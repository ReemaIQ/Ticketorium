import React from "react";
import { eventActionsConfig } from "./eventActionsConfig";

import { ArrowRight, Tickets } from "lucide-react";

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[#FFDF4F] text-[#14113B]",
    secondary: "border bg-white text-[#14113B]",
    border: "border bg-white",
};

export default function EventActions({ type, category, state }) {
    const actions = eventActionsConfig[category]?.[state] || eventActionsConfig[category]?.default;

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

                return (
                    <button
                        key={index}
                        className={`${baseBtn} ${variantClass} ${colorClass}`}
                        onClick={() => console.log(`${action.label} clicked`)}
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
