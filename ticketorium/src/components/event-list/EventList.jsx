import Event from "../event/Event";

export default function EventList(props) {
    const {
        events = {},
        eventsJoined = {},
        filteredEvents = [],
        userType,
        listType,
    } = props;

    // Decide which events to render: filtered list or all
    const items =
        filteredEvents && filteredEvents.length > 0
            ? filteredEvents
                .filter((id) => events[id]) // make sure event exists
                .map((id) => [id, events[id]])
            : Object.entries(events);

    if (items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center gap-5 p-3 w-full text-gray-500 font-[Gilroy-Medium] text-[22px]">
                {listType === "my-events" ? "No events joined yet." : "No events available."}
            </div>
        );
    }

    // Figure out join info for a given event key
    const getJoinInfo = (eventKey) => {
        let state = "not-joined";
        let user = null;
        let inviter = null;

        if (listType === "all-events") {
            // eventKey is the *event id*; search eventsJoined by eventId
            const match = Object.values(eventsJoined).find(
                (ej) => String(ej.eventId) === String(eventKey)
            );
            if (match) {
                state = match.state || state;
                user = match.user ?? null;
                inviter = match.invitee ?? null;
            }
        } else {
            // my-events / invites-* : keys of events === keys of eventsJoined
            const ej = eventsJoined[eventKey];
            if (ej) {
                state = ej.state || state;
                user = ej.user ?? null;
                inviter = ej.invitee ?? null;
            }
        }

        return { state, user, inviter };
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 p-3">
            {items.map(([id, ev]) => {
                const { state, user, inviter } = getJoinInfo(id);

                return (
                    <Event
                        key={id}                 // fixes key warning here
                        id={id}                  // event id (for all-events) or join-id (for others)
                        type={userType}
                        state={state}
                        user={user}
                        img={ev.img}
                        title={ev.title}
                        date={ev.date}
                        organizer={ev.organizer}
                        price={ev.price}
                        inviter={inviter}
                    />
                );
            })}
        </div>
    );
}
