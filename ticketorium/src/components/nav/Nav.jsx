import {useEffect, useRef, useState } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { Bell, MessageCircle, Menu, X } from "lucide-react";
import logoUrl from "../../assets/images/nav/Logo.png";
import "./Nav.css";

import NotificationModal from "../modals/NotificationModal.jsx";
//import LogOutModal???? from;

const navItems = {
    "": [],
    "student": [
        { label: "All Events", href: "/events" },
        { label: "My Events", href: "/my-events" },
        { label: "Bidding", href: "/bidding" },
        { label: "My Disputes", href: "/disputes" },
    ],
    "visitor": [
        { label: "All Events", href: "/events" },
        { label: "My Events", href: "/my-events" },
        { label: "My Disputes", href: "/disputes" },
    ],
    "organizer": [
        { label: "My Events", href: "/my-events" },
        { label: "Create Event", href: "/create-event" },
        { label: "Analytics", href: "/analytics" },
        { label: "My Disputes", href: "/disputes" },
    ],
    "admin": [
        { label: "Manage Events", href: "/events" },
        { label: "Manage Users", href: "/manage-users" },
        { label: "Manage Disputes", href: "/disputes" },
        { label: "System Policies", href: "/system-policies" },
    ],
    "system-admin": [
        { label: "Manage Events", href: "/events" },
        { label: "Manage Universities", href: "/universities" },
        { label: "Manage Users", href: "/manage-users" },
        { label: "Manage Disputes", href: "/disputes" },
        { label: "System Policies", href: "/system-policies" },
    ],
};


function InitialAvatar({ name, setOpen, open }) {
    const letter = (name && name.trim().charAt(0).toUpperCase()) || "U"; // U = Unknown

    return (
        <div onClick={() => setOpen(!open)}
            aria-label="User menu"
            className="w-8 h-8 rounded-full bg-[#404d71] text-white grid place-items-center select-none hover:bg-[#55608a] cursor-pointer outline-[rgba(255,255,255,0.2)] outline-4"
        >
            <span className="text-sm font-semibold">{letter}</span>
        </div>
    );
}

export default function Nav({userName, type, setLoggedInUser}) {
    const [logoutOpen, setLogoutOpen] = useState(false); // avatar log out drop down
    const [notificationOpen, setNotificationOpen] = useState(false); //notifications modal
    const [mobileOpen, setMobileOpen] = useState(false); // hamburger menu

    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        function onDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setLogoutOpen(false);
                setNotificationOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);


    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        navigate("/log-in");
    }

    const items = navItems[type] || [];

    return (
        <>
            <nav id="nav" className="w-full h-15 bg-[#1F4C76] text-white flex items-center justify-between px-3 py-4 md:px-6 md:py-5 relative">

                {/* Left*/}
                <div id="nav-links" className="flex items-center gap-6 md:gap-10">

                    {/* Logo */}
                    <div id="nav-logo" className="flex items-center gap-1 cursor-pointer" onClick={() => {navigate('/home');setMobileOpen(false);}}>
                        <img src={logoUrl} alt="Ticketorium logo" className="w-10 h-10" />

                        <div className="flex-direction-columns items-center">
                            <span className="text-lg font-[Gilroy-Black] flex h-3 text-[#1F4C76]">-</span>
                            <span className="font-[Gilroy-Black] font-black italic text-[20px] tracking-wide flex">Ticketorium.</span>
                        </div>
                    </div>


                    {/* Desktop links */}
                    <div id="nav-links-inner" className="hidden md:flex gap-6 font-[Gilroy-Medium]">
                        {items.map((item) => (
                            <NavLink to={item.href} className="text-white hover:underline">
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>


                {/* Right: Icons + Avatar + Hamburger */}
                <div id="nav-buttons"
                     className="flex items-center gap-3 md:gap-4 relative"
                     ref={dropdownRef}
                >

                    {/* Specific User Types' Buttons*/}
                    {(type === "student" || type === "visitor" || type === "organizer") && (
                        <>
                            <NavLink to={"/disputes"}>
                                <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                            </NavLink>
                        </>
                    )}

                    <div className="relative cursor-pointer">
                        <div onClick={() => setNotificationOpen(!notificationOpen)} aria-label="User menu">
                            <Bell className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" setOpen={setNotificationOpen} open={notificationOpen} />
                        </div>

                        <div className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-fit px-5 py-3 z-10 transform transition-all duration-200 ease-out origin-top ${
                            notificationOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                             role="menu">

                            <NotificationModal role="menuitem"/>
                            <p role="menuitem">notif</p>

                        </div>
                    </div>

                    {type && type !== "empty" && (
                        <>
                            {/* Avatar + Logout dropdown */}
                            <div className="relative">
                                <InitialAvatar name={userName} setOpen={setLogoutOpen} open={logoutOpen} />

                                <div
                                    className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2 z-10 transform transition-all duration-200 ease-out origin-top ${
                                        logoutOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                    role="menu"
                                >
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* Hamburger (mobile only) */}
                            <button
                                type="button"
                                className="md:hidden p-1 rounded bg-[#1F4C76] text-white focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setMobileOpen((prev) => !prev)}
                                aria-label="Toggle navigation menu"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu (only logged in) */}
            {type && type !== "empty" && (
                <div
                    className={`md:hidden w-full bg-white text-black transition-[max-height,opacity] duration-200 ease-out overflow-hidden ${
                        mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col items-center text-center py-2 font-[Gilroy-Medium]">
                        {items.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="w-full py-2 hover:bg-gray-100"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
