// INVITE modal
// - Currently uses local dummy invitees
// - Designed so later you can pass real users + onInvite callback

import React, { useState } from "react";
import Modal from "./Modal.jsx";

/* ------------------------------------------------------------------ */
/* InviteRow                                                           */
/* ------------------------------------------------------------------ */

function InviteRow({ person, price, onInvite }) {
    const [invited, setInvited] = useState(false);

    const safeName = person?.name || "Unknown user";
    const initial = safeName.charAt(0).toUpperCase();
    const subtitle = person?.subtitle || "";

    const handleClick = async () => {
        if (invited) return;

        // Allow parent to hook into invitations (backend) later
        if (typeof onInvite === "function") {
            try {
                await onInvite(person);
            } catch (err) {
                console.error("Invite failed:", err);
                return; // don't mark as invited on error
            }
        }

        setInvited(true);
    };

    const isPaid = typeof price === "number" && price > 0;

    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                    <span className="text-slate-600 text-sm">{initial}</span>
                </div>
                <div>
                    <div className="font-semibold">{safeName}</div>
                    {subtitle && (
                        <div className="text-xs text-slate-500">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            <button
                type="button"
                disabled={invited}
                onClick={handleClick}
                className={`inline-flex items-center justify-center rounded-[6px] px-4 py-2 text-sm font-medium ${
                    invited
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-[var(--accent-color)] text-[var(--secondary-color)] cursor-pointer"
                }`}
            >
                {invited ? "Invited" : isPaid ? "Pay & Invite" : "Invite"}
            </button>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* InviteList                                                          */
/* ------------------------------------------------------------------ */

const DUMMY_USERS = [
    { name: "Ahmad Faisal", subtitle: "Student · CS Department" },
    { name: "Alex White", subtitle: "Visitor · No Department" },
    { name: "Sarah Salem", subtitle: "Student · EE Department" },
];

function InviteList({ price, invitees = DUMMY_USERS, onInvite }) {
    const [query, setQuery] = useState("");

    const filtered = invitees.filter((u) =>
        (u.name || "")
            .toLowerCase()
            .includes(query.toLowerCase())
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
                    <InviteRow
                        key={u.name || u.id}
                        person={u}
                        price={price}
                        onInvite={onInvite}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="text-sm text-slate-500">No matches.</div>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* InviteModal                                                         */
/* ------------------------------------------------------------------ */

function InviteModal({
    isOpen,
    onClose,
    title,
    price,
    invitees,
    onInvite,
}) {
    const safeTitle = title || "this event";
    const numericPrice =
        typeof price === "number" ? price : 0;
    const isPaid = numericPrice > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h3 className="text-xl font-semibold text-center">
                    Invite to{" "}
                    <span className="font-bold">{safeTitle}</span>
                </h3>
                <p className="mt-2 text-center text-slate-500">
                    {isPaid ? (
                        <>
                            You will pay{" "}
                            <span className="text-[var(--primary-color)] font-medium">
                                ${numericPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <>This invite is free</>
                    )}
                </p>
                <InviteList
                    price={numericPrice}
                    invitees={invitees}
                    onInvite={onInvite}
                />
            </div>
        </Modal>
    );
}

export default InviteModal;
