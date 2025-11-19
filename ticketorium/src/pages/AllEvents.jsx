import { useState, useEffect, useRef } from "react";
import EventList from "../components/event-list/EventList.jsx";

import {Hash, Search} from "lucide-react";

// Font Awesome Setup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import SearchBtn from "../components/SearchBtn/SearchBtn.jsx";


library.add(fas, far, fab)

function AllEvents(props) {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const originalState = useRef({});

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "admin") {
            return <span className="font-[Gilroy-Black] text-[40px] text-[var(--primary-color)]" >Manage Events</span>;
        }

        if (t === "visitor") {
            return (
                <span className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)]">
                    Events at {props.uni}
                </span>
            );
        }

        if (t === "student") {
            return <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">Events</span>;
        }

        return <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">Events</span>;
    };

    useEffect(() => {
        props.filterContent("initial", props.events, originalState, "event", "", { "list-type": "all-events", "university": props.uni})
        console.log("Original State Set:", originalState.current);
        setFilteredEvents(Object.keys(originalState.current)); // ik its stupid, but it forces a re-render
    }, []);


    return (
        <>
            { /* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30">

                {/* Upcoming Events */}
                <div id="events-section" className="flex flex-col max-w-5xl align-middle px-10 xl:px-15 pb-10">
                    <div id="section-header" className="flex flex-col items-start justify-between w-full mt-9 mb-3 px-3 gap-4">
                        {/* Left: Title + Search */}
                        <div className="flex items-center gap-3">
                            <h1>
                                {getEventsTitle(props.users[props.user]['type'])}
                            </h1>         
                        </div>
                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                icon={"fa-solid fa-filter"}
                                className="text-white"
                                />
                            </button>
                            <SearchBtn filterFunc={(searchValue) => {props.filterContent("search", originalState.current, setFilteredEvents, "event", searchValue, { "list-type": "all-events", "university": props.uni})}} expandable={true}/>
                        </div>
                    </div>

                    <EventList events={originalState.current} filteredEvents={filteredEvents} filterContent={props.filterContent} userType={props.users[props.user]['type']} listType="all-events"/>
                </div>

            </div>

            {/* Footer */}
            {/* <Footer type={user.type} /> */}
        </>
    )
}

export default AllEvents