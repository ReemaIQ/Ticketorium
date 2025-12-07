// ticketorium-frontend/src/components/events-fetching/InvitesReceivedComponents.jsx

import { useEffect, useState } from "react";

import { fetchUserRegistrations } from "../../api/eventRegistrations.js";
import { fetchEventById } from "../../api/events.js";

// use EventList
import EventList from "../event-list/EventList.jsx";

/* ---------------- small helpers ---------------- */

function getInviterLabelFromReg(reg) {
    if (!reg || !reg.invitedBy) return undefined;

    const inv = reg.invitedBy;

    if (typeof inv === "string") return inv;

    const fullName = [inv.firstName, inv.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || inv.handle || undefined;
}

function sortByStartAt(eventsArray) {
    return [...eventsArray].sort((a, b) => {
        const aDate = a.startAt ? new Date(a.startAt) : null;
        const bDate = b.startAt ? new Date(b.startAt) : null;

        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;

        return aDate - bDate;
    });
}

/* ---------------- main hook: invitations received ---------------- */

export function useInvitesReceivedForUser({ user }) {
    const backendUser = user || {};
    const userId = backendUser._id || null;

    const [invites, setInvites] = useState([]); // [{ event, registration, inviterLabel }]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!userId) {
                if (!cancelled) {
                    setError("You must be logged in to view your invitations.");
                    setLoading(false);
                    setInvites([]);
                }
                return;
            }

            try {
                setLoading(true);
                setError("");

                // 1) Fetch all registrations
                let registrations = await fetchUserRegistrations(userId);

                // 2) Filter to invited only
                const invitedRegs = registrations.filter((reg) => {
                    const status = String(reg.status || "").toLowerCase();
                    return status === "invited";
                });

                // 3) Hydrate registrations → full event data
                const hydrated = await Promise.all(
                    invitedRegs.map(async (reg) => {
                        let ev = reg.event;

                        // if event is not fully populated, fetch it
                        if (!ev || typeof ev !== "object") {
                            const eventId =
                                (typeof reg.event === "string" && reg.event) ||
                                reg.event?._id;

                            if (!eventId) return null;

                            try {
                                ev = await fetchEventById(eventId);
                            } catch (e) {
                                console.error(
                                    "[useInvitesReceivedForUser] Failed to fetch event:",
                                    e
                                );
                                return null;
                            }
                        }

                        if (!ev) return null;

                        const inviterLabel = getInviterLabelFromReg(reg);

                        return {
                            event: ev,
                            registration: reg,
                            inviterLabel,
                        };
                    })
                );

                const clean = hydrated.filter(Boolean);

                // 4) Sort by event.startAt
                const sortedEvents = sortByStartAt(clean.map((x) => x.event));

                // 5) rebuild sorted structure
                const sortedWithRegs = sortedEvents.map((ev) => {
                    const match = clean.find(
                        (item) =>
                            String(item.event._id || item.event.id) ===
                            String(ev._id || ev.id)
                    );
                    return (
                        match || {
                            event: ev,
                            registration: null,
                            inviterLabel: undefined,
                        }
                    );
                });

                if (!cancelled) {
                    setInvites(sortedWithRegs);
                }
            } catch (err) {
                console.error("[useInvitesReceivedForUser] load error:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to load your invitations.");
                    setInvites([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return {
        invites,
        loading,
        error,
    };
}

/* ---------------- UI component using EventList ---------------- */

export default function InvitesReceivedComponents({ user }) {
    const { invites, loading, error } = useInvitesReceivedForUser({ user });

    if (loading) {
        return (
            <p className="px-3 text-sm text-gray-500">Loading invitations…</p>
        );
    }

    if (error) {
        return <p className="px-3 text-sm text-red-600">{error}</p>;
    }

    if (!invites.length) {
        return (
            <p className="px-3 text-sm text-gray-500">
                You have no pending invitations.
            </p>
        );
    }

    // 🔁 Adapt result to EventList props
    const eventsMap = {};
    const filterIds = [];

    invites.forEach(({ event, registration, inviterLabel }) => {
        if (!event) return;
        const id = String(event._id || event.id || "");
        if (!id) return;

        // FIX: normalize `event.organizer` into a STRING, This is what was causing the White Screen Crash

        let organizerDisplay = event.organizer;

        if (event.organizer && typeof event.organizer === "object") {
            const fullName = [event.organizer.firstName, event.organizer.lastName]
                .filter(Boolean)
                .join(" ")
                .trim();

            organizerDisplay =
                fullName ||
                event.organizer.handle ||
                event.organizer._id ||
                "Unknown Organizer";
        }

        const merged = {
            ...event,
            id,
            date: event.startAt || event.date || event.endAt || null,
            actionState: "invited",
            inviter: inviterLabel,
            organizer: organizerDisplay, // SAFE STRING
            registration,
        };

        eventsMap[id] = merged;
        filterIds.push(id);
    });

    return (
        <div className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10">
            <div className="flex items-center justify-between mt-9 mb-3 px-3">
                <h2 className="font-[Gilroy-Black] text-3xl text-[#1A1A1A]">
                    Invitations
                </h2>
            </div>

            <EventList
                events={eventsMap}
                filterIds={filterIds}
                userType={user?.role || null}
                listType="invites-received"
                user={user}
            />
        </div>
    );
}
