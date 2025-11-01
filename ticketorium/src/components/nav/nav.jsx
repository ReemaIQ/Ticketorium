import { useEffect, useRef, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import logoUrl from "../../assets/nav/Logo.png";

const navItems = {
    empty: [],
    student: [
        { label: "All Events", href: "/student/events" },
        { label: "My Events", href: "/student/my-events" },
        { label: "Bidding", href: "/student/bidding" },
        { label: "My Disputes", href: "/student/disputes" },
    ],
    visitor: [
        { label: "All Events", href: "/visitor/events" },
        { label: "My Events", href: "/visitor/my-events" },
        { label: "My Disputes", href: "/visitor/disputes" },
    ],
    organizer: [
        { label: "My Events", href: "/organizer/my-events" },
        { label: "Create Event", href: "/organizer/create" },
        { label: "Analytics", href: "/organizer/analytics" },
        { label: "My Disputes", href: "/organizer/disputes" },
    ],
    admin: [
        { label: "Manage Events", href: "/admin/manage-events" },
        { label: "Manage Users", href: "/admin/manage-users" },
        { label: "Manage Disputes", href: "/admin/manage-disputes" },
        { label: "System Policies", href: "/admin/system-policies" },
    ],
};

function InitialAvatar({ name }) {
    const letter = (name && name.trim().charAt(0).toUpperCase()) || "U"; // U = Unknown

    return (
        <div
            aria-label="User menu"
            className="w-8 h-8 rounded-full bg-[#404d71] text-white grid place-items-center select-none hover:bg-[#55608a] cursor-pointer"
        >
            <span className="text-sm font-semibold">{letter}</span>
        </div>
    );
}

export default function Nav({userName, type}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const handleLogoClick = () => {
        let path;

        switch (type) {
            case "student":
                path = "/home/student";
                break;
            case "visitor":
                path = "/home/visitor";
                break;
            case "organizer":
                path = "/home/organizer";
                break;
            case "admin":
                path = "/home/admin";
                break;
            case "empty":
            default:
                path = "/home";
                break;
        }

        window.location.href = path;
    };

    return (
        <nav id="nav" className="w-full h-15 bg-[#1F4C76] text-white flex items-center justify-between px-3 py-5 relative">

            {/* Left*/}
            <div id="nav-links" className="flex items-center gap-10">

                {/* Logo */}
                <div id="nav-logo" className="flex items-center gap-1" onClick={handleLogoClick}>
                    <img src={logoUrl} alt="Ticketorium logo" className="w-10 h-10" />

                    <div className="flex-direction-columns items-center">
                        <span className="text-lg font-[Gilroy] font-black flex h-3 text-[#1F4C76]">-</span>
                        <span className="font-[Gilroy] font-black italic text-[20px] tracking-wide flex">Ticketorium.</span>
                    </div>
                </div>


                {/* Links */}
                <div id="nav-links-inner" className="hidden md:flex gap-6 font-[Gilroy] font-medium">
                    {navItems[type]?.map((item) => (
                        <a key={item.label} href={item.href} className="text-white hover:underline">
                            {item.label}
                        </a>
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
                    <Bell className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                )}

                {/* Other User Types' Buttons*/}
                {(type === "student" || type === "visitor" || type === "organizer") && (
                    <>
                        <MessageCircle className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        <Bell className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />

                        <button
                            type="button"
                            onClick={() => setOpen((s) => !s)}
                            className="focus:outline-none"
                            aria-haspopup="menu"
                            aria-expanded={open}
                        >
                            <InitialAvatar name={userName} />
                        </button>

                        {/* Dropdown (Logout only) */}
                        <div
                            className={`absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-40 py-2 transform transition-all duration-200 ease-out origin-top animate-soft ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                            role="menu"
                        >
                            <button onClick={() => console.log("Logout")} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">
                                Logout
                            </button>
                        </div>
                    </>
                )}

            </div>
        </nav>
    );
}
