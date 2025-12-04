// ticketorium/ticketorium-backend/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import argon2 from "argon2";

const router = express.Router();

// ------------------ LOGIN HELPER ------------------
export async function loginUser(identifier, password) {
    // identifier can be username OR email
    const query = identifier.includes("@")
        ? { email: identifier }
        : { handle: identifier };

    const user = await User.findOne(query).lean();

    if (!user) throw new Error("Invalid username/email or password");

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new Error("Invalid username/email or password");

    // sanitize user
    const { passwordHash, ...safeUser } = user;

    // sign jwt with safe user only
    const token = jwt.sign(
        { user: safeUser },
        process.env.JWT_SECRET,
        { expiresIn: "12d" }
    );

    return token;
}

router.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
    const identifier = username || email;

    try {
        const token = await loginUser(identifier, password);
        console.log("Login successful, token generated:", token);
        res.json({token});
    } catch (err) {
        res.status(401).json({ errMsg: err.message });
    }
})

router.post("/signup", async (req, res) => {

})

router.all("*", (req, res) => {
  res.status(404).json({ message: "Auth Route not found" });
});




export default router;