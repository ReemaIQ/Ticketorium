// ticketorium-frontend/src/pages/Event.jsx

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import EventActions from "../components/event/EventActions.jsx";
import { getUserCategory } from "../components/event/getUserCategory.js";

export default function EventPage(props) {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const location = useLocation();

    // If we came from EventList → we have the full merged event (with actionState)
    const eventFromState = location.state?.event || null;

    /* -----------------------------------------------------------
       FIXED USER TYPE LOGIC (same as AllEvents.jsx)
       ----------------------------------------------------------- */
    const type = useMemo(() => {
        // NEW SYSTEM: props.user is a real user object
        if (props?.user && typeof props.user === "object") {
            const t = props.user.role || props.user.type;
            if (t) return String(t).toLowerCase();
        }

        // OLD SYSTEM: props.users is a map
        if (props?.users && typeof props.user === "string") {
            const legacy =
                props.users[props.user]?.type || props.users[props.user]?.role;
            if (legacy) return String(legacy).toLowerCase();
        }

        // default fallback
        return "visitor";
    }, [props?.user, props?.users]);

    const category = getUserCategory(type);

    /* -----------------------------------------------------------
       JOIN RECORD (same as before)
       ----------------------------------------------------------- */
    const joinedRecord = useMemo(() => {
        if (!props.eventsJoined || !props.user || !eventId) return null;

        const records = Object.values(props.eventsJoined);
        const sameEvent = (j) => String(j.eventId) === String(eventId);

        // Incoming invite
        const incomingInvite = records.find(
            (j) =>
                sameEvent(j) &&
                j.invitee === props.user &&
                j.state === "invited"
        );
        if (incomingInvite) return incomingInvite;

        // Joined / waitlisted by me
        const myJoin = records.find(
            (j) =>
                sameEvent(j) &&
                j.user === props.user &&
                j.state !== "invited"
        );
        if (myJoin) return myJoin;

        return null;
    }, [props.eventsJoined, props.user, eventId]);

    /* -----------------------------------------------------------
       FIND EVENT IF NO STATE PASSED
       ----------------------------------------------------------- */
    const findEventFromProps = () => {
        const src = props?.events;
        if (!src || !eventId) return null;

        const matches = (ev) =>
            String(ev?._id || ev?.id || ev?.eventId) === String(eventId);

        if (Array.isArray(src)) return src.find(matches) || null;

        if (typeof src === "object") {
            if (src[eventId]) return src[eventId];
            const values = Object.values(src);
            return values.find(matches) || null;
        }

        return null;
    };

    const raw = eventFromState || findEventFromProps() || null;

    /* -----------------------------------------------------------
       FIXED BUTTON LOGIC (mirror AllEvents actionState)
       ----------------------------------------------------------- */
    const [viewState, setViewState] = useState(() => {
        if (raw?.actionState != null) return raw.actionState;
        if (joinedRecord?.state) return joinedRecord.state;
        if (raw?.state) return raw.state;
        return undefined; // normal
    });

    useEffect(() => {
        if (raw?.actionState != null) {
            setViewState(raw.actionState);
            return;
        }
        if (joinedRecord?.state) {
            setViewState(joinedRecord.state);
            return;
        }
        if (raw?.state) {
            setViewState(raw.state);
            return;
        }
        setViewState(undefined);
    }, [raw, joinedRecord, eventId]);

    /* -----------------------------------------------------------
       BASIC DISPLAY FIELDS
       ----------------------------------------------------------- */
    const [title] = useState(raw?.title || "Event");
    const [locationName] = useState(raw?.location || "Campus");
    const [description] = useState(
        raw?.description || "Join us for an amazing event. (Demo description)"
    );
    const [cover] = useState(
        `/src/assets/images/event/${raw?.img || "graduation.png"}`
    );
    const [organizerName] = useState(raw?.organizer || "Organizer");

    // TODO replace with real times from DB
    const [start] = useState("2025-11-21T06:30:00Z");
    const [end] = useState("2025-11-21T12:30:00Z");
    const [capacity] = useState(50);
    const [attendees] = useState(20);
    const [locationUrl] = useState("#");

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
                {/* Back button */}
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

                    {/* The correct buttons NOW appear because type + category are correct */}
                    <EventActions
                        user={props.user}
                        type={type}
                        category={category}
                        state={viewState}
                        event={raw}
                        onStateChange={setViewState}
                    />
                </div>

                {/* Image */}
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
                            <span>{Math.max(0, capacity - attendees)} Seats left</span>
                        </div>
                        <a
                            href={locationUrl}
                            className="text-[var(--primary-color)] font-medium hover:underline"
                        >
                            Location: {locationName}
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
