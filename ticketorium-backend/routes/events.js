// ticketorium-frontend-backend/routes/events.js
import express from "express";
import multer from "multer";
import path from "node:path";
import { Event } from "../models/Event.js";
import { EventRegistration } from "../models/EventRegistration.js";


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


/* GET ALL EVENTS - accepts user object OR university object from client (no middleware required) */
router.get("/", async (req, res) => {
    try {
        // 1) Try req.user first (if you ever set it via middleware)
        let user = req.user || null;
        let universityPayload = null;

        // 2) Optionally, get user from 'x-user' header
        if (!user) {
            const userHeader = req.headers["x-user"];
            if (userHeader) {
                try {
                    user = JSON.parse(userHeader);
                } catch (err) {
                    return res
                        .status(400)
                        .json({ error: "Invalid x-user header JSON" });
                }
            }
        }

        // 3) New: try to read explicit university object from 'x-university' header
        const uniHeader = req.headers["x-university"];
        if (uniHeader) {
            try {
                universityPayload = JSON.parse(uniHeader);
            } catch (err) {
                return res
                    .status(400)
                    .json({ error: "Invalid x-university header JSON" });
            }
        }

        // Helper: extract an ObjectId-like string from a user or university-shaped object
        const extractUniversityId = (src) => {
            if (!src) return null;

            // Direct id string
            if (typeof src === "string") return src;

            // src._id
            if (src._id && typeof src._id === "string") return src._id;

            // src.id
            if (src.id && typeof src.id === "string") return src.id;

            // src.university (could be string or object)
            if (src.university) {
                if (typeof src.university === "string") return src.university;
                if (
                    src.university._id &&
                    typeof src.university._id === "string"
                )
                    return src.university._id;
            }

            // src.universityId
            if (src.universityId && typeof src.universityId === "string") {
                return src.universityId;
            }

            return null;
        };

        // 4) Decide which source we use for the university ID:
        //    - Prefer explicit universityPayload (x-university) if provided
        //    - Otherwise fall back to the user object (req.user / x-user)
        let universityId = extractUniversityId(universityPayload);
        if (!universityId) {
            universityId = extractUniversityId(user);
        }

        if (!universityId) {
            return res.status(400).json({
                error:
                    "Missing university information. Provide a user (x-user) or university (x-university) with a valid id.",
            });
        }

        // 5) Build filter: always scope to the university
        const { state } = req.query;
        const filter = { university: universityId };
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