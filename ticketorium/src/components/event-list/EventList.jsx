import React from "react";
import Event from "../event/Event";

/**
 * Displays a list of events.
 *
 * @param {Array} events - List of event objects
 * @param {string} userRole - Current user's role ("student", "visitor", "admin", "organizer")
 */

export default function EventList({ events = [], userType }) {
    if (!events.length) {
        return (
            <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy]">
                No events available.
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {events.map((event, index) => (
                <Event
                    key={event.id || index}
                    type={userType}
                    state={event.state}
                    img={event.img}
                    title={event.title}
                    date={event.date}
                    organizer={event.organizer}
                    price={event.price}
                    inviter={event.inviter}
                />
            ))}
        </div>
    );
}
