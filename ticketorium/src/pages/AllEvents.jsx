// src/pages/AllEvents.jsx
import React, { useState, useEffect, useRef } from "react";
import EventList from "../components/event-list/EventList.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

function AllEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]); // array of ids only
    const originalState = useRef({}); // full event objects (with state)

    const userType = props.role

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
                    Events at{" "}
                    <span className="text-[var(--primary-color)] font-[Gilroy-Medium]">
                        {props.uni["code"]}
                    </span>
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

    // 1) Initial: build a map of all events (merged with state)
    useEffect(() => {
        props.filterContent(
            "initial",
            // FIX 1: Pass BOTH events and eventsJoined
            { events: props.events, eventsJoined: props.eventsJoined },
            originalState,
            "event",
            "",
            // FIX 2: Pass loggedInUser (props.user) so we can merge 'joined'/'invited' states
            {
                "list-type": "all-events",
                university: props.uni["code"],
                loggedInUser: props.user
            },
            props.user // Pass user ID as the last arg if your app wrapper expects it here
        );

        // Debug to ensure state is merging
        console.log("AllEvents originalState:", originalState.current);

        setFilteredEvents(Object.keys(originalState.current));
    }, [props, props.events, props.eventsJoined, props.filterContent, props.uni, props.user]);

    // 2) Search
    const handleSearch = (searchValue) => {
        props.filterContent(
            "search",
            originalState.current,
            setFilteredEvents,
            "event",
            searchValue,
            {
                "list-type": "all-events",
                university: props.uni["code"],
            }
        );
    };

    return (
        <>
            <div
                id="page-content"
                className="flex flex-col items-center gap-30 min-h-screen"
            >
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3 gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <h1>{getEventsTitle(userType)}</h1>
                        </div>

                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>
                            <SearchBtn
                                expandable={true}
                                filterFunc={handleSearch}
                            />
                        </div>
                    </div>

                    <EventList
                        // Always pass the full objects (with state)
                        events={originalState.current}
                        // Optional: the raw events map if EventList ever needs it
                        allEvents={props.events}
                        eventsJoined={props.eventsJoined}
                        userType={userType}
                        listType="all-events"
                        // Only filter by ids
                        filterIds={filteredEvents}
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
