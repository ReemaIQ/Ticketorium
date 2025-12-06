import { API_BASE } from "./config.js";

/**
 * Fetch all event registrations for a specific user.
 */
export async function fetchUserRegistrations(userId) {
    if (!userId) {
        throw new Error("Missing userId for fetchUserRegistrations");
    }

    const url = `${API_BASE}/api/event-registrations?user=${encodeURIComponent(
        userId
    )}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to load event registrations");
    }

    return res.json();
}
