import EventList from "../components/event-list/EventList";
import { useState, useEffect } from "react";
//1
function AboutOrganizer(props) {
    const [organizerEvents, setOrganizerEvents] = useState([]);

    const updateOrganizerEvents = () => {
        setOrganizerEvents(Object.keys(props.events).filter((eventId) => props.events[eventId].organizer === props.organizer && props.events[eventId]["university"] === props.users[props.organizer]["university"]));
        console.log(Object.keys(props.events))
        console.log("Organizer Events:", organizerEvents);
    }

    useEffect(() => {
        updateOrganizerEvents();
        // console.log(organizerEvents)
    }, [props.organizer]);
    useEffect(() => {
        updateOrganizerEvents();
        // console.log(organizerEvents)
    }, []);

    return (
        <div className="flex flex-col m-10 gap-7">
            <div>
                <h1 className="font-[Epilogue-Black] text-5xl lg:text-6xl text-[var(--primary-color)]">{props.users[props.organizer]["university"]}</h1>
                <h1 className="font-[Epilogue-Black] text-5xl lg:text-6xl text-[var(--primary-color)]">Organizer: {props.users[props.organizer]["first-name"]} {props.users[props.organizer]["last-name"]}</h1>
            </div>
            <h2 className="font-[Epilogue-Bold] text-3xl text-[var(--secondary-color)]">Events organized:</h2>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="max-w-5xl">
                    <EventList filteredEvents={organizerEvents} events={props.events} userType={props.userType} variant="r" />
                </div>
            </div>
        </div>
    )
}
export default AboutOrganizer;