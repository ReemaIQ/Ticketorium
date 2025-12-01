import express from "express";
import crypto from "crypto";

import { Listing } from "../models/Listing.js"
import { Ticket } from "../models/Ticket.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

const router = express.Router();

function generateTicketCode(eventId, userHandle) {
    const cleanEvent = String(eventId).padStart(3, "0");
    const cleanUser = (userHandle || "USER").toUpperCase().slice(0, 6);
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `TKT-E${cleanEvent}-${cleanUser}-${randomPart}`;
}

function generateQrToken() {
    return crypto.randomBytes(8).toString("hex");
}

/**
 * POST /api/tickets
 * Body: { eventId (numeric), userId, seat?, price? }
 */
router.post("/", async (req, res) => {
    try {
        const { eventId, userId, seat = null, price = 0 } = req.body || {};

        if (!eventId || !userId) {
            return res.status(400).json({
                error: "eventId (numeric) and userId are required",
            });
        }

        const event = await Event.findOne({ eventId: Number(eventId) });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const qrToken = generateQrToken();
        const ticketCode = generateTicketCode(event.eventId, user.handle);

        const ticket = await Ticket.create({
            event: event._id,
            user: user._id,
            eventId: event.eventId,
            ticketCode,
            qrToken,
            qrData: `TICKET:${qrToken}`,
            seat,
            price,
            status: "active",
        });

        res.status(201).json(ticket);
    } catch (err) {
        console.error("POST /api/tickets error:", err);
        res.status(500).json({ error: "Failed to create ticket" });
    }
});

/**
 * GET /api/tickets
 * Optional query:
 *   - userId
 */
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = {};
        if (userId) filter.user = userId;

        const tickets = await Ticket.find(filter)
            .populate("event", "eventId title startAt")
            .populate("user", "handle firstName lastName role");

        res.json(tickets);
    } catch (err) {
        console.error("GET /api/tickets error:", err);
        res.status(500).json({ error: "Failed to load tickets" });
    }
});

/**
 * POST /api/tickets/cancel
 * Body: { ticketId, userId }
 */
router.post("/cancel", async (req, res) => {
    try {
        const { ticketId, userId } = req.body || {};

        if (!ticketId || !userId) {
            return res.status(400).json({
                error: "ticketId and userId are required",
            });
        }

        const ticket = await Ticket.findOne({ _id: ticketId, user: userId });

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        ticket.status = "cancelled";
        await ticket.save();

        res.json({ ok: true, ticket });
    } catch (err) {
        console.error("POST /api/tickets/cancel error:", err);
        res.status(500).json({ error: "Failed to cancel ticket" });
    }
});

/**
 * GET /api/tickets/verify
 * Query:
 *   - code: ticketCode OR
 *   - token: qrToken / qrData
 *   - eventId: optional numeric
 */
router.get("/verify", async (req, res) => {
    try {
        const { code, token, eventId } = req.query;

        if (!code && !token) {
            return res.status(400).json({
                valid: false,
                reason: "bad-request",
                message: "You must provide either code or token",
            });
        }

        function matchesToken(ticket, incomingToken) {
            if (!incomingToken) return false;
            if (ticket.qrToken === incomingToken) return true;
            if (ticket.qrData === incomingToken) return true;
            if (incomingToken.startsWith("TICKET:")) {
                return ticket.qrToken === incomingToken.slice("TICKET:".length);
            }
            return false;
        }

        let ticket;
        if (token) {
            const all = await Ticket.find({});
            ticket = all.find((t) => matchesToken(t, token));
        } else if (code) {
            ticket = await Ticket.findOne({ ticketCode: code });
        }

        if (!ticket) {
            return res.json({
                valid: false,
                reason: "not-found",
                message: "Ticket not found",
            });
        }

        if (eventId && String(ticket.eventId) !== String(eventId)) {
            return res.json({
                valid: false,
                reason: "wrong-event",
                message: "Ticket belongs to a different event",
                ticket: {
                    id: ticket._id,
                    eventId: ticket.eventId,
                    ticketCode: ticket.ticketCode,
                    status: ticket.status,
                },
            });
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
                    id: ticket._id,
                    eventId: ticket.eventId,
                    ticketCode: ticket.ticketCode,
                    status: ticket.status,
                },
            });
        }

        ticket.status = "used";
        await ticket.save();

        return res.json({
            valid: true,
            reason: "ok",
            message: "Ticket is valid and has been marked as used.",
            ticket: {
                id: ticket._id,
                eventId: ticket.eventId,
                userId: ticket.user,
                ticketCode: ticket.ticketCode,
                seat: ticket.seat,
                price: ticket.price,
                status: ticket.status,
                createdAt: ticket.createdAt,
            },
        });
    } catch (err) {
        console.error("GET /api/tickets/verify error:", err);
        res.status(500).json({
            valid: false,
            reason: "error",
            message: "Server error",
        });
    }
});

// GET /api/tickets/unlisted
// Query param: userHandle
router.get("/unlisted", async (req, res) => {
    try {
        const userHandle = req.query.userHandle;
        if (!userHandle) return res.status(400).json({ error: "userHandle required" });

        // Find tickets owned by user
        const tickets = await Ticket.find({ user: userHandle, status: "active" }).lean();

        // Find tickets already listed
        const listedTickets = await Listing.find({ seller: userHandle, status: "active" }).select("ticket").lean();
        const listedTicketIds = new Set(listedTickets.map(l => l.ticket.toString()));

        // Filter out tickets already listed
        const unlistedTickets = tickets.filter(t => !listedTicketIds.has(t._id.toString()));

        res.json(unlistedTickets);
    } catch (err) {
        console.error("GET /api/tickets/unlisted error:", err);
        res.status(500).json({ error: "Failed to fetch unlisted tickets" });
    }
});



export default router;
