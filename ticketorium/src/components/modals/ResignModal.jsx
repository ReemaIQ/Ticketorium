// RESIGN modal
// - confirms that the user wants to resign from an event
// - can optionally show refund amount if price > 0
// - parent passes onConfirm() to update state (e.g., setViewState("not-joined"))

import React from "react";
import Modal from "./Modal.jsx";

function ResignModal({ isOpen, onClose, title, price = 0, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Are you sure you want to resign from{" "}
                    <span className="font-bold">{title}</span>?
                </h3>
            </div>

            {price > 0 && (
                <p className="mt-2 text-slate-500 text-center">
                    You will receive a refund of:{" "}
                    <span className="text-indigo-700 font-medium">
                        ${price.toFixed(2)}
                    </span>
                </p>
            )}

            <div className="mt-6 flex justify-center gap-3">
                <button
                    onClick={() => {
                        if (onConfirm) onConfirm();
                    }}
                    className="px-4 py-2 text-sm font-medium bg-white border border-rose-600 text-rose-600 rounded-md shadow-sm hover:bg-rose-50"
                >
                    Resign
                </button>

                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium border bg-white text-slate-700 rounded-md shadow-sm hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export default ResignModal;