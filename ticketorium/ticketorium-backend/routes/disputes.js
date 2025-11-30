import express from "express";
import { Dispute } from "../models/Dispute.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { Ticket } from "../models/Ticket.js";

const router = express.Router();

/**
 * GET /api/disputes
 * Optional query:
 *   - userId (participant)
 *   - status
 */
router.get("/", async (req, res) => {
    try {
        const { userId, status } = req.query;
        const filter = {};
        if (userId) filter.participants = userId;
        if (status) filter.status = status;

        const disputes = await Dispute.find(filter)
            .populate("createdBy", "handle firstName lastName role")
            .populate("participants", "handle firstName lastName role")
            .populate("event", "eventId title")
            .populate("ticket", "ticketCode seat")
            .populate("messages.from", "handle firstName lastName role")
            .sort({ lastActivityAt: -1 });

        res.json(disputes);
    } catch (err) {
        console.error("GET /api/disputes error:", err);
        res.status(500).json({ error: "Failed to load disputes" });
    }
});

/**
 * GET /api/disputes/:id
 */
router.get("/:id", async (req, res) => {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate("createdBy", "handle firstName lastName role")
            .populate("participants", "handle firstName lastName role")
            .populate("event", "eventId title")
            .populate("ticket", "ticketCode seat")
            .populate("messages.from", "handle firstName lastName role");

        if (!dispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        res.json(dispute);
    } catch (err) {
        console.error("GET /api/disputes/:id error:", err);
        res.status(500).json({ error: "Failed to load dispute" });
    }
});

/**
 * POST /api/disputes
 * Body: { title, subtitle?, type, createdById, participantIds?, eventId?, ticketId? }
 */
router.post("/", async (req, res) => {
    try {
        const {
            title,
            subtitle,
            type = "other",
            createdById,
            participantIds = [],
            eventId,
            ticketId,
        } = req.body || {};

        if (!title || !createdById) {
            return res
                .status(400)
                .json({ error: "title and createdById are required" });
        }

        const creator = await User.findById(createdById);
        if (!creator) {
            return res.status(404).json({ error: "Creator user not found" });
        }

        let event = null;
        if (eventId) {
            // eventId can be Mongo _id or numeric eventId; we try both.
            event =
                (await Event.findById(eventId)) ||
                (await Event.findOne({ eventId: Number(eventId) }));
        }

        let ticket = null;
        if (ticketId) {
            ticket = await Ticket.findById(ticketId);
        }

        const uniqueParticipants = Array.from(
            new Set([createdById, ...participantIds])
        );

        const dispute = await Dispute.create({
            title,
            subtitle,
            type,
            createdBy: creator._id,
            status: "open",
            participants: uniqueParticipants,
            event: event ? event._id : null,
            ticket: ticket ? ticket._id : null,
            messages: [],
            lastActivityAt: new Date(),
        });

        res.status(201).json(dispute);
    } catch (err) {
        console.error("POST /api/disputes error:", err);
        res.status(500).json({ error: "Failed to create dispute" });
    }
});

/**
 * POST /api/disputes/:id/messages
 * Body: { fromId, type, text?, url?, caption? }
 */
router.post("/:id/messages", async (req, res) => {
    try {
        const { fromId, type = "text", text, url, caption } = req.body || {};
        if (!fromId) {
            return res.status(400).json({ error: "fromId is required" });
        }

        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        const user = await User.findById(fromId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        dispute.messages.push({
            from: user._id,
            type,
            text,
            url,
            caption,
            createdAt: new Date(),
        });
        dispute.lastActivityAt = new Date();

        await dispute.save();

        res.status(201).json(dispute);
    } catch (err) {
        console.error("POST /api/disputes/:id/messages error:", err);
        res.status(500).json({ error: "Failed to add message" });
    }
});

/**
 * PATCH /api/disputes/:id/status
 * Body: { status } // open, in_review, resolved, closed, etc.
 */
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!status) {
            return res.status(400).json({ error: "status is required" });
        }

        const dispute = await Dispute.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!dispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        res.json(dispute);
    } catch (err) {
        console.error("PATCH /api/disputes/:id/status error:", err);
        res.status(500).json({ error: "Failed to update dispute status" });
    }
});

export default router;
