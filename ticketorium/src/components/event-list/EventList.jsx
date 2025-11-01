import React from "react";
import Event from "../event/Event";

/**
 * Displays a list of events.
 *
 * @param {{}} events - List of event objects
 * @param {string} userRole - Current user's role ("student", "visitor", "admin", "organizer")
 */

export default function EventList({ events = {}, userType }) {
    if (events.length) {
        return (
            <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                No events available.
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {Object.keys(events).map((event, index) => (
                <Event
                    key={events[event].id || index}
                    type={userType}
                    state={events[event].state}
                    img={events[event].img}
                    title={events[event].title}
                    date={events[event].date}
                    organizer={events[event].organizer}
                    price={events[event].price}
                    inviter={events[event].inviter}
                />
            ))}
        </div>
    );
}
