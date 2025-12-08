// ticketorium-frontend/src/pages/AnalyticsEventPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchEventById } from "../api/events.js";
import OrganizerAnalytics from "../components/analytics/Analytics.jsx";
// If you have a dedicated detailed component, import it here
// import EventDetailLayout from "../components/event-detail/EventDetailLayout.jsx";

export default function AnalyticsEventPage({ user, uni, userType }) {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await fetchEventById(eventId);
                if (!cancelled) setEvent(data);
            } catch (e) {
                if (!cancelled) {
                    setError(e.message || "Failed to load event.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [eventId]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* You can reuse the same header style as Event page */}
            <section className="bg-white flex flex-col items-center py-16 px-20 gap-4 w-full">
                <h1 className="font-[Epilogue-Black] text-[48px] leading-[1.0] text-[#1A1A1A] text-center">
                    Event Analytics
                </h1>
                <p className="font-[DM-Sans-Light] text-[18px] text-[#4B5563] max-w-3xl text-center">
                    Detailed view of this event plus its performance.
                </p>
            </section>

            {loading && (
                <p className="font-[DM-Sans-Light] text-[14px] text-[#6B7280] text-center">
                    Loading event...
                </p>
            )}

            {error && !loading && (
                <p className="font-[DM-Sans-Light] text-[14px] text-red-500 text-center">
                    {error}
                </p>
            )}

            {!loading && !error && event && (
                <>
                    {/* TODO: Replace this with your real detailed event layout */}
                    <section className="w-full max-w-6xl mx-auto px-6 pb-10">
                        <div className="bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm">
                            <h2 className="font-[Gilroy-Black] text-[28px] mb-2">
                                {event.title}
                            </h2>
                            <p className="font-[Gilroy-Medium] text-[16px] text-[#4B5563] mb-4">
                                {event.description || "Event description here."}
                            </p>
                            {/* Add any fields you use in Event detailed page here */}
                        </div>
                    </section>

                    {/* Analytics for this specific event – hardcoded for now */}
                    <section className="bg-white flex flex-col items-center py-10 px-20 gap-6 w-full">
                        <div className="w-full max-w-6xl">
                            <OrganizerAnalytics
                                // later you can pass eventId to a more specific analytics component
                            />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
