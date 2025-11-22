// src/components/modals/Modal.jsx
// reema: generic modal shell used by Join / Ticket / Verify / Invite

import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative mx-4 w-xl rounded-xl bg-white p-6 shadow-xl">
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}