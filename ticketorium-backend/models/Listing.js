// ticketorium-frontend-backend/models/Listing.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const topBidSchema = new Schema(
    {
        bidder: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        placedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false } // embedded, no separate id needed
);

const listingSchema = new Schema(
    {
        ticket: {
            type: Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
            index: true,
        },

        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: { type: String, required: true },

        startingPrice: { type: Number, required: true },

        // current "best" price (usually topBids[0].amount)
        currentPrice: { type: Number, required: true },

        status: {
            type: String,
            enum: ["active", "expired", "awaiting_payment"],
            default: "active",
            index: true,
        },

        expiresAt: { type: Date },

        // keep snapshot of highest 3 bids
        topBids: {
            type: [topBidSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const Listing = model("Listing", listingSchema);
