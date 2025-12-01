import Bidding from "../bidding/Bidding.jsx";
import React from "react";

export default function BiddingList({ biddings = {}, type, user, onListingUpdated }) {
    const items = Object.entries(biddings);
    const currentUserId = typeof user === "string" ? user : (user?._id || user?.id || null);

    const filteredItems = items.filter(([id, bidding]) => {
        const ownerId = bidding.ownerId || (bidding.user && (typeof bidding.user === "string" ? bidding.user : (bidding.user._id || bidding.user.id)));

        if (type === "listing") {
            // show only listings owned by current user
            return ownerId && currentUserId && ownerId === currentUserId;
        }

        if (type === "bids") {
            // show listings that the current user has placed bids on but doesn't own
            return ownerId !== currentUserId;
        }

        return true;
    });

    if (filteredItems.length === 0) {
        if (type === "bids") {
            return (
                <div className="flex flex-col justify-center items-center gap-5 p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                    No bids available.
                </div>
            );
        } else {
            return (
                <div className="flex flex-col justify-center items-center gap-5 p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                    No listings made.
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3 pb-10">
            {filteredItems.map(([id, bidding]) => (
                // ensure key present and pass id + onListingUpdated
                <Bidding
                    key={id}
                    bidding={{ ...bidding, id }}
                    type={type}
                    user={user}
                    onListingUpdated={onListingUpdated}
                />
            ))}
        </div>
    );
}
