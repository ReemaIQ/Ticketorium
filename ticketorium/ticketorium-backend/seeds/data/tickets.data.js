// key is just to connect tickets -> listings easily
export const ticketsSeed = [
    {
        key: "t1",
        eventKey: 4,          // UPDATED: Must be Number (4), not "ev4"
        userHandle: "student",
        seat: "A-01",
        price: 19.99,
        status: "active",
    },
    {
        key: "t2",
        eventKey: 4,
        userHandle: "visitor",
        seat: "A-02",
        price: 19.99,
        status: "active",
    },
    {
        key: "t3",
        eventKey: 6,          // UPDATED: Must be Number (6)
        userHandle: "visitor",
        seat: "B-01",
        price: 19.99,
        status: "active",
    },
    {
        key: "t4",
        eventKey: 6,
        userHandle: "student",
        seat: "B-02",
        price: 19.99,
        status: "active",
    },
    {
        key: "t5",
        eventKey: 8,          // UPDATED: Must be Number (8)
        userHandle: "visitor",
        seat: "C-01",
        price: 0,
        status: "active",
    },
    {
        key: "t6",
        eventKey: 7,          // UPDATED: Must be Number (7)
        userHandle: "student",
        seat: "VIP-01",
        price: 0,
        status: "active",
    },
];