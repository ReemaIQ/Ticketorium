// ticketorium/ticketorium-backend/routes/auth.js

import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import argon2 from "argon2";

const router = express.Router();

export async function loginUser(username, email, password) {
    try {
        const user = await User.findOne({
            // either username or email matches
            $or : [
                {handle: username},
                {email: email}
            ]
        });
        
        let isCorrectPassword = false;
        if (user)
            isCorrectPassword = await argon2.verify(user.passwordHash, password)

        if (!isCorrectPassword) { // which, if false, also implies user is null (not all the time though!)
            console.log("Bad login info")
            // res.status(401).json({ errMsg: "Invalid username/email or password" });
            throw new Error("Invalid username/email or password");
        }
        else {
            console.log("User fetched:", user);
            return jwt.sign(
                {user: user.toObject()},
                process.env.JWT_SECRET,
                {expiresIn: "12d"}
            )

        }
    }
    catch (err) {
        console.log("Error during login:", err.message);
        res.status(401).json({ errMsg: err.message });
    }
}

router.post("/login", async (req, res) => {
    const payload = req.body;
    console.log("Login payload received:", payload.username, payload.email, payload.password);
    try {
        const token = await loginUser(payload.username, payload.email, payload.password)
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