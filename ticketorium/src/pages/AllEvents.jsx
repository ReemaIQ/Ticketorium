
// // export default AllEvents;
// // src/pages/AllEvents.jsx
// import React, { useState, useEffect, useRef } from "react";
// import EventList from "../components/event-list/EventList.jsx";

// // Font Awesome Setup
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { library } from "@fortawesome/fontawesome-svg-core";

// import { fas } from "@fortawesome/free-solid-svg-icons";
// import { far } from "@fortawesome/free-regular-svg-icons";
// import { fab } from "@fortawesome/free-brands-svg-icons";

// library.add(fas, far, fab);

// import SearchBtn from "../components/search-button/SearchBtn.jsx";
// import WaitlistSuccess from "../components/WaitlistSuccess.jsx";
// import { fetchEvents } from "../api/events.js";
// import { fetchUserRegistrations } from "../api/eventRegistrations.js";

// function AllEvents(props) {
//     const [filteredEvents, setFilteredEvents] = useState([]); // array of ids only
//     const originalState = useRef({}); // full event objects (with state)

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const userType = props.user ? props.users[props.user]?.type : null;

//     const getEventsTitle = (type) => {
//         const t = type?.toLowerCase();

//         if (t === "admin") {
//             return (
//                 <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
//                     Manage Events
//                 </span>
//             );
//         }

//         if (t === "visitor") {
//             return (
//                 <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
//                     Events at{" "}
//                     <span className="text-[var(--primary-color)] font-[Gilroy-Medium]">
//                         {props.uni}
//                     </span>
//                 </span>
//             );
//         }

//         if (t === "student") {
//             return (
//                 <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
//                     Events
//                 </span>
//             );
//         }

//         return (
//             <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
//                 Events
//             </span>
//         );
//     };

//     // 1) Load events + user registrations from backend,
//     //    then hand both to filterContent (just like dummy era).
//     useEffect(() => {
//         let cancelled = false;

//         async function loadAll() {
//             setLoading(true);
//             setError(null);

//             try {
//                 // 1) Events for this university
//                 const backendEvents = await fetchEvents({
//                     universityCode: props.uni || undefined,
//                 });

//                 // 2) Registrations for this user (if logged in)
//                 let regs = [];
//                 if (props.user) {
//                     try {
//                         regs = await fetchUserRegistrations(props.user);
//                     } catch (e) {
//                         console.error("Failed to load user registrations:", e);
//                     }
//                 }

//                 if (cancelled) return;

//                 // Build map: eventId → event object
//                 const eventsMap = {};
//                 backendEvents.forEach((ev) => {
//                     const key =
//                         (ev._id && ev._id.toString()) ||
//                         (ev.eventId && ev.eventId.toString());

//                     if (!key) return;

//                     eventsMap[key] = {
//                         ...ev,
//                         id: key,
//                         // Normalize university for existing UI logic
//                         university:
//                             typeof ev.university === "string"
//                                 ? ev.university
//                                 : ev.university?.code ||
//                                   ev.university?.name ||
//                                   props.uni ||
//                                   "",
//                         // keep date-ish field; cards can format startAt/date as needed
//                         date: ev.startAt || ev.date,
//                     };
//                 });

//                 // Build map: eventId → registration status ("joined", "invited", "waitlisted", etc.)
//                 const eventsJoined = {};
//                 regs.forEach((reg) => {
//                     const ev = reg.event;
//                     if (!ev) return;

//                     const key =
//                         (ev._id && ev._id.toString()) ||
//                         (ev.eventId && ev.eventId.toString());

//                     if (!key) return;

//                     // status is one of:
//                     // "joined", "invited", "waitlisted",
//                     // "cancelled", "cancelled_by_org", "no_show", "declined", "resigned"
//                     eventsJoined[key] = reg.status;
//                 });

//                 // Reset originalState before filterContent populates it
//                 originalState.current = {};

