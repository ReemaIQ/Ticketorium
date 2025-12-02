// ticketorium-backend/utils/getNextSequence.js
import { Counter } from "../models/Counter.js";

export async function getNextSequence(name) {
    const doc = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return doc.seq;
}
