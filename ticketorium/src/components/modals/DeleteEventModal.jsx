// DELETE EVENT modal
// - confirms deleting an event
// - parent passes onConfirm() to do actual delete logic or show banner

import React from "react";
import Modal from "./Modal.jsx";

function DeleteEventModal({ isOpen, onClose, title, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Really delete <span className="font-bold">{title}</span>?
                </h3>
                <p className="mt-2 text-slate-500">
                    This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                        }}
                        className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-500"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteEventModal;