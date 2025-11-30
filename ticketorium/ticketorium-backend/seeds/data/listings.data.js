// ticketorium-backend/seeds/data/listings.data.js

// Each listing references a ticketKey (in ticketsSeed) and a sellerHandle.
export const listingsSeed = [
    {
        key: "listing1",
        ticketKey: "t1", // student’s comp ticket
        sellerHandle: "student",
        title: "2025 Coding Competition – Seat A-01",
        startingPrice: 20,
        status: "active",
        expiresAt: "2025-12-31T23:59:59Z",
    },
    {
        key: "listing2",
        ticketKey: "t6", // graduation VIP ticket
        sellerHandle: "student",
        title: "2025 Graduation Ceremony – VIP-01",
        startingPrice: 50,
        status: "active",
        expiresAt: "2025-12-31T23:59:59Z",
    },
];
