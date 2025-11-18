import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import EventActions from "./EventActions";
import { getUserCategory } from "./getUserCategory.js";

export default function Event({
                                  id,
                                  type,
                                  state,
                                  img,
                                  title,
                                  date,
                                  organizer,
                                  price,
                                  inviter,
                              }) {
    const category = getUserCategory(type);
    const [expanded, setExpanded] = useState(false); // mobile expand/collapse

    return (
        <div className="sd:flex-col sd:align-center md:flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">

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
                    {state === "invited" ? (
                        <div className="flex flex-row justify-between">
                            <p className="font-[Gilroy-Bold] text-[#4F6FFF] text-[18px] my-1">
                                You've been invited to this event by {inviter}!
                            </p>
                            <p className="font-[Gilroy-Bold] text-[#4F6FFF] mb-1">
                                in 3 days!
                            </p>
                        </div>
                    ) : (
                        <p className="font-[Gilroy-Bold] text-right text-[#4F6FFF] mb-1">
                            in 3 days!
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
                            aria-label={expanded ? "Collapse event details" : "Expand event details"}
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
                    <EventActions type={type} category={category} state={state} eventId={id} />

                    <div className="flex-1 flex md:flex-row justify-between">
                        <div className="pl-2 flex align-center items-center">
                            {price === 0 && category === "attendee" && (
                                <span className="font-[Gilroy-Medium] text-gray-700 text-[16px] self-center">
                            Free
                        </span>
                            )}

                            {price !== 0 && category === "attendee" && (
                                <span className="font-[Gilroy-Bold] text-[#4F6FFF] text-[18px] self-center">
                        $ {price}
                        </span>
                            )}
                        </div>

                        <div className="font-[Gilroy-Medium] text-sm text-[#3E3E3E] text-right whitespace-nowrap ml-auto flex align-center items-center">
                            {date} <br /> by {organizer}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
