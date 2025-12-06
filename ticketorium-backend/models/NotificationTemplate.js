// ticketorium-frontend-backend/models/NotificationTemplate.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationTemplateSchema = new Schema(
    {
        key: { type: String, required: true, unique: true }, // "event_join_success"

        category: {
            type: String,
            enum: ["event", "bidding", "listing", "dispute", "organizer_event", "account"],
            required: true,
        },

        titleTemplate: { type: String, required: true },
        bodyTemplate:  { type: String, required: true },

        roles: [
            {
                type: String,
                enum: ["visitor", "student", "organizer", "admin", "system-admin"],
            },
        ],

        channels: {
            badge: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

export const NotificationTemplate = model(
    "NotificationTemplate",
    notificationTemplateSchema
);
