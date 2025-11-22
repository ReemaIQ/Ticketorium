import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import EventActions from "../components/event/EventActions.jsx";
import { getUserCategory } from "../components/event/getUserCategory.js";

export default function EventPage(props) {
    const navigate = useNavigate();
    const { eventId } = useParams();

    // user type: student / visitor / organizer / admin / system-admin
    const type = useMemo(() => {
        const t =
            props?.users && props?.user
                ? props.users[props.user]?.type
                : "visitor";
        return (t || "visitor").toLowerCase();
    }, [props?.users, props?.user]);

    // map type to EventActions category (attendee / organizer / admin)
    const category = getUserCategory(type);

    // event info from dummyEvents
    const raw = props?.events?.[eventId] || null;

    // basic event state
    const [title, setTitle] = useState(raw?.title || "Event");
    const [location, setLocation] = useState(raw?.location || "Campus");
    const [description, setDescription] = useState(
        raw?.description ||
        "Join us for an amazing event. (Demo description)"
    );
    const [cover] = useState(
        `/src/assets/images/event/${raw?.img || "graduation.png"}`
    );
    const [organizerName] = useState(raw?.organizer || "Organizer");

    // TODO: later replace these static times with real event times from DB
    const [start] = useState("2025-11-21T06:30:00Z");
    const [end] = useState("2025-11-21T12:30:00Z");
    const [capacity] = useState(50);
    const [attendees] = useState(20);
    const [locationUrl] = useState("#");
    const [viewState, setViewState] = useState(raw?.state || undefined);

    const formatTimeRange = (a, b) => {
        const fmt = (d) =>
            new Date(d).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        return `${fmt(a)} – ${fmt(b)}`;
    };

    return (
        <div className="bg-white text-[#1A1A1A] min-h-screen">
            <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-8">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-[var(--primary-color)] hover:underline font-[Gilroy-Medium] text-[16px]"
                >
                    ← Back
                </button>

                {/* Header */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-[Gilroy-Black] text-[#1A1A1A] text-[36px] leading-tight">
                            {title}
                        </h1>
                        <p className="font-[Gilroy-Medium] text-[16px] text-[#3E3E3E]">
                            by {organizerName}
                        </p>
                    </div>

                    <EventActions
                        user={props.user}
                        type={type}
                        category={category}
                        state={viewState}
                        eventId={eventId}
                        event={props.event}
                    />
                </div>

                {/* Cover image */}
                <figure className="mt-6 overflow-hidden rounded-xl shadow-sm">
                    <img
                        className="h-auto w-full object-cover"
                        alt={title}
                        src={cover}
                        onError={(e) => {
                            e.currentTarget.src =
                                "/src/assets/images/event/graduation.png";
                        }}
                    />
                </figure>

                {/* Description */}
                <article className="prose max-w-none mt-6 text-slate-700">
                    <p>{description}</p>
                </article>

                {/* Meta info */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-[var(--primary-color)] font-medium">
                            Time: {formatTimeRange(start, end)}
                        </span>
                        <div className="flex gap-8 text-slate-500">
                            <span>{attendees} Seats taken</span>
                            <span>
                                {Math.max(0, capacity - attendees)} Seats left
                            </span>
                        </div>
                        <a
                            href={locationUrl}
                            className="text-[var(--primary-color)] font-medium hover:underline"
                        >
                            Location: {location}
                        </a>
                    </div>
                </div>
            </main>

            {/*/!* Deletion banner (demo only) *!/*/}
            {/*{showDeleteBanner && (*/}
            {/*    <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">*/}
            {/*        Event deleted (demo).*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}