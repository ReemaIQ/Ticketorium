// ticketorium-frontend/src/components/events-fetching/InvitesReceivedComponents.jsx

import { useEffect, useState } from "react";

import { fetchUserRegistrations } from "../../api/eventRegistrations.js";
import { fetchEventById } from "../../api/events.js";
import EventList from "../event-list/EventList.jsx";

/* ---------------- small helpers ---------------- */

function resolveUserType(backendRole, userTypeProp) {
    if (backendRole) return String(backendRole).toLowerCase();
    if (userTypeProp) return String(userTypeProp).toLowerCase();
    return null;
}

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

/* ---- helpers to match MyEventsComponent normalization ---- */

function getActionStateFromRegistrationStatus(status) {
    if (!status) return undefined;
    const s = String(status).toLowerCase();

    if (["joined", "attending", "registered"].includes(s)) return "joined";
    if (["waitlist", "waitlisted"].includes(s)) return "waitlisted";
    if (["invited", "invitation"].includes(s)) return "invited";

    return undefined;
}

function getActionStateFromEvent(ev) {
    const s = String(ev?.state || "").toLowerCase();
    if (["waitlist", "waitlisted"].includes(s)) return "waitlist";
    return undefined;
}

// SAME SHAPE as normalizeEventForUI in MyEventsComponent.jsx
function normalizeEventForUI(ev, { reg } = {}) {
    const id = (ev._id || ev.id || "").toString();
    if (!id) return null;

    const regState = reg
        ? getActionStateFromRegistrationStatus(reg.status)
        : undefined;
    const eventState = !reg ? getActionStateFromEvent(ev) : undefined;

    const actionState =
        regState !== undefined
            ? regState
            : eventState !== undefined
                ? eventState
                : undefined;

    const inviter = reg ? getInviterLabelFromReg(reg) : undefined;

    let uniValue = "";
    if (typeof ev.university === "string") {
        uniValue = ev.university;
    } else if (ev.university && typeof ev.university === "object") {
        uniValue =
            ev.university.code ||
            ev.university.name ||
            ev.university._id ||
            "";
    }

    let organizerDisplay = ev.organizer;
    if (ev.organizer && typeof ev.organizer === "object") {
        const full = [ev.organizer.firstName, ev.organizer.lastName]
            .filter(Boolean)
            .join(" ");
        organizerDisplay = full || ev.organizer.handle || ev.organizer._id;
    }

    return {
        ...ev,
        id,
        university: uniValue,
        date: ev.startAt || ev.endAt || ev.date || null,
        organizer: organizerDisplay,
        actionState,
        inviter,
    };
}

/* ---------------- main hook: invitations received ---------------- */

export function useInvitesReceivedForUser({ user }) {
    const backendUser = user || {};
    const userId = backendUser._id || null;

    const [invites, setInvites] = useState([]); // [{ event, registration }]
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

                // 1) Fetch all registrations for this user
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
                                    e,
                                );
                                return null;
                            }
                        }

                        if (!ev) return null;

                        return {
                            event: ev,
                            registration: reg,
                        };
                    }),
                );

                const clean = hydrated.filter(Boolean);

                // 4) Sort by event.startAt
                const sortedEvents = sortByStartAt(clean.map((x) => x.event));

                // 5) Rebuild with their registrations
                const sortedWithRegs = sortedEvents.map((ev) => {
                    const match = clean.find(
                        (item) =>
                            String(item.event._id || item.event.id) ===
                            String(ev._id || ev.id),
                    );
                    return (
                        match || {
                            event: ev,
                            registration: null,
                        }
                    );
                });

                if (!cancelled) {
                    setInvites(sortedWithRegs);
                }
            } catch (err) {
                console.error("[useInvitesReceivedForUser] load error:", err);
                if (!cancelled) {
                    setError(
                        err.message || "Failed to load your invitations.",
                    );
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

/* ---------------- UI wrapper used in UserHome ---------------- */

export default function InvitesReceivedComponents({ user }) {
    const { invites, loading, error } = useInvitesReceivedForUser({ user });
    const backendUser = user || {};
    const backendRole = backendUser.role || null;

    const userType = resolveUserType(backendRole, null);

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

    // Normalize exactly like MyEvents → same event object shape
    const eventsArray = invites
        .map(({ event, registration }) => {
            if (!event) return null;
            return normalizeEventForUI(event, {
                reg: registration,
            });
        })
        .filter(Boolean);

    return (
        <EventList
            events={eventsArray}       // same type as myUpcomingFiltered
            userType={userType}
            listType="my-events"       // use same layout rules as My Events
            user={user}
        />
    );
}
