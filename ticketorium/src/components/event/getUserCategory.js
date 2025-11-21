/**
 * Returns the user category based on the type.
 */
export function getUserCategory(type) {
    const normalized = type?.toLowerCase();

    if (normalized === "student" || normalized === "visitor") {
        return "attendee";
    }
    if (normalized === "organizer") return "organizer";   // r was "other"
    if (normalized === "admin" || normalized === "system-admin") return "admin";           // r was "other"
}
