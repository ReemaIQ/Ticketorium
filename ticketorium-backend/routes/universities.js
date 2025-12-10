// ticketorium-frontend/ticketorium-frontend-backend/routes/universities.js
import express from "express";
import { University } from "../models/University.js";

const router = express.Router();

/**
 * GET /api/universities
 */
router.get("/", async (_req, res) => {
    try {
        const universities = await University.find({}).sort({ name: 1 });
        res.json(universities);
    } catch (err) {
        console.error("GET /api/universities error:", err);
        res.status(500).json({ error: "Failed to load universities" });
    }
});

/**
 * GET /api/universities/:id
 */

router.get("/all", async (req, res) => {
    try {
        const universities = await University.find();
        console.log("Events for university fetched:", universities);
        res.json(universities);
    }
    catch (err) {
        console.error("GET /api/universities/all error:", err);
        res.status(500).json({ error: "Failed to load universities" });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const uni = await University.findById(req.params.id);
        if (!uni) {
            return res.status(404).json({ error: "University not found" });
        }
        res.json(uni);
    } catch (err) {
        console.error("GET /api/universities/:id error:", err);
        res.status(500).json({ error: "Failed to load university" });
    }
});


/**
 * POST /api/universities
 * Body: { code, name, logo, themeColors }
 */
router.post("/", async (req, res) => {
    try {
        const uni = new University({
            code: req.body.code,
            name: req.body.name,
            logo: req.body.logo,
            themeColors: req.body.themeColors,
        });

        const saved = await uni.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("POST /api/universities error:", err);
        res.status(500).json({ error: "Failed to create university" });
    }
});

/**
 * PUT /api/universities/:id
 * Body: { code?, name?, logo?, themeColors? }
 */
router.put("/:id", async (req, res) => {
    try {
        const updates = {
            code: req.body.code,
            name: req.body.name,
            logo: req.body.logo,
            themeColors: req.body.themeColors,
        };

        // Remove undefined fields so you can send partial updates if you want
        Object.keys(updates).forEach(
            (k) => updates[k] === undefined && delete updates[k]
        );

        const updated = await University.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "University not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("PUT /api/universities/:id error:", err);
        res.status(500).json({ error: "Failed to update university" });
    }
});

/**
 * DELETE /api/universities/:id
 */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await University.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "University not found" });
        }
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/universities/:id error:", err);
        res.status(500).json({ error: "Failed to delete university" });
    }
});


export default router;
