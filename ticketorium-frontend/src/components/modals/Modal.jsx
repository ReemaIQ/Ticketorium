// src/components/modals/Modal.jsx
// reema: generic modal shell used by Join / Ticket / Verify / Invite

import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;

        function onKey(e) {
            if (e.key === "Escape") {
                if (typeof onClose === "function") {
                    onClose();
                }
            }
        }

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    // Lock background scroll while modal is open
    useEffect(() => {
        if (!isOpen) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />

            {/* Modal content */}
            <div className="relative mx-4 w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}
