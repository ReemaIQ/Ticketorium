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

        // 1) Preferred: events is an object map { [id]: eventObj }
        if (!Array.isArray(props.events) && typeof props.events === "object") {
            normalized = Object.entries(props.events).map(([id, ev]) => ({
                id: String(id),
                ...(ev || {}),
            }));
        } else if (Array.isArray(props.events)) {
            // 2) Fallback: events is an array of full objects
            normalized = props.events
                .map((entry, idx) => {
                    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                        const id = entry.id ?? entry.eventId ?? String(idx);
                        return { ...entry, id: String(id) };
                    }
                    // If it's just an ID here, we **avoid** re-building from allEvents,
                    // because that would drop any custom state. Safer to ignore.
                    return null;
                })
                .filter(Boolean);
        }

        // 3) Apply filterIds if provided (we only hide/show, not touch data)
        if (filterIds && filterIds.length > 0) {
            const set = new Set(filterIds);
            normalized = normalized.filter((item) => set.has(String(item.id)));
        }

        // 4) Date helpers
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(8640000000000000); // Far future if invalid

            const cleanDate = dateStr.replace(/^\d{1,2}:\d{2}\s(?:AM|PM)\s/i, "");
            const d = new Date(cleanDate);
            return isNaN(d.getTime()) ? new Date(8640000000000000) : d;
        };

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // 5) Sort: future first, then past; within each, earliest first
        return normalized.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            const isPastA = dateA < now;
            const isPastB = dateB < now;

            if (isPastA && !isPastB) return 1;
            if (!isPastA && isPastB) return -1;

            return dateA - dateB;
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
