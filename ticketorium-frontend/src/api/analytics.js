// ticketorium-frontend/src/api/analytics.js
import { getApiBaseUrl } from "./client.js";

// One-event analytics (from EventStats aggregate)
export async function fetchEventAnalytics(eventId, token) {
    if (!eventId) throw new Error("eventId is required");

    const res = await fetch(`${getApiBaseUrl()}/api/analytics/events/${eventId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("fetchEventAnalytics error:", res.status, text);
        throw new Error("Failed to load analytics for this event.");
    }

    // expected shape:
    // {
    //   event: {...},
    //   attendance: { joined, waitlisted, cancelled, noShow },
    //   funnel: { totalVisitors, clickedView, joined },
    //   audience: {
    //     gender: { male, female, other },
    //     ageGroups: { "18-21": n, "22-25": n, "26-30": n, "30+": n },
    //     universities: { kfupm: n, harvard: n, other: n }
    //   }
    // }
    return await res.json();
}