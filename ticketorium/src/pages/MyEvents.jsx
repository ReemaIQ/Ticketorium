import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import EventList from "../components/event-list/EventList.jsx";

import { Search, Hash, Plus } from "lucide-react";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

library.add(fas, far, fab);

function MyEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const originalState = useRef({});

    const navigate = useNavigate(); // used when clicking "Create New Event" button

    // user in props is the username; we must look up the type from users map
    const userType = props.user ? props.users[props.user]?.type : null;

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "organizer") {
            return (
                <span className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)]">
                    My Events
                </span>
            );
        }

        if (t === "visitor") {
            return (
                <span className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)]">
                    My Events{" "}
                    <span className="font-[Gilroy-Medium] text-[40px] text-[#1A1A1A]">
                        at {props.uni || "Harvard"}
                    </span>
                </span>
            );
        }

        if (t === "student") {
            return (
                <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
                    My Events
                </span>
            );
        }

        return (
            <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
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

    return (
        <>
            {/* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30">
                {/* Upcoming Events */}
                <div
                    id="events-section"
                    className="flex flex-col max-w-5xl align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3"
                    >
                        {/* Left: Title + Search */}
                        <div className="flex items-center justify-start gap-4 w-full max-w-5xl">
                            <h1>{getEventsTitle(userType)}</h1>
                        </div>

                            {userType === "organizer" && (
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => navigate("/create-event")}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#FFDF4F]
                                            text-[#14113B] rounded-[6px] font-[Gilroy-Medium]"
                                    >
                                        <Plus size={18} />
                                        Create New Event
                                    </button>
                                </div>
                            )}

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

                        {/* Right: Create New Event (organizers only) */}

                    </div>

                    <EventList
                        events={filteredEvents}
                        allEvents={props.events}
                        eventsJoined={props.eventsJoined}
                        userType={userType}
                        listType="my-events"
                    />
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