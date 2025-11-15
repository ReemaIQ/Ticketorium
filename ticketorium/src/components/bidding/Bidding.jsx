import React from "react";
import listing from "../../assets/images/bidding/listing.png";
import bids from "../../assets/images/bidding/bids.png";

export default function Bidding({type, date, year, topBid}) {
    return (
        <div className="sd:flex-col sd:align-center md:flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">

            {/* Left image */}
            <div className="md:w-1/3">
                    <img src={`/src/assets/images/event/graduation.png`} alt="Event" className="w-full h-full object-cover"/>
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-between pb-5 pt-5 pr-4 pl-5 md:w-2/3 md:pl-0 gap-5">

                {/* Top */}
                <div>
                    {/* Title */}
                        <h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1">
                            {year} Graduation Ceremony
                        </h2>


                    <p className="font-[Gilroy-Medium] text-[20px] text-[#3E3E3E]">
                        Join us in celebrating our beloved graduates. They have worked so hard to finally reach this day!
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center md:flex-row gap-5">

                    {/* Left */}
                    <div>
                        {type === "listing"  && (
                            <button
                                className="flex gap-3 bg-[#FFDF4F] text-[#14113B]
                                        rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3 "
                            >
                                End Bid
                                <img src={listing} alt="Bid" className="w-5 h-5 object-cover"/>
                            </button>
                        )}

                        {type === "bids" && (
                            <button
                                className="flex items-center gap-2 bg-[#FFDF4F] text-[#14113B]
                                        rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3"
                            >
                                Bid
                                <img src={bids} alt="Bid" className="w-5 h-5 object-cover"/>
                            </button>
                        )}
                    </div>

                    {/* Right */}
                    <div>
                        <p className="font-[Gilroy-Medium] text-[#4F6FFF] text-[18px]">Bidding Ends:
                            <span className="text-[#14113B]"> {date}</span>
                        </p>
                        <p className="font-[Gilroy-Medium] text-[#4F6FFF] text-[18px]">Highest Bid:
                            <span className="text-[#14113B]"> {topBid}</span>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}