import React from "react";
import EventActions from "./EventActions";
import {getUserCategory} from "./getUserCategory.js";
import { NavLink } from "react-router-dom"; //r

export default function Event({ id, type, state, img, title, date, organizer, price, inviter}) {
    const category = getUserCategory(type);

    return (
        <div className="sd:flex-col sd:align-center md:flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">

            {/* Left image (click to details //r) */}
            <div className="md:w-1/3">
                <NavLink to={`/event/${id}`} aria-label={`Open details for ${title}`}>
                    <img
                        src={`/src/assets/images/event/${img}`}
                        alt="Event"
                        className="w-full h-full object-cover"
                    />
                </NavLink>
                {/*<img src={"/src/assets/images/event/" + img} alt="Event" className="w-full h-full object-cover" />*/}

            {/* Right content */}
            <div className="flex flex-col justify-between pb-5 pt-3 pr-4 pl-5 md:w-2/3 md:pl-0 gap-5">

                {/* Top */}
                <div>
                        { state === "invited" ? (
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

                    {/* Title (click to details //r) */}
                    <NavLink to={`/event/${id}`} className="block">
                        <h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1 hover:underline">
                            {title}
                        </h2>
                    </NavLink>
                    {/*<h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1">*/}
                    {/*    {title}*/}
                    {/*</h2>*/}

                    <p className="font-[Gilroy-Medium] text-[20px] text-[#3E3E3E]">
                        Join us in the exciting coding competition — don’t miss it!
                        Two lines maximum here. Just saying btw. Js.
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center md:flex-row gap-2">
                    <EventActions type={type} category={category} state={state} eventId={id} />

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

                    <div className="font-[Gilroy-Medium] text-sm text-[#3E3E3E] text-right whitespace-nowrap ml-auto">
                        {date} <br /> by {organizer}
                    </div>

                </div>
            </div>

        </div>
    );
}
