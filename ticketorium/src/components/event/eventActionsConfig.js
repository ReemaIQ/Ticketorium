import { ArrowRight, Tickets } from "lucide-react";

export const eventActionsConfig = {
    attendee: {
        joined: [
            { label: "Your Ticket", icon: Tickets, variant: "primary" },
            { label: "Send Invite", icon: ArrowRight, variant: "secondary" },
            { label: "Resign", color: "text-red-500", variant: "border" },
        ],
        undefined : [
            { label: "Join", icon: ArrowRight, variant: "primary" },
            { label: "Send Invite", variant: "border" },
        ],
        waitlist: [
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

    organizer: { //r
        default: [
            { label: "Edit", icon: ArrowRight, variant: "primary" },
            { label: "Verify Tickets", icon: ArrowRight, variant: "secondary" },
            { label: "Delete", color: "text-red-500", variant: "border" },
        ],
    },
    
    admin: { //r
        default: [
            { label: "Edit", icon: ArrowRight, variant: "primary" },
            { label: "Delete", color: "text-red-500", variant: "border" },
        ],
    },
};
