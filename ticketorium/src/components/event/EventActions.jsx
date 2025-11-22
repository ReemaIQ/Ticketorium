import React, { useEffect, useState } from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Tickets } from "lucide-react";

import JoinModal from "../modals/JoinModal.jsx";
import InviteModal from "../modals/InviteModal.jsx";
import TicketModal from "../modals/TicketModal.jsx";
import VerifyTicketsModal from "../modals/VerifyTicketModal.jsx";
import ResignModal from "../modals/ResignModal.jsx";
import DeleteEventModal from "../modals/DeleteEventModal.jsx";
import { fetchTicketForEvent } from "../../api/tickets.js";

/* ----------------------------- Buttons styling ----------------------------- */

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[var(--accent-color)] text-[var(--secondary-color)]",
    secondary:
        "border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)]",
    border: "border bg-white",
};

/* ----------------------------- Main Component ----------------------------- */

export default function EventActions({
                                         event,
                                         user,
                                         type,
                                         category,
                                         state,
                                         eventId,
                                         onAction,
                                     }) {
    const navigate = useNavigate();
    const routerLocation = useLocation();

    const passedEvent = event ? event : {};

    const [viewState, setViewState] = useState(event?.state || null);
    const [ticket, setTicket] = useState(null);
    const [openModal, setOpenModal] = useState("none"); // 'join' | 'resign' | 'invite' | 'verify' | 'delete' | 'ticket' | 'none'
    const [showDeleteBanner, setShowDeleteBanner] = useState(false);

    const closeModal = () => setOpenModal("none");

    /* AUTO-OPEN MODALS WHEN COMING FROM REGISTRATION PAGE */
    useEffect(() => {
        const navState = routerLocation.state;
        if (!navState) return;

        if (navState.openJoinModal) {
            setOpenModal("join");
        } else if (navState.openTicketModal) {
            setOpenModal("ticket");
        }
    }, [routerLocation.state]);

    // load existing ticket from backend when page mounts/user changes
    useEffect(() => {
        if (!user || !eventId) return;

        async function loadTicket() {
            try {
                const existing = await fetchTicketForEvent({ eventId, user });
                if (existing) {
                    setTicket((prev) => prev || { ...existing, accessibilityNotes: "" });
                    console.log("Loaded ticket from backend:", existing);
                }
            } catch (err) {
                console.error("Failed to load ticket:", err);
            }
        }

        loadTicket();
    }, [eventId, user]);

    // map EventActions button label → open correct modal / route (for full event details view)
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

    const actions =
        eventActionsConfig[category]?.[state] ||
        eventActionsConfig[category]?.default;

    if (!actions) return null;

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {actions
                    // Only students can see "Send Invite" / "Offer Ticket"
                    .filter((action) => {
                        if (
                            (action.label === "Send Invite" ||
                                action.label === "Offer Ticket") &&
                            type !== "student"
                        ) {
                            return false;
                        }
                        return true;
                    })

                    // Map each item to its information to return the right button shape
                    .map((action, index) => {
                        const Icon = action.icon;
                        const colorClass = action.color || "";
                        const variantClass = variants[action.variant] || "";

                        const isArrowRight = Icon === ArrowRight;
                        const isTickets = Icon === Tickets;

                        const handleClick = () => {
                            const label = action.label;

                            // If the page provided a handler, let it decide
                            // (e.g. cards or details page can hook into this)
                            if (onAction) {
                                onAction(label);
                                return;
                            }

                            // CARD / LIST FALLBACK:
                            // If we are in a context where we only know eventId (no full `event` object),
                            // make "View" / "Join" / "Pay & Join" / "Verify Tickets" go to the details page.
                            if (
                                !event &&
                                eventId &&
                                (label === "View" ||
                                    label === "Join" ||
                                    label === "Pay & Join" ||
                                    label === "Verify Tickets")
                            ) {
                                navigate(`/event/${eventId}`);
                                return;
                            }

                            // Default: use internal modal / routing logic
                            handleAction(label);
                            console.log(`${label} clicked`);
                        };

                        return (
                            <button
                                key={index}
                                className={`${baseBtn} ${variantClass} ${colorClass}`}
                                onClick={handleClick}
                            >
                                {/* Tickets icon BEFORE text */}
                                {isTickets && <Icon size={16} />}

                                {action.label}

                                {/* ArrowRight AFTER text */}
                                {isArrowRight && <Icon size={16} />}
                            </button>
                        );
                    })}
            </div>

            {/* -------------------------- MODALS -------------------------- */}

            {/* JOIN modal: create ticket + redirect to /registration */}
            <JoinModal
                isOpen={openModal === "join"}
                onClose={closeModal}
                eventId={eventId}
                title={passedEvent.title}
                price={passedEvent.price}
                hasSeatingPlan={passedEvent.hasSeatingPlan}
                userId={user}
                setTicket={setTicket}
                setViewState={setViewState}
            />

            {/* INVITE modal */}
            <InviteModal
                isOpen={openModal === "invite"}
                onClose={closeModal}
                title={passedEvent.title}
                price={passedEvent.price}
            />

            {/* TICKET modal: QR ticket */}
            <TicketModal
                isOpen={openModal === "ticket"}
                onClose={closeModal}
                ticket={ticket}
                title={passedEvent.title}
            />

            {/* VERIFY modal: organizer/admin verifies ticket by code or QR scan */}
            <VerifyTicketsModal
                isOpen={openModal === "verify"}
                onClose={closeModal}
                eventId={eventId}
            />

            {/* RESIGN modal */}
            <ResignModal
                isOpen={openModal === "resign"}
                onClose={closeModal}
                title={passedEvent.title}
                price={passedEvent.price}
                onConfirm={() => {
                    setViewState(null);
                    closeModal();
                }}
            />

            {/* DELETE modal: demo-only delete (shows banner) */}
            <DeleteEventModal
                isOpen={openModal === "delete"}
                onClose={closeModal}
                title={passedEvent.title}
                onConfirm={() => {
                    closeModal();
                    setShowDeleteBanner(true);
                    setTimeout(() => setShowDeleteBanner(false), 2500);
                }}
            />
        </>
    );
}
