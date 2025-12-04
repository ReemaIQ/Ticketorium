// // src/pages/MyEvents.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus } from "lucide-react";

// import EventList from "../components/event-list/EventList.jsx";
// import SearchBtn from "../components/search-button/SearchBtn.jsx";
// import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

// // Font Awesome Setup
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fas } from "@fortawesome/free-solid-svg-icons";
// import { far } from "@fortawesome/free-regular-svg-icons";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// library.add(fas, far, fab);

// import { fetchEvents } from "../api/events.js";
// import { fetchUserRegistrations } from "../api/eventRegistrations.js";
// import { fetchUserByUsername } from "../api/users.js";

// /* ------------------ helpers ------------------ */

// function normalizeUserType(props) {
//     const raw =
//         (props.user && props.users?.[props.user]?.type) ||
//         props.userType ||
//         null;
//     return raw ? String(raw).toLowerCase() : null;
// }

// function buildUniName(props) {
//     return props.uni || "Harvard";
// }

// /**
//  * Check if an event belongs to the “current” university for non-admin users.
//  * Admin / system-admin see all their events.
//  */
// function eventMatchesUniversity(ev, uniKey, backendUser) {
//     const rawType =
//         backendUser?.role ||
//         backendUser?.type ||
//         backendUser?.userType ||
//         "";
//     const normalizedType = String(rawType).toLowerCase();

//     // Admin / system-admin → see all their events regardless of uni
//     if (normalizedType === "admin" || normalizedType === "system-admin") {
//         return true;
//     }

//     // Preferred university filter:
//     const uniFilter =
//         uniKey ||
//         backendUser?.university?.code ||
//         backendUser?.university?.name ||
//         "";

//     if (!uniFilter) return true;

//     const target = String(uniFilter).toLowerCase();
//     const u = ev.university;

//     if (!u) return false;

//     if (typeof u === "string") {
//         return u.toLowerCase() === target;
//     }

//     const code = u.code ? u.code.toLowerCase() : "";
//     const name = u.name ? u.name.toLowerCase() : "";

//     return code === target || name === target;
// }

// /**
//  * Build "my events" list directly from registrations:
//  * - Only events where the user has a registration (joined / waitlist / invited / etc.).
//  * - Attach reg.status → viewEvent.state (the user–event relation).
//  * - Attach inviter display name when present.
//  */
// function buildMyEventsFromRegistrations(registrations, uniKey, backendUser) {
//     if (!Array.isArray(registrations)) return [];

//     const result = [];

//     registrations.forEach((reg) => {
//         if (!reg || typeof reg !== "object") return;

//         const ev = reg.event;
//         if (!ev || typeof ev !== "object") return;

//         // Optional: filter by university (non-admin)
//         if (!eventMatchesUniversity(ev, uniKey, backendUser)) return;

//         const viewEv = { ...ev };

//         // Relation state (joined / waitlisted / invited / etc.)
//         viewEv.state = reg.status;

//         // Inviter name if present
//         if (reg.invitedBy) {
//             const inv = reg.invitedBy;
//             const inviterName =
//                 inv.handle ||
//                 [inv.firstName, inv.lastName].filter(Boolean).join(" ") ||
//                 "";
//             if (inviterName) viewEv.inviter = inviterName;
//         }

//         result.push(viewEv);
//     });

//     return result;
// }

// /**
//  * Build organizer/admin "my events" list:
//  * - Events where backendUser is the organizer.
//  * - Optionally filtered by university.
//  */
// function buildOrganizedEvents(events, uniKey, backendUser) {
//     if (!Array.isArray(events)) return [];

//     const backendUserId = backendUser?._id
//         ? String(backendUser._id)
//         : backendUser?.id
//         ? String(backendUser.id)
//         : null;

//     if (!backendUserId) return [];

//     const result = [];

//     events.forEach((ev) => {
//         if (!ev || typeof ev !== "object") return;

