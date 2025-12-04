// // src/components/event-list/EventList.jsx
// import React, { useMemo } from "react";
// import Event from "../event/Event";
//
// /**
//  * EventList
//  *
//  * Props:
//  *  - events: array OR object map of backend event objects.
//  *            Each event is a backend Event doc:
//  *            {
//  *              _id, title, startAt, endAt,
//  *              price, img, organizer, state, inviter, ...
//  *            }
//  *  - filterIds: optional array of ids (strings) for filtering
//  *               (by _id / id)
//  *  - userType: "student" | "visitor" | "organizer" | "admin" | "system-admin"
//  *  - listType: "all-events" | "my-events" | ...
//  *  - setOrganizerViewing: optional, passed down to Event card
//  */
//
// export default function EventList({
//     events,
//     filterIds,
//     userType,
//     listType,
//     setOrganizerViewing,
// }) {
//     const items = useMemo(() => {
//         if (!events) return [];
//
//         // 1) Normalize to array
//         let eventsArray = [];
//         if (Array.isArray(events)) {
//             eventsArray = events.filter(
//                 (ev) => !!ev && typeof ev === "object",
//             );
//         } else if (typeof events === "object") {
//             eventsArray = Object.values(events).filter(
//                 (ev) => !!ev && typeof ev === "object",
//             );
//         } else {
//             return [];
//         }
//
//         // 2) Optional ID filter (by _id / id)
//         let filterSet = null;
//         if (Array.isArray(filterIds) && filterIds.length > 0) {
//             filterSet = new Set(filterIds.map(String));
//         }
//
//         const getKeyForFilter = (item, idx) =>
//             item._id ?? item.id ?? String(idx);
//
//         if (filterSet) {
//             eventsArray = eventsArray.filter((item, idx) =>
//                 filterSet.has(String(getKeyForFilter(item, idx))),
//             );
//         }
//
//         const now = new Date();
//
//         // 3) Pre-calc fields for sorting & expired flag
//         const processed = eventsArray.map((item, idx) => {
//             const key =
//                 item._id ?? item.id ?? String(idx);
//
//             // Use endAt if available; otherwise startAt
//             let dateObj = null;
//             if (item.endAt) {
//                 const d = new Date(item.endAt);
//                 if (!Number.isNaN(d.getTime())) dateObj = d;
//             } else if (item.startAt) {
//                 const d = new Date(item.startAt);
//                 if (!Number.isNaN(d.getTime())) dateObj = d;
//             }
//
//             const hasValidDate =
//                 dateObj && !Number.isNaN(dateObj.getTime());
//             const sortDate = hasValidDate
//                 ? dateObj
//                 : new Date(8640000000000000); // far future sentinel
//
//             const isEnded = !!(hasValidDate && dateObj < now);
//
//             return {
//                 event: item,            // keep raw event doc separate
//                 key: String(key),
//                 isEnded,
//                 sortDate,
//             };
//         });
//
//         // 4) Sort: active first (soonest), then ended (most recent)
//         processed.sort((a, b) => {
//             if (a.isEnded !== b.isEnded) {
//                 return a.isEnded ? 1 : -1; // active events first
//             }
//
//             if (!a.isEnded) {
//                 // active → ascending (soonest first)
//                 return a.sortDate - b.sortDate;
//             } else {
//                 // ended → descending (most recent first)
//                 return b.sortDate - a.sortDate;
//             }
//         });
//
//         return processed;
//     }, [events, filterIds]);
//
//     // Empty state
//     if (items.length === 0) {
//         return (
//             <div
//                 className="flex flex-col justify-center items-center gap-5
//                         p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]"
//             >
//                 {listType === "my-events" && userType !== "organizer"
//                     ? "No events joined yet."
//                     : userType === "organizer"
//                     ? "No events created."
//                     : "No events found"}
//             </div>
//         );
//     }
//
//     return (
//         <div className="flex flex-col justify-center items-center gap-5 p-3">
//             {items.map(({ event, key, isEnded }) => {
//                 const state = event.state ?? undefined;
//                 const inviter =
//                     event.inviter ||
//                     (state === "invited" ? event.user : undefined);
//
//                 return (
//                     <Event
//                         key={key}
//                         event={event}                 // full backend event doc
//                         type={userType}
//                         state={state}
//                         inviter={inviter}
//                         expired={isEnded}
//                         setOrganizerViewing={setOrganizerViewing}
//                     />
//                 );
//             })}
//         </div>
//     );
// }
import React, { useMemo } from "react";
import Event from "../event/Event";

/**
 * EventList
 *
 * Props:
 *  - events: object map { [id]: eventObj } (preferred)
 *            or array of full event objects (used in some contexts)
 *  - allEvents: optional map of raw events (not used to overwrite state in AllEvents)
 *  - filterIds: optional array of ids (strings) for filtering
 *  - eventsJoined: map from joinId -> joined record (optional, not used here directly)
 *  - userType: "student" | "visitor" | "organizer" | "admin" | "system-admin"
 *  - listType: "all-events" | "my-events" | ...
 */

