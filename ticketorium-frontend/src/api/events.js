// src/api/events.js
import { getApiBaseUrl } from "./client";

/**
 * Fetch all events. The client passes a user object (no auth middleware required).
 *
 * params: { state?: "normal"|"waitlist"|"cancelled" }
 * user: { university: "<universityObjectId>" } or { university: { _id: "..." } } or { universityId: "..." }
 */
export async function fetchEvents(params = {}, user) {
    const search = new URLSearchParams();
    if (params.state) search.set("state", params.state);

    const qs = search.toString();
    const url = `${getApiBaseUrl()}/api/events${qs ? `?${qs}` : ""}`;

    const headers = {};
    if (user) {
        try {
            headers["x-user"] = JSON.stringify(user);
        } catch (err) {
            throw new Error("Failed to serialize user for request");
        }
    }

    const res = await fetch(url, { headers });
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
    const res = await fetch(url); // no credentials

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
 * Delete an event.
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
