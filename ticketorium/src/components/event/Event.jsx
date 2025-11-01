import React from "react";
import EventActions from "./EventActions";
import {getUserCategory} from "./getUserCategory.js";

export default function Event({ type, state, img, title, date, organizer, price, inviter}) {
    const category = getUserCategory(type);

    return (
        <div className="flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">

            {/* Left image */}
            <div className="w-1/3">
                <img src={img} alt="Event" className="w-full h-full object-cover" />
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-between pb-5 pt-3 pr-4 w-2/3 gap-5">

                {/* Top */}
                <div>
                        { state === "invited" ? (
                            <div className="flex flex-row justify-between">
                                <p className="font-[Gilroy] font-bold text-[#4F6FFF] text-[18px] my-1">
                                    You've been invited to this event by {inviter}!
                                </p>
                                <p className="font-[Gilroy] font-bold text-[#4F6FFF] mb-1">
                                    in 3 days!
                                </p>
                            </div>
                        ) : (
                            <p className="font-[Gilroy] font-bold text-right text-[#4F6FFF] mb-1">
                                in 3 days!
                            </p>
                        )}

                    <h2 className="font-[Gilroy] font-black text-[#1A1A1A] text-[28px] leading-tight my-1">
                        {title}
                    </h2>

                    <p className="font-[Gilroy] font-medium text-[20px] text-[#3E3E3E]">
                        Join us in the exciting coding competition — don’t miss it!
                        Two lines maximum here. Just saying btw. Js.
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between md:flex-row gap-2">
                    <EventActions type={type} category={category} state={state}/>

                    {price === 0 && category === "attendee" && (
                        <span className="font-[Gilroy] font-medium text-gray-700 text-[16px] self-center">
                            Free
                        </span>
                    )}

                    {price !== 0 && category === "attendee" && (
                        <span className="font-[Gilroy] font-bold text-[#4F6FFF] text-[18px] self-center">
                            $ {price}
                        </span>
                    )}

                    <div className="font-[Gilroy] font-medium text-sm text-[#3E3E3E] text-right whitespace-nowrap ml-auto">
                        {date} <br /> by {organizer}
                    </div>

                </div>
            </div>

        </div>
    );
}
