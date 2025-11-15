import React from "react";
import OrganizerAnalytics from "../../components/organizer/organizer_analytics.jsx";
import { Hash, Search } from "lucide-react";

function OrganizerAnalyticsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F3F3F3]">

            {/* ---- Page Header ---- */}
            <section className="bg-[#F3F3F3] flex flex-col items-center py-20 px-20 gap-4 w-full">
                <h1 className="font-[Epilogue-Black] text-[90px] leading-[1.0] text-[var(--primary-color)]">
                    Analytics
                </h1>

                <p className="font-[DM-Sans-Light] text-[24px] text-[#4B5563] max-w-3xl">
                    Deep dive into how your events are performing: attendance, funnels, audience insights, and growth trends.
                </p>
            </section>


            {/* ---- Centered Search + Filter ---- */}
            <section className="bg-[#F3F3F3] flex flex-col items-center w-full px-20 mt-5">
                <div className="flex items-center justify-center gap-6 w-full max-w-4xl">

                    {/* Search Input */}
                    <div className="relative flex-grow max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search analytics..."
                            className="w-full h-14 rounded-full border border-gray-300 pl-14 pr-5
                           text-[18px] font-[DM-Sans-Regular] shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#4F6FFF] transition"
                        />
                        <Search
                            size={22}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        className="flex items-center gap-2 border-2 border-[#4F6FFF]
                       text-[#14113B] px-8 py-3 rounded-full font-[Gilroy-Medium]
                       hover:bg-[#4F6FFF] hover:text-white transition"
                    >
                        <Hash size={20} />
                        Filter
                    </button>

                </div>
            </section>


            {/* ---- Analytics Section ---- */}
            <section
                id="analytics"
                className="bg-[#F3F3F3] flex flex-col items-center py-5 px-20 gap-6 w-full"
            >
                <div className="w-full max-w-6xl">
                    <OrganizerAnalytics />
                </div>
            </section>
        </div>
    );
}

export default OrganizerAnalyticsPage;
