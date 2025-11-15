import React from "react";
import EventList from "../../components/event-list/EventList.jsx";
import { Search, Hash } from "lucide-react";
import OrganizerAnalytics from "../../components/organizer/organizer_analytics.jsx";
import heroImg from "../../assets/img.png";

/* Dummy data – replace later with real events */
const upcomingEvents = [
    {
        id: "1",
        title: "2025 Group Hiking",
        description:
            "Join us in this exciting hiking trip – don’t miss it! Two lines maximum here. Just saying btw.",
        img: "group-hiking.png",
        dateLabel: "9:30 AM Nov 21, 2025",
        daysLeftLabel: "in 3 days!",
        department: "by CS Department",
        location: "Abha Mountains",
    },
    {
        id: "3",
        title: "2025 Spelling Bee",
        description:
            "Join us in the exciting spelling competition – don’t miss it! Two lines maximum. Just saying btw.",
        img: "spelling-bee.png",
        dateLabel: "Nov 21, 2025",
        daysLeftLabel: "in 3 days!",
        department: "by CS Department",
        location: "KFUPM Auditorium",
    },
    {
        id: "4",
        title: "2025 Coding Competition",
        description:
            "Join us in the exciting coding competition – don’t miss it! Two lines maximum. Just saying btw.",
        img: "game-dev.png",
        dateLabel: "Nov 21, 2025",
        daysLeftLabel: "in 3 days!",
        department: "by CS Department",
        location: "KFUPM Lab B24",
    },
];

function Organizer() {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 30,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* --- Hero Section --- */}
            <section className="m-0 flex flex-col gap-10 bg-[var(--secondary-color)] w-full h-screen relative">
                <div className="flex justify-between">
                    <div className="px-20 py-30">
                        <h1 className="text-[130px] font-bold w-180 font-[Epilogue-Black] leading-[140px] text-white">
                            Welcome Back,
                            <br />
                            Organizer!
                        </h1>
                        <p className="font-[DM-Sans-Light] text-[24px] text-white mt-7 max-w-xl">
                            All your university&apos;s events and performance analytics in one place.
                        </p>
                    </div>
                </div>

                <img
                    src={heroImg}
                    alt="Organizer Hero"
                    className="h-[95%] absolute right-[-15%] object-contain"
                />
            </section>

            {/* --- Jump-to section --- */}
            <div className="bg-[#F3F3F3] h-[96px] w-full flex items-center px-12 py-9 gap-12">
                <span className="font-[Gilroy-Black] text-[var(--secondary-color)] text-[32px]">
                    JUMP TO
                </span>
                <div className="flex flex-wrap gap-8">
                    <span
                        className="font-[Gilroy-Medium] text-[20px] text-[var(--primary-color)] cursor-pointer hover:text-[#4F6FFF] transition"
                        onClick={() => scrollToSection("analytics")}
                    >
                        Analytics
                    </span>
                    <span
                        className="font-[Gilroy-Medium] text-[20px] text-[var(--primary-color)] cursor-pointer hover:text-[#4F6FFF] transition"
                        onClick={() => scrollToSection("upcoming-events")}
                    >
                        Upcoming Events
                    </span>
                </div>
            </div>

            {/* --- Analytics Section --- */}
            <section
                id="analytics"
                className="bg-[#F3F3F3] flex flex-col items-center py-10 px-15 gap-6"
            >
                <div
                    id="section-header"
                    className="flex items-center justify-between w-full mt-2 mb-3 px-15"
                >
                    <div className="flex items-center gap-3">
                        <h2 className="font-[Epilogue-Black] text-[60px] text-[var(--primary-color)]">
                            Recent Analytics
                        </h2>
                    </div>
                </div>

                <div className="w-full max-w-6xl px-15">
                    <OrganizerAnalytics />
                </div>
            </section>

            {/* --- Upcoming Events Section --- */}
            <section
                id="upcoming-events"
                className="bg-[#F3F3F3] flex flex-col items-center py-10 px-15 gap-6"
            >
                <div
                    id="section-header"
                    className="flex items-center justify-between w-full mt-2 mb-3 px-15"
                >
                    {/* Left: Title + Search */}
                    <div className="flex items-center gap-3">
                        <h2 className="font-[Epilogue-Black] text-[60px] text-[var(--primary-color)]">
                            My Upcoming Events
                        </h2>

                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                            aria-label="Search"
                        >
                            <Search size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Right: Filter Button */}
                    <button
                        className="flex items-center gap-2 border-2 border-[#4F6FFF]
                                   text-[#14113B] px-5 py-2 rounded-full font-[Gilroy-Medium]
                                   hover:bg-[#4F6FFF] hover:text-white transition"
                    >
                        <Hash size={18} />
                        Filter
                    </button>
                </div>

                {/* reuse EventList*/}
                <div className="flex w-full max-w-6xl px-15">
                    <EventList events={upcomingEvents} userType="organizer" />
                </div>
            </section>
        </div>
    );
}

export default Organizer;
