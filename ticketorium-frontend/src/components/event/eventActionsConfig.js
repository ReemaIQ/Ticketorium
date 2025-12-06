// ticketorium-frontend/src/components/event/eventActionsConfig.js
import { ArrowRight, Tickets } from "lucide-react";

export const eventActionsConfig = {
    attendee: {
        joined: [
            { label: "Your Ticket", icon: Tickets, variant: "primary" },
            { label: "Send Invite", icon: ArrowRight, variant: "secondary" },
            { label: "Resign", color: "text-red-500", variant: "border" },
        ],
        undefined: [ //EVENT it should be "normal"
            { label: "Join", icon: ArrowRight, variant: "primary" },
            { label: "Send Invite", variant: "border" },
        ],
        waitlist: [ //EVENT
            { label: "Join Waitlist", icon: ArrowRight, variant: "primary" },
        ],
        waitlisted: [
            { label: "Waitlisted", icon: "", variant: "secondary" },
        ],
        invited: [
            { label: "Accept", icon: ArrowRight, variant: "primary" },
            { label: "Decline", color: "text-red-500", variant: "border" },
        ],
        graduation: [
            { label: "Your Ticket", icon: Tickets, variant: "primary" },
            { label: "Offer Ticket", icon: ArrowRight, variant: "secondary" },
        ],
    },

    organizer: {
        default: [
            { label: "Edit", icon: ArrowRight, variant: "primary" },
            { label: "Verify Tickets", icon: ArrowRight, variant: "secondary" },
            {
                label: "Delete",
                color: "text-[var(--warning-color)]",
                variant: "border",
            },
        ],
    },

    admin: {
        default: [
            { label: "Edit", icon: ArrowRight, variant: "primary" },
            {
                label: "Delete",
                color: "text-[var(--warning-color)]",
                variant: "border",
            },
        ],
    },
};
