// ticketorium-frontend-backend/models/University.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const themeColorsSchema = new Schema(
    {
        primaryColor: String,
        secondaryColor: String,
        accentColor: String,
        secondaryAccentColor: String,
        filterButtons: String,
        warningColor: String,
        successColor: String,
        footerColor: String,
        disputeChat: String,
    },
    { _id: false }
);

const universitySchema = new Schema(
    {
        code: { type: String, required: true, unique: true }, // "KFUPM", "Harvard"...
        name: { type: String, required: true },
        logo: { type: String }, // "kfupm.png"
        themeColors: themeColorsSchema,
    },
    { timestamps: true }
);

export const University = model("University", universitySchema);
