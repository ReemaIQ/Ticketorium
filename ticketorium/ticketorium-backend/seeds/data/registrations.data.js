// ticketorium-backend/seed/data/registrations.data.js
export const registrationsSeed = [
    { eventKey: 1, userHandle: "visitor", status: "joined" },
    { eventKey: 4, userHandle: "student", status: "joined" },
    { eventKey: 3, userHandle: "visitor", status: "joined" },
    { eventKey: 4, userHandle: "student", status: "invited", invitedByHandle: "student2",},
    { eventKey: 6, userHandle: "visitor", status: "joined", invitedByHandle: "student",},
];
