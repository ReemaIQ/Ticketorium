// ticketorium/src/components/event-list/EventList.jsx

import React, { useMemo } from "react";
import Event from "../event/Event";

/**
 * EventList
 *
 * Props:
 * - events: array OR object map of backend event objects.
 * (e.g., from AllEvents, these are merged objects with 'actionState')
 * - filterIds: optional array of ids (strings) for filtering
 * - userType: "student" | "visitor" | "organizer" | "admin" | "system-admin"
 * - listType: "all-events" | "my-events" | ...
 * - setOrganizerViewing: optional, passed down to Event card
 */

export default function EventList({
                                      events,
                                      filterIds,
                                      userType,
                                      listType,
                                      setOrganizerViewing,
                                      user // Prop added for completeness if needed in Event component
                                  }) {
    const items = useMemo(() => {
        if (!events) return [];

        // 1) Normalize to array
        let eventsArray = [];
        if (Array.isArray(events)) {
            eventsArray = events.filter(
                (ev) => !!ev && typeof ev === "object",
            );
        } else if (typeof events === "object") {
            eventsArray = Object.values(events).filter(
                (ev) => !!ev && typeof ev === "object",
            );
        } else {
            return [];
        }

        // 2) Optional ID filter (by _id / id)
        let filterSet = null;
        if (Array.isArray(filterIds) && filterIds.length > 0) {
            filterSet = new Set(filterIds.map(String));
        }

        const getKeyForFilter = (item, idx) =>
            item._id ?? item.id ?? String(idx);

        if (filterSet) {
            eventsArray = eventsArray.filter((item, idx) =>
                filterSet.has(String(getKeyForFilter(item, idx))),
            );
        }

        const now = new Date();

        // 3) Pre-calc fields for sorting & expired flag
        const processed = eventsArray.map((item, idx) => {
            const key =
                item._id ?? item.id ?? String(idx);

            // Use endAt if available; otherwise startAt (using robust date parsing)
            let dateObj = null;
            const dateSource = item.endAt || item.startAt;

            if (dateSource) {
                const d = new Date(dateSource);
                // Check for valid date
                if (!Number.isNaN(d.getTime())) dateObj = d;
            }

            const hasValidDate = !!dateObj;
            const sortDate = hasValidDate
                ? dateObj
                : new Date(8640000000000000); // far future sentinel

            const isEnded = !!(hasValidDate && dateObj < now);

            return {
                event: { ...item, isEnded: isEnded }, // Enrich the event object itself
                key: String(key),
                isEnded,
                sortDate,
            };
        });

        // 4) Sort: active first (soonest), then ended (most recent)
        processed.sort((a, b) => {
            if (a.isEnded !== b.isEnded) {
                return a.isEnded ? 1 : -1; // active events first
            }

            if (!a.isEnded) {
                // active → ascending (soonest first)
                return a.sortDate - b.sortDate;
            } else {
                // ended → descending (most recent first)
                return b.sortDate - a.sortDate;
            }
        });

        return processed;
    }, [events, filterIds]);

    // Empty state
    if (items.length === 0) {
        return (
            <div
                className="flex flex-col justify-center items-center gap-5
                        p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]"
            >
                {listType === "my-events" && userType !== "organizer"
                    ? "No events joined yet."
                    : userType === "organizer"
                        ? "No events created."
                        : "No events found"}
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {items.map(({ event, key, isEnded }) => {
                // The 'actionState' should be present on the 'event' object
                // if it was merged in AllEvents.jsx.
                const state = event.actionState ?? event.state ?? undefined;

                // For invites, inviter should already be merged into the event object,
                // but we keep the fallback logic based on the action state.
                const inviter =
                    event.inviter ||
                    (state === "invited" ? event.user : undefined);

                return (
                    <Event
                        key={key}
                        event={{...event, inviter: inviter, actionState: state}} // Pass the merged event doc and derived status
                        user={user} // Assuming user is passed as prop to EventList for consistency
                        type={userType}
                        setOrganizerViewing={setOrganizerViewing}
                    />
                );
            })}
        </div>
    );
}