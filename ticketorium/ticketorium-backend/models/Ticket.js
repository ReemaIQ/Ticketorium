// ticketorium-backend/models/Ticket.js
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

        // denormalized fields for pretty codes
        eventId: { type: Number },
        userCode: { type: Number }, // optional later

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

        seat: { type: String },

        price: { type: Number, default: 0 },

        status: {
            type: String,
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
