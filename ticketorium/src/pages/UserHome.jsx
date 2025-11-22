import EventList from "../components/event-list/EventList.jsx";
import NotificationList from "../components/notification-list/NotificationList.jsx";
import Analytics from "../components/analytics/Analytics.jsx";
import SearchBtn from "../components/search-button/SearchBtn.jsx";
import WaitlistSuccess from "../components/WaitlistSuccess.jsx";

import {Hash, Search} from "lucide-react";
import { NavLink } from "react-router-dom";
import React, {useMemo, useState, useRef, useEffect} from "react";

// Font Awesome Setup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import OrganizerAnalytics from "../components/analytics/Analytics.jsx";
import UniversityCard from "../components/university-card/UniversityCard.jsx";
import UniversityModal from "../components/modals/UniversityModal.jsx";

library.add(fas, far, fab)


const contentOptions = {
    // student, visitor, analytics, admin, system-admin
    "student": {
        "user-events": {
            "header": "Your Upcoming Events",
            "jump-to": "Upcoming Events"
        },
        "invites-sent": {
            "header": "Invites Sent",
            "jump-to": "Invites"
        }
    }, 
    "visitor": {
        "user-events": {
            "header": "Your Upcoming Events",
            "jump-to": "Upcoming Events"
        },
        "invites-received": {
            "header": "Invites Received",
            "jump-to": "Invites"
        }
    }, 
    "organizer": {
        "analytics": {
            "header": "Recent Analytics",
            "jump-to": "Analytics"
        },
        "upcoming-events": {
            "header": "Upcoming Events",
            "jump-to": "Upcoming Events"
        }
    }, 
    "admin": {
        "notifications": {
            "header": "Notifications",
            "jump-to": "Notifications"
        },
        "upcoming-events": {
            "header": "Upcoming Events",
            "jump-to": "Upcoming Events"
        }
    },
    "system-admin": {
        "notifications": {
            "header": "Notifications",
            "jump-to": "Notifications"
        },
        "universities": {
            "header": "Universities",
            "jump-to": "Universities"
        },
        "upcoming-events": {
            "header": "Upcoming Events",
            "jump-to": "Upcoming Events"
        }
    }
    
    // ["Your Upcoming Events", "Invites Sent", "Events of Subscriptions", "Subscriptions", "Event Organizers"],
    // "visitor": ["Your Upcoming Events", "Invites Received", "Events of Subscriptions", "Subscriptions", "Event Organizers"]
}


