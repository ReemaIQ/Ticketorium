import React, { useState, useEffect, useRef } from "react";
import EventList from "../components/event-list/EventList.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

// Use same path style as MyEvents
import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";


function AllEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const originalState = useRef({});

    // user in props is a username; look up in users map
    const userType = props.user ? props.users[props.user]?.type : null;

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "admin") {
            return (
                <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                    Manage Events
                </span>
            );
        }

        if (t === "visitor") {
            return (
                <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
                    Events at <span className="text-[var(--primary-color)] font-[Gilroy-Medium]"> {props.uni} </span>
                </span>
            );
        }

        if (t === "student") {
            return (
                <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                    Events
                </span>
            );
        }

        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                Events
            </span>
        );
    };

    useEffect(() => {
        // Initial load: filter events for this university
        props.filterContent(
            "initial",
            props.events,
            originalState,
            "event",
            "",
            { "list-type": "all-events", university: props.uni }
        );
        console.log("Original State Set:", originalState.current);
        // force a re-render with keys of originalState
        setFilteredEvents(Object.keys(originalState.current));
    }, []);

    return (
        <>
            {/* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30 min-h-screen">
                {/* Upcoming Events */}
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3 gap-4"
                    >
                        {/* Left: Title */}
                        <div className="flex items-center gap-3">
                            <h1>{getEventsTitle(userType)}</h1>
                        </div>

                        {/* Search */}
                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>
                            <SearchBtn
                                expandable={true}
                                filterFunc={(searchValue) => {
                                    props.filterContent(
                                        "search",
                                        originalState.current,
                                        setFilteredEvents,
                                        "event",
                                        searchValue,
                                        {
                                            "list-type": "all-events",
                                            university: props.uni,
                                        }
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <EventList
                        events={originalState.current}
                        eventsJoined={props.eventsJoined}
                        filteredEvents={filteredEvents}
                        filterContent={props.filterContent}
                        userType={userType}
                        listType="all-events"
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

export default AllEvents;