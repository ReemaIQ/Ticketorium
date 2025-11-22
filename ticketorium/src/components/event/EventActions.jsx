import React, { useEffect, useState } from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tickets } from "lucide-react";

/* ----------------------------- Resign Modal ----------------------------- */

function ResignModal({ isOpen, onClose, children }) {
    useEffect(() => {
        if (!isOpen) return;

        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative mx-4 w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

/* ----------------------------- Buttons styling ----------------------------- */

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[var(--accent-color)] text-[#14113B]",
    secondary:
        "border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)]",
    border: "border bg-white",
};

/* ----------------------------- Main Component ----------------------------- */

export default function EventActions({
                                         type,
                                         category,
                                         state,
                                         eventId,
                                         onAction,
                                     }) {
    const navigate = useNavigate();
    const [openResignModal, setOpenResignModal] = useState(null);

    const actions =
        eventActionsConfig[category]?.[state] ||
        eventActionsConfig[category]?.default;

    if (!actions) return null;

    const closeModal = () => setOpenResignModal(null);

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
                            // If the page provided a handler, let it decide (details page then open modals)
                            if (onAction) {
                                onAction(action.label);
                                return;
                            }

                            // Resign from cards / lists
                            if (action.label === "Resign") {
                                setOpenResignModal("resign");
                                return;
                            }

                            // Default navigation for cards:
                            // View, Join, Verify Tickets : go to event details page
                            if (
                                (action.label === "View" ||
                                    action.label === "Join" ||
                                    action.label === "Verify Tickets") &&
                                eventId
                            ) {
                                navigate(`/event/${eventId}`);
                                return;
                            }

                            console.log(`${action.label} clicked`);
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

            {/* Resign confirmation modal (used when no onAction is passed) */}
            <ResignModal
                isOpen={openResignModal === "resign"}
                onClose={closeModal}
            >
                <div className="text-center">
                    <h3 className="text-xl font-semibold">
                        Resign from <span className="font-bold">title var</span>?
                        {/* TODO: pass real title via props if you want */}
                    </h3>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={() => {
                            // Let parent know the resignation was confirmed
                            if (onAction) onAction("Resign Confirmed");
                            closeModal();
                        }}
                        className="px-4 py-2 text-sm font-medium bg-white border border-rose-600 text-rose-600 rounded-md shadow-sm hover:bg-rose-50"
                    >
                        Resign
                    </button>

                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)] rounded-md shadow-sm hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </ResignModal>
        </>
    );
}
