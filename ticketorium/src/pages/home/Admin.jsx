import React from "react";
import Nav from "../../components/nav/Nav.jsx";
import EventList from "../../components/event-list/EventList.jsx";

import { Search, Hash } from "lucide-react";
import heroImg from "./assets/img.png";

function Admin() {
    const user = {
        name: "Student",
        type: "visitor",
    };

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
