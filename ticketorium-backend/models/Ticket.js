// ticketorium-frontend-backend/models/Ticket.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
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

        // REMOVED: eventId (numeric) to fix inconsistency. 
        // We now rely on 'event' (ObjectId) above.
        
        // Optional: You can keep userCode if you have a system for it, 
        // but if it was part of the numeric ID system, you might want to remove it too.
        // userCode: { type: Number }, 

        ticketCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        qrToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        qrData: { type: String, required: true },

        seat: { type: String }, // e.g. "A1", "Row 3 Seat 5" or null/undefined

        price: { type: Number, default: 0 },

        status: {
            type: String,
            // Kept your specific enums here
            enum: ["active", "used", "cancelled", "refunded"], 
            default: "active",
            index: true,
        },

        usedAt: { type: Date },
        cancelledAt: { type: Date },
    },
    { timestamps: true }
);

export const Ticket = model("Ticket", ticketSchema);