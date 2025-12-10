// ticketorium-frontend/src/pages/AnalyticsEventPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchEventById } from "../api/events.js";

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

const PIE_COLORS = ["#4F6FFF", "#2F4473", "#FACC15", "#FB7185"];

function formatTimeRange(start, end) {
    if (!start || !end) return "";
    const fmt = (d) =>
        new Date(d).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    return `${fmt(start)} – ${fmt(end)}`;
}

/* ----------------------------- Helper Components ---------------------------- */

function SectionCard({ title, description, children }) {
    return (
        <section className="w-full rounded-[6px] bg-white border border-gray-200 px-10 py-8 space-y-4 shadow-sm">
            <div>
                <h2 className="font-[Epilogue-Black] text-[28px] md:text-[32px] text-[var(--primary-color)] leading-[1.1]">
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
                        accent
                            ? "bg-[var(--primary-color)]"
                            : "bg-[var(--secondary-color)]"
                    }`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function StatPill({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-3 rounded-[18px] bg-[var(--secondary-color)] text-white px-4 py-3 border border-[#1D3258]">
            {Icon && (
                <div className="rounded-2xl bg-white/10 p-2 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="font-[Gilroy-Medium] text-[11px] text-[#E5E7EB]">
                    {label}
                </span>
                <span className="font-[Epilogue-Black] text-[20px] leading-[1.1]">
                    {value}
                </span>
            </div>
        </div>
    );
}

/* ----------------------------- Main Page ------------------------------ */

function EventAnalyticsPage({ user, uni, userType }) {
    const { eventId } = useParams();
    const navigate = useNavigate();

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
                if (!cancelled) setError("Failed to load event.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [eventId]);

    // ---------------------- Per-event analytics skeleton ----------------------
    const {
        attendance,
        capacityTotal,
        capacityUsedPct,
        audience,
    } = useMemo(() => {
        const cap = event?.capacityTotal || 120;

        const attendance = {
            joined: 48,
            waitlisted: 14,
            cancelled: 6,
            noShow: 4,
        };

        const capacityUsedPct = Math.round((attendance.joined / cap) * 100);

        const audience = {
            gender: { male: 62, female: 35, other: 3 }, // percentages
            ageGroups: {
                "18–21": 44,
                "22–25": 36,
                "26+": 20,
            },
            universities: {
                KFUPM: 58,
                Harvard: 18,
                Saud: 14,
                Other: 10,
            },
        };

        return {
            attendance,
            capacityTotal: cap,
            capacityUsedPct,
            audience,
        };
    }, [event]);

    const attendanceData = useMemo(
        () => [
            { name: "Joined", value: attendance.joined },
            { name: "Waitlisted", value: attendance.waitlisted },
            { name: "Cancelled", value: attendance.cancelled },
            { name: "No-show", value: attendance.noShow },
        ].filter((d) => d.value > 0),
        [attendance]
    );

    return (
        <div className="bg-white min-h-screen text-[#1A1A1A]">
            {/* Top hero header for analytics page */}
            <header className="w-full flex flex-col items-center pt-16 pb-10 px-6">
                <h1 className="font-[Epilogue-Black] text-[52px] md:text-[60px] leading-[1] text-[#1A1A1A] text-center">
                    Event Analytics
                </h1>

                <p className="font-[DM-Sans-Light] text-[18px] md:text-[20px] text-[#4B5563] mt-2 text-center max-w-3xl">
                    Deep dive into how this event is performing — attendance,
                    capacity, and who is actually showing up.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 text-[var(--primary-color)] font-[Gilroy-Medium] hover:underline text-[15px]"
                >
                    ← Back to Events
                </button>
            </header>

            {/* Loading & error */}
            {loading && (
                <p className="text-center text-[#6B7280] text-[14px]">
                    Loading event analytics…
                </p>
            )}

            {!loading && error && (
                <p className="text-center text-red-500 text-[14px]">
                    {error}
                </p>
            )}

            {/* Main content */}
            {!loading && !error && event && (
                <main className="max-w-6xl mx-auto px-6 pb-16 flex flex-col gap-10">
                    {/* Event summary card */}
                    <SectionCard
                        title={event.title || "Event details"}
                        description={`ID: ${eventId}${
                            event.startTime
                                ? " · " +
                                formatTimeRange(
                                    event.startTime,
                                    event.endTime
                                )
                                : ""
                        }`}
                    >
                        {event.description && (
                            <p className="font-[DM-Sans-Light] text-[15px] text-[#4B5563] leading-relaxed">
                                {event.description}
                            </p>
                        )}
                    </SectionCard>

                    {/* 1) Attendance Donut + Stats */}
                    <SectionCard
                        title="Attendance for this event"
                        description="Distribution of attendees across joined, waitlist, cancelled, and no-shows — plus how full your event is."
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Donut chart */}
                            <div className="h-72">
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
                                            {attendanceData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`slice-${entry.name}`}
                                                        fill={
                                                            PIE_COLORS[
                                                            index %
                                                            PIE_COLORS.length
                                                                ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Stats side panel */}
                            <div className="flex flex-col gap-5">
                                {/* Capacity progress */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-2xl bg-[#E0E7FF] text-[var(--secondary-color)] p-2 flex items-center justify-center">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-[Gilroy-Medium] text-[13px] text-[#4B5563]">
                                                Capacity usage
                                            </span>
                                            <span className="font-[Epilogue-Black] text-[22px] text-[#14113B]">
                                                {attendance.joined} / {capacityTotal}{" "}
                                                attendees
                                            </span>
                                        </div>
                                    </div>

                                    <ProgressBar
                                        label="Seats filled"
                                        value={capacityUsedPct}
                                        accent
                                    />
                                </div>

                                {/* Little stat pills */}
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <StatPill
                                        label="Joined"
                                        value={attendance.joined}
                                        icon={Users}
                                    />
                                    <StatPill
                                        label="Waitlisted"
                                        value={attendance.waitlisted}
                                        icon={CalendarDays}
                                    />
                                    <StatPill
                                        label="Cancelled"
                                        value={attendance.cancelled}
                                        icon={CalendarDays}
                                    />
                                    <StatPill
                                        label="No-show"
                                        value={attendance.noShow}
                                        icon={CalendarDays}
                                    />
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* 2) Audience Breakdown (Gender + Age + University) */}
                    <SectionCard
                        title="Audience breakdown"
                        description="Who is attending this event — by gender, age group, and university."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Gender */}
                            <div className="space-y-3">
                                <h3 className="font-[Epilogue-Black] text-[22px] text-[var(--primary-color)]">
                                    Gender
                                </h3>
                                <div className="space-y-3">
                                    <ProgressBar
                                        label={`Male`}
                                        value={audience.gender.male}
                                    />
                                    <ProgressBar
                                        label={`Female`}
                                        value={audience.gender.female}
                                    />
                                    <ProgressBar
                                        label={`Other / Prefer not to say`}
                                        value={audience.gender.other}
                                    />
                                </div>
                            </div>

                            {/* Age groups */}
                            <div className="space-y-3">
                                <h3 className="font-[Epilogue-Black] text-[22px] text-[var(--primary-color)]">
                                    Age groups
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(audience.ageGroups).map(
                                        ([range, value]) => (
                                            <ProgressBar
                                                key={range}
                                                label={range}
                                                value={value}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Universities */}
                            <div className="space-y-3">
                                <h3 className="font-[Epilogue-Black] text-[22px] text-[var(--primary-color)]">
                                    Universities
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(
                                        audience.universities
                                    ).map(([uniLabel, value]) => (
                                        <ProgressBar
                                            key={uniLabel}
                                            label={uniLabel}
                                            value={value}
                                            accent={uniLabel === "KFUPM"}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </main>
            )}
        </div>
    );
}

export default EventAnalyticsPage;
