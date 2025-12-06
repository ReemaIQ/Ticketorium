// ticketorium-frontend-backend/models/Notification.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        template: {
            type: Schema.Types.ObjectId,
            ref: "NotificationTemplate",
            required: true,
        },

        data: {
            type: Schema.Types.Mixed,
            default: {},
        },

        channels: {
            badge: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
        },

        seen:  { type: Boolean, default: false },
        readAt:{ type: Date },
    },
    { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = model("Notification", notificationSchema);
