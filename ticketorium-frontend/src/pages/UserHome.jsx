// ticketorium-frontend/src/pages/UserHome.jsx
import React, { useMemo, useState } from "react";

import EventList from "../components/event-list/EventList.jsx";
import NotificationList from "../components/notification-list/NotificationList.jsx";
import Analytics from "../components/analytics/Analytics.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";
import UniversityCard from "../components/university-card/UniversityCard.jsx";
import UniversityModal from "../components/modals/UniversityModal.jsx";

// NEW: hooks + component for dynamic fetching
import {
    useMergedEventsForUserUpcomingOnly,
} from "../components/events-fetching/AllEventsComponent.jsx";

import {
    useMyEventsForUserUpcomingOnly,
} from "../components/events-fetching/MyEventsComponent.jsx";

import InvitesReceivedComponents from "../components/events-fetching/InvitesReceivedComponents.jsx";

// Font Awesome Setup (still used in other parts if needed later)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

// ---------------------- content options per role ---------------------- //

const contentOptions = {
    student: {
        "upcoming-events": {
            header: "Upcoming Events",
            "jump-to": "Upcoming Events",
        },
        "my-upcoming-events": {
            header: "My Upcoming Events",
            "jump-to": "My Upcoming Events",
        },
        "invites-received": {
            header: "Invites Received",
            "jump-to": "Invites",
        },
    },
    visitor: {
        "upcoming-events": {
            header: "Upcoming Events",
            "jump-to": "Upcoming Events",
        },
        "my-upcoming-events": {
            header: "My Upcoming Events",
            "jump-to": "My Upcoming Events",
        },
        "invites-received": {
            header: "Invites Received",
            "jump-to": "Invites",
        },
    },
    organizer: {
        analytics: {
            header: "Recent Analytics",
            "jump-to": "Analytics",
        },
        "upcoming-events": {
            header: "Upcoming Events",
            "jump-to": "Upcoming Events",
        },
    },
    admin: {
        notifications: {
            header: "Notifications",
            "jump-to": "Notifications",
        },
        "upcoming-events": {
            header: "Upcoming Events",
            "jump-to": "Upcoming Events",
        },
    },
    "system-admin": {
        notifications: {
            header: "Notifications",
            "jump-to": "Notifications",
        },
        universities: {
            header: "Universities",
            "jump-to": "Universities",
        },
        "upcoming-events": {
            header: "Upcoming Events",
            "jump-to": "Upcoming Events",
        },
    },
};

