import React from "react";
import EventList from "../components/event-list/EventList.jsx";

import { Search, Hash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom"; //r: needed to navigate to the Create Event page

function AllEvents(props) {
    const navigate = useNavigate(); //r: used when clicking "Create New Event" button

    //r: user in props is the username; we must look up the type from users map
    const userType = props.user ? props.users[props.user]?.type : null;

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "organizer") {
            return (
                <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
                    My Events
                </span>
            );
        }

        if (t === "visitor") {
            return (
                <span className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
                    My Events{" "}
                    <span className="font-[Gilroy-Medium] text-[40px] text-[#1A1A1A] ">
                        at Harvard
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

    return (
        <>
            {/* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30">
                {/* Upcoming Events */}
                <div
                    id="events-section"
                    className="flex flex-col max-w-5xl align-middle"
                >
                    <div
                        id="section-header"
                        className="flex items-center justify-between w-full mt-9 mb-3 px-3"
                    >
                        {/* Left: Title + Search */}
                        <div className="flex items-center gap-3">
                            <h1>{getEventsTitle(userType)}</h1>{" "}
                            {/* r: pass actual userType instead of props.user?.type */}
                            {/* Search Button */}
                            {/*onClick={onSearch}*/}
                            <button
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                                aria-label="Search"
                            >
                                <Search size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Right: Filter and Create Event Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Left: Filter Button */}
                            {/*onClick={onFilter}*/}
                            <button
                                className="flex items-center gap-2 border-2 border-[#4F6FFF]
                                text-[#14113B] px-5 py-2 rounded-full font-[Gilroy-Medium]
                                hover:bg-[#4F6FFF] hover:text-white transition"
                            >
                                <Hash size={18} />
                                Filter
                            </button>

                            {/* Right: Create Event Button */}
                            {/* Only visible to organizers */}
                            {/*onClick={opens create event page}*/}
                            {userType === "organizer" && ( //r: check userType looked up above
                                <button
                                    onClick={() => navigate("/events/new")} //r: opens the Create Event full page
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FFDF4F]
                                text-[#14113B]  rounded-[6px] font-[Gilroy-Medium]"
                                >
                                    <Plus size={18} />
                                    Create New Event
                                </button>
                            )}
                        </div>
                    </div>

                    <EventList
                        events={props.events}
                        userType={userType || "visitor"} //r: pass same derived type to cards
                    />
                </div>
            </div>
        </>
    );
}

export default AllEvents;
