// ticketorium-frontend-backend/models/User.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        handle: { type: String, unique: true, sparse: true }, // "visitor", "student", etc.

        firstName: { type: String, required: true },
        lastName:  { type: String, required: true },

        email: { type: String, required: true, unique: true, index: true },
        phone: { type: String },

        // For now: store plain text from dummy; later replace with real hash
        passwordHash: { type: String, required: true },

        role: {
            type: String,
            enum: ["visitor", "student", "organizer", "admin", "system-admin"],
            required: true,
        },

        university: {
            type: Schema.Types.ObjectId,
            ref: "University",
            default: null,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        dateOfBirth: { type: Date },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
