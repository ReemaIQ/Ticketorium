// Decline Invite modal
// - confirms declining an invite
// - parent passes onConfirm() to do actual delete logic or show banner

import React from "react";
import Modal from "./Modal.jsx";

function DeclineInviteModal({ isOpen, onClose, onConfirm }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Are you sure you want to decline?
                </h3>
                <p className="mt-2 text-slate-500">
                    This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                        }}
                        className="px-4 py-2 rounded-md bg-[var(--warning-color)] text-white cursor-pointer"
                    >
                        Decline
                    </button>
                    <button
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

export default DeclineInviteModal;