function UserHome(props) {
    // upcoming events
    const [filteredUpcomingEvents, setFilteredUpcomingEvents] = useState([]);
    const upcomingEventsOriginalState = useRef({});
    // invites received
    const [filteredInvitesReceived, setFilteredInvitesReceived] = useState([]);
    const invitesReceivedOriginalState = useRef({});
    // invites sent
    const [filteredInvitesSent, setFilteredInvitesSent] = useState([]);
    const invitesSentOriginalState = useRef({});

    // university section modal variables
    const [universities, setUniversities] = useState(props.universities);
    const [universityEditingId, setUniversityEditingId] = useState(null);
    const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);

    const [notifications, setNotifications] = useState(props.notifications || {});
    const notificationArray = useMemo(() => {
        if (!notifications) return [];

        return Object.values(notifications)
            .filter((n) => {
                // If roles are defined, check if current userType is included
                if (n.roles && Array.isArray(n.roles)) {
                    return n.roles.includes(props.users[props.user]["type"]);
                }
                // If no roles defined, assume visible to all (or change to false to be strict)
                return true;
            })
            .reverse(); // Sort new to old

    }, [notifications, props.users[props.user]["type"]]);

    function getSearchBtn(key) {
        switch (key) {
            case "user-events":
                return <SearchBtn filterFunc={(searchValue) => {props.filterContent("search", upcomingEventsOriginalState.current, setFilteredUpcomingEvents, "event", searchValue, { "list-type": "my-events", "university": props.uni})}} expandable={true}/>
            case "invites-received":
                return <SearchBtn filterFunc={(searchValue) => {props.filterContent("search", invitesReceivedOriginalState.current, setFilteredInvitesReceived, "event", searchValue, { "list-type": "invites-received", "university": props.uni})}} expandable={true}/>
            case "invites-sent":
                return <SearchBtn filterFunc={(searchValue) => {props.filterContent("search", invitesSentOriginalState.current, setFilteredInvitesSent, "event", searchValue, { "list-type": "invites-sent", "university": props.uni})}} expandable={true}/>
            default:
                return null;
        }
    }

    useEffect(() => {
            props.filterContent("initial", {"events": props.events, "eventsJoined": props.eventsJoined}, upcomingEventsOriginalState, "event", "", { "list-type": "my-events", "university": props.uni})
            setFilteredUpcomingEvents(Object.keys(upcomingEventsOriginalState.current)); // ik its stupid, but it forces a re-render
            props.filterContent("initial", {"events": props.events, "eventsJoined": props.eventsJoined}, invitesReceivedOriginalState, "event", "", { "list-type": "invites-received", "university": props.uni})
            setFilteredInvitesReceived(Object.keys(invitesReceivedOriginalState.current)); // ik its stupid, but it forces a re-render
            props.filterContent("initial", {"events": props.events, "eventsJoined": props.eventsJoined}, invitesSentOriginalState, "event", "", { "list-type": "invites-sent", "university": props.uni})
            setFilteredInvitesSent(Object.keys(invitesSentOriginalState.current)); // ik its stupid, but it forces a re-render
        }, []);

    // Handlers
        const handleUniversityDelete = (id) => {
            if (window.confirm('Are you sure you want to delete this university?')) {
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
        setUniversities(prev => ({
            ...prev,
            [key]: data
        }));
        setIsUniversityModalOpen(false);
    };

    return (
        <>
        <div className=" m-0 py-10 text-3xl flex flex-col xl:flex-row bg-[var(--secondary-color)] w-full relative xl:justify-between xl:items-center xl:content-center">
            <div id="a" className="flex justify-between order-2 xl:order-1">
                <div id="b" className="xl:px-20 xl:py-30 px-10 py-10 max-xl:flex max-xl:flex-col max-xl:w-full">
                    <h1 className="flex flex-col items-center max-xl:text-center text-[86px] sm:text-[110px] md:text-[130px] font-bold font-[Epilogue-Black] md:leading-[125px] text-white">Welcome<br/>Back,<br/>{props.users[props.user]["first-name"]}!</h1>
                    <p className="max-xl:flex flex-col items-center font-[DM-Sans-Light] text-[24px] text-white mt-7">All {(props.users[props.user]["type"] === "visitor" || props.users[props.user]["type"] === "system-admin")? "this": "your"} university's events in one place.</p>
                </div>
            </div>

            <img src={"/src/assets/images/home-main/unis/" + props.universities[props.users[props.user]["university"]]["logo"]} className="max-md:w-[40%] md:max-lg:w-[30%] lg:max-xl:w-[25%] xl:h-150 2xl:h-180 order-1 xl:order-2 self-center object-contain xl:max-w-2xl"/>
        </div>

        {/* Jump-to section */}
        <div className="bg-[#F3F3F3] xl:h-[96px] w-full xl:flex xl:flex-row xl:items-center px-12 py-9 gap-12">
            <div className="font-[Gilroy-Black] text-[var(--secondary-color)] text-[32px] mb-10 xl:mb-0 shrink-0">JUMP TO</div>
            <div className="flex max-xl:justify-between max-xl:grid max-xl:grid-cols-2 gap-25 xl:gap-15 w-full">
                {Object.keys(contentOptions[props.users[props.user]["type"]]).map((key) =>
                    <span className="font-[Gilroy-Medium] text-[20px] text-[var(--primary-color)] self-center text-center cursor-pointer" onClick={() => {window.scrollTo({top: document.getElementById(key).offsetTop - 30, behavior:'smooth'})}}>{contentOptions[props.users[props.user]["type"]][key]["jump-to"]}</span>
                )}
            </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col items-center xl:py-10 px-10 xl:px-15 gap-5 w-full">
            {Object.keys(contentOptions[props.users[props.user]["type"]]).map(key => 
                <>
                <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3">
                    {/* Left: Title + Search */}
                    <div className="flex flex-col items-start gap-4 w-full">
                        <h2 id={key} className="font-[Epilogue-Black] text-[50px] xl:text-[50px] text-[var(--primary-color)]">{contentOptions[props.users[props.user]["type"]][key]["header"]}</h2>
                        <div className="flex gap-4 self-start w-full justify-center">
                            <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">
                                <FontAwesomeIcon
                                    icon={"fa-solid fa-filter"}
                                    className="text-white"
                                />
                            </button>
                            {getSearchBtn(key)}
                        </div>
                    </div>

                </div>

                <div className="flex w-full max-w-6xl">
                    {
                    key === "notifications" ?
                        (
                            <div className="border-1 rounded-[6px] border-[#E0E0E0] w-full">
                                <NotificationList
                                    notifications={notificationArray}
                                    onMarkAsRead={ (id) => {
                                        setNotifications((prev) => {
                                            if (!prev[id]) return prev;
                                            return {
                                                ...prev,
                                                [id]: { ...prev[id], read: true }
                                            };
                                        });
                                    }}
                                />
                            </div>

                        ) :
                    (key=== "analytics" ?
                        (
                            <>
                                <div className="w-full max-w-6xl px-15">
                                    <Analytics />
                                </div>
                            </>

                        ) :
                    (key === "event-organizers" ?
                        (
                            <h1 className="font-[Gilroy-Medium] text-[20px]"> event-organizers </h1>
                        ) :
                    (key === "universities" ?
                        (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(universities).map(([key, data]) => (
                                        <UniversityCard
                                            key={key}
                                            id={key}
                                            data={data}
                                            onEdit={handleUniversityEdit}
                                            onDelete={handleUniversityDelete}
                                        />
                                    ))}

                                    {/* Empty State Helper */}
                                    {Object.keys(universities).length === 0 && (
                                        <div className="col-span-full text-center py-20 text-gray-500">
                                            No universities found. Click "Add new university" to get started.
                                        </div>
                                    )}

                                    <UniversityModal
                                        isOpen={isUniversityModalOpen}
                                        onClose={() => setIsUniversityModalOpen(false)}
                                        onSave={handleUniversitySave}
                                        initialData={universityEditingId ? universities[universityEditingId] : null}
                                        editId={universityEditingId}
                                        defaultTheme={universityEditingId ? universities[universityEditingId]["theme-colors"]:
                                            {"primary-color": "#1A1A1A",
                                                "secondary-color": "#1F4C76",
                                                "accent-color": "#FFDF4F",
                                                "secondary-accent-color": "#0800FF",
                                                "filter-buttons": "#8200DB",
                                                "warning-color": "#F54141",
                                                "success-color": "#46CA48",
                                                "footer-color": "#11223B"}}
                                    />
                                </div>
                            </>
                        ):
                    (key === "user-events" ?
                        (
                        <EventList eventsJoined={props.eventsJoined} events={upcomingEventsOriginalState.current} filteredEvents={filteredUpcomingEvents} filterContent={props.filterContent} userType={props.users[props.user]['type']} listType="my-events" variant="r"/>
                        )
                    :
                    (key === "invites-received" ?
                        <EventList eventsJoined={props.eventsJoined} events={invitesReceivedOriginalState.current} filteredEvents={filteredInvitesReceived} filterContent={props.filterContent} userType={props.users[props.user]['type']} listType="invites-received" variant="r"/>
                    :
                    (key === "invites-sent" ?
                        <EventList eventsJoined={props.eventsJoined} events={invitesSentOriginalState.current} filteredEvents={filteredInvitesSent} filterContent={props.filterContent} userType={props.users[props.user]['type']} listType="invites-sent"/>
                    :
                    "")
                    ))
                )))
                    }
                </div>
                </>
            )}

        </div>
        <NavLink to="/checkout" onClick={() => props.setIsPurchasing(true)} className="border-7 rounded-full py-3 px-15 m-10 self-center border-purple-200 cursor-pointer">Magic Button</NavLink>
        <div className="my-3">Remove later</div>
        {props.waitlistModalOpen && <WaitlistSuccess setWaitlistModalOpen={props.setWaitlistModalOpen} waitlistSuccess={props.waitlistSuccess} />}
        </>
    )
}

export default UserHome;