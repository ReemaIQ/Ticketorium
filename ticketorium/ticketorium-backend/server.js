const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// !!! TEMP: in-memory tickets instead of DB
// Later: replace with real DB queries (find, insert, update...)
let tickets = [];
let nextId = 1;

// Helper to generate a human-friendly ticket code
function generateTicketCode(eventId, userId) {
    // eventId/userId are just used to make code feel meaningful, but
    // the *real* uniqueness comes from the random part.
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
    const cleanEvent = String(eventId || "EVT").slice(0, 4).toUpperCase();
    const cleanUser = String(userId || "USR").slice(-4).toUpperCase();

    return `TKT-${cleanEvent}-${cleanUser}-${randomPart}`;
}

// Helper to generate QR data token
function generateQrToken() {
    return crypto.randomBytes(16).toString("hex"); // 32-char random hex string
}

/**
 * POST /api/tickets
 * Body: { eventId, userId, seat, price }
 * Returns: created ticket object
 */
app.post("/api/tickets", (req, res) => {
    const { eventId, userId, seat = null, price = 0 } = req.body || {};

    if (!eventId || !userId) {
        return res.status(400).json({
            error: "eventId and userId are required to create a ticket",
        });
    }

    // TODO (future): check if user already has active ticket for this event

    const ticketCode = generateTicketCode(eventId, userId);
    const qrToken = generateQrToken();

    // You can later store qrToken in DB, and QR will encode this value or a URL.
    const ticket = {
        id: nextId++,
        ticketCode,
        qrToken, // secret-ish part
        // For QR payload, you can encode just qrToken or a URL that contains it:
        qrData: `TICKET:${qrToken}`,
        eventId,
        userId,
        seat,
        price,
        status: "active", // later: "cancelled", "used", etc.
        createdAt: new Date().toISOString(),
    };

    tickets.push(ticket);

    console.log("Ticket created (in-memory):", ticket);

    res.status(201).json(ticket);
});

// OPTIONAL: simple GET for debugging / dummy tickets
app.get("/api/tickets", (_req, res) => {
    res.json(tickets);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Tickets service running at http://localhost:${PORT}`);
});
