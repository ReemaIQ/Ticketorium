// src/components/nav/nav.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Menu, X } from "lucide-react";
import logoUrl from "../../assets/images/nav/Logo.png";
import "./Nav.css";

import NotificationModal from "../modals/NotificationModal.jsx";

// NAV ITEMS BASED ON ROLE
const navItems = {
    "": [],

    student: [
        { label: "All Events", href: "/events" },
        { label: "My Events", href: "/my-events" },
        { label: "Bidding", href: "/bidding" },
        { label: "My Disputes", href: "/disputes" },
    ],

    visitor: [
        { label: "All Events", href: "/events" },
        { label: "My Events", href: "/my-events" },
        { label: "My Disputes", href: "/disputes" },
    ],

    organizer: [
        { label: "My Events", href: "/my-events" },
        { label: "Create Event", href: "/create-event" },
        { label: "Analytics", href: "/analytics" },
        { label: "My Disputes", href: "/disputes" },
    ],

    admin: [
        { label: "Manage Events", href: "/events" },
        { label: "Manage Users", href: "/manage-users" },
        { label: "Manage Disputes", href: "/disputes" },
        { label: "System Policies", href: "/system-policies" },
    ],

    "system-admin": [
        { label: "Manage Events", href: "/events" },
        { label: "Manage Universities", href: "/manage-universities" },
        { label: "Manage Users", href: "/manage-users" },
        { label: "Manage Disputes", href: "/disputes" },
        { label: "System Policies", href: "/system-policies" },
    ],
};

// INITIAL AVATAR
function InitialAvatar({ name, setOpen, open }) {
    const letter = (name && name.trim()[0]?.toUpperCase()) || "U";

    return (
        <div
            onClick={() => setOpen(!open)}
            aria-label="User menu"
            className="w-8 h-8 rounded-full bg-[#404d71] text-white grid place-items-center select-none hover:bg-[#55608a] cursor-pointer"
        >
            <span className="text-sm font-semibold">{letter}</span>
        </div>
    );
}

export default function Nav({ user, setUser }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [logoutOpen, setLogoutOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const firstName = user?.firstName || "";
    const role = user?.role || "empty";
    const hasUniversity = !!user?.university;

    let items = navItems[role] || [];

    // If user exists but has no university → hide links
    if (user && !hasUniversity) items = [];

    // CLOSE DROPDOWNS WHEN CLICK OUTSIDE
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

    // LOGOUT
    function handleLogout() {
        localStorage.removeItem("token");
        setUser(null);
        setLogoutOpen(false);
        navigate("/log-in");
    }

    function handleChangeUni() {
        setLogoutOpen(false);
        navigate("/university-selection");
    }

    return (
        <>
            <nav
                id="nav"
                className="w-full h-15 bg-[var(--secondary-color)] text-white flex items-center justify-between px-3 py-4 md:px-6 md:py-5 relative"
            >
                {/* LEFT SIDE */}
                <div id="nav-links" className="flex items-center gap-6 md:gap-10">
                    {/* LOGO */}
                    <div
                        id="nav-logo"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                            navigate("/home");
                            setMobileOpen(false);
                        }}
                    >
                        <img src={logoUrl} alt="Ticketorium logo" className="w-10 h-10" />

                        <span className="font-[Gilroy-Black] font-black italic mt-3 text-[20px] tracking-wide">
                            Ticketorium.
                        </span>
                    </div>

                    {/* DESKTOP LINKS */}
                    <div
                        id="nav-links-inner"
                        className="hidden md:flex gap-6 font-[Gilroy-Medium]"
                    >
                        {items.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className="text-white hover:underline"
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    id="nav-buttons"
                    className="flex items-center gap-3 md:gap-4 relative"
                    ref={dropdownRef}
                >
                    {/* DISPUTES ICON FOR NORMAL USERS */}
                    {(role === "student" ||
                        role === "visitor" ||
                        role === "organizer") && (
                        <NavLink to={"/disputes"}>
                            <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        </NavLink>
                    )}

                    {role !== "empty" && (
                        <>
                            {/* NOTIFICATIONS */}
                            <div className="relative cursor-pointer">
                                <div
                                    onClick={() => setNotificationOpen(!notificationOpen)}
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5 hover:opacity-80 transition-opacity" />
                                </div>

                                <div
                                    className={`absolute right-0 top-12 bg-white text-black rounded-[6px] border shadow-xl z-20 transform transition-all duration-200 origin-top ${
                                        notificationOpen
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    <NotificationModal
                                        notifications={user?.notifications || []}
                                        type={role}
                                    />
                                </div>
                            </div>

                            {/* AVATAR */}
                            <div className="relative">
                                <InitialAvatar
                                    name={firstName}
                                    open={logoutOpen}
                                    setOpen={setLogoutOpen}
                                />

                                <div
                                    className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2 z-10 transform transition-all duration-200 origin-top ${
                                        logoutOpen
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    {(role === "visitor" ||
                                        role === "system-admin") && (
                                        <button
                                            onClick={handleChangeUni}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Change University
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* MOBILE MENU BUTTON */}
                            <button
                                type="button"
                                className="md:hidden p-1 rounded bg-[var(--secondary-color)] hover:opacity-80 transition-opacity"
                                onClick={() => setMobileOpen((prev) => !prev)}
                                aria-label="Toggle navigation"
                            >
                                {mobileOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* MOBILE MENU */}
            {role !== "empty" && (
                <div
                    className={`md:hidden w-full bg-white text-black transition-[max-height,opacity] duration-200 overflow-hidden ${
                        mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col items-center text-center py-2 font-[Gilroy-Medium]">
                        {items.map((item) => (
                            <NavLink
                                key={item.href}
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
