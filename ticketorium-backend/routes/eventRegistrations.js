// ticketorium-frontend-backend/routes/eventRegistrations.js
import express from "express";
import mongoose from "mongoose";

import { EventRegistration } from "../models/EventRegistration.js";
const router = express.Router();

/* -------------------------------------
   GET REGISTRATIONS FOR A USER
   /api/event-registrations?user=<userId>
-------------------------------------- */
router.get("/", async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({ error: "Missing ?user=<userId>" });
        }

        // user is a string ObjectId from the query
        if (!mongoose.isValidObjectId(user)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const regs = await EventRegistration.find({ user })
            .populate({
                path: "event",
                populate: [
                    { path: "university", select: "code name logo" },
                    { path: "organizer", select: "handle firstName lastName role" },
                ],
            })
            .populate("invitedBy", "handle firstName lastName") // useful for "invited by"
            .sort({ joinedAt: -1 });

        res.json(regs);
    } catch (err) {
        console.error("GET /api/event-registrations error:", err);
        res.status(500).json({ error: "Failed to load registrations" });
    }
});

/* -------------------------------------
   GET ALL EVENT REGISTRATIONS
   /api/event-registrations/all
-------------------------------------- */
router.get("/all", async (_req, res) => {
    try {
        const regs = await EventRegistration.find()
            .populate({
                path: "event",
                populate: [
                    { path: "university", select: "code name logo" },
                    { path: "organizer", select: "handle firstName lastName role" },
                ],
            })
            .populate("user", "handle firstName lastName email")
            .sort({ joinedAt: -1 });

        res.json(regs);
    } catch (err) {
        console.error("GET /api/event-registrations/all error:", err);
        res.status(500).json({ error: "Failed to load event registrations" });
    }
});

export default router;
