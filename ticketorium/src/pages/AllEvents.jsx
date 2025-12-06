// src/pages/AllEvents.jsx
import React, { useState, useEffect } from "react";
import EventList from "../components/event-list/EventList.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

import { fetchEvents } from "../api/events.js";
import { fetchUserRegistrations } from "../api/eventRegistrations.js";

    const userType = props.role

function getEventsTitle(type, user) {
    const t = type?.toLowerCase();

    if (t === "admin") {
        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                Manage Events
            </span>
        );
    }

        if (t === "visitor") {
            return (
                <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
                    Events at{" "}
                    <span className="text-[var(--primary-color)] font-[Gilroy-Medium]">
                        {props.uni["code"]}
                    </span>
                </span>
            );
        }

    if (t === "student") {
        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                Events
            </span>
        );
    }

    return (
        <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
            Events
        </span>
    );
}

// Map registration.status → EventActions state
function getActionStateFromRegistration(reg) {
    if (!reg) return undefined;
    const s = String(reg.status || "").toLowerCase();

    if (["joined", "attending", "registered"].includes(s)) return "joined";
    if (["waitlist", "waitlisted"].includes(s)) return "waitlisted";
    if (["invited", "invitation"].includes(s)) return "invited";
    if (["graduation"].includes(s)) return "graduation";

    return undefined;
}

// Map event.state → EventActions state when no registration
function getActionStateFromEvent(ev) {
    const s = String(ev.state || "").toLowerCase();
    if (["waitlist", "waitlisted"].includes(s)) return "waitlist";
    // "normal" or anything else falls back to undefined, which in config = normal
    return undefined;
}

function getInviterLabel(reg) {
    if (!reg || !reg.invitedBy) return undefined;

    const inv = reg.invitedBy;
    if (typeof inv === "string") return inv;

    const handle = inv.handle;
    const fullName =
        [inv.firstName, inv.lastName].filter(Boolean).join(" ").trim();

    return fullName || handle || undefined;
}

