// ticketorium/ticketorium-backend/seeds/data/disputes.data.js
export const disputesSeed = [
    {
        title: "Ticket not received",
        subtitle: "Issue with email delivery for my ticket.",
        createdAt: "2025-11-21T09:15:00Z",
        lastActivityAt: "2025-11-21T09:20:00Z",
        status: "open",
        participantsHandles: ["visitor", "system-admin"],
        eventKey: 4,
        ticketKey: "t1",
        messages: [
            {
                fromHandle: "visitor",
                type: "text",
                text: "I have this issue with my ticket not arriving.",
                createdAt: "2025-11-21T09:15:00Z",
            },
            {
                fromHandle: "system-admin",
                type: "text",
                text: "I’ll fix it right away!",
                createdAt: "2025-11-21T09:17:00Z",
            },
            {
                fromHandle: "visitor",
                type: "image",
                url: "/src/assets/images/event/group-hiking.png",
                caption: "This is what I see on my screen.",
                createdAt: "2025-11-21T09:20:00Z",
            },
        ],
    },
    {
        title: "Double charge on payment",
        subtitle: "I was charged twice when buying tickets.",
        createdAt: "2025-11-21T08:40:00Z",
        lastActivityAt: "2025-11-21T08:50:00Z",
        status: "open",
        participantsHandles: ["kfupm-organizer", "admin"],
        eventKey: 6,
        ticketKey: "t3",
        messages: [
            {
                fromHandle: "kfupm-organizer",
                type: "text",
                text: "I have this issue with my ticket not arriving.",
                createdAt: "2025-11-21T09:15:00Z",
            },
            {
                fromHandle: "admin",
                type: "text",
                text: "I’ll fix it right away!",
                createdAt: "2025-11-21T09:17:00Z",
            },
        ],
    },
];
