// ticketorium-frontend-backend/database.js
import mongoose from "mongoose";

export async function connectDB(url) {
    if (!url) {
        throw new Error("MONGO_URL is not defined");
    }

    // Optional, but usually nice
    mongoose.set("strictQuery", true);

    await mongoose.connect(url);
    console.log("[DB] Mongo connected");
}
