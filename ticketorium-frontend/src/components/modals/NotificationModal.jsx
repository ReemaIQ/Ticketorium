import NotificationList from "../notification-list/NotificationList.jsx";
import {useState, useMemo} from "react";
import {Check} from "lucide-react";

export default function NotificationModal(props) {
    // In a real app, this state would come from a Context or Prop
    const [notifications, setNotifications] = useState(props.notifications || {});

    const notificationArray = useMemo(() => {
        if (!notifications) return [];

        return Object.values(notifications)
            .filter((n) => {
                // If roles are defined, check if current userType is included
                if (n.roles && Array.isArray(n.roles)) {
                    return n.roles.includes(props.type);
                }
                // If no roles defined, assume visible to all (or change to false to be strict)
                return true;
            })
            .reverse(); // Sort new to old

    }, [notifications, props.type]);

    const unreadCount = notificationArray.filter(n => !n.read).length;

    const handleMarkAsRead = (id) => {
        console.log("Clicked notification ID:", id); // Check your console!

        setNotifications((prev) => {
            const key = String(id); // Ensure type safety (String vs Number)

            if (!prev[key]) {
                console.warn("Notification key not found:", key);
                return prev;
            }

            return {
                ...prev,
                [key]: { ...prev[key], read: true }
            };
        });
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => {
            const updated = {};
            // Loop through every key in the object
            Object.keys(prev).forEach(key => {
                updated[key] = { ...prev[key], read: true };
            });
            return updated;
        });
    };

    return (
        // The outer container handles the specific sizing inside the Nav dropdown
        <div className="w-[375px] md:w-[380px] md:mr-0 md:mt-0 ">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-[Gilroy-Medium] text-[#1A1A1A]">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-[var(--warning-color)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-[12px] text-[var(--secondary-color)] font-[Gilroy-Bold] hover:underline flex items-center gap-1"
                    >
                        <Check className="w-3 h-3" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* List Component */}
            <NotificationList
                notifications={notificationArray}
                onMarkAsRead={handleMarkAsRead}
            />

        </div>
    );
}