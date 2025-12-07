// ticketorium-frontend/src/pages/AllEvents.jsx
import React from "react";
import EventList from "../components/event-list/EventList.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

// core fetching + merging logic lives here now
import { useMergedEventsForUser } from "../components/events-fetching/AllEventsComponent.jsx";

/* -------------------- helpers to derive titles only -------------------- */

function getEventsTitle(type) {
    const t = type?.toLowerCase();

    if (t === "admin") {
        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                Manage Events
            </span>
        );
    }

    if (t === "visitor") {
        return (
            <span className="font-[Epilogue-Black] text-[60px] xl:text-[60px] text-[#1A1A1A]">
                Events at{" "}
                <span className="text-[var(--primary-color)] font-[Gilroy-Medium]">
                    {"this university"}
                </span>
            </span>
        );
    }

    if (t === "student") {
        return (
            <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
                Events
            </span>
        );
    }

    return (
        <span className="font-[Gilroy-Black] text-[60px] text-[#1A1A1A]">
            Events
        </span>
    );
}

/* ----------------------------- main component ----------------------------- */

function AllEvents(props) {
    const user = props.user || {};
    const userType = user.role || null;
    const uni = props.uni;

    const {
        eventsMap,
        visibleIds,
        loading,
        error,
        handleSearch,
    } = useMergedEventsForUser({ user, uni });

    return (
        <>
            <div
                id="page-content"
                className="flex flex-col items-center gap-30 min-h-screen"
            >
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start justify-between max-w-5xl mt-9 mb-3 px-3 gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <h1>{getEventsTitle(userType, user)}</h1>
                        </div>

                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>
                            <SearchBtn
                                expandable={true}
                                filterFunc={handleSearch}
                            />
                        </div>
                    </div>

                    {loading && (
                        <p className="px-3 text-sm text-gray-500">
                            Loading events…
                        </p>
                    )}

                    {error && !loading && (
                        <p className="px-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <EventList
                            events={eventsMap}            // full merged events with actionState
                            filterIds={visibleIds}       // which ones to show (after search)
                            userType={userType}
                            listType="all-events"
                            user={user}                  // pass user through to Event
                            setOrganizerViewing={props.setOrganizerViewing}
                        />
                    )}
                </div>
            </div>

            {props.waitlistModalOpen && (
                <WaitlistSuccess
                    setWaitlistModalOpen={props.setWaitlistModalOpen}
                    waitlistSuccess={props.waitlistSuccess}
                />
            )}
        </>
    );
}

export default AllEvents;
