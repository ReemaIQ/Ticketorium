// ticketorium/ticketorium-backend/routes/users.js

import express from "express";
import { User } from "../models/User.js";
import {loginUser} from "./auth.js";
import argon2 from "argon2";

const router = express.Router();

/**
 * GET /api/users
 * Optional query:
 *   - role
 *   - university (university ObjectId)
 */
router.get("/email-exists/:email", async (req, res) => {
    const email = req.params.email
    console.log("Checking if email exists:", email);
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            console.log("Email exists in DB");
            res.json({ exists: true });
        }
        else {
            console.log("Email available");
            res.json({ exists: false });
        }
    }
    catch {
        console.log("Error checking email existence");
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/username-exists/:username", async (req, res) => {
    const username = req.params.username
    console.log("Checking if username exists:", username);
    try {
        const user = await User.findOne({ handle: username });
        if (user) {
            console.log("Username exists in DB");
            res.json({ exists: true });
        }
        else {
            console.log("Username available");
            res.json({ exists: false });
        }
    }
    catch {
        console.log("Error checking username existence");
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post("/add", async (req, res) => {
    const payload = req.body;
    console.log("Signup payload received:", payload);

    const hashedPassword = await argon2.hash(payload.password);

    try {
        const newUser = new User({
            handle: payload.username,
            email: payload.email,
            passwordHash: hashedPassword,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phoneNumber,
            university: payload.university,
            role: payload.type,
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth

        });
        await newUser.save()
        
        // now login the user and return token
        console.log("Login payload received:", payload.username, payload.email, payload.password);
        try {
            const token = await loginUser(payload.username, payload.email, payload.password)
            console.log("Login successful, token generated:", token);
            res.json({token});
        } catch (err) {
            res.status(401).json({ errMsg: err.message });
        }
        
    }
    catch (error) {
        console.log("Error creating new user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


export default router;
