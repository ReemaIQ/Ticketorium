// ticketorium-backend/models/Bid.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bidSchema = new Schema(
    {
        listing: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
            index: true,
        },

        bidder: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: { type: Number, required: true },

        isWinningBid: { type: Boolean, default: false },

        // whether this bid is still valid
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

bidSchema.index({ listing: 1, amount: -1 });

export const Bid = model("Bid", bidSchema);
