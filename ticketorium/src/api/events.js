// src/api/events.js
import { getApiBaseUrl } from "./client";

/**
 * Fetch all events (optionally filtered)
 */
export async function fetchEvents(params = {}) {
    const search = new URLSearchParams();

    if (params.university) {
        // Mongo ObjectId of university (if you ever use it)
        search.set("university", params.university);
    }
    if (params.universityCode) {
        // e.g. "KFUPM", "Harvard"
        search.set("universityCode", params.universityCode);
    }
    if (params.state) {
        search.set("state", params.state);
    }

    const qs = search.toString();
    const url = `${getApiBaseUrl()}/api/events${qs ? `?${qs}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to load events");
    }
    return res.json();
}

/**
 * Fetch a single event by Mongo _id.
 */
export async function fetchEventById(id) {
    if (!id) throw new Error("Missing event id");
    const url = `${getApiBaseUrl()}/api/events/${id}`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (!res.ok) {
        throw new Error("Failed to load event");
    }
    return res.json();
}

/**
 * Update an event.
 */
export async function updateEvent(id, updates) {
    if (!id) throw new Error("Missing event id");
    const url = `${getApiBaseUrl()}/api/events/${id}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to update event");
        throw new Error(msg || "Failed to update event");
    }

    return res.json();
}

/**
 * Delete event.
 */
export async function deleteEvent(id) {
    if (!id) throw new Error("Missing event id");
    const url = `${getApiBaseUrl()}/api/events/${id}`;
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to delete event");
        throw new Error(msg || "Failed to delete event");
    }

    return res.json();
}
