// ticketorium-backend/seed/data/notifications.data.js
export const notificationTemplatesSeed = [
    // EVENTS
    {
        key: "event_join_success",
        category: "event",
        titleTemplate: "You joined {{eventName}}",
        bodyTemplate: "You have successfully joined {{eventName}}.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_join_failed_full_or_closed",
        category: "event",
        titleTemplate: "Could not join {{eventName}}",
        bodyTemplate:
            "You could not join {{eventName}} because it is full or closed.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_waitlist_added",
        category: "event",
        titleTemplate: "Waitlisted for {{eventName}}",
        bodyTemplate: "You have been added to the waitlist for {{eventName}}.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_time_changed",
        category: "event",
        titleTemplate: "{{eventName}} time changed",
        bodyTemplate: "The time for {{eventName}} has changed to {{newDateTime}}.",
        roles: ["student", "visitor", "organizer"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_location_changed",
        category: "event",
        titleTemplate: "{{eventName}} location changed",
        bodyTemplate:
            "The location for {{eventName}} has changed to {{newLocation}}.",
        roles: ["student", "visitor", "organizer"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_canceled",
        category: "event",
        titleTemplate: "{{eventName}} was cancelled",
        bodyTemplate: "{{eventName}} has been cancelled.",
        roles: ["student", "visitor", "organizer"],
        channels: { badge: true, inApp: true, email: true },
    },
    {
        key: "event_reminder_day_before",
        category: "event",
        titleTemplate: "{{eventName}} is tomorrow",
        bodyTemplate: "{{eventName}} starts tomorrow at {{startTime}}.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_reminder_hours_before",
        category: "event",
        titleTemplate: "{{eventName}} starts soon",
        bodyTemplate: "{{eventName}} starts in {{timeUntilStart}}.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "event_invited",
        category: "event",
        titleTemplate: "You were invited to {{eventName}}",
        bodyTemplate: "{{inviterName}} invited you to {{eventName}}.",
        roles: ["student", "visitor"],
        channels: { badge: true, inApp: true, email: false },
    },

    // BIDDING
    {
        key: "bidding_bid_placed",
        category: "bidding",
        titleTemplate: "Bid placed on {{listingTitle}} ticket",
        bodyTemplate:
            "Your bid of {{amount}} was placed on {{listingTitle}} ticket.",
        roles: ["student"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "bidding_won",
        category: "bidding",
        titleTemplate: "You won the bidding for {{listingTitle}} ticket",
        bodyTemplate:
            "You won the bidding for {{listingTitle}} ticket. Complete your purchase.",
        roles: ["student"],
        channels: { badge: true, inApp: true, email: true },
    },
    {
        key: "bidding_ends_soon",
        category: "bidding",
        titleTemplate: "Bidding ends soon for {{listingTitle}} ticket",
        bodyTemplate:
            "Bidding for {{listingTitle}} ticket ends in {{timeUntilEnd}}.",
        roles: ["student"],
        channels: { badge: true, inApp: true, email: false },
    },

    // LISTINGS
    {
        key: "listing_received_bid",
        category: "listing",
        titleTemplate: "New bid on {{listingTitle}} ticket",
        bodyTemplate:
            "Your listing {{listingTitle}} ticket received a new bid.",
        roles: ["student"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "listing_expired",
        category: "listing",
        titleTemplate: "Listing expired: {{listingTitle}}",
        bodyTemplate: "Your listing {{listingTitle}} has expired.",
        roles: ["student"],
        channels: { badge: false, inApp: true, email: false },
    },
    {
        key: "listing_sold",
        category: "listing",
        titleTemplate: "Your ticket was sold",
        bodyTemplate: "Your ticket {{listingTitle}} was sold for {{amount}}.",
        roles: ["student"],
        channels: { badge: true, inApp: true, email: true },
    },

    // DISPUTES
    {
        key: "dispute_created",
        category: "dispute",
        titleTemplate: "Dispute {{disputeTitle}} submitted",
        bodyTemplate:
            "Your dispute regarding {{eventName}} has been submitted.",
        roles: ["student", "visitor", "organizer"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "dispute_created-admin",
        category: "dispute",
        titleTemplate: "New dispute titled {{disputeTitle}} was created",
        bodyTemplate: "A dispute regarding {{eventName}} has been created.",
        roles: ["admin", "system-admin"],
        channels: { badge: true, inApp: true, email: false },
    },
    {
        key: "dispute_new_message",
        category: "dispute",
        titleTemplate: "New reply in the dispute: {{disputeTitle}}",
        bodyTemplate:
            "There is a new message on your dispute for {{eventName}}.",
        roles: ["student", "visitor", "organizer", "admin", "system-admin"],
        channels: { badge: true, inApp: true, email: false },
    },

    // ORGANIZER EVENT REMINDERS
    {
        key: "organizer_event_reminder_day_before",
        category: "organizer_event",
        titleTemplate: "Your event {{eventName}} is tomorrow",
        bodyTemplate:
            "Your event {{eventName}} is scheduled for tomorrow at {{startTime}}.",
        roles: ["organizer"],
        channels: { badge: false, inApp: true, email: false },
    },
    {
        key: "organizer_event_reminder_hours_before",
        category: "organizer_event",
        titleTemplate: "Your event {{eventName}} starts soon",
        bodyTemplate:
            "Your event {{eventName}} starts in {{timeUntilStart}}.",
        roles: ["organizer"],
        channels: { badge: false, inApp: true, email: false },
    },
    {
        key: "organizer_event_ended",
        category: "organizer_event",
        titleTemplate: "{{eventName}} has ended",
        bodyTemplate:
            "Your event {{eventName}} has ended. Review attendance or feedback.",
        roles: ["organizer"],
        channels: { badge: false, inApp: true, email: false },
    },
    {
        key: "organizer_role_granted",
        category: "account",
        titleTemplate: "Organizer role granted",
        bodyTemplate: "You have been granted organizer privileges.",
        roles: ["organizer"],
        channels: { badge: true, inApp: true, email: false },
    },
];
