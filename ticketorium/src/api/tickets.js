// Change this base URL later when you deploy or proxy through Vite
const BASE_URL = "http://localhost:4000";

export async function createTicket({ eventId, userId, seat, price }) {
    const response = await fetch(`${BASE_URL}/api/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, userId, seat, price }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create ticket: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data; // { id, ticketCode, qrToken, qrData, eventId, userId, seat, price, status, createdAt }
}

/**
 * Get the latest active ticket for this user + event.
 * For now we just GET all tickets and filter on the frontend.
 * Later, you can replace this with a proper filtered backend query.
 */
export async function fetchTicketForEvent({ eventId, userId }) {
    const response = await fetch(`${BASE_URL}/api/tickets`);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch tickets: ${response.status} ${text}`);
    }

    const all = await response.json();

    // eventId from useParams is a string; backend also stores string "1"
    const evId = String(eventId);

    const matching = all.filter(
        (t) =>
            String(t.eventId) === evId &&
            String(t.userId) === String(userId) &&
            t.status === "active"
    );

    // Return the most recent one or null
    return matching.length > 0 ? matching[matching.length - 1] : null;
}
