// // Ticketorium/ticketorium/src/components/event/EventActions.jsx
// import React, { useEffect, useState } from "react";
// import { eventActionsConfig } from "./eventActionsConfig";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ArrowRight, Tickets } from "lucide-react";
//
// import JoinModal from "../modals/JoinModal.jsx";
// import InviteModal from "../modals/InviteModal.jsx";
// import TicketModal from "../modals/TicketModal.jsx";
// import VerifyTicketsModal from "../modals/VerifyTicketModal.jsx";
// import ResignModal from "../modals/ResignModal.jsx";
// import DeclineInviteModal from "../modals/DeclineInviteModal.jsx";
// import DeleteEventModal from "../modals/DeleteEventModal.jsx";
//
// import {
//     createTicket,
//     fetchTicketForEvent,
//     cancelTicket,
// } from "../../api/tickets.js";
// import { deleteEvent } from "../../api/events.js"; // real delete
//
// /* ----------------------------- Buttons styling ----------------------------- */
//
// const baseBtn =
//     "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1 cursor-pointer";
//
// const variants = {
//     primary: "bg-[var(--accent-color)] text-[var(--secondary-color)]",
//     secondary:
//         "border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)]",
//     border: "border bg-white",
// };
//
// /* ----------------------------- Main Component ----------------------------- */
//
// export default function EventActions({
//     event,
//     user,          // userId (required)
//     type,          // "student" / "organizer" / "visitor" etc.
//     category,      // derived with getUserCategory(type)
//     state,         // joined / invited / waitlist / undefined (from backend)
//     eventId,       // Mongo _id of event (required)
//     onAction,
//     onStateChange,
// }) {
//     const navigate = useNavigate();
//     const routerLocation = useLocation();
//
//     const passedEvent = event || {};
//
//     const [ticket, setTicket] = useState(null);
//     const [openModal, setOpenModal] = useState("none");
//     const [showDeleteBanner, setShowDeleteBanner] = useState(false);
//
//     const closeModal = () => setOpenModal("none");
//
//     /* AUTO-OPEN MODALS WHEN COMING FROM REGISTRATION PAGE */
//     useEffect(() => {
//         const navState = routerLocation.state;
//         if (!navState) return;
//
//         if (navState.openJoinModal) {
//             setOpenModal("join");
//         } else if (navState.openTicketModal) {
//             setOpenModal("ticket");
//         }
//     }, [routerLocation.state]);
//
//     /**
//      * Load ticket on mount / when eventId or user changes.
//      *
//      * REAL BEHAVIOR (no dummy hacks):
//      * - Only load ticket if it exists in backend.
//      * - Ticket creation happens explicitly via JoinModal (createTicket),
//      *   not magically here based on some "state === joined" flag.
//      */
//     useEffect(() => {
//         if (!user || !eventId) return;
//
//         async function loadTicket() {
//             try {
//                 const existing = await fetchTicketForEvent({ eventId, user });
//
//                 if (existing) {
//                     // Allow frontend-only field like accessibilityNotes
//                     setTicket((prev) => prev || { ...existing, accessibilityNotes: "" });
//                     console.log("Loaded ticket from backend:", existing);
//                 } else {
//                     setTicket(null);
//                 }
//             } catch (err) {
//                 console.error("Failed to load ticket:", err);
//             }
//         }
//
//         loadTicket();
//     }, [eventId, user]);
//
//     // Effective state = what parent (and modals) pass down
//     const effectiveState = state;
//
//     const actions =
//         eventActionsConfig[category]?.[effectiveState] ||
//         eventActionsConfig[category]?.default;
//
//     if (!actions) return null;
//
//     // map button label → open correct modal / route
//     function handleAction(label) {
//         switch (label) {
//             // attend / waitlist
//             case "Join":
//             case "Pay & Join":
//                 setOpenModal("join");
//                 break;
//
//             case "Join Waitlist":
//                 setOpenModal("waitlist");
//                 break;
//
//             // ticket & invite
//             case "Your Ticket":
//                 setOpenModal("ticket");
//                 break;
//
//             case "Send Invite":
//             case "Offer Ticket":
//                 setOpenModal("invite");
//                 break;
//
//             case "Decline":
//                 setOpenModal("decline");
//                 break;
//
//             case "Resign":
//                 setOpenModal("resign");
//                 break;
//
//             // organizer / admin tools
//             case "Edit":
//                 if (eventId) {
//                     navigate(`/event/${eventId}/edit`);
//                 }
//                 break;
//
//             case "Verify Tickets":
//             case "Verify Tickets →":
//                 setOpenModal("verify");
//                 break;
//
//             case "Delete":
//                 setOpenModal("delete");
//                 break;
//
//             // safety fallback
//             case "View":
//                 if (eventId) navigate(`/event/${eventId}`);
//                 break;
//
//             default:
//                 break;
//         }
//     }
//
//     return (
//         <>
//             <div className="flex flex-wrap gap-2">
//                 {actions
//                     // Only students can see "Send Invite" / "Offer Ticket"
//                     .filter((action) => {
//                         if (
//                             (action.label === "Send Invite" ||
//                                 action.label === "Offer Ticket") &&
//                             type !== "student"
//                         ) {
//                             return false;
//                         }
//                         return true;
//                     })
//
//                     .map((action, index) => {
//                         const Icon = action.icon;
//                         const colorClass = action.color || "";
//                         const variantClass = variants[action.variant] || "";
//
//                         const isArrowRight = Icon === ArrowRight;
//                         const isTickets = Icon === Tickets;
//
//                         const handleClick = () => {
//                             const label = action.label;
//
//                             // Let parent intercept if it wants
//                             if (onAction) {
//                                 onAction(label);
//                                 return;
//                             }
//
//                             // CARD / LIST FALLBACK:
//                             if (
//                                 !event &&
//                                 eventId &&
//                                 (label === "View" ||
//                                     label === "Join" ||
//                                     label === "Pay & Join" ||
//                                     label === "Verify Tickets")
//                             ) {
//                                 navigate(`/event/${eventId}`);
//                                 return;
//                             }
//
//                             // Default internal handling
//                             handleAction(label);
//                             console.log(`${label} clicked`);
//                         };
//
//                         return (
//                             <button
//                                 key={index}
//                                 className={`${baseBtn} ${variantClass} ${colorClass}`}
//                                 onClick={handleClick}
//                             >
//                                 {/* Tickets icon BEFORE text */}
//                                 {isTickets && Icon && <Icon size={16} />}
//
//                                 {action.label}
//
//                                 {/* ArrowRight AFTER text */}
//                                 {isArrowRight && Icon && <Icon size={16} />}
//                             </button>
//                         );
//                     })}
//             </div>
//
//             {/* -------------------------- MODALS -------------------------- */}
//
//             {/* JOIN modal: create ticket + redirect to /registration */}
//             <JoinModal
//                 isOpen={openModal === "join"}
//                 onClose={closeModal}
//                 eventId={eventId}
//                 title={passedEvent.title}
//                 price={passedEvent.price}
//                 hasSeatingPlan={passedEvent.hasSeatingPlan}
//                 userId={user}
//                 setTicket={setTicket}
//                 setViewState={(newState) => {
//                     if (onStateChange) onStateChange(newState);
//                 }}
//             />
//
//             {/* INVITE modal */}
//             <InviteModal
//                 isOpen={openModal === "invite"}
//                 onClose={closeModal}
//                 title={passedEvent.title}
//                 price={passedEvent.price}
//             />
//
//             {/* TICKET modal: QR ticket */}
//             <TicketModal
//                 isOpen={openModal === "ticket"}
//                 onClose={closeModal}
//                 ticket={ticket}
//                 title={passedEvent.title}
//             />
//
//             {/* VERIFY modal: organizer/admin verifies ticket by code or QR scan */}
//             <VerifyTicketsModal
//                 isOpen={openModal === "verify"}
//                 onClose={closeModal}
//                 eventId={eventId}
//             />
//
//             {/* RESIGN modal */}
//             <ResignModal
//                 isOpen={openModal === "resign"}
//                 onClose={closeModal}
//                 title={passedEvent.title}
//                 price={passedEvent.price}
//                 onConfirm={async () => {
//                     try {
//                         // If there is a ticket, cancel it in backend
//                         if (ticket) {
//                             const ticketId = ticket._id || ticket.id;
//                             if (ticketId) {
//                                 await cancelTicket(ticketId, user);
//                                 console.log("Ticket cancelled on resign:", ticketId);
//                             }
//                         }
//
//                         // User is no longer joined
//                         if (onStateChange) onStateChange(undefined);
//
//                         // Clear local ticket
//                         setTicket(null);
//                     } catch (err) {
//                         console.error("Failed to resign / cancel ticket:", err);
//                     } finally {
//                         closeModal();
//                     }
//                 }}
//             />
//
//             {/* Decline modal */}
//             <DeclineInviteModal
//                 isOpen={openModal === "decline"}
//                 onClose={closeModal}
//                 onConfirm={() => {
//                     if (onStateChange) onStateChange(undefined);
//                     closeModal();
//                 }}
//             />
//
//             {/* DELETE modal: now actually calls backend */}
//             <DeleteEventModal
//                 isOpen={openModal === "delete"}
//                 onClose={closeModal}
//                 title={passedEvent.title}
//                 onConfirm={async () => {
//                     if (!eventId) return;
//
//                     try {
//                         await deleteEvent(eventId);
//                         console.log("Event deleted:", eventId);
//
//                         closeModal();
//                         setShowDeleteBanner(true);
//
//                         // Optional: if on StateChange or onAction should reflect removal,
//                         // parent can listen to that and refetch lists.
//                         if (onAction) {
//                             onAction("Deleted");
//                         }
//                     } catch (err) {
//                         console.error("Failed to delete event:", err);
//                     } finally {
//                         setTimeout(() => setShowDeleteBanner(false), 2500);
//                     }
//                 }}
//             />
//
//             {showDeleteBanner && (
//                 <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">
//                     Event deleted.
//                 </div>
//             )}
//         </>
//     );
// }
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
                                         user,          // userId
                                         type,
                                         category,
                                         state,         // joined / invited / waitlist / undefined
                                         eventId,
                                         onAction,
                                         onStateChange,
                                     }) {
    const navigate = useNavigate();
    const routerLocation = useLocation();

    const passedEvent = event || {};

    const [ticket, setTicket] = useState(null);
    const [openModal, setOpenModal] = useState("none");
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

    /**
     * Load ticket on mount / when eventId or user changes.
     *
     * - If a ticket exists in backend (for this user+event), use it.
     * - If NO ticket exists but `state === "joined"` (dummy data says already joined),
     *   then auto-create a ticket ONCE.
     * - If user joined via JoinModal, that already called createTicket + setTicket,
     *   so this effect will only "see" existing ticket and not create a new one.
     */
    useEffect(() => {
        if (!user || !eventId) return;

        async function syncTicket() {
            try {
                // 1) Try to load existing ticket
                const existing = await fetchTicketForEvent({ eventId, user });

                if (existing) {
                    setTicket((prev) => prev || { ...existing, accessibilityNotes: "" });
                    console.log("Loaded ticket from backend:", existing);
                    return;
                }

                // 2) No ticket found in backend.
                // If dummy data says this user is already joined, auto-generate a ticket.
                if (state === "joined") {
                    const created = await createTicket({
                        eventId,
                        userId: user,
                        seat: null,
                        price: passedEvent?.price ?? 0,
                    });

                    setTicket({ ...created, accessibilityNotes: "" });
                    console.log("Auto-created ticket for joined user:", created);
                }
            } catch (err) {
                console.error("Failed to load / auto-create ticket:", err);
            }
        }

        syncTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, user, state, passedEvent?.price]);

    // Effective state = what parent passed down
    const effectiveState = state;

    const actions =
        eventActionsConfig[category]?.[effectiveState] ||
        eventActionsConfig[category]?.default;

    if (!actions) return null;

    // map button label → open correct modal / route
    function handleAction(label) {
        switch (label) {
            // attend / waitlist
            case "Join":
            case "Pay & Join":
                setOpenModal("join");
                break;

            case "Join Waitlist":
                setOpenModal("waitlist");
                break;

            // ticket & invite
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

            // organizer / admin tools
            case "Edit":
                if (eventId) {
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

                    .map((action, index) => {
                        const Icon = action.icon;
                        const colorClass = action.color || "";
                        const variantClass = variants[action.variant] || "";

                        const isArrowRight = Icon === ArrowRight;
                        const isTickets = Icon === Tickets;

                        const handleClick = () => {
                            const label = action.label;

                            // Let parent intercept if it wants
                            if (onAction) {
                                onAction(label);
                                return;
                            }

                            // CARD / LIST FALLBACK:
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

                            // Default internal handling
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
                                {isTickets && Icon && <Icon size={16} />}

                                {action.label}

                                {/* ArrowRight AFTER text */}
                                {isArrowRight && Icon && <Icon size={16} />}
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
                setViewState={(newState) => {
                    if (onStateChange) onStateChange(newState);
                }}
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
                onConfirm={async () => {
                    try {
                        // If there is a ticket, cancel it in backend
                        if (ticket?.id) {
                            await cancelTicket(ticket.id, user);
                            console.log("Ticket cancelled on resign:", ticket.id);
                        }

                        // User is no longer joined
                        if (onStateChange) onStateChange(undefined);

                        // Clear local ticket
                        setTicket(null);
                    } catch (err) {
                        console.error("Failed to resign / cancel ticket:", err);
                    } finally {
                        closeModal();
                    }
                }}
            />

            {/* Decline modal */}
            <DeclineInviteModal
                isOpen={openModal === "decline"}
                onClose={closeModal}
                onConfirm={() => {
                    if (onStateChange) onStateChange(undefined);
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

            {showDeleteBanner && (
                <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">
                    Event deleted (demo).
                </div>
            )}
        </>
    );
}