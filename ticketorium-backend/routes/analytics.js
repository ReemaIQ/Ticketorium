// ticketorium-frontend/ticketorium-frontend-backend/routes/analytics.js
import express from "express";
import { Event } from "../models/Event.js";
import { EventStats } from "../models/EventStats.js";

const router = express.Router();

/**
 * GET /api/analytics/events/:id
 * Use Mongo _id
 */
router.get("/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const stats = await EventStats.findOne({ event: event._id });

        if (!stats) {
            // Safe default for OrganizerAnalytics props
            return res.json({
                totals: {
                    totalEvents: 1,
                    upcomingEvents: 1,
                    totalAttendees: 0,
                    averageConversion: 0,
                },
                attendance: {
                    joined: 0,
                    waitlisted: 0,
                    cancelled: 0,
                    noShow: 0,
                },
                funnel: {
                    totalVisitors: 0,
                    clickedView: 0,
                    joined: 0,
                },
                audience: {
                    gender: { male: 0, female: 0 },
                    ageGroups: { "18-21": 0, "22-25": 0, "26-30": 0, "30+": 0 },
                    universities: { kfupm: 0, harvard: 0, other: 0 },
                },
            });
        }

        const totals = {
            totalEvents: 1,
            upcomingEvents: 1,
            totalAttendees: stats.joinedCount,
            averageConversion:
                stats.totalVisitors > 0
                    ? stats.joined / stats.totalVisitors
                    : 0,
        };

        const attendance = {
            joined: stats.joinedCount,
            waitlisted: stats.waitlistedCount,
            cancelled: stats.cancelledCount,
            noShow: stats.noShowCount,
        };

        const funnel = {
            totalVisitors: stats.totalVisitors,
            clickedView: stats.clickedView,
            joined: stats.joined,
        };

        const audience = {
            gender: stats.genderBreakdown,
            ageGroups: stats.ageGroups,
            universities: stats.universityBreakdown,
        };

        res.json({ totals, attendance, funnel, audience });
    } catch (err) {
        console.error("GET /api/analytics/events/:id error:", err);
        res.status(500).json({ error: "Failed to load analytics" });
    }
});

export default router;