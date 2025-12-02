// ticketorium-backend/models/Event.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { getNextSequence } from "../utils/getNextSequence.js";

const eventSchema = new Schema(
    {
        // External numeric ID (pretty)
        eventId: {
            type: Number,
            unique: true,
            sparse: true,
        },

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

        title: { type: String, required: true },
        description: { type: String },

        img: { type: String },

        startAt: { type: Date, required: true },
        endAt:   { type: Date },

        price: { type: Number, default: 0 },

        state: {
            type: String,
            enum: ["normal", "waitlist", "cancelled"],
            default: "normal",
        },

        hasSeatingPlan: { type: Boolean, default: false },

        capacityTotal:    { type: Number, default: 0 },
        capacityReserved: { type: Number, default: 0 },
        capacityWaitlist: { type: Number, default: 0 },

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

// Removed the duplicate eventId index (already handled by field definition)
// eventSchema.index({ eventId: 1 }, { unique: true, sparse: true });

// Auto-increment eventId on creation
eventSchema.pre("save", async function (next) {
    if (this.eventId != null) return next(); // skip if already set

    try {
        this.eventId = await getNextSequence("eventId");
        next();
    } catch (err) {
        next(err);
    }
});

export const Event = model("Event", eventSchema);
