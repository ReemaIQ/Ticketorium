import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import EventActions from "../components/event/EventActions.jsx";
import { getUserCategory } from "../components/event/getUserCategory.js";

import { fetchTicketForEvent } from "../api/tickets.js";

// modal components
import JoinModal from "../components/modals/JoinModal.jsx";
import InviteModal from "../components/modals/InviteModal.jsx";
import TicketModal from "../components/modals/TicketModal.jsx";
import VerifyTicketsModal from "../components/modals/VerifyTicketModal.jsx";
import ResignModal from "../components/modals/ResignModal.jsx";
import DeleteEventModal from "../components/modals/DeleteEventModal.jsx";

export default function EventPage(props) {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const routerLocation = useLocation();

    // Logged-in user id (username) or null
    const userId = props?.user ?? null;

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
    const hasSeatingPlan = Boolean(raw?.hasSeatingPlan);

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

    const [price] = useState(
        typeof raw?.price === "number" ? raw.price : 0
    );
    const [viewState, setViewState] = useState(raw?.state || "not-joined");

    // ticket state (for QR ticket modal)
    const [ticket, setTicket] = useState(null);
    console.log("Ticket in EventPage:", ticket);

    // which modal is open
    const [openModal, setOpenModal] = useState("none"); // 'join' | 'resign' | 'invite' | 'verify' | 'delete' | 'ticket' | 'none'
    const [showDeleteBanner, setShowDeleteBanner] = useState(false);

    const closeModal = () => setOpenModal("none");

    /* AUTO-OPEN MODALS WHEN COMING FROM REGISTRATION PAGE */
    useEffect(() => {
        const state = routerLocation.state;
        if (!state) return;

        if (state.openJoinModal) {
            setOpenModal("join");
        } else if (state.openTicketModal) {
            setOpenModal("ticket");
        }
    }, [routerLocation.state]);

    // load existing ticket from backend when page mounts/user changes
    useEffect(() => {
        if (!userId) return;

        async function loadTicket() {
            try {
                const existing = await fetchTicketForEvent({ eventId, userId });
                if (existing) {
                    setTicket((prev) => prev || { ...existing, accessibilityNotes: "" });
                    console.log("Loaded ticket from backend:", existing);
                }
            } catch (err) {
                console.error("Failed to load ticket:", err);
            }
        }

        loadTicket();
    }, [eventId, userId]);

    // map EventActions button label → open correct modal / route
    function handleAction(label) {
        switch (label) {
            // attend / waitlist
            case "Join":
            case "Pay & Join":
            case "Join Waitlist":
                setOpenModal("join");
                break;

            // ticket & invite
            case "Your Ticket":
                if (!userId) {
                    alert("You must be logged in to view your ticket.");
                    return;
                }
                setOpenModal("ticket");
                break;

            case "Send Invite":
            case "Offer Ticket":
            case "Accept":
                setOpenModal("invite");
                break;

            case "Decline":
            case "Resign":
                setOpenModal("resign");
                break;

            // organizer / admin tools
            case "Edit":
                if (eventId) {
                    // full-page Edit Event (not a modal anymore)
                    navigate(`/event/${eventId}/edit`);
                }
                break;

            case "Verify Tickets":
            case "Verify Tickets →":
                setOpenModal("verify");
                break;

            case "Delete":
                setOpenModal("delete");
                break;

            // safety fallback
            case "View":
                if (eventId) navigate(`/event/${eventId}`);
                break;

            default:
                break;
        }
    }

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
                    className="text-[#14113B] hover:underline font-[Gilroy-Medium] text-[16px]"
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
                        type={type}
                        category={category}
                        state={viewState}
                        eventId={eventId}
                        onAction={handleAction}
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
                        <span className="text-indigo-700 font-medium">
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
                            className="text-indigo-700 font-medium hover:underline"
                        >
                            Location: {location}
                        </a>
                    </div>
                </div>
            </main>

            {/* -------------------------- MODALS -------------------------- */}

            {/* JOIN modal: create ticket + redirect to /registration */}
            <JoinModal
                isOpen={openModal === "join"}
                onClose={closeModal}
                eventId={eventId}
                title={title}
                price={price}
                hasSeatingPlan={hasSeatingPlan}
                userId={userId}
                setTicket={setTicket}
                setViewState={setViewState}
            />

            {/* INVITE modal: dummy invite UI */}
            <InviteModal
                isOpen={openModal === "invite"}
                onClose={closeModal}
                title={title}
                price={price}
            />

            {/* TICKET modal: QR ticket */}
            <TicketModal
                isOpen={openModal === "ticket"}
                onClose={closeModal}
                ticket={ticket}
                title={title}
            />

            {/* VERIFY modal: organizer/admin verifies ticket by code or QR scan */}
            <VerifyTicketsModal
                isOpen={openModal === "verify"}
                onClose={closeModal}
                eventId={eventId}
            />

            {/* RESIGN modal: move user from joined to not-joined */}
            <ResignModal
                isOpen={openModal === "resign"}
                onClose={closeModal}
                title={title}
                price={price}
                onConfirm={() => {
                    setViewState("not-joined");
                    closeModal();
                }}
            />

            {/* DELETE modal: demo-only delete (shows banner) */}
            <DeleteEventModal
                isOpen={openModal === "delete"}
                onClose={closeModal}
                title={title}
                onConfirm={() => {
                    closeModal();
                    setShowDeleteBanner(true);
                    setTimeout(() => setShowDeleteBanner(false), 2500);
                }}
            />

            {/* Deletion banner (demo only) */}
            {showDeleteBanner && (
                <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">
                    Event deleted (demo).
                </div>
            )}
        </div>
    );
}