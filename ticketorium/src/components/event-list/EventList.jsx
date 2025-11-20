import { useEffect } from "react";
import Event from "../event/Event";

/**
 * Displays a list of events.
 *
 * @param {{}} events - List of event objects
 * @param {string} userRole - Current user's role ("student", "visitor", "admin", "organizer")
 */

export default function EventList(props) {

    if (props.events)
        props.filteredEvents = Object.keys(props.events)
    
    if (props.filteredEvents.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                {props.listType === "my-events" ? "No events joined yet." : "No events available."}
            </div>
        );
    }

    return ( //r
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {props.filteredEvents.map((event) => {
                return <Event
                    // key={props.events[event]}
                    type={props.userType}
                    state={props.events[event].state}
                    img={props.events[event].img}
                    title={props.events[event].title}
                    date={props.events[event].date}
                    organizer={props.events[event].organizer}
                    price={props.events[event].price}
                    inviter={props.events[event].inviter}
                />
            })}
        </div>
    );
}