//         const org = ev.organizer;
//         if (!org) return;

//         const orgId =
//             typeof org === "string"
//                 ? String(org)
//                 : org._id
//                 ? String(org._id)
//                 : org.id
//                 ? String(org.id)
//                 : null;

//         if (!orgId || orgId !== backendUserId) return;

//         // Optional: filter by university (non-admin/system-admin already allowed in eventMatchesUniversity)
//         if (!eventMatchesUniversity(ev, uniKey, backendUser)) return;

//         result.push({ ...ev });
//     });

//     return result;
// }

// /* ------------------ component ------------------ */

// function MyEvents(props) {
//     const [allMyEvents, setAllMyEvents] = useState([]);
//     const [filteredEvents, setFilteredEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const navigate = useNavigate();

//     const userType = normalizeUserType(props);
//     const uniName = buildUniName(props);

//     const getEventsTitle = (type) => {
//         const t = type?.toLowerCase();

//         if (t === "visitor") {
//             return (
//                 <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
//                     My Events{" "}
//                     <span className="font-[Gilroy-Medium] text-[60px] text-[var(--primary-color)]">
//                         at {uniName}
//                     </span>
//                 </span>
//             );
//         }

//         return (
//             <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
//                 My Events
//             </span>
//         );
//     };

//     /* -----------------------------------------
//        LOAD MY EVENTS (per page)
//        → resolve backend user
//        → attendee: build from registrations
//        → organizer/admin: build from events they created
//     ------------------------------------------ */
//     useEffect(() => {
//         let cancelled = false;

//         async function load() {
//             if (!props.user) {
//                 setError("You must be logged in to view your events.");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 setLoading(true);
//                 setError("");

//                 // 1) Backend user (lookup by username / handle, same style as AllEvents)
//                 const backendUser = await fetchUserByUsername(props.user);
//                 const userId = backendUser?._id || backendUser?.id;

//                 if (!userId) {
//                     throw new Error("Could not resolve backend user id.");
//                 }

//                 const rawRole =
//                     backendUser?.role ||
//                     backendUser?.type ||
//                     backendUser?.userType ||
//                     "";
//                 const normalizedRole = String(rawRole).toLowerCase();

//                 let myEvents = [];

//                 if (
//                     normalizedRole === "organizer" ||
//                     normalizedRole === "admin" ||
//                     normalizedRole === "system-admin"
//                 ) {
//                     // ------------ ORGANIZER / ADMIN VIEW ------------
//                     // Fetch all events and keep only those where this user is the organizer
//                     const events = await fetchEvents();
//                     const organized = buildOrganizedEvents(
//                         events,
//                         props.uni,
//                         backendUser
//                     );
//                     myEvents = organized;
//                 } else {
//                     // ------------ ATTENDEE / VISITOR VIEW ------------
//                     // Registrations for this backend user
//                     const registrations =
//                         await fetchUserRegistrations(userId);

//                     // Build "my events" directly from registrations
//                     myEvents = buildMyEventsFromRegistrations(
//                         registrations,
//                         props.uni,
//                         backendUser
//                     );
//                 }

//                 if (!cancelled) {
//                     setAllMyEvents(myEvents);
//                     setFilteredEvents(myEvents);
//                 }
//             } catch (err) {
//                 console.error("[MyEvents] load error:", err);
//                 if (!cancelled) {
//                     setError("Failed to load your events. Please try again.");
//                     setAllMyEvents([]);
//                     setFilteredEvents([]);
//                 }
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }

//         load();

//         return () => {
//             cancelled = true;
//         };
//     }, [props.user, props.uni]);

//     /* -----------------------------------------
//        Simple client-side search on my events
//     ------------------------------------------ */
//     const handleSearch = (searchValue) => {
//         const q = String(searchValue || "").trim().toLowerCase();
//         if (!q) {
//             setFilteredEvents(allMyEvents);
//             return;
//         }

