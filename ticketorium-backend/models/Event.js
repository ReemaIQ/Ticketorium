// ticketorium-frontend-backend/models/Event.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema(
    {
        // Removed custom numeric eventId. relying on default _id

        university: {
            type: Schema.Types.ObjectId,
            ref: "University",
            required: true,
        },

        organizer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },

        img: { type: String },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        // Timing
        startAt: { type: Date, required: true },
        endAt:   { type: Date },

        // Pricing
        price: {
            type: Number,
            default: 0,
            min: 0,
        },

        state: {
            type: String,
            enum: ["undefined", "waitlist", "cancelled"],
            default: "undefined",
        },

        type: {
            type: String,
            enum: ["Indoor", "Outdoor", "Hybrid"],
            default: "Indoor",
        },

        hasSeatingPlan: { type: Boolean, default: false },

        capacityTotal: {
            type: Number,
            default: 0,
            min: 0,
        },
        capacityReserved: {
            type: Number,
            default: 0,
            min: 0,
        },
        capacityWaitlist: {
            type: Number,
            default: 0,
            min: 0,
        },

        visibility: {
            type: String,
            enum: ["public", "university-only"],
            default: "public",
        },
    },
    { timestamps: true }
);

// Useful compound indexes
eventSchema.index({ university: 1, startAt: 1 });

export const Event = model("Event", eventSchema);