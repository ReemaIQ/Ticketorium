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

export default router;
