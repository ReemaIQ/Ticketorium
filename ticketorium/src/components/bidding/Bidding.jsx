import React, {useState} from "react";
import listing from "../../assets/images/bidding/listing.png";
import bids from "../../assets/images/bidding/bids.png";
import MakeBidModal from "./MakeBidModal.jsx";

export default function Bidding({type,bidding}) {
    const [open, setOpen] = useState(false);

    const handleBid = ({ id, deadline, startingBid }) => {
        console.log("Create listing:", { id, deadline, startingBid });
        setOpen(false); // close after creating
    };

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
                            {bidding.year} Graduation Ceremony
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
                            <>
                                <button
                                    className="flex items-center gap-2 bg-[#FFDF4F] text-[#14113B]
                                        rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3"
                                    onClick={() => setOpen(true)}
                                >
                                    Bid
                                    <img src={bids} alt="Bid" className="w-5 h-5 object-cover" />
                                </button>
                                <MakeBidModal open={open} onClose={() => setOpen(false)} bidding={bidding} onBid={handleBid}/>
                            </>
                        )}
                    </div>

                    {/* Right */}
                    <div>
                        <p className="font-[Gilroy-Medium] text-[#4F6FFF] text-[18px]">Bidding Ends:
                            <span className="text-[#14113B]"> {bidding.date}</span>
                        </p>
                        <p className="font-[Gilroy-Medium] text-[#4F6FFF] text-[18px]">Highest Bid:
                            <span className="text-[#14113B]"> {bidding.topBid}</span>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}