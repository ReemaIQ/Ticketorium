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

// --------- UNIVERSITY SEARCHES ---------

/**
 * Searches universities by matching the search text against:
 *  - university name, or
 *  - university ID.
 *
 * If the search text is empty, it returns all university IDs.
 *
 * @param {object} universities - Map from university ID to university object.
 * @param {string} searchValue - The user-entered search text.
 * @returns {string[]} An array of university IDs that match the search.
 */
export const searchUniversitiesByNameOrId = (universities, searchValue) => {
    const q = (searchValue || "").trim().toLowerCase();
    if (!q) return Object.keys(universities || {});

    return Object.keys(universities || {}).filter((uniId) => {
        const uni = universities[uniId];
        if (!uni) return false;
        return (
            uni.name?.toLowerCase().includes(q) ||
            uniId.toLowerCase().includes(q)
        );
    });
};

/**
 * More flexible university search that uses a custom predicate.
 *
 * The predicate receives both the university object and the university ID
 * and should return true if the item matches the desired condition.
 *
 * @param {object} universities - Map from university ID to university object.
 * @param {function} predicateFn - A function (uni, uniId) to determine if a university qualifies.
 * @returns {string[]} An array of university IDs that satisfy the predicate function.
 */
export const searchUniversitiesWithPredicate = (
    universities,
    predicateFn
) => {
    if (!universities || typeof predicateFn !== "function") return [];
    return Object.keys(universities).filter((uniId) => {
        const uni = universities[uniId];
        if (!uni) return false;
        return !!predicateFn(uni, uniId);
    });
};

// --------- EVENT SEARCHES ---------

/**
 * Basic event search that matches the search text against event titles.
 *
 * If the search text is empty, it returns all event IDs.
 *
 * @param {object} events - Map from eventId to event object.
 * @param {string} searchValue - The user-entered search text.
 * @returns {string[]} An array of event IDs whose title contains the search text.
 */
export const searchEventsByTitle = (events, searchValue) => {
    const q = (searchValue || "").trim().toLowerCase();
    if (!q) return Object.keys(events || {});

    return Object.keys(events || {}).filter((eventId) => {
        const event = events[eventId];
        if (!event) return false;
        return event.title?.toLowerCase().includes(q);
    });
};

/**
 * Advanced event search that can look across multiple fields, such as:
 *  - title
 *  - description
 *  - organizer
 *
 * If the search text is empty, it returns all event IDs.
 *
 * @param {object} events - Map from eventId to event object.
 * @param {string} searchValue - The user-entered search text.
 * @param {string[]} fields - List of field names to search in each event object.
 * @returns {string[]} An array of event IDs that match in at least one of the specified fields.
 */
export const searchEventsByKeyword = (
    events,
    searchValue,
    fields = ["title", "description", "organizer"]
) => {
    const q = (searchValue || "").trim().toLowerCase();
    if (!q) return Object.keys(events || {});

    return Object.keys(events || {}).filter((eventId) => {
        const event = events[eventId];
        if (!event) return false;

        return fields.some((field) => {
            const value = event[field];
            if (!value || typeof value !== "string") return false;
            return value.toLowerCase().includes(q);
        });
    });
};

/**
 * Searches events joined by a specific user by matching title.
 *
 * This function:
 *  - Looks at entries in eventsJoined.
 *  - Keeps only those whose `user` equals `loggedInUser`.
 *  - For those entries, finds the linked event in events.
 *  - Matches search text against the event title.
 *
 * It returns join IDs (not event IDs), which is compatible with how MyEvents
 * uses joined records as keys.
 *
 * @param {object} events - Map from eventId to event object.
 * @param {object} eventsJoined - Map from joinId to joined-event record.
 * @param {string} loggedInUser - The current logged-in user ID.
 * @param {string} searchValue - The user-entered search text.
 * @returns {string[]} An array of join IDs that match the search.
 */
export const searchUserJoinedEventsByTitle = (
    events,
    eventsJoined,
    loggedInUser,
    searchValue
) => {
    if (!loggedInUser) return [];

    const q = (searchValue || "").trim().toLowerCase();
    const resultIds = [];

    Object.keys(eventsJoined || {}).forEach((joinId) => {
        const joined = eventsJoined[joinId];
        if (!joined || joined.user !== loggedInUser) return;

        const event = events?.[joined.eventId];
        if (!event) return;

        // If q is empty, we include all joined events for this user.
        if (!q || event.title?.toLowerCase().includes(q)) {
            resultIds.push(joinId);
        }
    });

    return resultIds;
};

// --------- MAIN SEARCH WRAPPER ---------

/**
 * High-level search wrapper used by components to perform different kinds of searches.
 *
 * It decides which underlying search function to call based on:
 *  - searchFor (for example "university" or "event" or "user-events")
 *  - options.mode (for example "title" or "keyword" for events)
 *  - options.fields (for keyword event search)
 *
 * Then it writes the resulting IDs into the provided setter or ref.
 *
 * @param {string} searchFor - What is being searched: "university", "event", or "user-events".
 * @param {object} content - The data to search in (universities map, events map, or any map).
 * @param {function|object} setter - React setState function or ref where results should be stored.
 * @param {string} searchValue - The user-entered search text.
 * @param {object} options - Additional configuration for certain search types.
 * @param {string} options.mode - For events, "title" or "keyword".
 * @param {string[]} options.fields - For keyword mode, the list of fields to search in.
 * @param {object} options.events - Events map, used for "user-events" mode.
 * @param {object} options.eventsJoined - Joined events map, used for "user-events" mode.
 * @param {string} options.loggedInUser - The current logged-in user ID, used for "user-events" mode.
 */
export const searchContentHelper = (
    searchFor,
    content,
    setter,
    searchValue = "",
    options = {}
) => {
    // University search.
    if (searchFor === "university") {
        const ids = searchUniversitiesByNameOrId(content, searchValue);
        applyToSetter(setter, ids);
        return;
    }

    // Event search by title.
    if (searchFor === "event" && options.mode === "title") {
        const ids = searchEventsByTitle(content, searchValue);
        applyToSetter(setter, ids);
        return;
    }

    // Event search across multiple fields.
    if (searchFor === "event" && options.mode === "keyword") {
        const fields = options.fields || ["title", "description", "organizer"];
        const ids = searchEventsByKeyword(content, searchValue, fields);
        applyToSetter(setter, ids);
        return;
    }

    // User-specific joined events search.
    if (searchFor === "user-events") {
        const { events, eventsJoined, loggedInUser } = options;
        const ids = searchUserJoinedEventsByTitle(
            events,
            eventsJoined,
            loggedInUser,
            searchValue
        );
        applyToSetter(setter, ids);
        return;
    }

    // Default fallback for "event" when mode is not specified:
    // treat it as a title-based search.
    if (searchFor === "event") {
        const ids = searchEventsByTitle(content, searchValue);
        applyToSetter(setter, ids);
        return;
    }

    console.warn("[searchContentHelper] No branch matched", searchFor, options);
};
