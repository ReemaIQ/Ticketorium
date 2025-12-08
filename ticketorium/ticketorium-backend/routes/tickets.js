// ticketorium/ticketorium-backend/routes/tickets.js

import express from "express";
import crypto from "crypto";

import { Listing } from "../models/Listing.js"
import { Ticket } from "../models/Ticket.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

const router = express.Router();

// UPDATED: Use ObjectId (last 4 chars) for the ticket code
function generateTicketCode(eventObjectId, userHandle) {
    const eventSuffix = String(eventObjectId).slice(-4).toUpperCase();
    const cleanUser = (userHandle || "USER").toUpperCase().slice(0, 6);
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `TKT-E${eventSuffix}-${cleanUser}-${randomPart}`;
}

function generateQrToken() {
    return crypto.randomBytes(8).toString("hex");
}

/**
 * POST /api/tickets
 * Body: { eventId (Mongo ID), userId, seat?, price? }
 */
router.post("/", async (req, res) => {
    try {
        // 'eventId' here receives the Mongo ObjectId string from the frontend
        const { eventId, userId, seat = null, price = 0 } = req.body || {};

        if (!eventId || !userId) {
            return res.status(400).json({
                error: "eventId and userId are required",
            });
        }

        // Find by _id now
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const qrToken = generateQrToken();

        // Pass the actual event._id to the generator
        const ticketCode = generateTicketCode(event._id, user.handle);

        const ticket = await Ticket.create({
            event: event._id,
            user: user._id,
            // Removed numeric eventId
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
 * - userId
 */
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = {};
        if (userId) filter.user = userId;

        const tickets = await Ticket.find(filter)
            // Removed 'eventId' from select
            .populate("event", "title startAt")
            .populate("user", "handle firstName lastName role");

        res.json(tickets);
    } catch (err) {
        console.error("GET /api/tickets error:", err);
        res.status(500).json({ error: "Failed to load tickets" });
    }
});

/**
 * POST /api/tickets/cancel
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

        // Compare using Mongo _id (ticket.event is ObjectId)
        if (eventId && String(ticket.event) !== String(eventId)) {
            return res.json({
                valid: false,
                reason: "wrong-event",
                message: "Ticket belongs to a different event",
                ticket: {
                    id: ticket._id,
                    eventId: ticket.event, // return the ObjectId
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
                    eventId: ticket.event,
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
                eventId: ticket.event,
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
        if (!userHandle) {
            return res.status(400).json({ error: "userHandle required" });
        }

        // Find User by handle to get their Mongo _id
        const user = await User.findOne({ handle: userHandle });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;

        // 1) Find tickets owned by user (using ObjectId) and populate event info
        const tickets = await Ticket.find({
            user: userId,
            status: "active",
        })
            .populate("event", "title startAt") // <-- pull in title + date
            .lean();

        // 2) Graduation-only: keep only tickets whose event title contains "graduation"
        const graduationTickets = tickets.filter((t) => {
            const title = t.event?.title || "";
            return /graduation/i.test(title); // case-insensitive match
        });

        // 3) Find tickets already listed (using ObjectId for seller)
        const listedTickets = await Listing.find({
            seller: userId,
            status: "active",
        })
            .select("ticket")
            .lean();

        const listedTicketIds = new Set(
            listedTickets.map((l) => l.ticket.toString())
        );

        // 4) Filter out tickets already listed, only graduation tickets
        const unlistedTickets = graduationTickets.filter(
            (t) => !listedTicketIds.has(t._id.toString())
        );

        res.json(unlistedTickets);
    } catch (err) {
        console.error("GET /api/tickets/unlisted error:", err);
        res.status(500).json({ error: "Failed to fetch unlisted tickets" });
    }
});


export default router;