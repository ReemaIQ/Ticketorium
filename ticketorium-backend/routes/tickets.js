// ticketorium-frontend-backend/routes/tickets.js

import express from "express";
import crypto from "crypto";

const router = express.Router();

/**
 * DEMO TICKET SERVICE (IN-MEMORY)
 * -------------------------------
 * - No Mongo, just an array in memory.
 * - Fields per ticket:
 *     id          (number)
 *     eventId     (string)
 *     userId      (string)
 *     seat        (string | null)
 *     price       (number)
 *     status      ("active" | "cancelled" | "used")
 *     ticketCode  (string)
 *     qrToken     (string)
 *     qrData      (string)
 *     createdAt   (ISO string)
 */

let tickets = [];
let nextId = 1;

// Helper to normalize eventId coming from frontend
function normalizeEventId(eventId) {
    if (!eventId) return "";
    if (typeof eventId === "object") {
        // Could be { _id: "..." }
        if (eventId._id) return String(eventId._id);
        if (eventId.id) return String(eventId.id);
    }
    return String(eventId);
}

// Helper to normalize userId coming from frontend
function normalizeUserId(user) {
    if (!user) return "";
    if (typeof user === "string") return String(user);
    if (typeof user === "object") {
        if (user._id) return String(user._id);
        if (user.id) return String(user.id);
        if (user.handle) return String(user.handle);
    }
    return String(user);
}

// Helper to generate a human-friendly ticket code
function generateTicketCode(eventId, userId) {
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
router.post("/", (req, res) => {
    let { eventId, userId, seat = null, price = 0 } = req.body || {};

    const safeEventId = normalizeEventId(eventId);
    const safeUserId = normalizeUserId(userId);

    if (!safeEventId || !safeUserId) {
        return res.status(400).json({
            error: "eventId and userId are required to create a ticket",
        });
    }

    const ticketCode = generateTicketCode(safeEventId, safeUserId);
    const qrToken = generateQrToken();

    const ticket = {
        id: nextId++, // numeric id for frontend
        ticketCode,
        qrToken,                      // secret-ish part
        qrData: `TICKET:${qrToken}`,  // what we encode into QR
        eventId: safeEventId,
        userId: safeUserId,
        seat,
        price,
        status: "active",             // later: "cancelled", "used", etc.
        createdAt: new Date().toISOString(),
    };

    tickets.push(ticket);

    console.log("Ticket created (in-memory):", ticket);

    res.status(201).json(ticket);
});

/**
 * GET /api/tickets
 * Optional query filters:
 *   - eventId
 *   - userId
 *   - status
 */
router.get("/", (req, res) => {
    const { eventId, userId, status } = req.query || {};

    let filtered = tickets.slice();

    if (eventId) {
        const key = normalizeEventId(eventId);
        filtered = filtered.filter((t) => String(t.eventId) === key);
    }

    if (userId) {
        const key = normalizeUserId(userId);
        filtered = filtered.filter((t) => String(t.userId) === key);
    }

    if (status) {
        filtered = filtered.filter((t) => String(t.status) === String(status));
    }

    res.json(filtered);
});

/**
 * POST /api/tickets/cancel
 * Body: { ticketId, userId }
 */
router.post("/cancel", (req, res) => {
    const { ticketId, userId } = req.body || {};

    const safeUserId = normalizeUserId(userId);

    if (!ticketId || !safeUserId) {
        return res.status(400).json({
            error: "ticketId and userId are required to cancel a ticket",
        });
    }

    const ticket = tickets.find(
        (t) =>
            Number(t.id) === Number(ticketId) &&
            String(t.userId) === safeUserId
    );

    if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.status = "cancelled";
    console.log("Ticket cancelled:", ticket);

    return res.json({ ok: true, ticket });
});

/**
 * GET /api/tickets/verify
 * Query params:
 *   - code: ticketCode  OR
 *   - token: qrToken / qrData
 *   - eventId: optional, ensures ticket belongs to this event
 *
 * Response:
 *   { valid, reason, message, ticket? }
 */
router.get("/verify", (req, res) => {
    const { code, token, eventId } = req.query;

    if (!code && !token) {
        return res.status(400).json({
            valid: false,
            reason: "bad-request",
            message: "You must provide either code or token",
        });
    }

    function matchesToken(t, incomingToken) {
        if (!incomingToken) return false;

        if (t.qrToken === incomingToken) return true;
        if (t.qrData === incomingToken) return true;

        if (incomingToken.startsWith("TICKET:")) {
            return t.qrToken === incomingToken.slice("TICKET:".length);
        }

        return false;
    }

    let ticket;

    if (token) {
        ticket = tickets.find((t) => matchesToken(t, token));
    } else if (code) {
        ticket = tickets.find((t) => t.ticketCode === code);
    }

    if (!ticket) {
        return res.json({
            valid: false,
            reason: "not-found",
            message: "Ticket not found",
        });
    }

    if (eventId) {
        const key = normalizeEventId(eventId);
        if (String(ticket.eventId) !== key) {
            return res.json({
                valid: false,
                reason: "wrong-event",
                message: "Ticket belongs to a different event",
                ticket: {
                    id: ticket.id,
                    eventId: ticket.eventId,
                    ticketCode: ticket.ticketCode,
                    status: ticket.status,
                },
            });
        }
    }

    if (ticket.status !== "active") {
        return res.json({
            valid: false,
            reason: "inactive",
            message:
                ticket.status === "used"
                    ? "Ticket has already been used"
                    : "Ticket is not active",
            ticket: {
                id: ticket.id,
                eventId: ticket.eventId,
                ticketCode: ticket.ticketCode,
                status: ticket.status,
            },
        });
    }

    // SINGLE-USE: mark as used
    ticket.status = "used";

    return res.json({
        valid: true,
        reason: "ok",
        message: "Ticket is valid and has been marked as used.",
        ticket: {
            id: ticket.id,
            eventId: ticket.eventId,
            userId: ticket.userId,
            ticketCode: ticket.ticketCode,
            seat: ticket.seat,
            price: ticket.price,
            status: ticket.status,
            createdAt: ticket.createdAt,
        },
    });
});

export default router;
