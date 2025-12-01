import React, {useState} from "react";
import listing from "../../assets/images/bidding/listing.png";
import bids from "../../assets/images/bidding/bids.png";
import MakeBidModal from "../modals/MakeBidModal.jsx";

export default function Bidding({ type, bidding, setBiddings, listingToBidding, onListingUpdated,  user }) {
    const [open, setOpen] = useState(false);

    const handleBid = async (amount) => {
        try {
            const listingId = bidding.id || bidding.raw?._id;
            const res = await fetch(`/api/listings/${listingId}/bids`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bidderId: user, amount }),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "Bid failed");

            // backend returns { bid, listing }
            const updatedListing = body.listing;
            // tell parent to update UI with this listing
            onListingUpdated?.(updatedListing);

            alert("Bid placed successfully!");
        } catch (err) {
            console.error("Place bid error", err);
            alert("Failed to place bid: " + err.message);
        } finally {
            setOpen(false);
        }
    };

    const endListing = async (listingId) => {
        try {
            const res = await fetch(`/api/listings/${listingId}/end`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId: user.handle }), // use normalized user id
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "End failed");

            // update local state: replace listing with returned listing or set its status
            const updated = body.listing || body;
            setBiddings(prev => ({ ...prev, [String(updated._id)]: listingToBidding(updated, user) }));

            alert("Listing ended. Top bidder notified (if one exists).");
        } catch (err) {
            console.error("endListing error:", err);
            alert("Could not end listing: " + err.message);
        }
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
                                className="flex gap-3 bg-[var(--accent-color)] text-[var(--secondary-color)]
                                        rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3 "
                                onClick={() => endListing(bidding.raw._id || bidding.id)}
                            >
                                End Bid
                                <img src={listing} alt="Bid" className="w-5 h-5 object-cover"/>
                            </button>
                        )}

                        {type === "bids" && (
                            <>
                                <button
                                    className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--secondary-color)]
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
                        <p className="font-[Gilroy-Medium] text-[var(--primary-color)] text-[18px]">Bidding Ends:
                            <span className="text-[#1A1A1A]"> {bidding.date}</span>
                        </p>
                        <p className="font-[Gilroy-Medium] text-[var(--primary-color)] text-[18px]">Highest Bid:
                            <span className="text-[#1A1A1A]"> $ {bidding.topBid}</span>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}