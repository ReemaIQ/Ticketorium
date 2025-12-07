// ticketorium-frontend/src/pages/MyEvents.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import EventList from "../components/event-list/EventList.jsx";
import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

// Font Awesome Setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

// core fetching + organizing logic for "My Events"
import { useMyEventsForUser } from "../components/events-fetching/MyEventsComponent.jsx";

/* ------------------ component ------------------ */

function MyEvents(props) {
    const navigate = useNavigate();

    const {
        userType,
        filteredEvents,
        loading,
        error,
        handleSearch,
    } = useMyEventsForUser({
        user: props.user,
        uni: props.uni,
        // we can pass userTypeProp / visitorUniKey here if needed later
    });

    return (
        <>
            <div
                id="page-content"
                className="flex flex-col items-center gap-30 w-full min-h-screen"
            >
                <div
                    id="events-section"
                    className="flex flex-col w-full max-w-5xl gap-5 align-middle px-10 xl:px-15 pb-10"
                >
                    <div
                        id="section-header"
                        className="flex flex-col items-start gap-5 mt-9 mb-3 px-3"
                    >
                        <h1 className="text-[60px] font-[Gilroy-Black]">
                            My Events
                        </h1>

                        {userType === "organizer" && (
                            <div className="flex w-full justify-end">
                                <button
                                    onClick={() => navigate("/create-event")}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)]
                                    text-[var(--primary-color)] rounded-[6px] font-[Gilroy-Medium]"
                                >
                                    <Plus size={18} /> Create New Event
                                </button>
                            </div>
                        )}

                        {userType !== "organizer" && (
                            <div className="flex gap-4 self-start w-full justify-center">
                                <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)]">
                                    <FontAwesomeIcon
                                        icon={"fa-solid fa-filter"}
                                        className="text-white"
                                    />
                                </button>

                                <SearchBtn
                                    filterFunc={handleSearch}
                                    expandable={true}
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-md border border-red-300 bg-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-10 text-slate-500 text-sm">
                            Loading your events…
                        </div>
                    ) : (
                        <EventList
                            events={filteredEvents}
                            userType={userType}
                            listType="my-events"
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

export default MyEvents;
