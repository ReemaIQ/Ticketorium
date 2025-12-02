import express from "express";
import { Event } from "../models/Event.js";
import { EventRegistration } from "../models/EventRegistration.js";


const router = express.Router();

/**
 * GET /api/events
 * Query:
 *   - university (university ObjectId)
 *   - state (normal, waitlist, cancelled…)
 */
router.get("/", async (req, res) => {
    try {
        const { university, state } = req.query;
        const filter = {};
        if (university) filter.university = university;
        if (state) filter.state = state;

        const events = await Event.find(filter)
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role")
            .sort({ startAt: 1 });

        res.json(events);
    } catch (err) {
        console.error("GET /api/events error:", err);
        res.status(500).json({ error: "Failed to load events" });
    }
});

// router.get("/joined/:uniId", async (req, res) => {
//     try {
//         const eventsJoined = await EventRegistration.find().sort({startAt: 1});
//         const events = await Event.find({university: req.params.uniId})
//         console.log("Joined events for user fetched:", eventsJoined);
//         res.json(eventsJoined);
//     }
//     catch (err) {
//         console.error("GET /api/events/joined/:userId error:", err);
//         res.status(500).json({ error: "Failed to load joined events for user" });
//     }
// })

/**
 * GET /api/events/:id (Mongo _id)
 */
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        console.error("GET /api/events/:id error:", err);
        res.status(500).json({ error: "Failed to load event" });
    }
});

/**
 * GET /api/events/by-event-id/:eventId
 * eventId = numeric external ID you seeded (1..9)
 */
router.get("/by-event-id/:eventId", async (req, res) => {
    try {
        const event = await Event.findOne({
            eventId: Number(req.params.eventId),
        })
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        console.error("GET /api/events/by-event-id error:", err);
        res.status(500).json({ error: "Failed to load event" });
    }
});

router.get("/uni-all/:universityId", async (req, res) => {
    try {
        const events = await Event.find({university: req.params.universityId}).select("eventId title description startAt price state organizer img visibility").sort({startAt: 1});
        console.log("Events for university fetched:", events);
        res.json(events);
    }
    catch (err) {
        console.error("GET /api/events/uni-all/:universityId error:", err);
        res.status(500).json({ error: "Failed to load events for university" });
    }
})
export default router;
