// RESIGN modal
// - confirms that the user wants to resign from an event
// - can optionally show refund amount if price > 0
// - parent passes onConfirm() to update state (e.g., setViewState("not-joined"))

import React from "react";
import Modal from "./Modal.jsx";

function ResignModal({ isOpen, onClose, title, price = 0, onConfirm }) {
    const safeTitle = title || "this event";
    const numericPrice = typeof price === "number" ? price : 0;
    const hasRefund = numericPrice > 0;

    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Are you sure you want to resign from{" "}
                    <span className="font-bold">{safeTitle}</span>?
                </h3>

                {hasRefund && (
                    <p className="mt-2 text-slate-500 text-center">
                        You will receive a refund of{" "}
                        <span className="text-indigo-700 font-medium">
                            ${numericPrice.toFixed(2)}
                        </span>
                        .
                    </p>
                )}
            </div>

            <div className="mt-6 flex justify-center gap-3">
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-4 py-2 text-sm font-medium bg-white border border-[var(--warning-color)] text-[var(--warning-color)] rounded-[6px] cursor-pointer"
                >
                    Resign
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)] rounded-[6px] cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export default ResignModal;
