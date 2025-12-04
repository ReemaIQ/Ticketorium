// ticketorium/src/components/event/getUserCategory.js

/**
 * Normalize user role → event-action category
 *
 * Used by Event & EventActions components.
 */
export function getUserCategory(type) {
    if (!type) return "attendee"; // safe fallback

    const normalized = String(type).trim().toLowerCase();

    if (normalized === "student" || normalized === "visitor") {
        return "attendee";
    }

    if (normalized === "organizer") {
        return "organizer";
    }

    if (normalized === "admin" || normalized === "system-admin") {
        return "admin";
    }

    return "attendee"; // default fallback
}
