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

        // If events is an array:
        if (Array.isArray(props.events)) {
            return props.events
                .map((entry, idx) => {
                    // If entry is an object and already has id, keep it
                    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                        // If event object lacks an id but has eventId use it
                        const id = entry.id ?? entry.eventId ?? String(idx);
                        return { ...entry, id: String(id) };
                    }

                    // If entry is a scalar (id), caller probably passed array of ids; we cannot build event data here
                    // so return an object with only id (rendering will skip if no event data found)
                    if (typeof entry === "string" || typeof entry === "number") {
                        const id = String(entry);
                        const found = allEvents[id];

                        if (found) return {...found, id};

                        // If not found → still return an item to avoid crashes
                        return {id};
                    }

                    return null;
                })
                .filter(Boolean);
        }

        // If events is an object/map: convert to array [{ id, ...event }]
        if (typeof props.events === "object") {
            return Object.entries(props.events).map(([id, ev]) => ({ id: String(id), ...(ev || {}) }));
        }

        // Fallback: nothing
        return [];
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
        const joined = props.eventsJoined?.[id] || {};
        const passedState = item.state? item.state : joined.state;

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
                inviter={joined.invitee}
            />
        );
    };

    return <div className="flex flex-col justify-center items-center gap-5 p-3">{items.map(renderItem)}</div>;

}
