import React, { useEffect, useRef, useState } from "react";
import { X, BadgeDollarSign } from "lucide-react";

export default function MakeBidModal({
                                             open,
                                             onClose,
                                             bidding,              // { img, title, description, countdownText, biddingEnds, latestBid, dateText, organizer }
                                             onBid,               // (amount: number) => void
                                         }) {
    const [bid, setBid] = useState("");
    const dialogRef = useRef(null);

    // Reset when opened
    useEffect(() => {
        if (open) {
            setBid("");
        }
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    // Focus dialog
    useEffect(() => {
        if (open) dialogRef.current?.focus();
    }, [open]);

    if (!open || !bidding) return null;

    const numericBid = Number(bid);
    const isValidBid =
        bid.trim() !== "" && !Number.isNaN(numericBid) && numericBid > 0;

    const handleSubmit = () => {
        if (!isValidBid) return;
        onBid?.(numericBid);
        setBid("");
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-labelledby="bid-title">
            <div className="w-3xl px-10">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose}/>

                {/* Dialog */}
                <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-8">
                    <div ref={dialogRef} tabIndex={-1} className="px-5 w-fit max-w-5xl bg-white rounded-2xl shadow-xl outline-none">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <h2 id="bid-title" className="font-[Gilroy-Black] text-[22px] text-[#1A1A1A]">
                                Bid on Ticket
                            </h2>

                            <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Ticket card */}
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
                                <div className="flex justify-start md:flex-row gap-5">
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

                        {/* Bid input + button */}
                        <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-end">
                            <div className="flex-1 flex justify-center sm:justify-start">
                                <div className="w-full max-w-xs border-b border-gray-300">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={bid}
                                        onChange={(e) => setBid(e.target.value)}
                                        className="w-full bg-transparent outline-none py-1 text-center sm:text-left font-[Gilroy-Medium] text-[14px]"
                                        placeholder="Enter your Bid"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isValidBid}
                                className={`inline-flex items-center gap-2 rounded-[6px] px-6 py-2 text-[14px] font-[Gilroy-Medium] transition
                ${
                                    isValidBid
                                        ? "bg-[#FFDF4F] text-[#14113B] hover:brightness-105"
                                        : "bg-[#FFF5B8] text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Bid
                                <BadgeDollarSign size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
