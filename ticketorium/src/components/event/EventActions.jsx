import React from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { useNavigate } from "react-router-dom"; //r
import { ArrowRight, Tickets } from "lucide-react";

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[#FFDF4F] text-[#14113B]",
    secondary: "border bg-white text-[#14113B]",
    border: "border bg-white",
};

export default function EventActions({ type, category, state , eventId, onAction}) {
    // const actions = eventActionsConfig[category]?.[state] || eventActionsConfig[category]?.default;
    const navigate = useNavigate();
    const actions =
        eventActionsConfig[category]?.[state] ||
        eventActionsConfig[category]?.default;

    if (!actions) return null;


    return (
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

                        // Default behavior (lists/cards): keep your previous behavior
                        if (action.label === "View" && eventId) {
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
    );
}
