// ticketorium-backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
import auth from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.options("*", cors()); // <= this makes OPTIONS (preflight) succeed

app.use(express.json());

// Health check (before DB is fine)
app.get("/", (_req, res) => {
    res.send("Ticketorium backend is running");
});

app.post('/checkout', async (req, res) => {
    console.log("HERE")
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "sar",
                    product_data: {
                        name: "Best Event Ever",
                        description: "Don't miss it"
                    },
                    unit_amount: 50 * 100
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: process.env.BASE_URL + "/complete",
        cancel_url: process.env.BASE_URL + "/cancel"
    })
    console.log(session)
    res.json({url: session.url})
})

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
        app.use("/api/auth", auth);

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
