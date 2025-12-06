// src/api/eventRegistrations.js
import { getApiBaseUrl } from "./client";

/**
 * Fetch all event registrations for a specific user.
 */
export async function fetchUserRegistrations(userId) {
    if (!userId) {
        throw new Error("Missing userId for fetchUserRegistrations");
    }

    const url = `${getApiBaseUrl()}/api/event-registrations?user=${encodeURIComponent(
        userId
    )}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to load event registrations");
    }

    return res.json();
}
