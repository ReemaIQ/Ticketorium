/**
 * Safely applies a value to either a React state setter or a ref.
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

export const filterEventsByUniversity = (events, universityId) => {
    if (!events || !universityId) return [];
    return Object.keys(events).filter(
        (eventId) => events[eventId]?.university === universityId
    );
};

export const filterJoinedEvents = (
    events,
    eventsJoined,
    { loggedInUser = null, university = null, state = null } = {}
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

    return resultIds;
};

// ---------- LIST HELPERS ----------

/**
 * Computes the IDs that should appear for a given listType and context.
 */
export const getInitialEventIdsForList = (
    listType,
    content,
    university,
    loggedInUser
) => {
    if (!listType || !content) return [];

    // Normalize content: might be just events map OR { events, eventsJoined }
    const eventsMap = content.events || content;
    const eventsJoinedMap = content.eventsJoined || {};

    // "all-events": Returns all event IDs in the uni
    if (listType === "all-events") {
        return filterEventsByUniversity(eventsMap, university);
    }

    // "my-events": Joined by user (excluding invited)
    if (listType === "my-events") {
        return filterJoinedEvents(eventsMap, eventsJoinedMap, {
            loggedInUser,
            university,
        }).filter((joinId) => {
            const joined = eventsJoinedMap[joinId];
            return joined.state !== "invited";
        });
    }

    // "invites-received"
    if (listType === "invites-received") {
        return Object.keys(eventsJoinedMap).filter((joinedId) => {
            const joined = eventsJoinedMap[joinedId];
            if (!joined) return false;
            const event = eventsMap[joined.eventId];
            if (!event) return false;

            return (
                event.university === university &&
                joined.state === "invited" &&
                joined.invitee === loggedInUser
            );
        });
    }

    // "invites-sent"
    if (listType === "invites-sent") {
        return Object.keys(eventsJoinedMap).filter((joinedId) => {
            const joined = eventsJoinedMap[joinedId];
            if (!joined) return false;
            const event = eventsMap[joined.eventId];
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
 * Builds the final event map.
 */
export const buildInitialEventMapForList = (
    listType,
    content,
    university,
    loggedInUser
) => {
    const results = {};

    // Normalize content
    const events = content.events || content;
    const eventsJoined = content.eventsJoined || {};

    const ids = getInitialEventIdsForList(
        listType,
        content,
        university,
        loggedInUser
    );

    if (listType === "all-events") {
        // [Logic for all-events remains the same]
        const userJoinMap = {};

        if (loggedInUser && eventsJoined) {
            Object.values(eventsJoined).forEach(join => {
                // CASE 1: I am the receiver of an invite
                if (join.invitee === loggedInUser && join.state === "invited") {
                    userJoinMap[join.eventId] = join;
                }
                // CASE 2: I have interacted with the event (Joined, Waitlisted, etc.)
                else if (join.user === loggedInUser && join.state !== "invited") {
                    userJoinMap[join.eventId] = join;
                }
            });
        }

        ids.forEach((id) => {
            const rawEvent = events[id];
            if(!rawEvent) return;

            const joinRecord = userJoinMap[id];

            if (joinRecord) {
                results[id] = {
                    ...rawEvent,
                    state: joinRecord.state,
                    joinId: joinRecord.id,
                    inviter: joinRecord.state === 'invited' ? joinRecord.user : undefined
                };
            } else {
                results[id] = rawEvent;
            }
        });

    } else {
        // For "my-events", "invites-sent", "invites-received"
        ids.forEach((joinedId) => {
            const joined = eventsJoined[joinedId];
            if (!joined) return;
            const event = events[joined.eventId];
            if (!event) return;

            // FIX: Use 'joined.eventId' as the key, NOT 'joinedId'.
            // This ensures the UI renders the Event ID, allowing correct navigation.
            results[joined.eventId] = {
                ...event,
                id: joined.eventId, // Explicitly set the ID to the event ID
                state: joined.state,
                user: joined.user,
                invitee: joined.invitee,
                joinId: joinedId, // Keep track of the join record ID separately
                eventId: joined.eventId,
            };
        });
    }
    return results;
};

// ---------- MAIN FILTER WRAPPER ----------

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
            console.warn("[filterContentHelper] Missing list-type or university.");
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
    console.warn("[filterContentHelper] No branch matched for searchFor:", searchFor);
};