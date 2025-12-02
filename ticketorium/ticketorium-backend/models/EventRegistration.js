// ticketorium-backend/models/EventRegistration.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventRegistrationSchema = new Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        invitationSource: {
            type: String,
            enum: ["direct", "organizer", "user-referral", "listing-bid"],
            default: "direct",
        },

        status: {
            type: String,
            enum: [
                "joined",
                "invited",
                "waitlisted",
                "cancelled",
                "cancelled_by_org",
                "no_show",
                "declined",
                "resigned",
            ],
            default: "invited",
            index: true,
        },

        joinedAt: { type: Date },
        cancelledAt: { type: Date },
        noShowMarkedAt: { type: Date },
    },
    { timestamps: true }
);

// Prevent multiple registrations for same event-user pair
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export const EventRegistration = model(
    "EventRegistration",
    eventRegistrationSchema
);
