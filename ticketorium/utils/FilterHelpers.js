// src/utils/FilterHelpers.js

import * as events from "node:events";

/**
 * Safely applies a value to either a React state setter or a ref.
 *
 * If `setter` is:
 *  - a function, it calls setter(value) to update state.
 *  - an object with a `current` property, it sets setter.current = value to update a ref.
 *
 * If `setter` is missing or of an unexpected type, it does nothing.
 */
const applyToSetter = (setter, value) => {
    if (!setter) return;
    if (typeof setter === "function") {
        setter(value);
    } else if (typeof setter === "object" && "current" in setter) {
        setter.current = value;
    }
};

// ---------- BASIC FILTER UTILITIES ----------

/**
 * Filters events by a specific university ID.
 *
 * @param {object} events - Map from eventId to event object.
 * @param {string} universityId - The university identifier to filter by.
 * @returns {string[]} An array of event IDs that belong to the given university.
 */
export const filterEventsByUniversity = (events, universityId) => {
    if (!events || !universityId) return [];
    return Object.keys(events).filter(
        (eventId) => events[eventId]?.university === universityId
    );
};

/**
 * Filters joined events with optional constraints on user, university, and state.
 *
 * @param {object} events - Map from eventId to event object.
 * @param {object} eventsJoined - Map from joinId to joined-event record.
 * @param {object} options - Optional filters.
 * @param {string|null} options.loggedInUser - If provided, only entries for this user are kept.
 * @param {string|null} options.university - If provided, only events in this university are kept.
 * @param {string|null} options.state - If provided, only joined records with this state are kept.
 * @returns {string[]} An array of join IDs that match all filters.
 */
export const filterJoinedEvents = (
    events,
    eventsJoined,
    {
        loggedInUser = null,
        university = null,
        state = null, // for example: "joined" or "invited"; if null then any state is allowed
    } = {}
) => {
    const resultIds = [];

    Object.keys(eventsJoined || {}).forEach((joinId) => {
        const joined = eventsJoined[joinId];
        if (!joined) return;

        const event = events?.[joined.eventId];
        if (!event) return;

        if (loggedInUser && joined.user !== loggedInUser) return;
        if (university && event.university !== university) return;
        if (state && joined.state !== state) return;

        resultIds.push(joinId);
    });

    console.log("resultIds" + resultIds);
    return resultIds;
};

// ---------- LIST HELPERS (BASED ON YOUR ORIGINAL LOGIC) ----------

/**
 * Computes the IDs that should appear for a given listType and context.
 *
 * Supported listType values:
 *  - "all-events": returns event IDs from the events map for the given university.
 *  - "my-events": returns join IDs for events the user joined in the given university (excluding invites).
 *  - "invites-received": returns join IDs for invitations sent to the user in the given university.
 *  - "invites-sent": returns join IDs for invitations sent by the user in the given university.
 *
 * @param {string} listType - The type of list (for example "all-events" or "my-events").
 * @param {object} content - Either events map or an object containing { events, eventsJoined }.
 * @param {string} university - The university ID used to filter events.
 * @param {string} loggedInUser - The current logged-in user ID.
 * @returns {string[]} An array of IDs (event IDs or join IDs) depending on the list type.
 */
export const getInitialEventIdsForList = (
    listType,
    content,
    university,
    loggedInUser
) => {
    if (!listType || !content) return [];

    // For "all-events", content is the events map.
    if (listType === "all-events") {
        return filterEventsByUniversity(content, university);
    }

    // For other list types, content is expected to be { events, eventsJoined }.
    const events = content.events || {};
    const eventsJoined = content.eventsJoined || {};

    // "my-events" means events joined by this user in this university, excluding invites.
    if (listType === "my-events") {
        return filterJoinedEvents(events, eventsJoined, {
            loggedInUser,
            university,
        }).filter((joinId) => {
            const joined = eventsJoined[joinId];
            console.log("joined.state" + joined.state)
            return joined.state !== "invited";
        });
    }

    // "invites-received" means user is the invitee and state is "invited".
    if (listType === "invites-received") {
        return Object.keys(eventsJoined).filter((joinedId) => {
            const joined = eventsJoined[joinedId];
            if (!joined) return false;

            const event = events[joined.eventId];
            if (!event) return false;

            return (
                event.university === university &&
                joined.state === "invited" &&
                joined.invitee === loggedInUser
            );
        });
    }

    // "invites-sent" means user is the one who sent the invite and state is "invited".
    if (listType === "invites-sent") {
        return Object.keys(eventsJoined).filter((joinedId) => {
            const joined = eventsJoined[joinedId];
            if (!joined) return false;

            const event = events[joined.eventId];
            if (!event) return false;

            return (
                event.university === university &&
                joined.state === "invited" &&
                joined.user === loggedInUser
            );
        });
    }

    return [];
};