function UserHome(props) {
    // Prefer full backend user if provided
    const user = props.user || {};
    const userType = user.role || props.role;

    const uni = props.uni;

    // ---------- UPCOMING EVENTS (all events for this uni, upcoming only) ----------
    const {
        eventsMap: upcomingEventsMap,
        visibleIds: upcomingVisibleIds,
        loading: upcomingLoading,
        error: upcomingError,
        handleSearch: handleUpcomingSearch, // currently unused, but available if you add search
    } = useMergedEventsForUserUpcomingOnly({ user, uni });

    // ---------- MY UPCOMING EVENTS (per user) ----------
    const {
        userType: myEventsUserType, // not used, but returned by hook
        allMyEvents: myUpcomingAll,
        filteredEvents: myUpcomingFiltered,
        loading: myUpcomingLoading,
        error: myUpcomingError,
        handleSearch: handleMyUpcomingSearch, // also available
    } = useMyEventsForUserUpcomingOnly({ user, uni });

    // ---------- UNIVERSITIES & NOTIFICATIONS (for admin/system-admin) ----------
    const [universities, setUniversities] = useState(props.universities);
    const [universityEditingId, setUniversityEditingId] = useState(null);
    const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);

    const [notifications, setNotifications] = useState(props.notifications || {});
    const notificationArray = useMemo(() => {
        if (!notifications) return [];

        return Object.values(notifications)
            .filter((n) => {
                if (n.roles && Array.isArray(n.roles)) {
                    return n.roles.includes(userType);
                }
                return true;
            })
            .reverse();
    }, [notifications, userType]);

    // ---------- University handlers ----------
    const handleUniversityDelete = (id) => {
        if (
            window.confirm("Are you sure you want to delete this university?")
        ) {
            const newUniversities = { ...props.universities };
            delete newUniversities[id];
            setUniversities(newUniversities);
        }
    };

    const handleUniversityEdit = (id) => {
        setUniversityEditingId(id);
        setIsUniversityModalOpen(true);
    };

    const handleUniversitySave = (key, data) => {
        setUniversities((prev) => ({
            ...prev,
            [key]: data,
        }));
        setIsUniversityModalOpen(false);
    };

    const roleContent = contentOptions[userType] || {};

    return (
        <>
            {/* HERO */}
            <div className="m-0 py-10 text-3xl flex flex-col xl:flex-row bg-[var(--secondary-color)] w-full relative xl:justify-between xl:items-center xl:content-center">
                <div
                    id="a"
                    className="flex justify-between order-2 xl:order-1"
                >
                    <div
                        id="b"
                        className="xl:px-20 xl:py-30 px-10 py-10 max-xl:flex max-xl:flex-col max-xl:w-full"
                    >
                        <h1 className="flex flex-col items-center max-xl:text-center text-[86px] sm:text-[110px] md:text-[130px] font-bold font-[Epilogue-Black] md:leading-[125px] text-white">
                            Welcome
                            <br />
                            Back,
                            <br />
                            {props.firstName}!
                        </h1>
                        <p className="max-xl:flex flex-col items-center font-[DM-Sans-Light] text-[24px] text-white mt-7">
                            All{" "}
                            {userType === "visitor" ||
                            userType === "system-admin"
                                ? "this"
                                : "your"}{" "}
                            university&apos;s events in one place.
                        </p>
                    </div>
                </div>

                <img
                    src={
                        "/src/assets/images/home-main/unis/" +
                        props.uni["logo"]
                    }
                    className="max-md:w-[40%] md:max-lg:w-[30%] lg:max-xl:w-[25%] xl:h-150 2xl:h-180 order-1 xl:order-2 self-center object-contain xl:max-w-2xl"
                />
            </div>

            {/* Jump-to section */}
            <div className="bg-[#F3F3F3] xl:h-[96px] w-full xl:flex xl:flex-row xl:items-center px-12 py-9 gap-12">
                <div className="font-[Gilroy-Black] text-[var(--secondary-color)] text-[32px] mb-10 xl:mb-0 shrink-0">
                    JUMP TO
                </div>
                <div className="flex max-xl:justify-between max-xl:grid max-xl:grid-cols-2 gap-25 xl:gap-15 w-full">
                    {Object.keys(roleContent).map((key) => (
                        <span
                            key={key}
                            className="font-[Gilroy-Medium] text-[20px] text-[var(--primary-color)] self-center text-center cursor-pointer"
                            onClick={() => {
                                const el = document.getElementById(key);
                                if (!el) return;
                                window.scrollTo({
                                    top: el.offsetTop - 30,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            {roleContent[key]["jump-to"]}
                        </span>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col items-center pb-15 xl:py-10 px-10 xl:px-15 gap-5 w-full">
                {Object.keys(roleContent).map((key) => (
                    <React.Fragment key={key}>
                        <div
                            id="section-header"
                            className="flex items-center justify-between w-full mt-9 mb-3"
                        >
                            {/* Left: Title */}
                            <div className="flex flex-col items-start gap-4 w-full">
                                <h2
                                    id={key}
                                    className="font-[Epilogue-Black] text-[50px] xl:text-[50px] text-[var(--secondary-color)]"
                                >
                                    {roleContent[key]["header"]}
                                </h2>
                            </div>
                        </div>

                        <div className="flex w-full max-w-6xl">
                            {key === "notifications" ? (
                                <div className="border-1 rounded-[6px] border-[#E0E0E0] w-full">
                                    <NotificationList
                                        notifications={notificationArray}
                                        onMarkAsRead={(id) => {
                                            setNotifications((prev) => {
                                                if (!prev[id]) return prev;
                                                return {
                                                    ...prev,
                                                    [id]: {
                                                        ...prev[id],
                                                        read: true,
                                                    },
                                                };
                                            });
                                        }}
                                    />
                                </div>
                            ) : key === "analytics" ? (
                                <div className="w-full max-w-6xl px-15">
                                    <Analytics />
                                </div>
                            ) : key === "upcoming-events" ? (
                                // Upcoming Events (for this uni, upcoming only)
                                <>
                                    {upcomingLoading && (
                                        <p className="px-3 text-sm text-gray-500">
                                            Loading events…
                                        </p>
                                    )}
                                    {upcomingError && !upcomingLoading && (
                                        <p className="px-3 text-sm text-red-600">
                                            {upcomingError}
                                        </p>
                                    )}
                                    {!upcomingLoading && !upcomingError && (
                                        <EventList
                                            events={upcomingEventsMap}
                                            filterIds={upcomingVisibleIds}
                                            userType={userType}
                                            listType="all-events"
                                            user={user}
                                            setOrganizerViewing={
                                                props.setOrganizerViewing
                                            }
                                        />
                                    )}
                                </>
                            ) : key === "my-upcoming-events" ? (
                                // My Upcoming Events (joined/invited/waitlisted for this user)
                                <>
                                    {myUpcomingLoading && (
                                        <p className="px-3 text-sm text-gray-500">
                                            Loading your events…
                                        </p>
                                    )}
                                    {myUpcomingError && !myUpcomingLoading && (
                                        <p className="px-3 text-sm text-red-600">
                                            {myUpcomingError}
                                        </p>
                                    )}
                                    {!myUpcomingLoading &&
                                        !myUpcomingError && (
                                            <EventList
                                                events={myUpcomingFiltered}
                                                userType={userType}
                                                listType="my-events"
                                                user={user}
                                                setOrganizerViewing={
                                                    props.setOrganizerViewing
                                                }
                                            />
                                        )}
                                </>
                            ) : key === "invites-received" ? (
                                // Invites Received (uses dedicated component that itself uses EventList)
                                <InvitesReceivedComponents user={user} />
                            ) : key === "universities" ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(universities).map(
                                            ([id, data]) => (
                                                <UniversityCard
                                                    key={id}
                                                    id={id}
                                                    data={data}
                                                    onEdit={
                                                        handleUniversityEdit
                                                    }
                                                    onDelete={
                                                        handleUniversityDelete
                                                    }
                                                />
                                            )
                                        )}

                                        {Object.keys(universities).length ===
                                            0 && (
                                                <div className="col-span-full text-center py-20 text-gray-500">
                                                    No universities found. Click
                                                    &quot;Add new university&quot;
                                                    to get started.
                                                </div>
                                            )}

                                        <UniversityModal
                                            isOpen={isUniversityModalOpen}
                                            onClose={() =>
                                                setIsUniversityModalOpen(false)
                                            }
                                            onSave={handleUniversitySave}
                                            initialData={
                                                universityEditingId
                                                    ? universities[
                                                        universityEditingId
                                                        ]
                                                    : null
                                            }
                                            editId={universityEditingId}
                                            defaultTheme={
                                                universityEditingId
                                                    ? universities[
                                                        universityEditingId
                                                        ]["theme-colors"]
                                                    : {
                                                        "primary-color":
                                                            "#1A1A1A",
                                                        "secondary-color":
                                                            "#1F4C76",
                                                        "accent-color":
                                                            "#FFDF4F",
                                                        "secondary-accent-color":
                                                            "#0800FF",
                                                        "filter-buttons":
                                                            "#8200DB",
                                                        "warning-color":
                                                            "#F54141",
                                                        "success-color":
                                                            "#46CA48",
                                                        "footer-color":
                                                            "#11223B",
                                                    }
                                            }
                                        />
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </React.Fragment>
                ))}
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

export default UserHome;
