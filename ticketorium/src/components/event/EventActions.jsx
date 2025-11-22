import React, {useEffect} from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { ArrowRight, Tickets } from "lucide-react";
import { useNavigate } from "react-router-dom"; //r
import {useState} from "react";

import ResignModal from "../modals/ResignModal";

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[var(--accent-color)] text-[#14113B]",
    secondary: "border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)]",
    border: "border bg-white",
};

export default function EventActions({ type, category, state , eventId, onAction, eventTitle, price}) {
    const navigate = useNavigate();
    const [openResignModal, setOpenResignModal] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(null);

    const actions = eventActionsConfig[category]?.[state] || eventActionsConfig[category]?.default;

    if (!actions) return null;
    const closeModal = () => {
        setOpenResignModal(false);
        setOpenDeleteModal(false);
    }

    const handleResignConfirm = () => {
        closeModal();
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">

                {/* Filter actions: only show "Send Invite" or "Offer Ticket" if user is a student */}
                {actions.filter((action) => {
                        if (
                            (action.label === "Send Invite" || action.label === "Offer Ticket") &&
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

                        const handleClick = () => { //r
                            // If the page provided a handler, let it decide (details page then open modals)
                            if (onAction) {
                                onAction(action.label);
                                return;
                            }

                            //Resign Button
                            if (action.label === "Resign") {
                                setOpenResignModal("resign");
                                return;
                            }

                            //Delete Button
                            if (action.label === "Delete") {
                                setOpenDeleteModal("delete");
                                return;
                            }

                            //View button
                            // Default behavior (lists/cards): keep your previous behavior
                            if ((action.label === "View" || action.label === "Join") && eventId) {
                                navigate(`/event/${eventId}`);
                                return;
                            }

                            console.log(`${action.label} clicked`);
                        };

                    return (
                        <button
                            key={index}
                            className={`${baseBtn} ${variantClass} ${colorClass}`}
                            // onClick={() => console.log(`${action.label} clicked`)}
                            onClick={handleClick} //r
                        >
                            {/* Show Tickets icon BEFORE text */}
                            {isTickets && <Icon size={16} />}

                            {action.label}

                            {/* Show ArrowRight AFTER text */}
                            {isArrowRight && <Icon size={16} />}
                        </button>
                    );
                })}
            </div>

            <ResignModal
                isOpen={openResignModal}
                onClose={closeModal}
                onConfirm={handleResignConfirm}
                eventName={eventTitle || `Event #${eventId}`} // Pass title if available
                refundAmount={price} // Pass price if available
            />
    </>

    );
}
