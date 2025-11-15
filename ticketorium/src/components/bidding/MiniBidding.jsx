export default function MiniBidding({bidding}) {

    return (
        <div
            className="sd:flex-col sd:align-center md:flex gap-5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.15)] overflow-hidden shadow-sm">

            {/* Left image) */}
            <div className="md:w-1/3">
                <img src={`/src/assets/images/event/graduation.png`} alt="Event"
                     className="w-full h-full object-cover"/>
            </div>

            {/* Right content */}
            <div className="flex flex-col justify-between pb-5 pt-3 pr-4 pl-5 md:w-2/3 md:pl-0 gap-5">

                {/* Top */}
                <div>
                    <p className="font-[Gilroy-Bold] text-right text-[#4F6FFF] mb-1">
                        in 3 days!
                    </p>

                    <h2 className="font-[Gilroy-Black] text-[#1A1A1A] text-[28px] leading-tight my-1">
                        {bidding.year} Graduation Ceremony
                    </h2>

                    <p className="font-[Gilroy-Medium] text-[20px] text-[#3E3E3E]">
                        Join us in the exciting coding competition — don’t miss it!
                        Two lines maximum here. Just saying btw. Js.
                    </p>
                </div>

                {/* Bottom */}
                <div className="flex flex-col items-center md:flex-row gap-2">
                    <button
                        className="flex items-center gap-2 bg-[#FFDF4F] text-[#14113B]
                                                rounded-[6px] font-[Gilroy-Medium] text-[16px] px-5 py-3"
                    >
                        Select
                    </button>

                    <div className="font-[Gilroy-Medium] text-sm text-[#3E3E3E] text-right whitespace-nowrap ml-auto">
                        Dec 28th <br/> by Harvard
                    </div>
                </div>
            </div>
        </div>
    )
}