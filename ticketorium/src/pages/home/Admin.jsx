import React from "react";
import Nav from "../../components/nav/Nav.jsx";
import EventList from "../../components/event-list/EventList.jsx";

import { Search, Hash } from "lucide-react";

import heroImg from "./assets/img.png";
import groupHiking from "../../assets/event/group-hiking.png";
import gameDev from "../../assets/event/game-dev.png";
import spellingBee from "../../assets/event/spelling-bee.png";
import graduation from "../../assets/event/graduation.png";

function Admin() {
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

    return (
        <>
            {/* Navigation */}
            <Nav
                userName={user.name}
                type={user.type}/>

            {/* --- Hero Section --- */}
            <section className="flex flex-col md:flex-row items-center justify-between bg-[#2F4473] text-white pl-8 md:pl-20 py-8 md:py-12">
                {/* Left: Welcome Text */}
                <div className="flex flex-col gap-2">
                    <h1 className="font-[Gilroy] font-black text-7xl leading-[1.1]">
                        Welcome<br />Back,<br />Admin
                    </h1>
                </div>

                {/* Right: Hero Image */}
                <div className="mt-10 md:mt-0 md:w-1/2 flex justify-end w-full">
                    <img
                        src={heroImg}
                        alt="Admin Hero"
                        className="max-w-[400px] md:max-w-[400px] object-contain"
                    />
                </div>
            </section>

            {/* --- Bottom Section (below hero) --- */}
            <section className="bg-[#F7F7F7] py-5 px-8 md:px-20 flex items-center gap-10 border-t border-gray-300">
                <h2 className="font-[Gilroy] font-black text-[#2F4473] text-[24px]">JUMP TO</h2>

                <div className="flex flex-wrap gap-8 text-[#14113B] font-[Gilroy] font-medium text-[20px]">
                    <button className="hover:text-[#4F6FFF] transition">Notifications</button>
                    <button className="hover:text-[#4F6FFF] transition">Upcoming Events</button>
                </div>
            </section>

            { /* Content */}
            <div id="page-content" className="flex flex-col gap-30">

                {/* Notifications */}
                <div id="notifcations-section">
                    <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        {/* Left: Title + Search */}
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A]">
                                Notifications
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

                        {/* Right: Filter Button */}
                        {/*onClick={onFilter}*/}
                        <button
                            className="flex items-center gap-2 border-2 border-[#4F6FFF]
                            text-[#14113B] px-5 py-2 rounded-full font-[Gilroy] font-medium
                            hover:bg-[#4F6FFF] hover:text-white transition"
                        >
                            <Hash size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div id="events-section" className="flex flex-col max-w-5xl align-middle">
                    <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        {/* Left: Title + Search */}
                        <div className="flex items-center gap-3">
                            <h1 className="font-[Gilroy] font-black text-[40px] text-[#1A1A1A] ">
                                Upcoming Events
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

                        {/* Right: Filter Button */}
                        {/*onClick={onFilter}*/}
                        <button
                            className="flex items-center gap-2 border-2 border-[#4F6FFF]
                            text-[#14113B] px-5 py-2 rounded-full font-[Gilroy] font-medium
                            hover:bg-[#4F6FFF] hover:text-white transition"
                        >
                            <Hash size={18} />
                            Filter
                        </button>
                    </div>

                    <EventList events={events} userType={user.type}/>
                </div>

            </div>

            {/* Footer */}
            {/* <Footer type={user.type} /> */}
        </>
    )
}

export default Admin
