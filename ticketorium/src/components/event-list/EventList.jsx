import React from "react";
import Event from "../event/Event";

/**
 * Displays a list of events.
 *
 * @param {{}} events - List of event objects
 * @param {string} userRole - Current user's role ("student", "visitor", "admin", "organizer")
 */

export default function EventList({ events = {}, userType }) {
    const items = Object.entries(events); //r

    if (items.length === 0) { //r
        return (
            <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                No events available.
            </div>
        );
    }

    return ( //r
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {items.map(([id, ev]) => (
                <Event
                    key={id}
                    id={id}                 // pass id so card can link to /event/:id
                    type={userType}
                    state={ev.state}
                    img={ev.img}
                    title={ev.title}
                    date={ev.date}
                    organizer={ev.organizer}
                    price={ev.price}
                    inviter={ev.inviter}
                />
            ))}
        </div>
    );
}
