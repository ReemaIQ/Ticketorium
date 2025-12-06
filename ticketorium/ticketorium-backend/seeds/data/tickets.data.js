// ticketorium-backend/seeds/data/tickets.data.js

// key is just to connect tickets → listings easily
export const ticketsSeed = [
    {
        key: "t1",
        eventKey: "ev4",          // Coding Competition
        userHandle: "student",
        seat: "A-01",
        price: 19.99,
        status: "active",
    },
    {
        key: "t2",
        eventKey: "ev4",
        userHandle: "visitor",
        seat: "A-02",
        price: 19.99,
        status: "active",
    },
    {
        key: "t3",
        eventKey: "ev6",          // Dec competition with seating
        userHandle: "visitor",
        seat: "B-01",
        price: 19.99,
        status: "active",
    },
    {
        key: "t4",
        eventKey: "ev6",
        userHandle: "student",
        seat: "B-02",
        price: 19.99,
        status: "active",
    },
    {
        key: "t5",
        eventKey: "ev8",          // Spelling Bee (seating)
        userHandle: "visitor",
        seat: "C-01",
        price: 0,
        status: "active",
    },
    {
        key: "t6",
        eventKey: "ev7",          // Graduation
        userHandle: "student",
        seat: "Seat A-01",
        price: 0,
        status: "active",
    },
    {
        key: "t7",
        eventKey: "ev7",          // Graduation
        userHandle: "student2",
        seat: "VIP-01",
        price: 0,
        status: "active",
    },
    {
        key: "t8",
        eventKey: "ev7",          // Graduation
        userHandle: "student2",
        seat: "VIP-02",
        price: 0,
        status: "active",
    },
    {
        key: "t9",
        eventKey: "ev7",          // Graduation
        userHandle: "student",
        seat: "Seat A-02",
        price: 0,
        status: "active",
    },
];
