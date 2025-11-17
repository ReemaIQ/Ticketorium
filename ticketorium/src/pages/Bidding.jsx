import BiddingList from "../components/bidding-list/BiddingList.jsx";
import AddListingModal from "../components/bidding/AddListingModal.jsx";

import {Hash, Plus} from "lucide-react";
import {useState} from "react";
import React from "react";

function Bidding(props) {
    const [open, setOpen] = useState(false);

    const handleCreate = ({ id, deadline, startingBid }) => {
        console.log("Create listing:", { id, deadline, startingBid });
        setOpen(false); // close after creating
    };

    return (
        <>
            { /* Content */}
            <div id="page-content" className="flex flex-col items-center gap-10">

                {/* My Listings */}
                <div id="my-listings-section" className="flex flex-col max-w-5xl align-middle w-full">
                    <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        {/* Left: Title */}
                        <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
                            My Listings
                        </h1>


                        {/* Right: Create New Event Button */}
                        {/*onClick={createNewListing}*/}
                        <button
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFDF4F]
                                text-[#14113B]  rounded-[6px] font-[Gilroy-Medium]"
                            onClick={() => setOpen(true)}
                        >
                            <Plus size={18} />
                            New Listing
                        </button>

                        <AddListingModal
                            open={open}
                            onClose={() => setOpen(false)}
                            biddings={Object.values(props.biddings).filter(b => b.user === props.user)}
                            onCreate={handleCreate}
                        />

                    </div>

                    <BiddingList user={props.user} biddings={props.biddings} type="listing" />

                </div>


                {/* Current Bids */}
                <div id="current-bids-section" className="flex flex-col max-w-5xl align-middle w-full">
                    <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-3">
                        {/* Left: Title */}
                        <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A]">
                            Current Bids
                        </h1>


                        {/* Right: Filter Button */}
                        {/*onClick={onFilter}*/}
                        <button
                            className="flex items-center gap-2 border-2 border-[#4F6FFF]
                                    text-[#14113B] px-5 py-2 rounded-full font-[Gilroy-Medium]
                                    hover:bg-[#4F6FFF] hover:text-white transition"
                        >
                            <Hash size={18} />
                            Filter
                        </button>
                    </div>

                    <BiddingList user={props.user} biddings={props.biddings} type="bids" />

                </div>

            </div>
        </>
    )
}

export default Bidding;