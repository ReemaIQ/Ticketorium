// ticketorium-frontend/src/pages/Analytics.jsx
import React from "react";

import OrganizerAnalytics from "../components/analytics/Analytics.jsx";
import EventList from "../components/event-list/EventList.jsx";

// use the *main* My Events hook (not upcoming-only)
import {
    useMyEventsForUser,
} from "../components/events-fetching/MyEventsComponent.jsx";

function Analytics({
                       user,
                       uni,
                       userType,
                       visitorUniKey,
                   }) {
    // --- My Events (for Events Analytics section) ---
    const {
        filteredEvents,
        loading,
        error,
    } = useMyEventsForUser({
        user,
        uni,
        userTypeProp: userType,
        visitorUniKey,
    });

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* ---- Page Header ---- */}
            <section className="bg-white flex flex-col items-center py-20 px-20 gap-4 w-full">
                <h1 className="font-[Epilogue-Black] text-[60px] leading-[1.0] text-[#1A1A1A]">
                    Analytics
                </h1>

                <p className="font-[DM-Sans-Light] text-[24px] text-[#4B5563] max-w-3xl text-center">
                    Deep dive into how your events are performing: attendance, funnels, audience insights, and growth trends.
                </p>
            </section>

            {/* ---- Analytics Section (hardcoded / Organizer analytics) ---- */}
            <section
                id="analytics"
                className="bg-white flex flex-col items-center py-5 px-20 gap-6 w-full"
            >
                <div className="w-full max-w-6xl">
                    <OrganizerAnalytics />
                </div>
            </section>

            {/* ---- Events Analytics: My Events list ---- */}
            <section
                id="events-analytics"
                className="bg-white flex flex-col items-center py-10 px-20 gap-6 w-full"
            >
                <div className="w-full max-w-6xl flex flex-col gap-4 items-center">
                    {/* Centered section header */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="font-[Epilogue-Black] text-[60px] leading-[1.0] text-[#1A1A1A]">
                            Events Analytics
                        </h2>
                        <p className="font-[DM-Sans-Light] text-[16px] text-[#6B7280] max-w-2xl">
                            See how your own events are doing — events you created or joined.
                        </p>
                    </div>

                    {/* Content states */}
                    {loading && (
                        <p className="font-[DM-Sans-Light] text-[14px] text-[#6B7280] mt-2">
                            Loading your events…
                        </p>
                    )}

                    {error && !loading && (
                        <p className="font-[DM-Sans-Light] text-[14px] text-red-500 mt-2">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <>
                            {filteredEvents && filteredEvents.length > 0 ? (
                                <div className="w-full">
                                    <EventList
                                        events={filteredEvents}
                                        user={user}
                                        userType={userType}
                                        listType="my-events"
                                        detailBasePath="/analytics/event"   // THIS makes clicks go to /analytics/event/:id
                                    />

                                </div>
                            ) : (
                                <p className="font-[DM-Sans-Light] text-[14px] text-[#6B7280] mt-4 text-center">
                                    No events found in your analytics yet.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Analytics;
