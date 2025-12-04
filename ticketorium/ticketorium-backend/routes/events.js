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

/* GET ALL EVENTS - accepts user object from client (no middleware required) */
router.get("/", async (req, res) => {
    try {
        // First prefer any existing req.user (if present)
        let user = req.user || null;

        // If not present, try to read user from a custom header 'x-user' (JSON string)
        if (!user) {
            const userHeader = req.headers["x-user"];
            if (userHeader) {
                try {
                    user = JSON.parse(userHeader);
                } catch (err) {
                    return res.status(400).json({ error: "Invalid x-user header JSON" });
                }
            }
        }

        // If still no user, we can't scope events
        if (!user) {
            return res
                .status(400)
                .json({ error: "Missing user information. Pass user in 'x-user' header." });
        }

        // Extract university id from user object.
        // Acceptable shapes:
        //  - user.university is a string ObjectId
        //  - user.university is an object with _id
        //  - user.universityId
        let userUniversityId = null;
        if (user.university) {
            userUniversityId =
                typeof user.university === "string"
                    ? user.university
                    : user.university._id || null;
        } else if (user.universityId) {
            userUniversityId = user.universityId;
        } else if (user.univ) {
            userUniversityId = user.univ;
        }

        if (!userUniversityId) {
            return res
                .status(400)
                .json({ error: "User object missing university id (user.university/_id/universityId)" });
        }

        // Build filter: always scope to the user's university
        const { state } = req.query;
        const filter = { university: userUniversityId };
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