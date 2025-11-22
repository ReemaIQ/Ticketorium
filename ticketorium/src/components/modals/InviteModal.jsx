// INVITE modal
// - dummy UI to invite other users (no backend yet)

import React, { useState } from "react";
import Modal from "./Modal.jsx";

function InviteRow({ person, price }) {
    const [invited, setInvited] = useState(false);
    const initial = person.name.charAt(0).toUpperCase();

    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                    <span className="text-slate-600 text-sm">{initial}</span>
                </div>
                <div>
                    <div className="font-semibold">{person.name}</div>
                    <div className="text-xs text-slate-500">
                        {person.subtitle}
                    </div>
                </div>
            </div>
            <button
                disabled={invited}
                onClick={() => setInvited(true)}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-slate-300 ${
                    invited
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-yellow-400 text-slate-900 hover:bg-yellow-300"
                }`}
            >
                {invited ? "Invited" : price > 0 ? "Pay & Invite" : "Invite"}
            </button>
        </div>
    );
}

function InviteList({ price }) {
    const [query, setQuery] = useState("");
    const users = [
        { name: "Ahmad Faisal", subtitle: "Student · CS Department" },
        { name: "Alex White", subtitle: "Visitor · No Department" },
        { name: "Sarah Salem", subtitle: "Student · EE Department" },
    ];

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="mt-6">
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-full border border-slate-300 px-4 py-2 pl-10"
                    placeholder="Search people"
                />
                {/* search icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 lucide lucide-search"
                    aria-hidden="true"
                >
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                </svg>
            </div>

            <div className="mt-4 space-y-3">
                {filtered.map((u) => (
                    <InviteRow key={u.name} person={u} price={price} />
                ))}
                {filtered.length === 0 && (
                    <div className="text-sm text-slate-500">No matches.</div>
                )}
            </div>
        </div>
    );
}

function InviteModal({ isOpen, onClose, title, price }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h3 className="text-xl font-semibold text-center">
                    Invite to <span className="font-bold">{title}</span>
                </h3>
                <p className="mt-2 text-center text-slate-500">
                    {price > 0 ? (
                        <>
                            You will pay{" "}
                            <span className="text-indigo-700 font-medium">
                                ${price.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <>This invite is free</>
                    )}
                </p>
                <InviteList price={price} />
            </div>
        </Modal>
    );
}

export default InviteModal;