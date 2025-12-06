// src/api/tickets.js
import { getApiBaseUrl } from "./client";

const BASE_URL = `${getApiBaseUrl()}/api/tickets`;

/**
 * Create a ticket for (eventId, userId).
 * Used by JoinModal when a user joins an event.
 */
export async function createTicket({ eventId, userId, seat = null, price = 0 }) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId, seat, price }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create ticket: ${res.status} ${text}`);
    }

    return res.json();
}

/**
 * Fetch the latest NON-CANCELLED ticket for this user+event.
 *
 * NOTE: This assumes the backend has been updated to support:
 * GET /api/tickets?event={eventId}&user={userId}&status=active
 * (Highly Recommended for performance)
 */
export async function fetchTicketForEvent({ eventId, user }) {
    if (!eventId || !user) throw new Error("Missing eventId or user ID for ticket lookup");

    // Construct query parameters for server-side filtering (Recommended approach)
    const search = new URLSearchParams();
    search.set("event", eventId);
    search.set("user", user);
    search.set("status", "active"); // Fetching only active/non-cancelled tickets

    const url = `${BASE_URL}?${search.toString()}`;

    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch tickets: ${res.status} ${text}`);
    }

    const matchingTickets = await res.json();

    if (matchingTickets.length === 0) return null;

    // The backend should ideally sort this, but we will sort client-side just in case
    // pick the latest by id (ObjectId sorting is chronological)
    return matchingTickets.reduce((a, b) => (String(a._id) > String(b._id) ? a : b));
}

/**
 * Cancel a ticket (used when user RESIGNS).
 */
export async function cancelTicket(ticketId, userId) {
    // Assuming backend keeps the custom /cancel route for now
    const res = await fetch(`${BASE_URL}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, userId }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to cancel ticket: ${res.status} ${text}`);
    }

    return res.json();
}

/**
 * It talks to backend route:
 * GET /api/tickets/verify?code=...&token=...&eventId=...
 *
 * pass either:
 * { code, eventId }   OR
 * { token, eventId }
 */
export async function verifyTicket({ code, token, eventId }) {
    const url = new URL(`${BASE_URL}/verify`);

    if (code) url.searchParams.set("code", code);
    if (token) url.searchParams.set("token", token);
    if (eventId) url.searchParams.set("eventId", eventId);

    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to verify ticket: ${res.status} ${text}`);
    }

    return res.json();
}