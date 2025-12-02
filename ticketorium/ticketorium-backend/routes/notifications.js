import express from "express";
import { NotificationTemplate } from "../models/NotificationTemplate.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

const router = express.Router();

/**
 * GET /api/notifications/templates
 * Optional query:
 *   - category
 */
router.get("/templates", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};
        if (category) filter.category = category;

        const templates = await NotificationTemplate.find(filter).sort({
            category: 1,
            key: 1,
        });

        res.json(templates);
    } catch (err) {
        console.error("GET /api/notifications/templates error:", err);
        res.status(500).json({ error: "Failed to load notification templates" });
    }
});

/**
 * GET /api/notifications
 * Query:
 *   - userId (required)
 */
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res
                .status(400)
                .json({ error: "userId query param is required" });
        }

        const notifications = await Notification.find({ user: userId })
            .populate("template")
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (err) {
        console.error("GET /api/notifications error:", err);
        res.status(500).json({ error: "Failed to load notifications" });
    }
});

/**
 * POST /api/notifications
 * Body: { userId, templateKey, data? }
 */
router.post("/", async (req, res) => {
    try {
        const { userId, templateKey, data = {} } = req.body || {};
        if (!userId || !templateKey) {
            return res
                .status(400)
                .json({ error: "userId and templateKey are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const template = await NotificationTemplate.findOne({
            key: templateKey,
        });
        if (!template) {
            return res
                .status(404)
                .json({ error: "Notification template not found" });
        }

        const notif = await Notification.create({
            user: user._id,
            template: template._id,
            data,
            channels: template.channels,
            seen: false,
        });

        res.status(201).json(notif);
    } catch (err) {
        console.error("POST /api/notifications error:", err);
        res.status(500).json({ error: "Failed to create notification" });
    }
});

/**
 * PATCH /api/notifications/:id/seen
 * Body: { seen: boolean }
 */
router.patch("/:id/seen", async (req, res) => {
    try {
        const { seen = true } = req.body || {};
        const update = { seen };
        if (seen) {
            update.readAt = new Date();
        }

        const notif = await Notification.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        if (!notif) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.json(notif);
    } catch (err) {
        console.error("PATCH /api/notifications/:id/seen error:", err);
        res.status(500).json({ error: "Failed to update notification" });
    }
});

export default router;
