// DELETE EVENT modal
// - confirms deleting an event
// - parent passes onConfirm() to do actual delete logic (API call, banner, refetch, etc.)

import React from "react";
import Modal from "./Modal.jsx";

function DeleteEventModal({ isOpen, onClose, title, onConfirm }) {
    const safeTitle = title || "this event";

    const handleConfirm = () => {
        if (typeof onConfirm === "function") {
            onConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{safeTitle}</span>?
                </h3>
                <p className="mt-2 text-slate-500">
                    This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-md bg-[var(--warning-color)] text-white cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-[6px] border border-[var(--primary-color)] text-[var(--primary-color)] bg-white cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteEventModal;
