// /Users/reema/WebstormProjects/Ticketorium/ticketorium/src/api/tickets.js

const BASE_URL = "http://localhost:4000/api/tickets";

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
 * Returns `null` if none is found.
 *
 * This calls GET /api/tickets (all tickets) and filters client-side
 * because the backend currently exposes that endpoint.
 */
export async function fetchTicketForEvent({ eventId, user }) {
    const res = await fetch(BASE_URL, { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch tickets: ${res.status} ${text}`);
    }

    const allTickets = await res.json();

    const matching = allTickets.filter(
        (t) =>
    String(t.event) === String(eventId) &&
    String(t.user) === String(user) &&
    t.status !== "cancelled"

    );

    if (matching.length === 0) return null;

    // pick the latest by id
    return matching.reduce((a, b) => (a.id > b.id ? a : b));
}

/**
 * Cancel a ticket (used when user RESIGNS).
 * After this, admin verification will fail for that ticket
 * because status !== "active".
 */
export async function cancelTicket(ticketId, userId) {
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
 *   GET /api/tickets/verify?code=...&token=...&eventId=...
 *
 * pass either:
 *   { code, eventId }   OR
 *   { token, eventId }
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
