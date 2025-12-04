// src/pages/Event.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import EventActions from "../components/event/EventActions.jsx";
import { getUserCategory } from "../components/event/getUserCategory.js";
import { getApiBaseUrl } from "../api/client";

export default function EventPage(props) {
    const navigate = useNavigate();
    const { eventId: eventIdParam } = useParams(); // can be Mongo _id OR numeric eventId

    // --------------------------------------------------------------------
    // User type & category
    // --------------------------------------------------------------------
    const type = useMemo(() => {
        const t =
            props?.user &&
            props?.users &&
            props.users[props.user]?.type
                ? props.users[props.user].type
                : "visitor";
        return (t || "visitor").toLowerCase();
    }, [props?.users, props?.user]);

    const category = getUserCategory(type);

    // --------------------------------------------------------------------
    // Backend event + local viewState (joined / invited / etc.)
    // --------------------------------------------------------------------
    const [event, setEvent] = useState(null);
    const [viewState, setViewState] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const url = `${base}/api/events/${eventIdParam}`;


    useEffect(() => {
        if (!eventIdParam) {
            setError("No event id provided.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadEvent() {
            try {
                setLoading(true);
                setError("");

                const base = getApiBaseUrl();
                
                let url = `${base}/api/events/${eventIdParam}`;
                

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || "Failed to load event.");
                }

                if (!cancelled) {
                    setEvent(data);
                    // Reset viewState when event changes. Actual ticket/join info
                    // will be handled by EventActions + tickets API.
                    setViewState(undefined);
                }
            } catch (err) {
                console.error("Failed to load event:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to load event.");
                    setEvent(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadEvent();
        return () => {
            cancelled = true;
        };
    }, [eventIdParam, url]);

    // --------------------------------------------------------------------
    // Derived display fields from backend event
    // --------------------------------------------------------------------
    const title = event?.title || "Event";
    const description =
        event?.description ||
        "Join us for an amazing event. (Description coming soon.)";

    // Organizer display (similar logic as in Event card)
    let organizerName = "Organizer";
    if (event?.organizer) {
        if (typeof event.organizer === "string") {
            organizerName = event.organizer;
        } else {
            const { handle, firstName, lastName, name } = event.organizer;
            organizerName =
                handle ||
                name ||
                [firstName, lastName].filter(Boolean).join(" ") ||
                "Organizer";
        }
    }

    // Cover image: resolve backend /uploads path if needed
    let coverSrc = "/src/assets/images/event/graduation.png";
    if (event?.img && typeof event.img === "string") {
        if (event.img.startsWith("/uploads")) {
            coverSrc = `${getApiBaseUrl()}${event.img}`;
        } else {
            coverSrc = event.img;
        }
    }

    // Time range from startAt / endAt
    const formatTime = (value) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const startLabel = formatTime(event?.startAt);
    const endLabel = formatTime(event?.endAt);
    const timeRange =
        startLabel && endLabel
            ? `${startLabel} – ${endLabel}`
            : startLabel || "Time to be announced";

    // Capacity & attendees from backend
    const capacityTotal = typeof event?.capacityTotal === "number"
        ? event.capacityTotal
        : 0;
    const capacityReserved = typeof event?.capacityReserved === "number"
        ? event.capacityReserved
        : 0;

    const seatsTaken = capacityTotal > 0 ? capacityReserved : 0;
    const seatsLeft =
        capacityTotal > 0
            ? Math.max(0, capacityTotal - capacityReserved)
            : null; // null means "not tracked"

    // Location: we don't have building/room in schema yet, so use university
    const locationLabel =
        (event?.university &&
            (typeof event.university === "string"
                ? event.university
                : event.university.name || event.university.code)) ||
        "Campus";

    // --------------------------------------------------------------------
    // UI
    // --------------------------------------------------------------------
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

                {/* Loading & error */}
                {loading && (
                    <div className="mt-6 text-sm text-slate-500">
                        Loading event…
                    </div>
                )}

                {!loading && error && (
                    <div className="mt-6 rounded-md border border-[var(--warning-color)]/40 bg-[var(--warning-color)]/10 px-4 py-3 text-[13px] text-[var(--warning-color)] font-[Gilroy-Medium]">
                        {error}
                    </div>
                )}

                {!loading && !error && !event && (
                    <div className="mt-6 text-sm text-slate-500">
                        Event not found.
                    </div>
                )}

                {!loading && !error && event && (
                    <>
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
                                user={props.user}          // current user id
                                type={type}                // role string
                                category={category}
                                state={viewState}          // "joined" / "invited" / etc.
                                eventId={event._id}        // we now consistently use Mongo _id
                                event={event}              // full backend event doc
                                onStateChange={setViewState}
                            />
                        </div>

                        {/* Cover image */}
                        <figure className="mt-6 overflow-hidden rounded-xl shadow-sm">
                            <img
                                className="h-auto w-full object-cover"
                                alt={title}
                                src={coverSrc}
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
                                    Time: {timeRange}
                                </span>

                                <div className="flex gap-8 text-slate-500">
                                    {capacityTotal > 0 ? (
                                        <>
                                            <span>
                                                {seatsTaken} seats taken
                                            </span>
                                            <span>
                                                {seatsLeft} seats left
                                            </span>
                                        </>
                                    ) : (
                                        <span>Capacity not limited</span>
                                    )}
                                </div>

                                <span className="text-[var(--primary-color)] font-medium">
                                    Location: {locationLabel}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
