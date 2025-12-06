// ticketorium-frontend-backend/models/EventStats.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventStatsSchema = new Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            unique: true,
        },

        totalVisitors: { type: Number, default: 0 },
        clickedView:   { type: Number, default: 0 },
        joined:        { type: Number, default: 0 },

        joinedCount:     { type: Number, default: 0 },
        waitlistedCount: { type: Number, default: 0 },
        cancelledCount:  { type: Number, default: 0 },
        noShowCount:     { type: Number, default: 0 },

        genderBreakdown: {
            male:   { type: Number, default: 0 },
            female: { type: Number, default: 0 },
            other:  { type: Number, default: 0 },
        },

        ageGroups: {
            "18_21":   { type: Number, default: 0 },
            "22_25":   { type: Number, default: 0 },
            "26_30":   { type: Number, default: 0 },
            "30_plus": { type: Number, default: 0 },
        },

        universityBreakdown: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

export const EventStats = model("EventStats", eventStatsSchema);
