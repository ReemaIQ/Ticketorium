import EventList from "../../components/event-list/EventList.jsx";
import React from "react";
import {Hash, Search} from "lucide-react";

const contentOptions = {
    // student, visitor, organizer, admin, system-admin
    "student": {
        "user-events": {
            "header": "Your Upcoming Events",
            "jump-to": "Upcoming Events"
        },
        "invites-sent": {
            "header": "Invites Sent",
            "jump-to": "Invites"
        },
        "subscriptions-events": {
            "header": "Events of Subscriptions",
            "jump-to": "Events of Subscriptions"
        },
        "subscriptions": {
            "header": "Subscriptions",
            "jump-to": "Subscriptions"
        },
        "event-organizers": {
            "header": "Event Organizers",
            "jump-to": "Event Organizers"
        }
    }, 
    "visitor": {
        "user-events": {
            "header": "Your Upcoming Events",
            "jump-to": "Upcoming Events"
        },
        "invites-sent": {
            "header": "Invites Received",
            "jump-to": "Invites"
        },
        "subscriptions-events": {
            "header": "Events of Subscriptions",
            "jump-to": "Events of Subscriptions"
        },
        "subscriptions": {
            "header": "Subscriptions",
            "jump-to": "Subscriptions"
        },
        "event-organizers": {
            "header": "Event Organizers",
            "jump-to": "Event Organizers"
        }
    }, 
    "organizer": {

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
    return (
        <>
        <div className="m-0 text-3xl flex flex-col gap-10 bg-[var(--secondary-color)] w-full h-screen relative">
            <div className="flex justify-between">
                <div className="px-20 py-30">
                    <h1 className="text-[130px] font-bold w-180 font-[Epilogue-Black] leading-[140px] text-white">Welcome Back, {props.users[props.user]["first-name"]}!</h1>
                    <p className="font-[DM-Sans-Light] text-[24px] text-white mt-7">All {(props.users[props.user]["type"] === "visitor" || props.users[props.user]["type"] === "system-admin")? "this": "your"} university's events in one place.</p>
                </div>
            </div>

            <img src={"/src/assets/images/home-main/unis/" + props.universities[props.users[props.user]["university"]]["logo"]} className="h-[95%] absolute right-[-25%]"/>
        </div>

        {/* Jump-to section */}
        <div className="bg-[#F3F3F3] h-[96px] w-full flex items-center px-12 py-9 gap-12">
            <span className="font-[Gilroy-Black] text-[var(--secondary-color)] text-[32px]">JUMP TO</span>
            <div className="flex justify-between w-[55%]">
                {Object.keys(contentOptions[props.users[props.user]["type"]]).map((key) =>
                    <span className="font-[Gilroy-Medium] text-[20px] text-[var(--primary-color)]" onClick={() => {window.scrollTo({top: document.getElementById(key).offsetTop - 30, behavior:'smooth'})}}>{contentOptions[props.users[props.user]["type"]][key]["jump-to"]}</span>
                )}
            </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col items-center py-10 px-15 gap-10">
            {Object.keys(contentOptions[props.users[props.user]["type"]]).map(key => 
                <>
                <div id="section-header" className="flex items-center justify-between w-full mt-9 mb-3 px-15">
                    {/* Left: Title + Search */}
                    <div className="flex items-center gap-3">
                        <h2 id={key} className="font-[Epilogue-Black] text-[60px] text-[var(--primary-color)]">{contentOptions[props.users[props.user]["type"]][key]["header"]}</h2>

                        {/* Search Button */}
                        {/*onClick={onSearch}*/}
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                            aria-label="Search"
                        >
                            <Search size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Right: Filter Button */}
                    {/*onClick={onFilter}*/}
                    <button
                        className="flex items-center gap-2 border-2 border-[#4F6FFF]
                        text-[#14113B] px-5 py-2 rounded-full font-[Gilroy-Medium]
                        hover:bg-[#4F6FFF] hover:text-white transition"
                    >
                        <Hash size={18} />
                        Filter
                    </button>
                </div>

                <div className="flex w-full max-w-6xl">
                    {key === "notifications" ?
                        (
                            <h1 className="font-[Gilroy-Medium] text-[20px]"> notifications </h1>
                        ) :
                    (key=== "subscriptions" ?
                        (
                            <h1 className="font-[Gilroy-Medium] text-[20px]"> subscriptions </h1>
                        ) :
                    (key === "event-organizers" ?
                        (
                            <h1 className="font-[Gilroy-Medium] text-[20px]"> event-organizers </h1>
                        ) :
                    (key === "universities" ?
                        (
                            <h1 className="font-[Gilroy-Medium] text-[20px]"> universities </h1>
                        ):

                        (
                        <EventList events={props.events} userType={props.user.type}/>
                        ))))
                    }
                </div>
                </>
            )}

        </div>
        </>
    )
}

export default UserHome;