/**
 * Builds the final event map for a given list type.
 *
 * For:
 *  - "all-events": keys are event IDs and values are event objects.
 *  - other list types: keys are join IDs and values are merged event objects:
 *      {
 *          ...event,
 *          state,   // "joined" | "invited" | "waitlist" | ...
 *          user,    // owner of the joined record (invitor after creation)
 *          invitee, // the invited user (when applicable)
 *          joinId,
 *          eventId
 *      }
 *
 * Note: when an invite is accepted, your update logic should make the
 * eventsJoined record look like:
 *    user = invitee
 *    invitee = invitee
 *    state = "joined"
 *
 * This function will then expose state="joined" correctly to the UI.
 *
 * @param {string} listType - The list type such as "all-events" or "my-events".
 * @param {object} content - Either an events map, or an object containing { events, eventsJoined }.
 * @param {string} university - The university ID used to filter events.
 * @param {string} loggedInUser - The current logged-in user ID.
 * @returns {object} A map that can be used directly by components to render lists.
 */
export const buildInitialEventMapForList = (
    listType,
    content,
    university,
    loggedInUser
) => {
    const results = {};
    const ids = getInitialEventIdsForList(
        listType,
        content,
        university,
        loggedInUser
    );

    if (listType === "all-events") {
        // For "all-events", content is the events map, so we map event IDs to their event objects.
        ids.forEach((id) => {
            results[id] = content[id];
        });
    } else {
        // For other lists, content has { events, eventsJoined }.
        const events = content.events || {};
        const eventsJoined = content.eventsJoined || {};
        console.log("event3:"+events)
        ids.forEach((joinedId) => {
            const joined = eventsJoined[joinedId];
            if (!joined) return;
            const event = events[joined.eventId];
            if (!event) return;

            // Merge joined info into the event object
            results[joinedId] = {
                ...event,
                state: joined.state,
                user: joined.user,
                invitee: joined.invitee,
                joinId: joinedId,
                eventId: joined.eventId,
            };
        });
    }
    return results;
};

// ---------- MAIN FILTER WRAPPER ----------

/**
 * High-level filter helper that is used for initial list-type filtering (not search).
 *
 * Currently supports:
 *  - searchFor equals "event"
 *  - filterDetails containing:
 *      - "list-type" to indicate which list to build
 *      - "university" to scope events by university
 *
 * It computes the initial event map and writes it to the provided setter or ref.
 *
 * @param {string} searchFor - The type of data to filter, currently "event".
 * @param {object} content - Either an events map or an object containing { events, eventsJoined }.
 * @param {function|object} setter - A state setter function or a ref where the result will be stored.
 * @param {object} filterDetails - Configuration such as { "list-type": "...", "university": "..." }.
 * @param {string} loggedInUser - The currently logged-in user ID.
 */
export const filterContentHelper = (
    searchFor,
    content,
    setter,
    filterDetails = {},
    loggedInUser
) => {
    if (searchFor === "event") {
        const listType = filterDetails["list-type"];
        const university = filterDetails["university"];

        if (!listType || !university) {
            console.warn(
                "[filterContentHelper] Missing list-type or university in filterDetails."
            );
            return;
        }

        const initialMap = buildInitialEventMapForList(
            listType,
            content,
            university,
            loggedInUser
        );

        applyToSetter(setter, initialMap);
        return;
    }

    // Additional filter types can be added here in the future.
    console.warn(
        "[filterContentHelper] No branch matched for searchFor:",
        searchFor
    );
};
