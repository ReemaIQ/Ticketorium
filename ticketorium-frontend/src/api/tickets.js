// // Ticketorium/ticketorium-frontend/src/api/tickets.js
//
// const BASE_URL = "http://localhost:4000/api/tickets";
//
// /**
//  * Normalize user object or id to a string id.
//  */
// function normalizeUserId(user) {
//     if (!user) return "";
//     if (typeof user === "string") return String(user);
//     if (user._id) return String(user._id);
//     if (user.id) return String(user.id);
//     if (user.handle) return String(user.handle);
//     return String(user);
// }
//
// /**
//  * Create a ticket for (eventId, userId).
//  * Used by JoinModal when a user joins an event.
//  */
// export async function createTicket({ eventId, userId, seat = null, price = 0 }) {
//     const safeUserId = normalizeUserId(userId);
//     const safeEventId = String(eventId);
//
//     const res = await fetch(BASE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             eventId: safeEventId,
//             userId: safeUserId,
//             seat,
//             price,
//         }),
//     });
//
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to create ticket: ${res.status} ${text}`);
//     }
//
//     return res.json();
// }
//
// /**
//  * Fetch the latest NON-CANCELLED ticket for this user+event.
//  * Works with the in-memory tickets router.
//  */
// export async function fetchTicketForEvent({ eventId, user }) {
//     const safeEventId = String(eventId);
//     const safeUserId = normalizeUserId(user);
//
//     const url = new URL(BASE_URL);
//     url.searchParams.set("eventId", safeEventId);
//     url.searchParams.set("userId", safeUserId);
//     url.searchParams.set("status", "active");
//
//     const res = await fetch(url.toString(), { method: "GET" });
//
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to fetch tickets: ${res.status} ${text}`);
//     }
//
//     const tickets = await res.json();
//
//     if (!Array.isArray(tickets) || tickets.length === 0) {
//         return null;
//     }
//
//     // pick the latest by numeric id or createdAt
//     return tickets.reduce((a, b) => {
//         const aKey = a.id ?? 0;
//         const bKey = b.id ?? 0;
//         if (aKey && bKey && aKey !== bKey) {
//             return aKey > bKey ? a : b;
//         }
//         const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//         const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//         return aTime >= bTime ? a : b;
//     });
// }
//
// /**
//  * Cancel a ticket (used when user RESIGNS).
//  */
// export async function cancelTicket(ticketId, userId) {
//     const safeUserId = normalizeUserId(userId);
//
//     const res = await fetch(`${BASE_URL}/cancel`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ticketId, userId: safeUserId }),
//     });
//
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to cancel ticket: ${res.status} ${text}`);
//     }
//
//     return res.json();
// }
//
// /**
//  * It talks to backend route:
//  *   GET /api/tickets/verify?code=...&token=...&eventId=...
//  *
//  * pass either:
//  *   { code, eventId }   OR
//  *   { token, eventId }
//  */
// export async function verifyTicket({ code, token, eventId }) {
//     const url = new URL(`${BASE_URL}/verify`);
//
//     if (code) url.searchParams.set("code", code);
//     if (token) url.searchParams.set("token", token);
//     if (eventId) url.searchParams.set("eventId", String(eventId));
//
//     const res = await fetch(url.toString(), { method: "GET" });
//
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Failed to verify ticket: ${res.status} ${text}`);
//     }
//
//     return res.json();
// }


// ticketorium-frontend/src/api/tickets.js

const BASE_URL = "http://localhost:4000/api/tickets";

/**
 * Normalize user object or id to a string id.
 */
function normalizeUserId(user) {
    if (!user) return "";
    if (typeof user === "string") return String(user);
    if (user._id) return String(user._id);
    if (user.id) return String(user.id);
    if (user.handle) return String(user.handle);
    return String(user);
}

/**
 * Create a ticket for (eventId, userId).
 * Used by JoinModal when a user joins an event.
 */
export async function createTicket({ eventId, userId, seat = null, price = 0 }) {
    const safeUserId = normalizeUserId(userId);
    const safeEventId = String(eventId);

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            eventId: safeEventId,
            userId: safeUserId,
            seat,
            price,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create ticket: ${res.status} ${text}`);
    }

    return res.json();
}

/**
 * Fetch the latest NON-CANCELLED ticket for this user+event.
 */
export async function fetchTicketForEvent({ eventId, user }) {
    const safeEventId = String(eventId);
    const safeUserId = normalizeUserId(user);

    const url = new URL(BASE_URL);
    url.searchParams.set("eventId", safeEventId);
    url.searchParams.set("userId", safeUserId);
    url.searchParams.set("status", "active");

    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch tickets: ${res.status} ${text}`);
    }

    const tickets = await res.json();

    if (!Array.isArray(tickets) || tickets.length === 0) {
        return null;
    }

    // pick the latest by numeric id or createdAt
    return tickets.reduce((a, b) => {
        const aKey = a.id ?? 0;
        const bKey = b.id ?? 0;
        if (aKey && bKey && aKey !== bKey) {
            return aKey > bKey ? a : b;
        }
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime >= bTime ? a : b;
    });
}

/**
 * Cancel a ticket (used when user RESIGNS).
 */
export async function cancelTicket(ticketId, userId) {
    const safeUserId = normalizeUserId(userId);

    const res = await fetch(`${BASE_URL}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, userId: safeUserId }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to cancel ticket: ${res.status} ${text}`);
    }

    return res.json();
}

/**
 * Verify a ticket:
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
    if (eventId) url.searchParams.set("eventId", String(eventId));

    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to verify ticket: ${res.status} ${text}`);
    }

    return res.json();
}

/* ------------------------------------------------------------------
 *  ADD LISTING HELPERS  (for /api/tickets/unlisted)
 *  These talk to the backend route:
 *    GET /api/tickets/unlisted?userHandle=...
 *  which:
 *   - finds the User by handle
 *   - gets their ACTIVE tickets
 *   - keeps only "graduation" events
 *   - filters out tickets already in Listing (active)
 * -----------------------------------------------------------------*/

/**
 * Resolve a "user" (object or string) into a handle string.
 * We do NOT send _id here; backend /unlisted expects `userHandle`.
 */
function normalizeUserHandle(user) {
    if (!user) return "";
    if (typeof user === "string") return user;
    if (user.handle) return String(user.handle);
    if (user.username) return String(user.username);
    if (user.userHandle) return String(user.userHandle);
    return "";
}

/**
 * Low-level helper: fetch unlisted graduation tickets by handle.
 * Used by AddListingModal (or similar) on the frontend.
 */
export async function fetchUnlistedTicketsForUserHandle(userHandle) {
    if (!userHandle) {
        throw new Error("userHandle is required to fetch unlisted tickets");
    }

    const url = new URL(`${BASE_URL}/unlisted`);
    url.searchParams.set("userHandle", userHandle);

    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Failed to fetch unlisted tickets: ${res.status} ${text}`,
        );
    }

    // Backend already:
    //  - filters to ACTIVE tickets
    //  - keeps only "graduation" events
    //  - removes tickets already listed
    return res.json();
}

/**
 * Convenience wrapper: accept a user object (or handle string)
 * and internally derive the handle for /unlisted.
 */
export async function fetchUnlistedTicketsForUser(user) {
    const handle = normalizeUserHandle(user);
    if (!handle) {
        throw new Error(
            "Could not derive user handle from user object when fetching unlisted tickets",
        );
    }
    return fetchUnlistedTicketsForUserHandle(handle);
}
