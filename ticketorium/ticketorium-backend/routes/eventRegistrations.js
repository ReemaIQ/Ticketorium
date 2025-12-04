// ticketorium-backend/routes/eventRegistrations.js
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

        const regs = await EventRegistration.find({ user: user._id})
            .populate({
                path: "event",
                populate: [
                    { path: "university", select: "code name logo" },
                    { path: "organizer", select: "handle firstName lastName role" }
                ]
            })
            .sort({ joinedAt: -1 });

        res.json(regs);
    } catch (err) {
        console.error("GET /api/event-registrations error:", err);
        res.status(500).json({ error: "Failed to load registrations" });
    }
});


export default router;
