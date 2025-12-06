import Notification from "../notifications/Notification.jsx";
import {Clock } from "lucide-react"

function NotificationList({ notifications, onMarkAsRead }) {

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-[#A0A0A0]" />
                </div>
                <p className="text-[14px] text-[#A0A0A0] font-[Gilroy-Medium]">No notifications yet.</p>
            </div>
        );
    }

    return (
        <div className="max-h-[400px] w-full overflow-y-auto custom-scrollbar">
            {notifications.map((notif) => (
                <Notification
                    key={notif.id}
                    notification={notif}
                    onRead={onMarkAsRead}
                />
            ))}
        </div>
    );
}

export default NotificationList;