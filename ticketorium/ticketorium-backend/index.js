// ticketorium-backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./database.js";

// Routers
import universitiesRouter from "./routes/universities.js";
import usersRouter from "./routes/users.js";
import eventsRouter from "./routes/events.js";
import eventRegistrationsRouter from "./routes/eventRegistrations.js";
import analyticsRouter from "./routes/analytics.js";
import ticketsRouter from "./routes/tickets.js";
import listingsRouter from "./routes/listings.js";
import disputesRouter from "./routes/disputes.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (before DB is fine)
app.get("/", (_req, res) => {
    res.send("Ticketorium backend is running");
});

// Start server inside async function
async function start() {
    try {
        await connectDB(process.env.MONGO_URL);

        // Mount routers
        app.use("/api/universities", universitiesRouter);
        app.use("/api/users", usersRouter);
        app.use("/api/events", eventsRouter);
        app.use("/api/event-registrations", eventRegistrationsRouter);
        app.use("/api/analytics", analyticsRouter);
        app.use("/api/tickets", ticketsRouter);
        app.use("/api/listings", listingsRouter);
        app.use("/api/disputes", disputesRouter);
        app.use("/api/notifications", notificationsRouter);

        // 404 fallback
        app.use((req, res) => {
            res.status(404).json({ error: "Not found" });
        });

        // Error handler
        app.use((err, _req, res, _next) => {
            console.error("Unhandled error:", err);
            res.status(500).json({ error: "Internal server error" });
        });

        app.listen(PORT, () => {
            console.log(`Ticketorium API running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();
