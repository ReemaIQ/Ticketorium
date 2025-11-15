import React from "react";
import {
    Users,
    CalendarDays,
    BarChart3,
    PieChart as PieChartIcon,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

/*
  PROPS SHAPES (to replace the defaults later with real data):

  totals = {
    totalEvents: number,
    upcomingEvents: number,
    totalAttendees: number,
    averageConversion: number, // 0–1 (e.g., 0.34 = 34%)
  }

  attendance = {
    joined: number,
    waitlisted: number,
    cancelled: number,
    noShow: number,
  }

  funnel = {
    totalVisitors: number,
    clickedView: number,
    joined: number,
  }

  audience = {
    gender: { male: number, female: number },
    ageGroups: { "18-21": number, "22-25": number, "26-30": number, "30+": number },
    universities: { kfupm: number, harvard: number, other: number },
  }
*/

const DEFAULT_TOTALS = {
    totalEvents: 9,
    upcomingEvents: 3,
    totalAttendees: 420,
    averageConversion: 0.37,
};

const DEFAULT_ATTENDANCE = {
    joined: 120,
    waitlisted: 28,
    cancelled: 7,
    noShow: 12,
};

const DEFAULT_FUNNEL = {
    totalVisitors: 800,
    clickedView: 520,
    joined: 120,
};

const DEFAULT_AUDIENCE = {
    gender: { male: 70, female: 30 },
    ageGroups: { "18-21": 45, "22-25": 35, "26-30": 15, "30+": 5 },
    universities: { kfupm: 70, harvard: 20, other: 10 },
};


const PIE_COLORS = ["#4F6FFF", "#2F4473", "#FACC15", "#FB7185"];

/* ----------------------------- Helper Components ---------------------------- */

function SectionCard({ title, description, children }) {
    return (
        <section className="w-full rounded-[32px] bg-white border border-gray-200 px-10 py-8 space-y-4 shadow-sm">
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

function ProgressBar({ label, value, suffix = "%", accent = false }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className="font-[Gilroy-Medium] text-[13px] text-[#14113B]">
                    {label}
                </span>
                <span
                    className={
                        accent
                            ? "font-[Gilroy-Medium] text-[13px] text-[var(--primary-color)]"
                            : "font-[Gilroy-Medium] text-[13px] text-[#4B5563]"
                    }
                >
                    {value}
                    {suffix}
                </span>
            </div>
            <div className="h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                    className={`h-full rounded-full ${
                        accent ? "bg-[var(--primary-color)]" : "bg-[var(--secondary-color)]"
                    }`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

/* ----------------------------- Main Component ------------------------------ */

const OrganizerAnalytics = ({
                                totals = DEFAULT_TOTALS,
                                attendance = DEFAULT_ATTENDANCE,
                                funnel = DEFAULT_FUNNEL,
                                audience = DEFAULT_AUDIENCE,
                            }) => {
    const attendanceData = [
        { name: "Joined", value: attendance.joined },
        { name: "Waitlisted", value: attendance.waitlisted },
        { name: "Cancelled", value: attendance.cancelled },
        { name: "No-show", value: attendance.noShow },
    ].filter((d) => d.value > 0);

    const clickRate =
        funnel.totalVisitors > 0
            ? (funnel.clickedView / funnel.totalVisitors) * 100
            : 0;
    const conversionRate =
        funnel.totalVisitors > 0 ? (funnel.joined / funnel.totalVisitors) * 100 : 0;
    const viewToJoinRate =
        funnel.clickedView > 0 ? (funnel.joined / funnel.clickedView) * 100 : 0;

    const genderTotal = audience.gender.male + audience.gender.female || 1;

    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto px-12 py-10 flex flex-col gap-10">
                {/* Top KPIs */}
                <SectionCard
                    title="Organizer Overview"
                    description="Quick snapshot of your events and attendees."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={CalendarDays}
                            label="Total Events Created"
                            value={totals.totalEvents}
                            subLabel="Since you joined Ticketorium"
                        />
                        <StatCard
                            icon={CalendarDays}
                            label="Events Happening Soon"
                            value={totals.upcomingEvents}
                            subLabel="Next 7 days"
                        />
                        <StatCard
                            icon={Users}
                            label="Total Attendees"
                            value={totals.totalAttendees}
                            subLabel="Across all events"
                        />
                        <StatCard
                            icon={BarChart3}
                            label="Average Conversion"
                            value={`${Math.round(totals.averageConversion * 100)}%`}
                            subLabel="Views to Joined"
                        />
                    </div>
                </SectionCard>

                {/* Attendance & Funnel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Attendance Breakdown */}
                    <SectionCard
                        title="Attendance Breakdown"
                        description="How attendees are distributed for a selected event."
                    >
                        <div className="h-64 md:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="55%"
                                        outerRadius="80%"
                                        paddingAngle={2}
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell
                                                key={`slice-${entry.name}`}
                                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#6B7280]">
                                    Joined
                                </p>
                                <p className="font-[Epilogue-Black] text-[20px] text-[#14113B]">
                                    {attendance.joined}
                                </p>
                            </div>
                            <div>
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#6B7280]">
                                    Waitlisted
                                </p>
                                <p className="font-[Epilogue-Black] text-[20px] text-[#14113B]">
                                    {attendance.waitlisted}
                                </p>
                            </div>
                            <div>
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#6B7280]">
                                    Cancelled
                                </p>
                                <p className="font-[Epilogue-Black] text-[20px] text-[#14113B]">
                                    {attendance.cancelled}
                                </p>
                            </div>
                            <div>
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#6B7280]">
                                    No-show
                                </p>
                                <p className="font-[Epilogue-Black] text-[20px] text-[#14113B]">
                                    {attendance.noShow}
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Funnel / Conversion */}
                    <SectionCard
                        title="Event Funnel"
                        description="From visitors to views to actual attendees."
                    >
                        <div className="flex items-start gap-4 mb-5">
                            <div className="rounded-2xl bg-[#E0E7FF] text-[var(--secondary-color)] p-3 flex items-center justify-center">
                                <PieChartIcon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#4B5563]">
                                    <span className="font-[Gilroy-Medium] font-semibold">
                                        {funnel.totalVisitors}
                                    </span>{" "}
                                    visitors saw your event.
                                </p>
                                <p className="font-[Gilroy-Medium] text-[13px] text-[#4B5563]">
                                    <span className="font-semibold">
                                        {funnel.clickedView}
                                    </span>{" "}
                                    users clicked{" "}
                                    <span className="font-semibold">&quot;View Event&quot;</span> and{" "}
                                    <span className="font-semibold">{funnel.joined}</span> actually
                                    joined.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ProgressBar
                                label="Visitors who clicked “View Event”"
                                value={Math.round(clickRate)}
                            />
                            <ProgressBar
                                label="Visitors who joined directly from views"
                                value={Math.round(conversionRate)}
                                accent
                            />
                            <ProgressBar
                                label="Conversion from View to Joined"
                                value={Math.round(viewToJoinRate)}
                            />
                        </div>
                    </SectionCard>
                </div>

                {/* Audience Breakdown */}
                <SectionCard
                    title="Audience Breakdown"
                    description="Who is actually attending your events."
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Gender */}
                        <div className="space-y-3">
                            <h3 className="font-[Epilogue-Black] text-[24px] text-[var(--primary-color)]">
                                Gender
                            </h3>
                            <div className="space-y-2">
                                <ProgressBar
                                    label="Male"
                                    value={Math.round(
                                        (audience.gender.male / genderTotal) * 100 || 0
                                    )}
                                />
                                <ProgressBar
                                    label="Female"
                                    value={Math.round(
                                        (audience.gender.female / genderTotal) * 100 || 0
                                    )}
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-3">
                            <h3 className="font-[Epilogue-Black] text-[24px] text-[var(--primary-color)]">
                                Age Groups
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(audience.ageGroups).map(([range, value]) => (
                                    <ProgressBar
                                        key={range}
                                        label={range}
                                        value={value}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* University */}
                        <div className="space-y-3">
                            <h3 className="font-[Epilogue-Black] text-[24px] text-[var(--primary-color)]">
                                University
                            </h3>
                            <div className="space-y-2">
                                <ProgressBar
                                    label="KFUPM"
                                    value={audience.universities.kfupm}
                                    accent
                                />
                                <ProgressBar
                                    label="Harvard"
                                    value={audience.universities.harvard}
                                />
                                <ProgressBar
                                    label="Other / Outsiders"
                                    value={audience.universities.other}
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

export default OrganizerAnalytics;
