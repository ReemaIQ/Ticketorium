import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

/**
 * GET /api/users
 * Optional query:
 *   - role
 *   - university (university ObjectId)
 */
router.get("/", async (req, res) => {
    try {
        const { role, university } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (university) filter.university = university;

        const users = await User.find(filter)
            .populate("university", "code name")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        console.error("GET /api/users error:", err);
        res.status(500).json({ error: "Failed to load users" });
    }
});

/**
 * GET /api/users/:id
 */
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "university",
            "code name"
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("GET /api/users/:id error:", err);
        res.status(500).json({ error: "Failed to load user" });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier = email or handle

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { handle: identifier }]
        });

        if (!user) return res.status(400).json({ error: 'User not found' });

        if (user.passwordHash !== password) return res.status(400).json({ error: 'Incorrect password' });

        res.json(user.toObject());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
