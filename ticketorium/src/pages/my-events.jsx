import React from "react";
import Nav from "../components/nav/Nav.jsx";
import EventList from "../components/event-list/EventList.jsx";

import {Search, Hash, Plus} from "lucide-react";

import groupHiking from "../assets/event/group-hiking.png";
import gameDev from "../assets/event/game-dev.png";
import spellingBee from "../assets/event/spelling-bee.png";
import graduation from "../assets/event/graduation.png";

function AllEvents() {
    const user = {
        name: "Student",
        type: "visitor",
    };

    const events = [
        {
            id:1,
            state:"joined",
            img: groupHiking,
            title:"2025 Group Hiking",
            date:"9:30 AM Nov 21, 2025",
            organizer:"CS Department",
            price: 0,
        },

        {
            id:2,
            state:"not-joined",
            img: gameDev,
            title:"2025 GameDev Competition",
            date:"Nov 21, 2025",
            organizer:"CS Department",
            price: 19.99,
        },

        {
            id: 3,
            state:"waitlist",
            img:spellingBee,
            title:"2025 Spelling Bee",
            date:"Nov 21, 2025",
            organizer:"CS Department",
            price: 0,
        },

        {
            id: 4,
            state:"waitlisted",
            img: gameDev,
            title:"2025 Coding Competition",
            date:"Nov 21, 2025",
            organizer:"CS Department",
            price: 19.99,
        },

        {
            id: 5,
            state: "invited",
            img: gameDev,
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
            inviter:"Student"
        },

        {
            id: 6,
            state: "graduation",
            img: graduation,
            title: "2025 Graduation Ceremony",
            date: "March 6, 2026",
            organizer: "Harvard",
            price: 0,
        }
    ]

    const getEventsTitle = (type) => {
        const t = type?.toLowerCase();

        if (t === "organizer") {
            return <span className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A]" >My Events</span>;
        }

        if (t === "visitor") {
            return (
                <span className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A]">
                    My Events{" "}
                    <span className="font-[Gilroy] font-medium text-[40px] text-[#1A1A1A] ">at Harvard</span>
                </span>
            );
        }

        if (t === "student") {
            return <span className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A]">My Events</span>;
        }

        return <span className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A]">My Events</span>;
    };

    return (
        <>
            <Nav
                userName={user.name}
                type={user.type}/>

            { /* Content */}
            <div id="page-content" className="flex flex-col items-center gap-30">

                {/* Upcoming Events */}
                <div id="events-section" className="flex flex-col max-w-5xl align-middle">
                    <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        {/* Left: Title + Search */}
                        <div className="flex items-center gap-3">
                            <h1>
                                {getEventsTitle(user?.type)}
                            </h1>

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
                                text-[#14113B] px-5 py-2 rounded-full font-[Gilroy] font-medium
                                hover:bg-[#4F6FFF] hover:text-white transition"
                            >
                                <Hash size={18} />
                                Filter
                            </button>

                            {/* Right: Create Event Button */}
                            {/* Only visible to organizers */}
                            {/*onClick={opens create event page}*/}
                            {   (user.type === "organizer") && (
                                <button
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FFDF4F]
                                text-[#14113B]  rounded-[6px] font-[Gilroy] font-medium"
                                >
                                    <Plus size={18} />
                                    Create New Event
                                </button>
                            )}
                        </div>

                    </div>

                    <EventList events={events} userType={user.type}/>
                </div>

            </div>

            {/* Footer */}
            {/* <Footer type={user.type} /> */}

        </>
    )
}

export default AllEvents