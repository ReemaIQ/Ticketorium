// ticketorium-frontend/src/components/events-fetching/MyEventsComponent.jsx
import { useState, useEffect } from "react";

import { fetchEvents, fetchEventById } from "../../api/events.js";
import { fetchUserRegistrations } from "../../api/eventRegistrations.js";

/* ------------------ small helpers ------------------ */

// Normalize userType: backend role first, then optional prop
function resolveUserType(backendRole, userTypeProp) {
    if (backendRole) return String(backendRole).toLowerCase();
    if (userTypeProp) return String(userTypeProp).toLowerCase();
    return null;
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

function isOrganizerEvent(ev, backendUser) {
    if (!backendUser || !backendUser._id) return false;

    const myId = String(backendUser._id);
    const org = ev.organizer;

    if (typeof org === "string") return String(org) === myId;
    if (typeof org === "object" && org._id) return String(org._id) === myId;

    return false;
}

/* ------------------ main reusable hook ------------------ */

/**
 * Core logic for "My Events" page:
 *  - Organizer: events I created
 *  - Student / Visitor: events from my registrations
 *  - Filters by university (student/visitor)
 *  - Merges registration status into actionState
 *  - Provides search over title
 *
 * Usage:
 *   const {
 *     userType,
 *     allMyEvents,
 *     filteredEvents,
 *     setFilteredEvents,
 *     loading,
 *     error,
 *     handleSearch,
 *   } = useMyEventsForUser({ user, uni, userTypeProp, visitorUniKey });
 */
export function useMyEventsForUser({
                                       user,
                                       uni,
                                       userTypeProp = null,
                                       visitorUniKey: visitorUniKeyProp = null,
                                   }) {
    const backendUser = user || {};
    const userId = backendUser._id || null;
    const backendRole = backendUser.role || null;

    const userType = resolveUserType(backendRole, userTypeProp);

    // Selected university (usually an object)
    const selectedUniversity =
        uni && typeof uni === "object" ? uni : null;

    // Student’s university info (for sameUniversity filtering)
    const studentUniId = selectedUniversity?._id || null;
    const studentUniCode = selectedUniversity?.code || null;

    // Visitor’s selected uni key (e.g. "KFUPM")
    const visitorUniKey =
        visitorUniKeyProp ||
        (typeof uni === "string" ? uni : selectedUniversity?.code || null);

    const [allMyEvents, setAllMyEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            console.log("----- [useMyEventsForUser] Loading -----");
            console.log("[useMyEventsForUser] user:", backendUser);
            console.log("[useMyEventsForUser] userType:", userType);
            console.log(
                "[useMyEventsForUser] studentUniId:",
                studentUniId,
                "studentUniCode:",
                studentUniCode,
                "visitorUniKey:",
                visitorUniKey,
            );

            if (!userId) {
                if (!cancelled) {
                    setError("You must be logged in to view your events.");
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                setError("");

                let myEventsForUI = [];

                if (userType === "organizer") {
                    /* --------- ORGANIZER: events I created --------- */
                    const events = await fetchEvents({}, backendUser, uni);
                    const organizerEvents = events.filter((ev) =>
                        isOrganizerEvent(ev, backendUser),
                    );

                    const sorted = sortByStartAt(organizerEvents);
                    myEventsForUI = sorted
                        .map((ev) => normalizeEventForUI(ev, { backendUser }))
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
                                    "[useMyEventsForUser] Failed to hydrate reg.event:",
                                    e,
                                );
                                return reg;
                            }
                        }),
                    );

                    // 3) Filter registrations by university
                    const filteredRegs = registrations.filter((reg) => {
                        const ev = reg.event;
                        if (!ev) return false;
                        const evUni = ev.university;

                        // VISITOR: use visitorUniKey (runtime selected uni key)
                        if (userType === "visitor") {
                            if (!visitorUniKey) return true; // no selection → keep all

                            if (!evUni || typeof evUni !== "object") return true;

                            const evCode = String(
                                evUni.code || evUni.name || "",
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
                                backendUser,
                                reg,
                            });
                            if (!normalized) return;
                            eventsMap[normalized.id] = normalized;
                        } catch (mergeErr) {
                            console.error(
                                "[useMyEventsForUser] Error merging reg → event, fallback to undefined state:",
                                mergeErr,
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
                        "[useMyEventsForUser] Attendee myEvents (after merge):",
                        myEventsForUI,
                    );
                }

                if (!cancelled) {
                    setAllMyEvents(myEventsForUI);
                    setFilteredEvents(myEventsForUI);
                }
            } catch (err) {
                console.error("[useMyEventsForUser] load error:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to load your events.");
                    setAllMyEvents([]);
                    setFilteredEvents([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    console.log("----- [useMyEventsForUser] END -----");
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userId, userType, studentUniId, studentUniCode, visitorUniKey]);

    /* -----------------------------------------
       SEARCH
    ------------------------------------------ */
    const handleSearch = (value) => {
        const q = String(value || "").trim().toLowerCase();
        if (!q) {
            setFilteredEvents(allMyEvents);
            return;
        }

        const res = allMyEvents.filter((ev) =>
            String(ev.title || "").toLowerCase().includes(q),
        );
        setFilteredEvents(res);
    };

    return {
        userType,
        allMyEvents,
        filteredEvents,
        setFilteredEvents,
        loading,
        error,
        handleSearch,
    };
}


// ---------------------- My Upcoming Events ---------------------- //

// Same as useMyEventsForUser, but hides past/expired events
export function useMyEventsForUserUpcomingOnly({
                                                   user,
                                                   uni,
                                                   userTypeProp = null,
                                                   visitorUniKey: visitorUniKeyProp = null,
                                               }) {
    const base = useMyEventsForUser({
        user,
        uni,
        userTypeProp,
        visitorUniKey: visitorUniKeyProp,
    });

    const {
        userType,
        allMyEvents,
        filteredEvents,
        setFilteredEvents, // still exposed if you need to override from UI
        loading,
        error,
        handleSearch: baseHandleSearch,
    } = base;

    const [upcomingAllMyEvents, setUpcomingAllMyEvents] = useState([]);
    const [upcomingFilteredEvents, setUpcomingFilteredEvents] = useState([]);

    // Helper: is this event today or in the future?
    const isUpcoming = (ev) => {
        if (!ev) return false;

        // Prefer normalized date, then raw fields
        const rawDate = ev.date || ev.startAt || ev.endAt;
        if (!rawDate) return true; // if no date, keep it (safe choice)

        const d = new Date(rawDate);
        if (Number.isNaN(d.getTime())) return true; // invalid date → keep

        // Compare at day level (ignore time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventDate = new Date(d);
        eventDate.setHours(0, 0, 0, 0);

        // keep if today or later
        return eventDate >= today;
    };

    // Filter the "all" list
    useEffect(() => {
        setUpcomingAllMyEvents(allMyEvents.filter(isUpcoming));
    }, [allMyEvents]);

    // Filter the "currently filtered" list (after search, etc.)
    useEffect(() => {
        setUpcomingFilteredEvents(filteredEvents.filter(isUpcoming));
    }, [filteredEvents]);

    // Search → just delegate to base, our effects will re-filter afterward
    const handleSearch = (value) => {
        baseHandleSearch(value);
    };

    return {
        userType,
        allMyEvents: upcomingAllMyEvents,
        filteredEvents: upcomingFilteredEvents,
        setFilteredEvents, // still the same setter if we ever need it
        loading,
        error,
        handleSearch,
    };
}
