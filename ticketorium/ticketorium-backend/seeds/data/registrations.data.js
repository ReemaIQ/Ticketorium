// ticketorium-backend/seed/data/registrations.data.js
export const registrationsSeed = [
    { eventKey: "ev1", userHandle: "visitor", status: "joined" },
    { eventKey: "ev4", userHandle: "student", status: "joined" },
    { eventKey: "ev3", userHandle: "visitor", status: "joined" },
    {
        eventKey: "ev4",
        userHandle: "student",
        status: "invited",
        invitedByHandle: "student2",
    },
    {
        eventKey: "ev6",
        userHandle: "visitor",
        status: "joined",
        invitedByHandle: "student",
    },
];
