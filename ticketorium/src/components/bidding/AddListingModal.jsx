import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import MiniBidding from "./MiniBidding.jsx";

export default function AddListingModal({
                                            open,
                                            onClose,
                                            biddings = {}, // [{id, title, desc, img, countdownText, dateText, organizer}]
                                            onCreate,     // ({ticketId, deadline, startingBid}) => void
                                        }) {
    const items = Object.entries(biddings);
    const [selectedId, setSelectedId] = useState(null);
    const [deadline, setDeadline] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const dialogRef = useRef(null);

    // Reset when opening
    useEffect(() => {
        if (open) {
            setSelectedId(null);
            setDeadline("");
            setStartingBid("");
        }
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Focus trap entry
    useEffect(() => {
        if (open) dialogRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const canCreate =
        selectedId &&
        deadline &&
        String(startingBid).trim() !== "" &&
        !Number.isNaN(Number(startingBid));

    return (
        <div className="fixed inset-0 z-[100]" aria-labelledby="sell-title" role="dialog" aria-modal="true">

            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true"/>

            {/* Dialog */}
            <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-8">
                <div ref={dialogRef} tabIndex={-1} className="w-fit max-w-5xl px-5 rounded-2xl bg-white shadow-xl outline-none">

                    {/* Header */}
                    <div className="flex items-center justify-between p-5">

                        <h2 id="sell-title" className="font-[Gilroy-Black] text-[24px] text-[#1A1A1A]">
                            Select a Ticket to Put on Sale
                        </h2>

                        <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-gray-100">
                            <X size={18} />
                        </button>

                    </div>

                    {/* Body: ticket list */}
                    <div className="flex flex-col justify-center items-center gap-5 p-3 pb-10">
                        <div className="h-72 overflow-y-auto pr-1 space-y-3">
                            {items.map(([ id, bidding]) => (
                                <MiniBidding bidding={bidding} />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Deadline */}
                            <label className="block">
                                <span className="font-[Gilroy-Medium] block text-[12px] text-[#7B7B7B] mb-1">
                                  Deadline
                                </span>

                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]} // 🔒 cannot pick past date
                                    value={deadline}
                                    onChange={
                                        (e) => {
                                        const picked = e.target.value;
                                        const today = new Date().toISOString().split("T")[0];
                                        if (picked < today) {
                                            alert("Deadline cannot be in the past.");
                                            setDeadline("");
                                        } else {
                                            setDeadline(picked);
                                        }
                                    }}
                                    className="w-full border-b border-gray-300 focus:border-[#4F6FFF] outline-none bg-transparent py-1"
                                    placeholder="YYYY/MM/DD"
                                />
                            </label>

                            {/* Starting Bid */}
                            <label className="block font-[Gilroy-Medium]">
                                <span className="block text-[12px] text-[#7B7B7B] mb-1">
                                  Starting Bid
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={startingBid}
                                    onChange={(e) => setStartingBid(e.target.value)}
                                    className="w-full border-b border-gray-300 focus:border-[#4F6FFF] outline-none bg-transparent py-1"
                                    placeholder="0.00"
                                />
                            </label>
                        </div>

                        <button
                            onClick={() =>
                                canCreate &&
                                onCreate?.({
                                    ticketId: selectedId,
                                    deadline,
                                    startingBid: Number(startingBid),
                                })
                            }
                            disabled={!canCreate}
                            className={`ml-auto inline-flex items-center justify-center rounded-[6px] px-5 py-2 text-[14px] font-[Gilroy-Medium] transition
                                ${
                                    canCreate
                                        ? "bg-[#4F6FFF] text-white hover:brightness-110"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Create Listing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