//         const next = allMyEvents.filter((ev) =>
//             String(ev.title || "").toLowerCase().includes(q)
//         );
//         setFilteredEvents(next);
//     };

//     return (
//         <>
//             <div
//                 id="page-content"
//                 className="flex flex-col items-center gap-30 w-full min-h-screen"
//             >
//                 <div
//                     id="events-section"
//                     className="flex flex-col w-full max-w-5xl gap-5 align-middle px-10 xl:px-15 pb-10"
//                 >
//                     <div
//                         id="section-header"
//                         className="flex flex-col items-start gap-5 max-w-5xl mt-9 mb-3 px-3"
//                     >
//                         <div className="flex flex-col md:flex-row items-center justify-start gap-4 w-full max-w-5xl">
//                             <h1 className="justify-end w-full">
//                                 {getEventsTitle(userType)}
//                             </h1>

//                             {userType === "organizer" && (
//                                 <div className="flex justify-end w-full gap-3">
//                                     <button
//                                         onClick={() => navigate("/create-event")}
//                                         className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)]
//                                         text-[var(--primary-color)] rounded-[6px] font-[Gilroy-Medium]"
//                                     >
//                                         <Plus size={18} /> Create New Event
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {userType !== "organizer" && (
//                             <div className="flex gap-4 self-start w-full justify-center">
//                                 <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
//                                     <FontAwesomeIcon
//                                         icon={"fa-solid fa-filter"}
//                                         className="text-white"
//                                     />
//                                 </button>

//                                 <SearchBtn
//                                     filterFunc={handleSearch}
//                                     expandable={true}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {error && (
//                         <div className="mb-4 rounded-md border border-[var(--warning-color)]/40 bg-[var(--warning-color)]/10 px-4 py-3 text-[13px] text-[var(--warning-color)] font-[Gilroy-Medium]">
//                             {error}
//                         </div>
//                     )}

//                     {loading ? (
//                         <div className="flex justify-center items-center py-10 text-slate-500 text-sm">
//                             Loading your events…
//                         </div>
//                     ) : (
//                         <EventList
//                             // For "my-events", we simply give it an array of full event objects
//                             // where each event has, for attendees:
//                             //   - state: reg.status (joined / waitlisted / invited ...)
//                             //   - inviter: optional display name
//                             // For organizers/admin:
//                             //   - their events as organizer (no relation state needed; EventActions will use organizer category)
//                             events={filteredEvents}
//                             userType={userType}
//                             listType="my-events"
//                         />
//                     )}
//                 </div>
//             </div>

//             {props.waitlistModalOpen && (
//                 <WaitlistSuccess
//                     setWaitlistModalOpen={props.setWaitlistModalOpen}
//                     waitlistSuccess={props.waitlistSuccess}
//                 />
//             )}
//         </>
//     );
// }

// export default MyEvents;





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

import { fetchEvents } from "../api/events.js";
import { fetchUserRegistrations } from "../api/eventRegistrations.js";
import { fetchUserByUsername } from "../api/users.js";

/* ------------------ helpers ------------------ */

function normalizeUserType(props) {
    const raw =
        (props.user && props.users?.[props.user]?.type) ||
        props.userType ||
        null;
    return raw ? String(raw).toLowerCase() : null;
}

function eventMatchesUni(ev, uniKey, backendUser) {
    const typeRaw =
        backendUser?.role ||
        backendUser?.type ||
        backendUser?.userType ||
        "";

    const normalizedType = String(typeRaw).toLowerCase();

    // admins can see everything
    if (normalizedType === "admin" || normalizedType === "system-admin") {
        return true;
    }

    // normal user → match their university
    const uniFilter =
        uniKey ||
        backendUser?.university?.code ||
        backendUser?.university?.name ||
        "";

    if (!uniFilter) return true;

    const target = String(uniFilter).toLowerCase();
    const u = ev.university;

    if (!u) return false;

    if (typeof u === "string") {
        return u.toLowerCase() === target;
    }

    const code = u.code ? u.code.toLowerCase() : "";
    const name = u.name ? u.name.toLowerCase() : "";

    return code === target || name === target;
}

function attachRegistrationState(events, registrations, backendUser) {
    const regsByEventId = {};
    if (Array.isArray(registrations)) {
        registrations.forEach((reg) => {
            const ev = reg.event;
            const id = ev && (ev._id);
            if (!id) return;
            regsByEventId[String(id)] = reg;
        });
    }

    const result = [];
    const myId = backendUser?._id ? String(backendUser._id) : null;

    if (!Array.isArray(events)) return result;

    events.forEach((ev) => {
        if (!ev) return;
        const id = ev._id;
        if (!id) return;

        const reg = regsByEventId[String(id)];

        const isOrganizerEvent =
            myId &&
            typeof ev.organizer === "object" &&
            ev.organizer?._id &&
            String(ev.organizer._id) === myId;

        if (!reg && !isOrganizerEvent) return;

        const viewEv = { ...ev };

        if (reg) {
            viewEv.state = reg.status;
            if (reg.invitedBy) {
                const inv = reg.invitedBy;
                const inviterName =
                    inv.handle ||
                    [inv.firstName, inv.lastName].filter(Boolean).join(" ") ||
                    "";
                if (inviterName) viewEv.inviter = inviterName;
            }
        } else {
            viewEv.state = ev.state;
        }

        result.push(viewEv);
    });

    return result;
}

/* ------------------ component ------------------ */

function MyEvents(props) {
    const [allMyEvents, setAllMyEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const userType = normalizeUserType(props);

    /* -----------------------------------------
       LOAD MY EVENTS
    ------------------------------------------ */
    useEffect(() => {
        let cancelled = false;

        async function load() {
            console.log("-------------- [MyEvents] START --------------");
            console.log("[MyEvents] props.user:", props.user);

            if (!props.user) {
                setError("You must be logged in to view your events.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                /** -------------------------
                 * 1) Get backend user
                 * ------------------------*/
                console.log("[MyEvents] Fetching backend user…");
                const backendUser = await fetchUserByUsername(props.user);
                console.log("[MyEvents] backendUser:", backendUser);

                const userId = backendUser?._id || backendUser?.id;
                if (!userId) {
                    throw new Error("No backend _id found for user.");
                }

                /** -------------------------
                 * 2) Fetch all events
                 * ------------------------*/
                console.log("[MyEvents] Fetching ALL events…");
                const events = await fetchEvents();
                console.log("[MyEvents] Events fetched:", events);

                /** -------------------------
                 * 3) Fetch registrations
                 * ------------------------*/
                console.log("[MyEvents] Fetching registrations for:", userId);
                const registrations = await fetchUserRegistrations(userId);
                console.log("[MyEvents] Registrations fetched:", registrations);

                /** -------------------------
                 * 4) Restrict to user university (unless admin)
                 * ------------------------*/
                const eventsByUni = events.filter((ev) =>
                    eventMatchesUni(ev, props.uni, backendUser)
                );
                console.log(
                    "[MyEvents] Events matching user's university:",
                    eventsByUni
                );

                /** -------------------------
                 * 5) Keep only MY events (registered or organizer)
                 * ------------------------*/
                const myFinalEvents = attachRegistrationState(
                    eventsByUni,
                    registrations,
                    backendUser
                );

                console.log(
                    "[MyEvents] FINAL myEvents (with state):",
                    myFinalEvents
                );

                if (!cancelled) {
                    setAllMyEvents(myFinalEvents);
                    setFilteredEvents(myFinalEvents);
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
                    console.log("-------------- [MyEvents] END --------------");
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [props.user, props.uni]);

    /* -----------------------------------------
       SEARCH
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
