// src/components/users/UserCard.jsx
import React from "react";

function getAvatarColor(type) {
    const r = type.toLowerCase();
    if (r.includes("student")) return "bg-[#C9C9FF]";
    if (r.includes("organizer")) return "bg-[#E6C4C7]";
    if (r.includes("admin")) return "bg-[#FFE4B2]";
    return "bg-[#D4D4D4]";
}

export default function UserCard({ user, onDelete, onEdit }) {
    const initial = user["first-name"]?.trim()?.charAt(0).toUpperCase() || "?";
    const avatarColor = getAvatarColor(user["type"] || "");

    return (
        <div className="max-w-5xl w-full mx-auto">
            <div className="w-full rounded-[6px] border border-gray-300 bg-white px-6 py-4 flex items-center justify-between mb-4">

                {/* Left: avatar + info */}
                <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center`}>
                          <span className="text-[20px] font-[Gilroy-Black] text-[#3B3B3B]">
                            {initial}
                          </span>
                    </div>

                    {/* Text info */}
                    <div className="flex flex-col gap-1">
                        <span className="font-[Gilroy-Bold] text-[16px] text-[#1A1A1A] leading-tight">
                            {user["first-name"]}
                        </span>

                        <span className="font-[Gilroy-Medium] text-[12px] text-[#555555] leading-tight">
                            {user["type"]}
                        </span>

                        <span className="font-[Gilroy-Medium] text-[12px] text-[#555555] leading-tight">
                            {user.department}
                        </span>
                    </div>
                </div>

                {/* Right: edit and delete buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onDelete?.(user.id)}
                        className="px-5 py-1.5 rounded-[6px] border border-[var(--warning-color)] text-[var(--warning-color)] text-[14px] font-[Gilroy-Medium]"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={() => onEdit?.(user.id)}
                        className="px-5 py-1.5 rounded-[6px] border border-[var(--secondary-color)] text-[var(--secondary-color)] text-[14px] font-[Gilroy-Medium]"
                    >
                        Edit
                    </button>
                </div>

            </div>
        </div>
    );
}
