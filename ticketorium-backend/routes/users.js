// ticketorium-backend/routes/users.js
import express from "express";
import { User } from "../models/User.js";
import {loginUser} from "./auth.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

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

router.get("/all-data", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    console.log("Beck: AuthHeader:", authHeader)
    const token = authHeader.split(" ")[1];
    try {
        console.log("Beck: token from localstorage:", token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Beck: decoded payload:", decoded)
        const userId = decoded.user._id;

        const user = await User.findById(userId).select("-passwordHash");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.log("Error fetching user data:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
});

export default router;
