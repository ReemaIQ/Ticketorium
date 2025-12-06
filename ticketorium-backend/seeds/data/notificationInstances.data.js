export const notificationsSeed = [
    {
        userHandle: "student",
        templateKey: "event_join_success",
        data: { eventName: "2025 Coding Competition" },
        seen: false,
    },
    {
        userHandle: "visitor",
        templateKey: "event_reminder_day_before",
        data: { eventName: "2025 Group Hiking", startTime: "9:30 AM" },
        seen: false,
    },
    {
        userHandle: "kfupm-organizer",
        templateKey: "organizer_event_reminder_day_before",
        data: { eventName: "2025 Coding Competition", startTime: "9:30 AM" },
        seen: false,
    },
    {
        userHandle: "student",
        templateKey: "listing_received_bid",
        data: { listingTitle: "2025 Graduation Ceremony – VIP-01" },
        seen: true,
    },
];
