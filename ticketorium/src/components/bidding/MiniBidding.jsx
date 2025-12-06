export default function MiniBidding({ bidding }) {
    return (
        <div className="flex flex-col md:flex-row gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">
            {/* Left image */}
            <div className="md:w-1/3">
                <img
                    src={bidding.img || "/src/assets/images/event/graduation.png"}
                    alt={bidding.title || "Ticket"}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-between pb-5 pt-3 pr-4 pl-5 md:w-2/3 md:pl-0 gap-3">
                {/* Top */}
                <div>
                    <h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1">
                        {bidding.title || "Graduation Event"}
                    </h2>
                    <p className="font-[Gilroy-Medium] text-[20px] text-[#3E3E3E]">
                        {bidding.description || "Seat info not available"}
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center md:flex-row gap-2">
                    <div className="font-[Gilroy-Medium] text-sm text-[#3E3E3E] text-right whitespace-nowrap ml-auto">
                        {bidding.date || "Date TBD"}
                    </div>
                </div>
            </div>
        </div>
    );
}
