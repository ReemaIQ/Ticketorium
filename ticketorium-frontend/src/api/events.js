import { API_BASE } from "./config.js";

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
    const url = `${API_BASE}/api/events${qs ? `?${qs}` : ""}`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (user) {
        try {
            headers["x-user"] = JSON.stringify(user);
        } catch (err) {
            throw new Error("Failed to serialize user for request");
        }
    }

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

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

    const url = `${API_BASE}/api/events/${id}`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

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

    const url = `${API_BASE}/api/events/${id}`;
    const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
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

    const url = `${API_BASE}/api/events/${id}`;
    const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to delete event");
        throw new Error(msg || "Failed to delete event");
    }

    return res.json();
}
