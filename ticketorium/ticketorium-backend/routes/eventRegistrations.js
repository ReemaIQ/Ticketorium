import express from "express";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { EventRegistration } from "../models/EventRegistration.js";

const router = express.Router();

/**
 * GET /api/event-registrations/event/:eventId
 * eventId is numeric external ID
 */
router.get("/event/:eventId", async (req, res) => {
    try {
        const numericId = Number(req.params.eventId);
        const event = await Event.findOne({ eventId: numericId });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const regs = await EventRegistration.find({ event: event._id })
            .populate("user", "handle firstName lastName role")
            .populate("invitedBy", "handle firstName lastName role")
            .sort({ createdAt: -1 });

        res.json(regs);
    } catch (err) {
        console.error("GET /api/event-registrations/event/:eventId error:", err);
        res.status(500).json({ error: "Failed to load registrations" });
    }
});

/**
 * POST /api/event-registrations/join
 * Body: { eventId (numeric), userId, invitedById? }
 */
router.post("/join", async (req, res) => {
    try {
        const { eventId, userId, invitedById } = req.body || {};
        if (!eventId || !userId) {
            return res
                .status(400)
                .json({ error: "eventId and userId are required" });
        }

        const event = await Event.findOne({ eventId: Number(eventId) });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let invitedBy = null;
        if (invitedById) {
            invitedBy = await User.findById(invitedById);
        }

        // upsert style: if exists, update; else create
        let reg = await EventRegistration.findOne({
            event: event._id,
            user: user._id,
        });

        if (!reg) {
            reg = new EventRegistration({
                event: event._id,
                user: user._id,
            });
        }

        reg.status = "joined";
        reg.joinedAt = new Date();
        if (invitedBy) {
            reg.invitedBy = invitedBy._id;
            reg.invitationSource = "user-referral";
        } else {
            reg.invitationSource = "direct";
        }

        await reg.save();

        res.status(201).json(reg);
    } catch (err) {
        console.error("POST /api/event-registrations/join error:", err);
        res.status(500).json({ error: "Failed to join event" });
    }
});

export default router;
