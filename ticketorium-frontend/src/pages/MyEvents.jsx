// src/pages/MyEvents.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import EventList from "../components/event-list/EventList.jsx";
import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

import { fetchEvents, fetchEventById } from "../api/events.js";
import { fetchUserRegistrations } from "../api/eventRegistrations.js";

/* ------------------ small helpers ------------------ */

// Only used as a fallback if backend role is missing
function normalizeUserTypeFromProps(props) {
    const raw =
        (props.user && props.users?.[props.user]?.type) ||
        props.userType ||
        null;
    return raw ? String(raw).toLowerCase() : null;
}

// Compare event.university vs user’s uni (for students/etc.)
function sameUniversity(evUni, userUniId, userUniCode) {
    let evUniId = null;
    let evUniCode = null;

    if (typeof evUni === "string") {
        evUniId = evUni;
    } else if (evUni && typeof evUni === "object") {
        evUniId = evUni._id || null;
        evUniCode = evUni.code || evUni.name || null;
    }

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

    if (!userUniId && !userUniCode) return true;

    return false;
}

// registration.status → EventActions state
function getActionStateFromRegistrationStatus(status) {
    if (!status) return undefined;
    const s = String(status).toLowerCase();

    if (["joined", "attending", "registered"].includes(s)) return "joined";
    if (["waitlist", "waitlisted"].includes(s)) return "waitlisted";
    if (["invited", "invitation"].includes(s)) return "invited";

    return undefined;
}

// event.state → fallback when no registration
function getActionStateFromEvent(ev) {
    const s = String(ev?.state || "").toLowerCase();
    if (["waitlist", "waitlisted"].includes(s)) return "waitlist";
    return undefined;
}

