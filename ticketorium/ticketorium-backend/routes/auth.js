//ticketorium/ticketorium-backend/routes/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// GET /api/auth/me
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "No token provided" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user._id)
            .populate("university");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            user: {
                id: user._id,
                handle: user.handle,
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                university: user.university, // populated object or null
            }
        });
    } catch (err) {
        console.log("ME endpoint error:", err.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
});
