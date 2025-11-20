/**
 * Returns the user category based on the type.
 * @param {string} type - The type of the user (e.g., "student", "visitor", "admin", "organizer")
 * @returns {"attendee" | "other"} - Returns "attendee" for students and visitors, "other" for admins and organizers.
 */
export function getUserCategory(type) {
    const normalized = type?.toLowerCase();

    if (normalized === "student" || normalized === "visitor") {
        return "attendee";
    }

    if (normalized === "admin" || normalized === "organizer") {
        return "other";
    }

    // Default fallback (optional)
    return "other";
}
