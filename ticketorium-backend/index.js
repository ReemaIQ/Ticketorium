import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// DB
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

// ---------- Middlewares ----------
app.use(
    cors({
        origin: true, // reflect request origin (local or Vercel)
        credentials: true,
    })
);
app.options("*", cors());

app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple health check
app.get("/health", (_req, res) => {
    res.send("Ticketorium backend is running");
});

// Stripe checkout example
app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "sar",
                        product_data: {
                            name: "Best Event Ever",
                            description: "Don't miss it",
                        },
                        unit_amount: 50 * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: process.env.BASE_URL + "/complete",
            cancel_url: process.env.BASE_URL + "/cancel",
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("Stripe error:", err);
        next(err);
    }
});

// ---------- Start server + mount routes ----------
async function start() {
    try {
        await connectDB(process.env.MONGO_URL);

        // API routes
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

        // 404 fallback for unknown API routes
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

export default app;
