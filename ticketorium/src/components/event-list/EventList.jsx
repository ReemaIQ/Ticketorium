import React, { useMemo } from "react";
import Event from "../event/Event";

/**
 * EventList
 *
 * Props:
 *  - events: object map { [id]: eventObj } (preferred)
 *            or array of full event objects (used in some contexts)
 *  - allEvents: optional map of raw events (not used to overwrite state in AllEvents)
 *  - filterIds: optional array of ids (strings) for filtering
 *  - eventsJoined: map from joinId -> joined record (optional, not used here directly)
 *  - userType: "student" | "visitor" | "organizer" | "admin" | "system-admin"
 *  - listType: "all-events" | "my-events" | ...
 */

export default function EventList(props) {
    const items = useMemo(() => {
        if (!props.events) return [];

        const filterIds = Array.isArray(props.filterIds)
            ? props.filterIds.map(String)
            : null;

        let normalized = [];

        // 1) Normalize Data
        if (!Array.isArray(props.events) && typeof props.events === "object") {
            normalized = Object.entries(props.events).map(([id, ev]) => ({
                id: String(id),
                ...(ev || {}),
            }));
        } else if (Array.isArray(props.events)) {
            normalized = props.events
                .map((entry, idx) => {
                    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                        const id = entry.id ?? entry.eventId ?? String(idx);
                        return { ...entry, id: String(id) };
                    }
                    return null;
                })
                .filter(Boolean);
        }

        // 2) Apply Filters
        if (filterIds && filterIds.length > 0) {
            const set = new Set(filterIds);
            normalized = normalized.filter((item) => set.has(String(item.id)));
        }

        // 3) Date Helper
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            // Fix format: "11/21/2025-9:30AM" -> "11/21/2025 9:30AM"
            const cleanDate = dateStr.replace('-', ' ');
            const d = new Date(cleanDate);
            return isNaN(d.getTime()) ? null : d;
        };

        const now = new Date(); // Compare against exact current time

        // 4) Pre-calculate date objects and status for sorting
        const processed = normalized.map(item => {
            const dateObj = parseDate(item.date);
            // If invalid date, push to far future
            const sortDate = dateObj || new Date(8640000000000000);

            // Determine if event has ended based on exact time
            const isEnded = dateObj ? dateObj < now : false;

            return {
                ...item,
                _sortDate: sortDate, // Internal use for sorting
                isEnded: isEnded     // Use this in your UI to show "Event Ended"
            };
        });

        // 5) Sort
        return processed.sort((a, b) => {
            // Rule 1: Active events first, Ended events last
            if (a.isEnded && !b.isEnded) return 1;
            if (!a.isEnded && b.isEnded) return -1;

            // Rule 2: Sort by Date (Earliest -> Latest)
            // This works for both groups:
            // - Upcoming: Sooner events appear first
            // - Ended: Oldest ended events appear first in the "ended" section
            return a._sortDate - b._sortDate;
        });
    }, [props.events, props.filterIds]);

    if (items.length === 0) {
        return (
            <div
                className="flex flex-col justify-center items-center gap-5
                        p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]"
            >
                {(props.listType === "my-events" && props.userType !== "organizer")
                    ? "No events joined yet."
                    : props.userType === "organizer" ?
                    "No events created." : "No events found"}
            </div>
        );
    }

    const renderItem = (item, idx) => {
        const id = item.id ?? String(idx);

        console.log("Rendering event with id =", id, "full item:", item);

        // 🔹 IMPORTANT:
        // `item.state` is whatever we got from:
        //   - DummyData (for AllEvents, e.g. undefined or "waitlist"), or
        //   - merged eventsJoined record (for MyEvents, e.g. "joined" / "invited")
        const passedState = item.state ?? undefined;

        // For invites, `user` = invitor, `invitee` = person invited
        const inviter = item.inviter || (passedState === "invited" ? item.user : undefined);

        if (
            !item.title &&
            !item.img &&
            !item.date &&
            !item.organizer &&
            item.id == null
        ) {
            return null;
        }

        console.log("EventList Event:", props.eventsJoined);
                    console.log("cheese", props.filteredEvents)
                    // get event joined that is has event id equal to event

                    const now = new Date();
                    const eventMonthAndDay = item.date.match(/(\d+)\//g).map(e => e.replace('/', ''));
                    const eventYear = item.date.match(/\/(\d+)-/g)[0].replace('/','').replace('-',''); // regex wizardry or sth
                    const expired = eventYear < now.getFullYear() || (eventYear == now.getFullYear() && (parseInt(eventMonthAndDay[0]) < (now.getMonth() + 1) || (parseInt(eventMonthAndDay[0]) == (now.getMonth() + 1) && parseInt(eventMonthAndDay[1]) < now.getDate())));
                        

        return (
            <Event
                key={id}
                id={id}
                type={props.userType}
                state={passedState}
                img={item.img}
                title={item.title}
                date={item.date}
                organizer={item.organizer}
                price={item.price}
                inviter={inviter}
                expired={expired}
                setOrganizerViewing={props.setOrganizerViewing} // don't worry about this, just passing it from App.jsx (Shayma)
            />
        );
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {items.map(renderItem)}
        </div>
    );
}
