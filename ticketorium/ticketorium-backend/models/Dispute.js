// ticketorium-backend/models/Dispute.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const disputeMessageSchema = new Schema(
    {
        from: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["text", "image", "system"],
            default: "text",
        },
        text: String,
        url: String,
        caption: String,
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

const disputeSchema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: String,

        type: {
            type: String,
            enum: ["event_issue", "ticket_issue", "payment_issue", "account_issue", "other"],
            default: "other",
            index: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["open", "in_review", "resolved", "closed"],
            default: "open",
            index: true,
        },

        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],

        event:  { type: Schema.Types.ObjectId, ref: "Event", default: null },
        ticket: { type: Schema.Types.ObjectId, ref: "Ticket", default: null },
        listing:{ type: Schema.Types.ObjectId, ref: "Listing", default: null },

        messages: [disputeMessageSchema],

        lastActivityAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

disputeSchema.index({ event: 1, status: 1 });

export const Dispute = model("Dispute", disputeSchema);
