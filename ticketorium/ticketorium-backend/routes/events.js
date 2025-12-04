// ticketorium-backend/routes/events.js
import express from "express";
import multer from "multer";
import path from "node:path";
import { Event } from "../models/Event.js";

const router = express.Router();

/* Multer storage for image uploads */
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, "uploads/events");
    },
    filename: function (_, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    },
});

const upload = multer({ storage });

/* CREATE EVENT */
router.post("/", upload.single("img"), async (req, res) => {
    try {
        const {
            title,
            description,
            startAt,
            endAt,
            price,
            hasSeatingPlan,
            capacityTotal,
            capacityReserved,
            capacityWaitlist,
            organizer,
            university,
            state,
            location,
            type,
        } = req.body;

        if (!title || !startAt || !organizer || !university) {
            return res.status(400).json({
                error: "Missing required fields (title, startAt, organizer, university)",
            });
        }

        const startDate = new Date(startAt);
        if (Number.isNaN(startDate.getTime())) {
            return res.status(400).json({ error: "Invalid start date" });
        }

        let endDate = null;
        if (endAt) {
            const ed = new Date(endAt);
            if (!Number.isNaN(ed.getTime())) endDate = ed;
        }

        let imgUrl = null;
        if (req.file) {
            imgUrl = `/uploads/events/${req.file.filename}`;
        }

        const event = await Event.create({
            title,
            description,
            img: imgUrl,
            startAt: startDate,
            endAt: endDate,
            price: price ? Number(price) : 0,
            state: state || "normal",
            hasSeatingPlan: hasSeatingPlan === "true" || hasSeatingPlan === true,
            capacityTotal: Number(capacityTotal) || 0,
            capacityReserved: Number(capacityReserved) || 0,
            capacityWaitlist: Number(capacityWaitlist) || 0,
            organizer,
            university,
            location: (location || "").trim(),
            type: type || "Indoor",
            visibility: "public",
        });

        res.status(201).json(event);
    } catch (err) {
        console.error("POST /api/events error:", err);
        res.status(500).json({ error: "Failed to create event" });
    }
});

/* GET ALL EVENTS */
router.get("/", async (req, res) => {
    try {
        const { university, universityCode, state } = req.query;

        const filter = {};
        if (university) filter.university = university; // Mongo ObjectId string
        if (state) filter.state = state;

        let events = await Event.find(filter)
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role")
            .sort({ startAt: 1 });

        // Extra filtering by university code (e.g. "KFUPM", "Harvard")
        if (universityCode) {
            events = events.filter(
                (ev) =>
                    ev.university &&
                    ev.university.code &&
                    ev.university.code === universityCode
            );
        }

        res.json(events);
    } catch (err) {
        console.error("GET /api/events error:", err);
        res.status(500).json({ error: "Failed to load events" });
    }
});


/* GET EVENT BY MONGO _id */
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role");

        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (err) {
        console.error("GET /api/events/:id error:", err);
        res.status(500).json({ error: "Failed to load event" });
    }
});

/* UPDATE EVENT */
router.put("/:id", async (req, res) => {
    try {
        const update = {};
        const fields = [
            "title",
            "description",
            "location",
            "type",
            "img",
            "state",
        ];

        fields.forEach((f) => {
            if (req.body[f] !== undefined) update[f] = req.body[f];
        });

        if (req.body.price !== undefined) {
            update.price = Number(req.body.price) || 0;
        }

        if (req.body.hasSeatingPlan !== undefined) {
            update.hasSeatingPlan =
                req.body.hasSeatingPlan === "true" ||
                req.body.hasSeatingPlan === true;
        }

        ["capacityTotal", "capacityReserved", "capacityWaitlist"].forEach(
            (f) => {
                if (req.body[f] !== undefined)
                    update[f] = Number(req.body[f]) || 0;
            }
        );

        if (req.body.startAt) {
            const d = new Date(req.body.startAt);
            if (!Number.isNaN(d.getTime())) update.startAt = d;
        }

        if (req.body.endAt) {
            const d = new Date(req.body.endAt);
            if (!Number.isNaN(d.getTime())) update.endAt = d;
        }

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        )
            .populate("university", "code name logo")
            .populate("organizer", "handle firstName lastName role");

        if (!updated) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("PUT /api/events/:id error:", err);
        res.status(500).json({ error: "Failed to update event" });
    }
});

/* DELETE EVENT */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Event not found" });
        res.json({ success: true, id: req.params.id });
    } catch (err) {
        console.error("DELETE /api/events/:id error:", err);
        res.status(500).json({ error: "Failed to delete event" });
    }
});

export default router;