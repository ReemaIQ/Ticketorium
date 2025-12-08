// ticketorium-frontend/src/components/analytics/Analytics.jsx
import React from "react";
import { Users, CalendarDays, BarChart3 } from "lucide-react";


const DEFAULT_TOTALS = {
    totalEvents: 4,
    upcomingEvents: 3,
    totalAttendees: 28,
    averageConversion: 0.6, // 0–1
};

/* ----------------------------- UI Helpers ---------------------------- */

function SectionCard({ title, description, children }) {
    return (
        <section className="w-full rounded-[6px] bg-white border border-gray-200 px-10 py-8 space-y-4 shadow-sm">
            <div>
                <h2 className="font-[Epilogue-Black] text-[32px] text-[var(--primary-color)] leading-[1.1]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 font-[Gilroy-Medium] text-[14px] text-[#4B5563]">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </section>
    );
}

function StatCard({ icon: Icon, label, value, subLabel }) {
    return (
        <div className="flex items-center gap-4 rounded-[24px] bg-[var(--secondary-color)] text-white px-5 py-4 border border-[#1D3258]">
            <div className="rounded-2xl bg-white/10 p-2 flex items-center justify-center">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
                <span className="font-[Gilroy-Medium] text-[12px] text-[#E5E7EB]">
                    {label}
                </span>
                <span className="font-[Epilogue-Black] text-[26px] leading-[1.1]">
                    {value}
                </span>
                {subLabel && (
                    <span className="font-[Gilroy-Medium] text-[11px] text-[#D1D5DB] mt-1">
                        {subLabel}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ----------------------------- Main Component ---------------------------- */

/**
 * OrganizerAnalytics
 *
 * Props (optional, for when you later wire real data):
 * totals = {
 *   totalEvents: number,
 *   upcomingEvents: number,
 *   totalAttendees: number,
 *   averageConversion: number, // 0–1
 * }
 */
const OrganizerAnalytics = ({ totals }) => {
    const t = totals || DEFAULT_TOTALS;


    // - read organizerId from localStorage
    // - call /api/analytics/overview?organizerId=...
    // - store the response into local state and feed it into `t`

    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto px-12 py-10 flex flex-col gap-10">
                {/* Top KPIs – Global Overview */}
                <SectionCard
                    title="Organizer Overview"
                    description="Quick snapshot of all your events and attendees."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={CalendarDays}
                            label="Total Events Created"
                            value={t.totalEvents}
                            subLabel="Since you joined Ticketorium"
                        />
                        <StatCard
                            icon={CalendarDays}
                            label="Events Happening Soon"
                            value={t.upcomingEvents}
                            subLabel="Next few days"
                        />
                        <StatCard
                            icon={Users}
                            label="Total Attendees"
                            value={t.totalAttendees}
                            subLabel="Across all events"
                        />
                        <StatCard
                            icon={BarChart3}
                            label="Average Conversion"
                            value={`${Math.round((t.averageConversion || 0) * 100)}%`}
                            subLabel="Views to Joined"
                        />
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

export default OrganizerAnalytics;
