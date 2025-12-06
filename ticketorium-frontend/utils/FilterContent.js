// // src/utils/filterContent.js
// // This rebuilds the old dummy-data logic using real backend events + registrations.
//
// export default function filterContent(
//     mode,
//     data,
//     targetRef,
//     type,
//     searchValue,
//     extra,
//     loggedInUser
// ) {
//     if (type !== "event") return;
//
//     /* -------------------------------------------------------------
//        INITIAL MODE — MERGE EVENTS + REGISTRATIONS FOR UI
//     -------------------------------------------------------------- */
//     if (mode === "initial") {
//         const events = data.events || {};         // map of {eventId/_id → event}
//         const joined = data.eventsJoined || [];   // array of registration objects
//         const merged = {};
//
//         // Build lookup for registrations by event ID
//         const regByEvent = {};
//         joined.forEach((reg) => {
//             const evId =
//                 reg.event?._id ||
//                 reg.event?._id ||
//                 reg.eventId ||
//                 reg.event;
//
//             if (!evId) return;
//             if (!regByEvent[evId]) regByEvent[evId] = [];
//             regByEvent[evId].push(reg);
//         });
//
//         // Merge event + user state
//         Object.keys(events).forEach((id) => {
//             const event = events[id];
//
//             const regsForEvent = regByEvent[id] || [];
//
//             // Find THIS USER’S registration entry if exists
//             let userReg = null;
//             if (loggedInUser) {
//                 userReg = regsForEvent.find(
//                     (r) =>
//                         r.user === loggedInUser ||
//                         r.user?._id === loggedInUser
//                 );
//             }
//
//             // Determine relation state
//             let finalState = userReg?.status || undefined;
//
//             // Event-level waitlist
//             if (!finalState && event.state === "waitlist") {
//                 finalState = "waitlist";
//             }
//
//             merged[id] = {
//                 ...event,
//                 relation: userReg
//                     ? {
//                           status: userReg.status,
//                           invitedBy: userReg.invitedBy,
//                       }
//                     : null,
//
//                 // 🔥 CRITICAL: THIS is what EventActions uses
//                 state: finalState,
//             };
//         });
//
//         targetRef.current = merged;
//         return;
//     }
//
//     /* -------------------------------------------------------------
//        SEARCH MODE
//     -------------------------------------------------------------- */
//     if (mode === "search") {
//         const all = data; // already merged state map
//         const q = (searchValue || "").trim().toLowerCase();
//
//         if (!q) {
//             targetRef(Object.keys(all));
//             return;
//         }
//
//         const filtered = Object.keys(all).filter((id) => {
//             const ev = all[id];
//             const text = `${ev.title || ""} ${ev.organizer?.handle || ""} ${
//                 ev.description || ""
//             }`
//                 .toLowerCase()
//                 .trim();
//
//             return text.includes(q);
//         });
//
//         targetRef(filtered);
//     }
// }
