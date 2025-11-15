import {useEffect, useRef, useState } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { Bell, MessageCircle } from "lucide-react";
import logoUrl from "../../assets/images/nav/Logo.png";
import "./Nav.css";

const navItems = {
    empty: [],
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
        { label: "Analytics", href: "/organizer/analytics" },
        { label: "My Disputes", href: "/disputes" },
    ],
    admin: [
        { label: "Manage Events", href: "/events" },
        { label: "Manage Users", href: "/manage-users" },
        { label: "Manage Disputes", href: "/manage-disputes" },
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
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        function onDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    useEffect(() => {
        console.log("Dropdown open state:", open);
    }, [open]);

    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        navigate("/log-in");
    }

    return (
        <nav id="nav" className="w-full h-15 bg-[#1F4C76] text-white flex items-center justify-between px-3 py-5 relative">

            {/* Left*/}
            <div id="nav-links" className="flex items-center gap-10">

                {/* Logo */}
                <div id="nav-logo" className="flex items-center gap-1 cursor-pointer" onClick={() => {navigate('/home')}}>
                    <img src={logoUrl} alt="Ticketorium logo" className="w-10 h-10" />

                    <div className="flex-direction-columns items-center">
                        <span className="text-lg font-[Gilroy-Black] flex h-3 text-[#1F4C76]">-</span>
                        <span className="font-[Gilroy-Black] font-black italic text-[20px] tracking-wide flex">Ticketorium.</span>
                    </div>
                </div>


                {/* Links */}
                <div id="nav-links-inner" className="hidden md:flex gap-6 font-[Gilroy-Medium]">
                    {navItems[type]?.map((item) => (
                        <NavLink to={item.href} className="text-white hover:underline">
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>


            {/* Right: Icons + Avatar */}
            <div id="nav-buttons"
                 className="flex items-center gap-4 relative"
                 ref={dropdownRef}
            >

                {/* Admin's Buttons*/}
                {(type === "admin") && (
                    <>
                        <Bell className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                    </>
                )}

                {/* Other User Types' Buttons*/}
                {(type === "student" || type === "visitor" || type === "organizer") && (
                    <>
                        <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        <Bell className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />

                        {/* Dropdown (Logout only) */}
                        <div
                            className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2 z-10 transform transition-all duration-200 ease-out origin-top animate-soft ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                            role="menu"
                        >
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">
                                Logout
                            </button>
                        </div>
                    </>
                )}

                <InitialAvatar name={userName} setOpen={setOpen} open={open} />
                <div
                    className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2 z-10 transform transition-all duration-200 ease-out origin-top animate-soft ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                    role="menu"
                >
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}
