import React, { useMemo } from "react";
import Event from "../event/Event";

/**
 * EventList (expects `events` to already contain the events to display)
 *
 * Props:
 *  - events: array | object
 *      - array: can be array of event objects OR array of event ids (strings/numbers)
 *      - object/map: { [id]: eventObj } (common initial shape)
 *  - eventsJoined: { [id]: { user, state, ... } } (optional)
 *  - userType: current user's type
 *  - listType: used only to select empty message ("my-events" -> "No events joined yet.")
 */

// Displays a list of events.
export default function EventList(props) {
    // Normalize `events` into an array of event objects that each include an `id` string
    const items = useMemo(() => {
        if (!props.events) return [];
        const allEvents = props.allEvents || {}; // event map: { id: eventObj }
        let normalizedItems = [];

        // If events is an array:
        if (Array.isArray(props.events)) {
            normalizedItems = props.events
                .map((entry, idx) => {
                    // Object entry
                    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                        const id = entry.id ?? entry.eventId ?? String(idx);
                        return { ...entry, id: String(id) };
                    }
                    // ID entry (string/number)
                    if (typeof entry === "string" || typeof entry === "number") {
                        const id = String(entry);
                        const found = allEvents[id];
                        if (found) return { ...found, id };
                        return { id };
                    }
                    return null;
                })
                .filter(Boolean);
        } else if (typeof props.events === "object") {
            normalizedItems = Object.entries(props.events).map(([id, ev]) => ({
                id: String(id),
                ...(ev || {})
            }));
        }

        // 2. Date Helpers
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(8640000000000000); // Far future if invalid
            const cleanDate = dateStr.replace(/^\d{1,2}:\d{2}\s(?:AM|PM)\s/i, '');
            const d = new Date(cleanDate);
            return isNaN(d.getTime()) ? new Date(8640000000000000) : d;
        };

        // Get "Now" set to midnight to include "Today" in the Upcoming group
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // 3. Sort: Future first, then Past. Within groups, sort by date ascending.
        return normalizedItems.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            const isPastA = dateA < now;
            const isPastB = dateB < now;

            // Priority 1: Separate Future from Past
            if (isPastA && !isPastB) return 1; // A is past, B is future -> B first
            if (!isPastA && isPastB) return -1; // A is future, B is past -> A first

            // Priority 2: Chronological Sort (Soonest -> Furthest)
            return dateA - dateB;
        });
    }, [props.events, props.allEvents]);

    if (items.length === 0) { //r
        return (
            <div className="flex flex-col justify-center items-center gap-5
                        p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                {props.listType === "my-events" ? "No events joined yet." : "No events available."}
            </div>
        );
    }

    const renderItem = (item, idx) => {
        const id = item.id ?? String(idx);

        console.log("Rendering event with id =", id, "full item:", item);

        const joined = props.eventsJoined?.["eventId"] || {};
        const passedState = (item.state || (joined.state === "invited" && joined.user !== joined.invitee)) ? item.state : joined.state;

        // If the event object doesn't include necessary display fields (title/img/date/etc.)
        // we attempt to skip rendering rather than render a broken Event card.
        if (!item.title && !item.img && !item.date && !item.organizer && item.id == null) {
            return null;
        }

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
                inviter={joined.user}
            />
        );
    };

    return <div className="flex flex-col justify-center items-center gap-5 p-3">
        {items.map(renderItem)}
    </div>;

}