//                 // Use your existing filterContent logic to merge:
//                 //  - event state (normal / waitlist / cancelled)
//                 //  - user registration state (joined / invited / waitlisted / ...)
//                 //
//                 // NOTE:
//                 //  - eventsMap → all events this uni can see
//                 //  - eventsJoined → user-specific relationship
//                 props.filterContent(
//                     "initial",
//                     { events: eventsMap, eventsJoined },
//                     originalState,
//                     "event",
//                     "",
//                     {
//                         "list-type": "all-events",
//                         university: props.uni,
//                         loggedInUser: props.user,
//                     },
//                     props.user // keep as-is for compatibility
//                 );

//                 // Show everything (keys are event ids after filterContent)
//                 setFilteredEvents(Object.keys(originalState.current));

//                 console.log("AllEvents originalState (merged):", originalState.current);
//             } catch (err) {
//                 console.error("AllEvents – failed to load events", err);
//                 if (!cancelled) {
//                     setError(err.message || "Failed to load events");
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setLoading(false);
//                 }
//             }
//         }

//         loadAll();

//         return () => {
//             cancelled = true;
//         };
//         // refetch when university / logged-in user / filter function changes
//     }, [props.uni, props.user, props.filterContent]);

//     // 2) Search (works on merged originalState)
//     const handleSearch = (searchValue) => {
//         props.filterContent(
//             "search",
//             originalState.current,
//             setFilteredEvents,
//             "event",
//             searchValue,
//             {
//                 "list-type": "all-events",
//                 university: props.uni,
//             }
//         );
//     };

//     return (
//         <>
//             <div
//                 id="page-content"
//                 className="flex flex-col items-center gap-30 min-h-screen"
//             >
//                 <div
//                     id="events-section"
//                     className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10"
//                 >
//                     <div
//                         id="section-header"
//                         className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3 gap-4"
//                     >
//                         <div className="flex items-center gap-3">
//                             <h1>{getEventsTitle(userType)}</h1>
//                         </div>

//                         <div className="flex gap-4 self-start w-full justify-center">
//                             <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
//                                 <FontAwesomeIcon
//                                     icon={"fa-solid fa-filter"}
//                                     className="text-white"
//                                 />
//                             </button>
//                             <SearchBtn
//                                 expandable={true}
//                                 filterFunc={handleSearch}
//                             />
//                         </div>
//                     </div>

//                     {loading && (
//                         <p className="px-3 text-sm text-gray-500">
//                             Loading events…
//                         </p>
//                     )}

//                     {error && !loading && (
//                         <p className="px-3 text-sm text-red-600">
//                             {error}
//                         </p>
//                     )}

//                     {!loading && !error && (
//                         <EventList
//                             // full merged event objects (with final state)
//                             events={originalState.current}
//                             // Optional: raw events; using originalState so it's consistent
//                             allEvents={originalState.current}
//                             // eventsJoined from backend now lives inside originalState,
//                             // so this is only needed if EventList still reads it directly somewhere.
//                             eventsJoined={undefined}
//                             userType={userType}
//                             listType="all-events"
//                             filterIds={filteredEvents}
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

// export default AllEvents;
// src/pages/AllEvents.jsx
import React, { useState, useEffect, useRef } from "react";
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
import { fetchUserByUsername } from "../api/users.js";

function AllEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]); // array of ids only
    const originalState = useRef({}); // full event objects (with merged state)
    const eventsJoinedRef = useRef({}); // shape: { [username]: { [eventId]: regObj } }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // NOTE: props.user is the *username* (e.g. "kfupm-student")
    const username = props.user || null;
    const userType = username ? props.users[username]?.type : null;

    const getEventsTitle = (type) => {
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
                        {props.uni}
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
    };

    // 1) Load backend user + events + registrations,
    //    then let filterContent merge state (joined/invited/waitlisted/...).
    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            setLoading(true);
            setError(null);

            try {
                // ---------- 1) Resolve backend user (_id) from username ----------
                let backendUserId = null;

                if (username) {
                    try {
                        const backendUser = await fetchUserByUsername(username);
                        backendUserId = backendUser?._id || backendUser?.id || null;
                    } catch (e) {
                        console.error(
                            "[AllEvents] Failed to load backend user for",
                            username,
                            e
                        );
                    }
                }

                // ---------- 2) Fetch events for this university ----------
                const backendEvents = await fetchEvents({
                    universityCode: props.uni || undefined,
                });

                // ---------- 3) Fetch registrations for this backend user ----------
                let regs = [];
                if (backendUserId) {
                    try {
                        regs = await fetchUserRegistrations(backendUserId);
                    } catch (e) {
                        console.error(
                            "[AllEvents] Failed to load registrations for",
                            backendUserId,
                            e
                        );
                    }
                }

                if (cancelled) return;

                // ---------- 4) Build events map: eventId → event object ----------
                const eventsMap = {};
                backendEvents.forEach((ev) => {
                    if (!ev || typeof ev !== "object") return;

                    
                        const key = ev._id?.toString();

                    if (!key) return;

                    eventsMap[key] = {
                        ...ev,
                        id: key,
                        // Normalize university for existing UI logic
                        university:
                            typeof ev.university === "string"
                                ? ev.university
                                : ev.university?.code ||
                                  ev.university?.name ||
                                  props.uni ||
                                  "",
                        // keep date-ish field; cards can format startAt/date as needed
                        date: ev.startAt || ev.date,
                    };
                });

                // ---------- 5) Build eventsJoined in legacy shape ----------
                // Expected by FilterHelpers:
                // eventsJoined = {
                //   [username]: {
                //       [eventId]: { ...reg, status: "joined" | "invited" | "waitlisted" | ... }
                //   }
                // }
                const byEventForUser = {};
                regs.forEach((reg) => {
                    if (!reg || typeof reg !== "object") return;

                    const ev = reg.event;
                    if (!ev || typeof ev !== "object") return;

                        const key = ev._id?.toString();


                    if (!key) return;

                    // Make sure embedded event has normalized university too
                    const uni = ev.university;
                    const uniCode =
                        typeof uni === "string" ? uni : uni?.code || uni?.name || props.uni || "";

                    const cleanedEvent = {
                        ...ev,
                        university: uniCode,
                    };

                    byEventForUser[key] = {
                        ...reg,
                        event: cleanedEvent,
                    };
                });

                const eventsJoined =
                    username && Object.keys(byEventForUser).length > 0
                        ? { [username]: byEventForUser }
                        : username
                        ? { [username]: {} }
                        : {};

                eventsJoinedRef.current = eventsJoined;

                // ---------- 6) Let filterContent merge everything ----------
                originalState.current = {};

                props.filterContent(
                    "initial",
                    {
                        events: eventsMap,
                        eventsJoined: eventsJoinedRef.current,
                    },
                    originalState,
                    "event",
                    "",
                    {
                        "list-type": "all-events",
                        university: props.uni,
                        loggedInUser: username,
                    },
                    username
                );

                setFilteredEvents(Object.keys(originalState.current));

                console.log("[AllEvents] eventsMap:", eventsMap);
                console.log("[AllEvents] eventsJoined:", eventsJoinedRef.current);
                console.log(
                    "[AllEvents] originalState (merged):",
                    originalState.current
                );
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
        // Re-run when uni or logged-in user changes
    }, [props.uni, username, props.filterContent]);

    // 2) Search (works on merged originalState)
    const handleSearch = (searchValue) => {
        props.filterContent(
            "search",
            originalState.current,
            setFilteredEvents,
            "event",
            searchValue,
            {
                "list-type": "all-events",
                university: props.uni,
            }
        );
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
                            <h1>{getEventsTitle(userType)}</h1>
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
                            // full merged event objects (with final state for EventActions)
                            events={originalState.current}
                            // raw events not needed now, but kept for compatibility
                            allEvents={originalState.current}
                            // full registrations map (per-username) for any components that still read it
                            eventsJoined={eventsJoinedRef.current}
                            userType={userType}
                            listType="all-events"
                            filterIds={filteredEvents}
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
