// "My Events" page
// - For students/visitors: shows events they joined (using EventList)
// - For organizers: also shows "Create New Event" button → /create-event
//   (CreateEvent.jsx handles the creation form)
// - Event cards here still use Event → EventPage for:
//     * joining
//     * QR tickets
//     * QR verification (via EventActions + EventPage)

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import EventList from "../components/event-list/EventList.jsx";
import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

function MyEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const originalState = useRef({});

    const navigate = useNavigate(); // used when clicking "Create New Event" button

    // user in props is the username; we must look up the type from users map
    const userType = props.user ? props.users[props.user]?.type : null;

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "visitor") {
            return (
                <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
                    My Events{" "}
                    <span className="font-[Gilroy-Medium] text-[60px] text-[var(--primary-color)]">
                        at {props.uni || "Harvard"}
                    </span>
                </span>
            );
        }

        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                My Events
            </span>
        );
    };

    useEffect(() => {
        props.filterContent(
            "initial",
            { events: props.events, eventsJoined: props.eventsJoined },
            originalState,
            "event",
            "",
            { "list-type": "my-events", university: props.uni }
        );
        console.log("Original State Set:", originalState.current);
        // forces a re-render
        setFilteredEvents(Object.keys(originalState.current));
    }, []);

    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv", filteredEvents)

    return (
        <>
            {/* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30 w-full min-h-screen">
                {/* Upcoming Events */}
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl gap-5 align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start gap-5 max-w-5xl mt-9 mb-3 px-3"
                    >
                        {/* Left: Title + Search */}
                        <div className="flex flex-col md:flex-row items-center justify-start gap-4 w-full max-w-5xl">
                            <h1 className="justify-end w-full">{getEventsTitle(userType)}</h1>

                            {/* Right: Create New Event (organizers only) */}
                            {userType === "organizer" && (
                                <div className="flex justify-end w-full gap-3">
                                    <button
                                        onClick={() => navigate("/create-event")}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)]
                                        text-[var(--primary-color)] rounded-[6px] font-[Gilroy-Medium]"
                                    >
                                        <Plus size={18} />
                                        Create New Event
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>

                            <SearchBtn
                                filterFunc={(searchValue) => {
                                    props.filterContent(
                                        "search",
                                        originalState.current,
                                        setFilteredEvents,
                                        "event",
                                        searchValue,
                                        {
                                            "list-type": "my-events",
                                            university: props.uni,
                                        }
                                    );
                                }}
                                expandable={true}
                            />
                        </div>
                    </div>

                    {userType === "organizer" && (
                        <EventList
                            events={props.events}
                            allEvents={props.events}
                            eventsJoined={props.eventsJoined}
                            userType={userType}
                            listType="my-events"
                        />
                    )}

                    {userType !== "organizer" && (
                        <EventList
                            events={filteredEvents}
                            allEvents={props.events}
                            eventsJoined={props.eventsJoined}
                            userType={userType}
                            listType="my-events"
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

export default MyEvents;