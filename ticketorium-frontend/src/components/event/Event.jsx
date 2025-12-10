// ticketorium-frontend/src/components/event/Event.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import EventActions from "./EventActions";
import { getUserCategory } from "./getUserCategory.js";

export default function Event({
                                  event,
                                  user,
                                  type,
                                  setOrganizerViewing,
                                  // base path for the detailed page; default stays "/event"
                                  detailBasePath = "/event",
                              }) {
    // Robust id: supports backend (_id), dummy (id), or eventId
    const id = event?.id || event?._id || event?.eventId;

    const title = event?.title;
    const img = event?.img;
    const date = event?.date;
    const organizer = event?.organizer;
    const price = event?.price;
    const inviter = event?.inviter;
    const state = event?.actionState;
    const expired = event?.isEnded;

    const category = getUserCategory(type);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const getRelativeTime = (dateString) => {
        if (!dateString) return "";

        const cleanDateStr = dateString.replace(
            /^\d{1,2}:\d{2}\s(?:AM|PM)\s/i,
            "",
        );

        const eventDate = new Date(cleanDateStr);
        const today = new Date();

        if (isNaN(eventDate.getTime())) return dateString;

        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Event Ended";
        if (diffDays === 0) return "Today!";
        if (diffDays === 1) return "Tomorrow!";
        return `in ${diffDays} days!`;
    };

    const daysLeftText = getRelativeTime(date);

    // Build href using the base path + id
    const detailHref = id ? `${detailBasePath}/${id}` : "#";

    return (
        <div className="relative">
            {expired && (
                <div className="absolute z-[100] w-full h-full bg-black rounded-[6px] opacity-10" />
            )}

            <div
                className={`sd:flex-col sd:align-center md:flex gap-5 rounded-[6px] ${
                    expired ? "opacity-60 bg-gray-300" : "opacity-100 bg-white"
                } border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-smz`}
            >
                {/* Left image (click to details) */}
                <div className="md:w-1/3">
                    <NavLink
                        to={detailHref}
                        state={{ event }}                 // pass full event
                        aria-label={`Open details for ${title}`}
                        onClick={(e) => {
                            if (!id) e.preventDefault();
                        }}
                    >
                        <img
                            src={`/src/assets/images/event/${img}`}
                            alt="Event"
                            className="w-full h-full object-cover"
                        />
                    </NavLink>
                </div>

                {/* Right content */}
                <div className="flex flex-col justify-between pb-5 pt-3 pr-4 pl-5 md:w-2/3 md:pl-0 gap-5">
                    {/* Top section */}
                    <div>
                        {state === "invited" && type !== "organizer" ? (
                            <div className="flex flex-row justify-between">
                                <p className="font-[Gilroy-Bold] text-[var(--secondary-accent-color)] text-[18px] my-1">
                                    You&apos;ve been invited to this event by {inviter}!
                                </p>
                                <p className="font-[Gilroy-Bold] text-[var(--secondary-accent-color)] mb-1">
                                    {daysLeftText}
                                </p>
                            </div>
                        ) : (
                            <p className="font-[Gilroy-Bold] text-right text-[var(--secondary-accent-color)] mb-1">
                                {daysLeftText}
                            </p>
                        )}

                        {/* Title row + mobile expand toggle */}
                        <div className="flex items-start justify-between gap-2">
                            {/* Title (click to details) */}
                            <NavLink
                                to={detailHref}
                                state={{ event }}         // pass full event
                                className="block flex-1"
                                onClick={(e) => {
                                    if (!id) e.preventDefault();
                                }}
                            >
                                <h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1 hover:underline">
                                    {title}
                                </h2>
                            </NavLink>

                            {/* Mobile chevron toggle */}
                            <button
                                type="button"
                                className="md:hidden p-1 mt-1 rounded-full hover:bg-gray-100 transition-transform"
                                onClick={() => setExpanded((prev) => !prev)}
                                aria-label={
                                    expanded
                                        ? "Collapse event details"
                                        : "Expand event details"
                                }
                                aria-expanded={expanded}
                            >
                                <ChevronDown
                                    className={`w-5 h-5 text-[#3E3E3E] transition-transform ${
                                        expanded ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mt-1 md:block">
                            <p className="font-[Gilroy-Medium] text-[20px] text-[#3E3E3E]">
                                Join us in the exciting coding competition — don&apos;t miss it!
                                Two lines maximum here. Just saying btw. Js.
                            </p>
                        </div>
                    </div>

                    {/* Bottom: actions + price + meta */}
                    <div
                        className={`flex flex-col gap-5 md:flex-row md:gap-1 ${
                            expanded ? "flex" : "hidden"
                        } md:flex`}
                    >
                        <EventActions
                            user={user}
                            type={type}
                            category={category}
                            state={state}
                            event={event}
                        />

                        <div className="flex-1 flex md:flex-row justify-between">
                            <div className="pl-2 flex align-center items-center">
                                {price === 0 && category === "attendee" && (
                                    <span className="font-[Gilroy-Medium] text-gray-700 text-[16px] self-center">
                                        Free
                                    </span>
                                )}

                                {price !== 0 && category === "attendee" && (
                                    <span className="font-[Gilroy-Bold] text-[var(--secondary-accent-color)] text-[18px] self-center">
                                        $ {price}
                                    </span>
                                )}
                            </div>

                            <div className="font-[Gilroy-Medium] text-sm text-[var(--primary-color)] text-right whitespace-nowrap ml-auto align-center items-center">
                                {date} <br /> by{" "}
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (setOrganizerViewing) {
                                            setOrganizerViewing(organizer);
                                        }
                                    }}
                                >
                                    {organizer}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
