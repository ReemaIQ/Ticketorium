import Bidding from "../bidding/Bidding.jsx";
import React from "react";

export default function BiddingList({ biddings = {}, type, user }) {
    const items = Object.entries(biddings); //r

    // filtering
    const filteredItems = items.filter(([id, bidding]) => {
        if (type === "listing") {
            return bidding.user === user;
        }

        if (type === "bids") {
            return bidding.user !== user;
        }

        return true;
    });

    if (filteredItems.length === 0) { //r
        if (type === "bids") {
            return (
                <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                    No bids available.
                </div>
            )
        } else {
            return (
                <div className="flex flex-col justify-center items-center gap-5
                            p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                    No listings made.
                </div>
            );
        }
    }

    return ( //r
        <div className="flex flex-col justify-center items-center gap-5 p-3 pb-10">
            {filteredItems.map(([ id, bidding]) => (
                <Bidding
                    id = {id}
                    type={type}
                    date={bidding.date}
                    year={bidding.year}
                    topBid={bidding.topBid}
                />
            ))}
        </div>
    );
}