export default function EventList(props) {
    const items = useMemo(() => {
        if (!props.events) return [];

        const filterIds = Array.isArray(props.filterIds)
            ? props.filterIds.map(String)
            : null;

        let normalized = [];

        // 1) Normalize Data
        if (!Array.isArray(props.events) && typeof props.events === "object") {
            normalized = Object.entries(props.events).map(([id, ev]) => ({
                id: String(id),
                ...(ev || {}),
            }));
        } else if (Array.isArray(props.events)) {
            normalized = props.events
                .map((entry, idx) => {
                    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                        const id = entry.id ?? entry.eventId ?? String(idx);
                        return { ...entry, id: String(id) };
                    }
                    return null;
                })
                .filter(Boolean);
        }

        // 2) Apply Filters
        if (filterIds && filterIds.length > 0) {
            const set = new Set(filterIds);
            normalized = normalized.filter((item) => set.has(String(item.id)));
        }

        // 3) Robust Date Parser for "MM/DD/YYYY-H:MMAM"
        const parseDate = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return null;

            // Split "11/21/2025-9:30AM" into date and time
            const parts = dateStr.split('-');
            if (parts.length < 2) return null; // Invalid format

            const datePart = parts[0]; // "11/21/2025"
            const timePart = parts[1]; // "9:30AM"

            const d = new Date(datePart);
            if (isNaN(d.getTime())) return null;

            // Parse time manually to handle "9:30AM" (no space) safely
            const timeMatch = timePart.match(/(\d+):(\d+)\s?(AM|PM)/i);
            if (timeMatch) {
                let [_, hours, minutes, ampm] = timeMatch;
                hours = parseInt(hours, 10);
                minutes = parseInt(minutes, 10);

                if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
                if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;

                d.setHours(hours, minutes, 0, 0);
            }

            return d;
        };

        const now = new Date();

        // 4) Pre-calculate Sort Data
        const processed = normalized.map(item => {
            const dateObj = parseDate(item.date);

            // If date is invalid (null), push it to the far future so it doesn't break list
            // Or set to epoch (0) if you want it at the bottom.
            const validDate = dateObj || new Date(8640000000000000);

            return {
                ...item,
                _sortDate: validDate,
                // It is ended if we have a valid date AND that date is before now
                isEnded: dateObj ? dateObj < now : false
            };
        });

        // 5) Sort
        return processed.sort((a, b) => {
            // Primary Sort: Active events first, Ended events last
            if (a.isEnded !== b.isEnded) {
                return a.isEnded ? 1 : -1;
            }

            // Secondary Sort:
            // - Active events: Ascending (Soonest first)
            // - Ended events: Descending (Most recently ended first) -> usually looks better
            if (!a.isEnded) {
                return a._sortDate - b._sortDate;
            } else {
                return b._sortDate - a._sortDate;
            }
        });
    }, [props.events, props.filterIds]);

    if (items.length === 0) {
        return (
            <div
                className="flex flex-col justify-center items-center gap-5
                        p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]"
            >
                {(props.listType === "my-events" && props.userType !== "organizer")
                    ? "No events joined yet."
                    : props.userType === "organizer" ?
                        "No events created." : "No events found"}
            </div>
        );
    }

    const renderItem = (item, idx) => {
        const id = item.id ?? String(idx);

        console.log("Rendering event with id =", id, "full item:", item);

        // IMPORTANT:
        // `item.state` is whatever we got from:
        //   - DummyData (for AllEvents, e.g. undefined or "waitlist"), or
        //   - merged eventsJoined record (for MyEvents, e.g. "joined" / "invited")
        const passedState = item.state ?? undefined;

        // For invites, `user` = invitor, `invitee` = person invited
        const inviter = item.inviter || (passedState === "invited" ? item.user : undefined);

        if (
            !item.title &&
            !item.img &&
            !item.date &&
            !item.organizer &&
            item.id == null
        ) {
            return null;
        }

        console.log("EventList Event:", props.eventsJoined);
        console.log("cheese", props.filteredEvents)
        // get event joined that is has event id equal to event

        const now = new Date();
        const eventMonthAndDay = item.date.match(/(\d+)\//g).map(e => e.replace('/', ''));
        const eventYear = item.date.match(/\/(\d+)-/g)[0].replace('/','').replace('-',''); // regex wizardry or sth
        const expired = eventYear < now.getFullYear() || (eventYear == now.getFullYear() && (parseInt(eventMonthAndDay[0]) < (now.getMonth() + 1) || (parseInt(eventMonthAndDay[0]) == (now.getMonth() + 1) && parseInt(eventMonthAndDay[1]) < now.getDate())));


        return (
            <Event
                key={id}
                id={id}
                type={props.userType}
                state={passedState}
                img={item.img}
                title={item.title}
                date={item.date}
                organizer={item.organizer}
                price={item.price}
                inviter={inviter}
                expired={expired}
                setOrganizerViewing={props.setOrganizerViewing} // don't worry about this, just passing it from App.jsx (Shayma)
            />
        );
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {items.map(renderItem)}
        </div>
    );
}