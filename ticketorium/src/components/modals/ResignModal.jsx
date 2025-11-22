import React, { useEffect } from "react";
import { X } from "lucide-react"; // Assuming you have lucide-react, or use &times;

export default function ResignModal({ isOpen, onClose, onConfirm, eventName, refundAmount }) {
    useEffect(() => {
        if (!isOpen) return;

        function onKey(e) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl transform transition-all">
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                <div className="text-center mt-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Resign from <span className="font-bold text-[var(--secondary-color)]">{eventName || "this event"}</span>?
                    </h3>

                    {refundAmount !== undefined && refundAmount > 0 && (
                        <p className="mt-2 text-slate-500">
                            Refund: <span className="text-[var(--success-color)] font-bold">${Number(refundAmount).toFixed(2)}</span>
                        </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">
                        Are you sure you want to proceed? This action cannot be undone.
                    </p>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 text-sm font-medium bg-[var(--warning-color)] text-white rounded-[6px] hover:opacity-90 transition-opacity"
                    >
                        Confirm Resignation
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 rounded-[6px] hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}