function sameUniversity(evUni, userUniId, userUniCode) {
    // evUni can be a string ObjectId, or a populated uni document
    let evUniId = null;
    let evUniCode = null;

    if (typeof evUni === "string") {
        evUniId = evUni;
    } else if (evUni && typeof evUni === "object") {
        evUniId = evUni._id || null;
        evUniCode = evUni.code || evUni.name || null;
    }

    // Prefer id comparison if both exist
    if (userUniId && evUniId && String(userUniId) === String(evUniId)) {
        return true;
    }

    if (
        userUniCode &&
        evUniCode &&
        String(userUniCode).toLowerCase() === String(evUniCode).toLowerCase()
    ) {
        return true;
    }

    // If we don't know either properly, keep it (avoids dropping valid events silently)
    if (!userUniId && !userUniCode) return true;

    return false;
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

/* ----------------------------- main component ----------------------------- */

function AllEvents(props) {
    const user = props.user || {};
    const userId = user._id || null;
    const userType = user.role || null;

    const userUniId =
        typeof user.university === "string"
            ? user.university
            : user.university?._id || null;
    const userUniCode =
        user.universityCode ||
        (typeof user.university === "object" ? user.university.code : null);

    const [eventsMap, setEventsMap] = useState({});      // { [id]: eventWithActionState }
    const [visibleIds, setVisibleIds] = useState([]);    // for search filtering

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch events + registrations, merge into actionState
    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            setLoading(true);
            setError(null);

            try {
                // 1) Fetch all events from backend
                const backendEvents = await fetchEvents({}, user);

                // 2) Filter by user's university
                const uniEvents = backendEvents.filter((ev) =>
                    sameUniversity(ev.university, userUniId, userUniCode),
                );

                // 3) Sort by startAt
                const sortedEvents = sortByStartAt(uniEvents);

                // 4) Fetch registrations for this user (if logged in)
                let regs = [];
                if (userId) {
                    try {
                        regs = await fetchUserRegistrations(userId);
                    } catch (e) {
                        console.error(
                            "[AllEvents] Failed to load registrations for user",
                            userId,
                            e,
                        );
                        // If regs fail, we still show events with pure event.state
                    }
                }

                if (cancelled) return;

                // 5) Index registrations by eventId (one per event, with priority)
                const regsByEventId = {};
                const priority = (state) => {
                    // Strongest → weakest (joined > invited > waitlisted > rest)
                    switch (state) {
                        case "joined":
                            return 3;
                        case "invited":
                            return 2;
                        case "waitlisted":
                            return 1;
                        default:
                            return 0;
                    }
                };

                regs.forEach((reg) => {
                    if (!reg || typeof reg !== "object") return;
                    const ev = reg.event;
                    if (!ev) return;

                    const evId =
                        (typeof ev === "object" && (ev._id || ev.id)) ||
                        (typeof ev === "string" && ev) ||
                        null;
                    if (!evId) return;

                    const newState = getActionStateFromRegistration(reg);
                    const existing = regsByEventId[evId];

                    if (!existing) {
                        regsByEventId[evId] = reg;
                        return;
                    }

                    const oldState = getActionStateFromRegistration(existing);
                    if (priority(newState) > priority(oldState)) {
                        regsByEventId[evId] = reg;
                    }
                });

                // 6) Build final events map with actionState + inviter + normalized fields
                const mergedEventsMap = {};

                sortedEvents.forEach((ev) => {
                    try {
                        const id = (ev._id || ev.id || "").toString();
                        if (!id) return;

                        const reg = regsByEventId[id];

                        const regState = getActionStateFromRegistration(reg);
                        const eventState = getActionStateFromEvent(ev);

                        // final actionState:
                        //  - use registration if available
                        //  - else event.state
                        //  - else undefined (which means "normal" for attendee in config)
                        const actionState =
                            regState !== undefined
                                ? regState
                                : eventState !== undefined
                                    ? eventState
                                    : undefined;

                        const inviter = getInviterLabel(reg);

                        // Normalize university field for UI (code/name)
                        let uniValue = "";
                        if (typeof ev.university === "string") {
                            uniValue = ev.university;
                        } else if (ev.university && typeof ev.university === "object") {
                            uniValue =
                                ev.university.code ||
                                ev.university.name ||
                                ev.university._id ||
                                "";
                        } else {
                            uniValue = userUniCode || "";
                        }

                        // Normalize organizer to something displayable
                        let organizerDisplay = ev.organizer;
                        if (ev.organizer && typeof ev.organizer === "object") {
                            const handle = ev.organizer.handle;
                            const fullName = [
                                ev.organizer.firstName,
                                ev.organizer.lastName,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .trim();
                            organizerDisplay = fullName || handle || ev.organizer._id;
                        }

                        const merged = {
                            ...ev,
                            id,
                            university: uniValue,
                            // date is used by Event getRelativeTime()
                            date: ev.startAt || ev.date || ev.endAt || null,
                            organizer: organizerDisplay,
                            actionState:
                                actionState === undefined ? undefined : actionState,
                            inviter: inviter,
                        };

                        mergedEventsMap[id] = merged;
                    } catch (mergeErr) {
                        console.error(
                            "[AllEvents] Error merging event with registration, falling back to undefined state:",
                            mergeErr,
                        );
                        const id = (ev._id || ev.id || "").toString();
                        if (!id) return;

                        mergedEventsMap[id] = {
                            ...ev,
                            id,
                            university: userUniCode || ev.university,
                            date: ev.startAt || ev.date || ev.endAt || null,
                            actionState: undefined, // safest fallback → "normal" in config
                        };
                    }
                });

                if (!cancelled) {
                    setEventsMap(mergedEventsMap);
                    setVisibleIds(Object.keys(mergedEventsMap));

                    console.log("[AllEvents] merged events:", mergedEventsMap);
                    console.log("[AllEvents] registrationsByEventId:", regsByEventId);
                }
            } catch (err) {
                console.error("[AllEvents] Failed to load data:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to load events");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadAll();

        return () => {
            cancelled = true;
        };
    }, [userId, userUniId, userUniCode]);

    // Simple search over title / description / organizer
    const handleSearch = (searchValue) => {
        const q = searchValue.trim().toLowerCase();

        if (!q) {
            setVisibleIds(Object.keys(eventsMap));
            return;
        }

        const ids = Object.values(eventsMap)
            .filter((ev) => {
                const title = String(ev.title || "").toLowerCase();
                const desc = String(ev.description || "").toLowerCase();
                const org = String(ev.organizer || "").toLowerCase();

                return (
                    title.includes(q) ||
                    desc.includes(q) ||
                    org.includes(q)
                );
            })
            .map((ev) => (ev.id || ev._id || "").toString())
            .filter(Boolean);

        setVisibleIds(ids);
    };

    return (
        <>
            <div
                id="page-content"
                className="flex flex-col items-center gap-30 min-h-screen"
            >
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3 gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <h1>{getEventsTitle(userType, user)}</h1>
                        </div>

                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>
                            <SearchBtn
                                expandable={true}
                                filterFunc={handleSearch}
                            />
                        </div>
                    </div>

                    {loading && (
                        <p className="px-3 text-sm text-gray-500">
                            Loading events…
                        </p>
                    )}

                    {error && !loading && (
                        <p className="px-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <EventList
                            events={eventsMap}            // full merged events with actionState
                            filterIds={visibleIds}       // which ones to show (after search)
                            userType={userType}
                            listType="all-events"
                            user={user}                  // pass user through to Event
                            setOrganizerViewing={props.setOrganizerViewing}
                        />
                    )}
                </div>
            </div>

            {props.waitlistModalOpen && (
                <WaitlistSuccess
                    setWaitlistModalOpen={props.setWaitlistModalOpen}
                    waitlistSuccess={props.waitlistSuccess}
                />
            )}
        </>
    );
}

export default AllEvents;
