import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import EventActions from "./EventActions";
import { getUserCategory } from "./getUserCategory.js";

export default function Event({
                                  event,
                                  id,
                                  user,
                                  type,
                                  state,
                                  img,
                                  title,
                                  date,
                                  organizer,
                                  price,
                                  inviter,
                                  expired,
                                  setOrganizerViewing
                              }) {
    const category = getUserCategory(type);
    const [expanded, setExpanded] = useState(false); // mobile expand/collapse
    const navigate = useNavigate();

    const getRelativeTime = (dateString) => {
        if (!dateString) return "";

        // 1. Remove leading time (e.g. "9:30 AM ") to ensure 'new Date()' parses correctly
        // Regex looks for: Digits, Colon, Digits, Space, AM/PM, Space
        const cleanDateStr = dateString.replace(/^\d{1,2}:\d{2}\s(?:AM|PM)\s/i, "");

        const eventDate = new Date(cleanDateStr);
        const today = new Date();

        // 2. Validate date
        if (isNaN(eventDate.getTime())) return dateString; // Fallback if parsing fails

        // 3. Reset time to midnight for accurate day calculation
        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // 4. Calculate difference
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 5. Return formatted string
        if (diffDays < 0) return "Event Ended";
        if (diffDays === 0) return "Today!";
        if (diffDays === 1) return "Tomorrow!";
        return `in ${diffDays} days!`;
    };

    const daysLeftText = getRelativeTime(date);

    return (
        <div className="relative">
            {expired && (
                <div className="absolute z-[100] w-full h-full bg-black rounded-[6px] opacity-10">
                </div>)
            }

            <div className={`sd:flex-col sd:align-center md:flex gap-5 rounded-[6px] ${expired ? "opacity-60 bg-gray-300" : "opacity-100 bg-white"} border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-smz`}>
                {/* Left image (click to details) */}
                <div className="md:w-1/3">
                    <NavLink to={`/event/${id}`} aria-label={`Open details for ${title}`}>
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
                        {(state === "invited" && type !== "organizer") ? (
                            <div className="flex flex-row justify-between">
                                <p className="font-[Gilroy-Bold] text-[var(--secondary-accent-color)] text-[18px] my-1">
                                    You've been invited to this event by {inviter}!
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
                            <NavLink to={`/event/${id}`} className="block flex-1">
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
                                    expanded ? "Collapse event details" : "Expand event details"
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
                                Join us in the exciting coding competition — don’t miss it!
                                Two lines maximum here. Just saying btw. Js.
                            </p>
                        </div>
                    </div>

                    {/* Bottom: actions + price + meta (collapsible on mobile, always visible on md+) */}
                    <div
                        className={`flex flex-col gap-5 md:flex-row md:gap-1 ${
                            expanded ? "flex" : "hidden"
                        } md:flex`}
                    >
                        {/* Integrated EventActions (single instance, with event + user) */}
                        <EventActions
                            user={user}
                            type={type}
                            category={category}
                            state={state}
                            eventId={id}
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
                                {date} <br /> by <span className="cursor-pointer" onClick={() => {setOrganizerViewing(organizer)}}>{organizer}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
