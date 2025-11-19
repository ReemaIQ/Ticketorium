import React from "react";
import { Calendar, Gavel, Ticket, AlertCircle, Shield, Clock } from "lucide-react";

// Helper to get the right icon based on category
const NotificationIcon = ({ category }) => {
    const baseClass = "w-5 h-5";

    switch (category) {
        case "event":
        case "organizer_event":
            return <Calendar className={`${baseClass} text-[#14113B]`} />;
        case "bidding":
            return <Gavel className={`${baseClass} text-[#14113B]`} />;
        case "listing":
            return <Ticket className={`${baseClass} text-[#14113B]`} />;
        case "dispute":
            return <AlertCircle className={`${baseClass} text-[#14113B]`} />;
        case "account":
        case "security":
            return <Shield className={`${baseClass} text-[#14113B]`} />;
        default:
            return <Clock className={`${baseClass} text-[#14113B]`} />;
    }
};

function Notification({ notification, onRead }) {
    return (
        <div
            onClick={() => onRead(notification.id)}
            className={`
                flex gap-3 p-4 border-b border-[#E0E0E0] cursor-pointer hover:bg-[#F9FAFB] transition-colors
                ${!notification.read ? "bg-[#EFF7FF]" : "bg-white"}
            `}
        >
            {/* Icon Container */}
            <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <NotificationIcon category={notification.category} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={`text-[14px] leading-tight mb-1 ${!notification.read ? "font-[Gilroy-Bold] text-[#14113B]" : "font-[Gilroy-Medium] text-[#505050]"}`}>
                        {notification.titleTemplate}
                    </h4>
                    {/* Unread Dot */}
                    {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5"></span>
                    )}
                </div>
                <p className="text-[13px] text-[#666] font-[Gilroy-Medium] leading-snug mb-2">
                    {notification.bodyTemplate}
                </p>
                <span className="text-[12px] text-[#A0A0A0] font-[Gilroy-Medium]">
                    {notification.timestamp}
                </span>
            </div>
        </div>
    );
}

export default Notification;