import React, { useState } from "react";
import listingImg from "../../assets/images/bidding/listing.png";
import bids from "../../assets/images/bidding/bids.png";
import MakeBidModal from "../modals/MakeBidModal.jsx";
import { API_BASE } from "../../api/config";

/**
 * Helper: normalize the `user` prop to an identifier string.
 * Accepts: user = null | string (handle or id) | object (user object with _id/id/handle)
 * Priority: _id -> id -> handle -> raw string
 */
const getUserId = (user) => {
    if (!user) return null;
    if (typeof user === "string") return user;
    // object
    return user._id || user.id || user.handle || null;
};

export default function Bidding({
                                    type,
                                    bidding,
                                    setBiddings,
                                    listingToBidding,
                                    onListingUpdated,
                                    user,
                                }) {
    const [open, setOpen] = useState(false);

    // normalized user identifier (string) - could be an ObjectId or handle,
    // depending on how your app stores logged-in user. Prefer _id when available.
    const userId = getUserId(user);

    const handleBid = async (amount) => {
        try {
            const listingId = bidding.id || bidding.raw?._id;
            if (!listingId) throw new Error("Missing listing id");

            if (!userId) {
                alert("You must be logged in to place a bid.");
                return;
            }

            // debug
            console.log("[client] placing bid:", { listingId, bidderId: userId, amount });

            const res = await fetch(`${API_BASE}/api/listings/${listingId}/bids`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bidderId: userId, amount }),
            });

            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error || "Bid failed");

            // backend returns { bid, listing } (your code earlier used body.listing)
            const updatedListing = body.listing || body;
            onListingUpdated?.(updatedListing);

            alert("Bid placed successfully!");
        } catch (err) {
            console.error("Place bid error", err);
            alert("Failed to place bid: " + (err.message || err));
        } finally {
            setOpen(false);
        }
    };

    const endListing = async (listingId) => {
        try {
            if (!listingId) {
                console.warn("endListing called without listingId");
                return;
            }

            // normalize user -> prefer _id, fallback to handle/string
            const sellerId = (() => {
                if (!user) return null;
                if (typeof user === "string") return user;
                return user._id || user.id || user.handle || null;
            })();

            console.log("[client] endListing called:", { listingId, sellerId, user });

            if (!sellerId) {
                alert("You must be logged in as the seller to end this listing.");
                return;
            }

            const res = await fetch(`${API_BASE}/api/listings/${listingId}/end`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId }),
            });

            // read text first so we can show raw body even if non-json
            const text = await res.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                json = null;
            }

            console.log("[client] /end response status:", res.status, res.statusText);
            console.log("[client] /end response text:", text);
            console.log("[client] /end response json:", json);

            if (!res.ok) {
                // show server-provided error if present, otherwise raw text
                const errMsg = (json && json.error)
                    ? json.error
                    : (text || `${res.status} ${res.statusText}`);
                throw new Error(errMsg);
            }

            // success path
            const body = json || {};
            const updated = body.listing || body;
            if (setBiddings && listingToBidding && updated) {
                setBiddings((prev) => ({
                    ...prev,
                    [String(updated._id)]: listingToBidding(updated, sellerId),
                }));
            }
            onListingUpdated?.(updated);
            alert("Listing ended. Top bidder notified (if one exists).");
        } catch (err) {
            console.error("endListing error (verbose):", err);
            alert("Could not end listing: " + (err.message || err));
        }
    };

    return (
        <div className="sd:flex-col sd:align-center md:flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">
            {/* Left image */}
            <div className="md:w-1/3">
                <img
                    src={`/src/assets/images/event/graduation.png`}
                    alt="Event"
                    className="w-full h-full object-cover"
                />
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
                        Join us in celebrating our beloved graduates. They have worked so hard to
                        finally reach this day!
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex items-center md:flex-row gap-5">
                    {/* Left */}
                    <div>
                        {type === "listing" && (
                            <button
                                className="flex gap-3 bg-[var(--accent-color)] text-[var(--secondary-color)]
                                    rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3 "
                                onClick={() => endListing(bidding.raw?._id || bidding.id)}
                            >
                                End Bid
                                <img
                                    src={listingImg}
                                    alt="Bid"
                                    className="w-5 h-5 object-cover"
                                />
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
                                    <img
                                        src={bids}
                                        alt="Bid"
                                        className="w-5 h-5 object-cover"
                                    />
                                </button>
                                <MakeBidModal
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    bidding={bidding}
                                    onBid={handleBid}
                                />
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