function getInviterLabelFromReg(reg) {
    if (!reg || !reg.invitedBy) return undefined;

    const inv = reg.invitedBy;
    if (typeof inv === "string") return inv;

    const handle = inv.handle;
    const fullName = [inv.firstName, inv.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || handle || undefined;
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

// Normalize event with actionState + inviter for UI
function normalizeEventForUI(ev, { backendUser, reg } = {}) {
    const id = (ev._id || ev.id || "").toString();
    if (!id) return null;

    const regState = reg ? getActionStateFromRegistrationStatus(reg.status) : undefined;
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

function isOrganizerEvent(ev, backendUser) {
    if (!backendUser || !backendUser._id) return false;

    const myId = String(backendUser._id);
    const org = ev.organizer;

    if (typeof org === "string") return String(org) === myId;
    if (typeof org === "object" && org._id) return String(org._id) === myId;

    return false;
}

/* ------------------ component ------------------ */

function MyEvents(props) {
    const user = props.user || {};        // backend user from token
    const userId = user._id || null;
    const backendRole = user.role || null;

    const fallbackType = normalizeUserTypeFromProps(props);
    const userType =
        (backendRole && String(backendRole).toLowerCase()) ||
        fallbackType ||
        null;

    // The actual selected university object (from props)
    const selectedUniversity = props.uni || null;

    // Visitor’s currently selected university *key* (like "KFUPM") if you're using props.uni that way elsewhere
    const visitorUniKey =
        typeof props.uni === "string" ? props.uni : selectedUniversity?.code || null;

    // Student’s university info (for sameUniversity filtering)
    const studentUniId = selectedUniversity?._id || null;
    const studentUniCode = selectedUniversity?.code || null;


    const [allMyEvents, setAllMyEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /* -----------------------------------------
       LOAD MY EVENTS
    ------------------------------------------ */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            console.log("----- [MyEvents] Loading -----");
            console.log("[MyEvents] user:", user);
            console.log("[MyEvents] userType:", userType);
            console.log(
                "[MyEvents] studentUniId:",
                studentUniId,
                "studentUniCode:",
                studentUniCode,
                "visitorUniKey:",
                visitorUniKey
            );

            if (!userId) {
                setError("You must be logged in to view your events.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                let myEventsForUI = [];

                if (userType === "organizer") {
                    /* --------- ORGANIZER: events I created --------- */
                    const events = await fetchEvents({}, user, props.uni);
                    const organizerEvents = events.filter((ev) =>
                        isOrganizerEvent(ev, user)
                    );

                    const sorted = sortByStartAt(organizerEvents);
                    myEventsForUI = sorted
                        .map((ev) => normalizeEventForUI(ev, { backendUser: user }))
                        .filter(Boolean);
                } else {
                    /* ------- STUDENT / VISITOR: my registrations ------- */

                    // 1) Fetch regs for this user
                    let registrations = await fetchUserRegistrations(userId);

                    // 2) Hydrate event if reg.event is just an id
                    registrations = await Promise.all(
                        registrations.map(async (reg) => {
                            if (reg.event && typeof reg.event === "object") return reg;

                            const eventId =
                                (typeof reg.event === "string" && reg.event) ||
                                reg.event?._id;
                            if (!eventId) return reg;

                            try {
                                const fullEvent = await fetchEventById(eventId);
                                return { ...reg, event: fullEvent || reg.event };
                            } catch (e) {
                                console.error(
                                    "[MyEvents] Failed to hydrate reg.event:",
                                    e
                                );
                                return reg;
                            }
                        })
                    );

                    // 3) Filter registrations by university
                    const filteredRegs = registrations.filter((reg) => {
                        const ev = reg.event;
                        if (!ev) return false;
                        const evUni = ev.university;

                        // VISITOR: use props.uni (runtime selected uni key)
                        if (userType === "visitor") {
                            if (!visitorUniKey) return true; // no selection → keep all

                            if (!evUni || typeof evUni !== "object") return true;

                            const evCode = String(
                                evUni.code || evUni.name || ""
                            ).toLowerCase();
                            const key = String(visitorUniKey).toLowerCase();

                            return evCode === key;
                        }

                        // STUDENT (or any non-visitor attendee)
                        return sameUniversity(evUni, studentUniId, studentUniCode);
                    });

                    // 4) Map each registration → normalized event with actionState
                    const eventsMap = {};
                    filteredRegs.forEach((reg) => {
                        const ev = reg.event;
                        if (!ev) return;

                        try {
                            const normalized = normalizeEventForUI(ev, {
                                backendUser: user,
                                reg,
                            });
                            if (!normalized) return;
                            eventsMap[normalized.id] = normalized;
                        } catch (mergeErr) {
                            console.error(
                                "[MyEvents] Error merging reg → event, falling back to undefined state:",
                                mergeErr
                            );
                            const id = (ev._id || ev.id || "").toString();
                            if (!id) return;

                            eventsMap[id] = {
                                ...ev,
                                id,
                                date: ev.startAt || ev.date || ev.endAt || null,
                                actionState: undefined, // safest fallback → "normal"
                            };
                        }
                    });

                    const eventsArray = Object.values(eventsMap);
                    myEventsForUI = sortByStartAt(eventsArray);

                    console.log(
                        "[MyEvents] Attendee myEvents (after merge):",
                        myEventsForUI
                    );
                }

                if (!cancelled) {
                    setAllMyEvents(myEventsForUI);
                    setFilteredEvents(myEventsForUI);
                }
            } catch (err) {
                console.error("[MyEvents] load error:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to load your events.");
                    setAllMyEvents([]);
                    setFilteredEvents([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    console.log("----- [MyEvents] END -----");
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userId, userType, studentUniId, studentUniCode, visitorUniKey]);

    /* -----------------------------------------
       SEARCH (unchanged)
    ------------------------------------------ */
    const handleSearch = (value) => {
        const q = String(value).trim().toLowerCase();
        if (!q) return setFilteredEvents(allMyEvents);

        const res = allMyEvents.filter((ev) =>
            String(ev.title || "").toLowerCase().includes(q)
        );
        setFilteredEvents(res);
    };

    /* -----------------------------------------
       RENDER
    ------------------------------------------ */

    return (
        <>
            <div
                id="page-content"
                className="flex flex-col items-center gap-30 w-full min-h-screen"
            >
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl gap-5 align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start gap-5 mt-9 mb-3 px-3"
                    >
                        <h1 className="text-[60px] font-[Gilroy-Black]">
                            My Events
                        </h1>

                        {userType === "organizer" && (
                            <div className="flex w-full justify-end">
                                <button
                                    onClick={() => navigate("/create-event")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)]
                                    text-[var(--primary-color)] rounded-[6px] font-[Gilroy-Medium]"
                                >
                                    <Plus size={18} /> Create New Event
                                </button>
                            </div>
                        )}

                        {userType !== "organizer" && (
                            <div className="flex gap-4 self-start w-full justify-center">
                                <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)]">
                                    <FontAwesomeIcon
                                        icon={"fa-solid fa-filter"}
                                        className="text-white"
                                    />
                                </button>

                                <SearchBtn
                                    filterFunc={handleSearch}
                                    expandable={true}
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-md border border-red-300 bg-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-10 text-slate-500 text-sm">
                            Loading your events…
                        </div>
                    ) : (
                        <EventList
                            events={filteredEvents}
                            userType={userType}
                            listType="my-events"
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

export default MyEvents;
