// Bidding.jsx (top-level page)
import React, { useEffect, useState, useCallback } from "react";
import BiddingList from "../components/bidding-list/BiddingList.jsx";
import AddListingModal from "../components/modals/AddListingModal.jsx";
import { Plus } from "lucide-react";

function listingToBidding(l, currentUserId = null) {
    // normalize seller id
    const ownerId =
        l.seller && (typeof l.seller === "string" ? l.seller : (l.seller._id || l.seller.id || null));

    // normalize topBids bidders to id strings (if populated)
    const topBids = (l.topBids || []).map(tb => ({
        bidder: tb.bidder && (typeof tb.bidder === "string" ? tb.bidder : (tb.bidder._id || tb.bidder.id || null)),
        amount: tb.amount,
        placedAt: tb.placedAt,
    }));

    // whether current user has placed a bid (if we know currentUserId)
    const hasUserBid = currentUserId ? topBids.some(tb => tb.bidder === currentUserId) : false;

    return {
        id: l._id || l.id,
        title: l.title,
        description: l.ticket?.event?.title || "",
        img: l.ticket?.imageUrl || "/src/assets/images/event/graduation.png",
        date: l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : (l.ticket?.event?.startAt ? new Date(l.ticket.event.startAt).toLocaleDateString() : ""),
        topBid: l.currentPrice ?? l.startingPrice ?? 0,
        ownerId,         // <-- seller id as string
        hasUserBid,      // <-- whether the current user has a bid here
        topBids,         // normalized top bids (bidder ids)
        raw: l,
    };
}


function transformListingsToBiddings(listings, currentUserId) {
    const map = {};
    listings.forEach(l => map[l._id || l.id] = listingToBidding(l, currentUserId));
    return map;
}

export default function Bidding({ user }) {
    const [open, setOpen] = useState(false);
    const [biddings, setBiddings] = useState({});
    const [loading, setLoading] = useState(false);

    const loadListings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/listings");
            if (!res.ok) throw new Error("Failed to fetch listings");
            const listings = await res.json();
            setBiddings(transformListingsToBiddings(listings, user));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadListings();
        // optional: polling
        // const interval = setInterval(loadListings, 10000);
        // return () => clearInterval(interval);
    }, [loadListings]);

    const handleCreate = async ({ ticketId, deadline, startingBid }) => {
        try {
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId,
                    sellerId: user,
                    startingPrice: startingBid,
                    deadline,
                }),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "Create failed");

            // server returns populated listing
            const createdListing = body;
            setBiddings(prev => ({ ...prev, [createdListing._id]: listingToBidding(createdListing) }));
            setOpen(false);
        } catch (err) {
            console.error("Create listing error:", err);
            alert("Could not create listing: " + err.message);
        }
    };

    return (
        <>
            <div id="page-content" className="flex flex-col items-center gap-10">
                <div id="my-listings-section" className="flex flex-col max-w-5xl align-middle w-full">
                    <div className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        <h1 className="font-[Gilroy-Black] text-[60px]">My Listings</h1>
                        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] font-[Gilroy-Medium]">
                            <Plus size={18} /> New Listing
                        </button>

                        <AddListingModal
                            open={open}
                            onClose={() => setOpen(false)}
                            biddings={biddings}
                            onCreate={handleCreate}
                        />
                    </div>

                    <BiddingList user={user} biddings={biddings} type="listing" />
                </div>

                <div id="current-bids-section" className="flex flex-col max-w-5xl align-middle w-full">
                    <div className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        <h1 className="font-[Gilroy-Black] text-[60px]">Current Bids</h1>
                    </div>

                    <BiddingList
                        user={user}
                        biddings={biddings}
                        type="bids"
                        onListingUpdated={(listing) => {
                            setBiddings(prev => ({ ...prev, [(listing._id || listing.id)]: listingToBidding(listing) }));
                        }}
                    />


                </div>
            </div>
        </>
    );
}
