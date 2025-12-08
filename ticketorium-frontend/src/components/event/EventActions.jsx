// ticketorium-frontend/src/components/event/EventActions.jsx

import React, { useEffect, useState } from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Tickets } from "lucide-react";

import JoinModal from "../modals/JoinModal.jsx";
import InviteModal from "../modals/InviteModal.jsx";
import TicketModal from "../modals/TicketModal.jsx";
import VerifyTicketsModal from "../modals/VerifyTicketModal.jsx";
import ResignModal from "../modals/ResignModal.jsx";
import DeclineInviteModal from "../modals/DeclineInviteModal.jsx";
import DeleteEventModal from "../modals/DeleteEventModal.jsx";

import {
    createTicket,
    fetchTicketForEvent,
    cancelTicket,
} from "../../api/tickets.js";

/* ----------------------------- Buttons styling ----------------------------- */

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1 cursor-pointer";

const variants = {
    primary: "bg-[var(--accent-color)] text-[var(--secondary-color)]",
    secondary:
        "border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)]",
    border: "border bg-white",
};

/* ----------------------------- Main Component ----------------------------- */

export default function EventActions({
                                         event,
                                         user, // could be id or full userObj
                                         type,
                                         category,
                                         state,
                                         onAction,
                                         onStateChange,
                                     }) {
    const navigate = useNavigate();
    const routerLocation = useLocation();

    const passedEvent = event || {};
    const eventId = passedEvent.id || passedEvent._id;

    const [ticket, setTicket] = useState(null);
    const [openModal, setOpenModal] = useState("none");
    const [showDeleteBanner, setShowDeleteBanner] = useState(false);

    const closeModal = () => setOpenModal("none");

    /* AUTO-OPEN MODALS WHEN RETURNING FROM REGISTRATION */
    useEffect(() => {
        const navState = routerLocation.state;
        if (!navState) return;

        if (navState.openJoinModal) {
            setOpenModal("join");
        } else if (navState.openTicketModal) {
            setOpenModal("ticket");
        }
    }, [routerLocation.state]);

    /* -------------------------
       FIXED TICKET LOADING LOGIC
       ------------------------- */
    function normalizeUserId(u) {
        if (!u) return "";
        if (typeof u === "string") return u;
        if (u._id) return u._id;
        if (u.id) return u.id;
        if (u.handle) return u.handle; // for demo fallback
        return String(u);
    }

    useEffect(() => {
        if (!user || !eventId) return;

        async function syncTicket() {
            try {
                const userId = normalizeUserId(user);

                // 1) Try loading existing ticket
                const existing = await fetchTicketForEvent({
                    eventId,
                    user: userId,
                });

                if (existing) {
                    setTicket((prev) => prev || { ...existing, accessibilityNotes: "" });
                    console.log("Loaded ticket:", existing);
                    return;
                }

                // 2) Auto-create ticket if user is joined
                if (state === "joined") {
                    const created = await createTicket({
                        eventId,
                        userId,
                        seat: null,
                        price: passedEvent?.price ?? 0,
                    });

                    setTicket({ ...created, accessibilityNotes: "" });
                    console.log("Auto-created ticket:", created);
                }
            } catch (err) {
                console.error("Failed to load/create ticket:", err);
            }
        }

        syncTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, user, state, passedEvent?.price]);

    /* -------------------------
       ACTION BUTTON HANDLER
       ------------------------- */

    const effectiveState = state;

    const actions =
        eventActionsConfig[category]?.[effectiveState] ||
        eventActionsConfig[category]?.default;

    if (!actions) return null;

    function handleAction(label) {
        switch (label) {
            case "Join":
            case "Pay & Join":
                setOpenModal("join");
                break;

            case "Join Waitlist":
                setOpenModal("waitlist");
                break;

            case "Your Ticket":
                setOpenModal("ticket");
                break;

            case "Send Invite":
            case "Offer Ticket":
                setOpenModal("invite");
                break;

            case "Decline":
                setOpenModal("decline");
                break;

            case "Resign":
                setOpenModal("resign");
                break;

            case "Edit":
                if (eventId) navigate(`/event/${eventId}/edit`);
                break;

            case "Verify Tickets":
            case "Verify Tickets →":
                setOpenModal("verify");
                break;

            case "Delete":
                setOpenModal("delete");
                break;

            case "View":
                if (eventId) {
                    navigate(`/event/${eventId}`, { state: { event: passedEvent } });
                }
                break;

            default:
                break;
        }
    }

    /* -------------------------
       RENDER UI
       ------------------------- */

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {actions
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
                    .map((action, index) => {
                        const Icon = action.icon;
                        const colorClass = action.color || "";
                        const variantClass = variants[action.variant] || "";

                        const isArrowRight = Icon === ArrowRight;
                        const isTickets = Icon === Tickets;

                        const handleClick = () => {
                            if (onAction) {
                                onAction(action.label);
                                return;
                            }

                            if (
                                !event &&
                                eventId &&
                                ["View", "Join", "Pay & Join", "Verify Tickets"].includes(
                                    action.label
                                )
                            ) {
                                navigate(`/event/${eventId}`, { state: { event: passedEvent } });
                                return;
                            }

                            handleAction(action.label);
                        };

                        return (
                            <button
                                key={index}
                                className={`${baseBtn} ${variantClass} ${colorClass}`}
                                onClick={handleClick}
                            >
                                {isTickets && Icon && <Icon size={16} />}
                                {action.label}
                                {isArrowRight && Icon && <Icon size={16} />}
                            </button>
                        );
                    })}
            </div>

            {/* -------------------------- MODALS -------------------------- */}

            <JoinModal
                isOpen={openModal === "join"}
                onClose={closeModal}
                eventId={eventId}
                title={passedEvent.title}
                price={passedEvent.price}
                hasSeatingPlan={passedEvent.hasSeatingPlan}
                userId={normalizeUserId(user)}
                setTicket={setTicket}
                setViewState={(newState) => onStateChange?.(newState)}
            />

            <InviteModal
                isOpen={openModal === "invite"}
                onClose={closeModal}
                title={passedEvent.title}
                price={passedEvent.price}
            />

            <TicketModal
                isOpen={openModal === "ticket"}
                onClose={closeModal}
                ticket={ticket}
                title={passedEvent.title}
            />

            <VerifyTicketsModal
                isOpen={openModal === "verify"}
                onClose={closeModal}
                eventId={eventId}
            />

            <ResignModal
                isOpen={openModal === "resign"}
                onClose={closeModal}
                title={passedEvent.title}
                price={passedEvent.price}
                onConfirm={async () => {
                    try {
                        if (ticket?.id) {
                            await cancelTicket(ticket.id, normalizeUserId(user));
                            console.log("Ticket cancelled:", ticket.id);
                        }
                        onStateChange?.(undefined);
                        setTicket(null);
                    } catch (err) {
                        console.error("Failed to resign:", err);
                    } finally {
                        closeModal();
                    }
                }}
            />

            <DeclineInviteModal
                isOpen={openModal === "decline"}
                onClose={closeModal}
                onConfirm={() => {
                    onStateChange?.(undefined);
                    closeModal();
                }}
            />

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

            {showDeleteBanner && (
                <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">
                    Event deleted (demo).
                </div>
            )}
        </>
    );
}
