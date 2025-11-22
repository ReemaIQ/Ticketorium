import React from "react";
import OrganizerAnalytics from "../components/analytics/Analytics.jsx";
import { Hash, Search } from "lucide-react";

function Analytics() {
    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* ---- Page Header ---- */}
            <section className="bg-white flex flex-col items-center py-20 px-20 gap-4 w-full">
                <h1 className="font-[Epilogue-Black] text-[60px] leading-[1.0] text-[#1A1A1A]">
                    Analytics
                </h1>

                <p className="font-[DM-Sans-Light] text-[24px] text-[#4B5563] max-w-3xl">
                    Deep dive into how your events are performing: attendance, funnels, audience insights, and growth trends.
                </p>
            </section>


            {/* ---- Analytics Section ---- */}
            <section
                id="analytics"
                className="bg-white flex flex-col items-center py-5 px-20 gap-6 w-full"
            >
                <div className="w-full max-w-6xl">
                    <OrganizerAnalytics />
                </div>
            </section>
        </div>
    );
}

export default Analytics;
