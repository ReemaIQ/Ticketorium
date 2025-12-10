import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import MiniBidding from "../bidding/MiniBidding.jsx";

export default function AddListingModal({
                                            open,
                                            onClose,
                                            biddings = {}, // [array of tickets]
                                            onCreate,      // ({ticketId, deadline, startingBid}) => void
                                        }) {
    const items = Array.isArray(biddings) ? biddings : [];
    const [selectedId, setSelectedId] = useState(null);
    const [deadline, setDeadline] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const dialogRef = useRef(null);

    /* Reset on open */
    useEffect(() => {
        if (open) {
            setSelectedId(null);
            setDeadline("");
            setStartingBid("");
        }
    }, [open]);

    /* ESC to close */
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    /* Focus trap */
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
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-8">
                <div
                    ref={dialogRef}
                    tabIndex={-1}
                    className="w-fit max-w-5xl px-5 rounded-2xl bg-white shadow-xl outline-none"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5">
                        <h2 className="font-[Gilroy-Black] text-[24px]">
                            Select a Ticket to Put on Sale
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Ticket List */}
                    <div className="flex flex-col items-center gap-5 p-3 pb-10">
                        <div className="h-72 overflow-y-auto pr-1 space-y-3 w-full">
                            {items.map((ticket) => {
                                const id = String(ticket._id || ticket.id);

                                // Build the MiniBidding props from the ticket
                                const bidding = {
                                    id,
                                    title: ticket.event?.title || "Graduation Event",
                                    description: ticket.seat
                                        ? `Seat: ${ticket.seat}`
                                        : ticket.description || "Seat info not available",
                                    img:
                                        ticket.imageUrl ||
                                        "/src/assets/images/event/graduation.png",
                                    date: ticket.event?.startAt
                                        ? new Date(ticket.event.startAt).toLocaleDateString()
                                        : "",
                                };

                                return (
                                    <div
                                        key={id}
                                        onClick={() => setSelectedId(id)}
                                        className={`cursor-pointer rounded-xl transition border-2 ${
                                            selectedId === id
                                                ? "border-[var(--primary-color)]"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <MiniBidding bidding={bidding} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom form */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Deadline */}
                            <label>
                                <span className="text-[12px] text-[#7B7B7B] mb-1 block">
                                    Deadline
                                </span>

                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={deadline}
                                    onChange={(e) => {
                                        const picked = e.target.value;
                                        const today = new Date()
                                            .toISOString()
                                            .split("T")[0];
                                        if (picked < today) {
                                            alert("Deadline cannot be in the past.");
                                            setDeadline("");
                                        } else setDeadline(picked);
                                    }}
                                    className="w-full border-b border-gray-300 focus:border-[var(--primary-color)] outline-none bg-transparent py-1"
                                    placeholder="YYYY/MM/DD"
                                />
                            </label>

                            {/* Starting bid */}
                            <label>
                                <span className="text-[12px] text-[#7B7B7B] mb-1 block">
                                    Starting Bid
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={startingBid}
                                    onChange={(e) => setStartingBid(e.target.value)}
                                    className="w-full border-b border-gray-300 focus:border-[var(--primary-color)] outline-none bg-transparent py-1"
                                    placeholder="0.00"
                                />
                            </label>
                        </div>

                        {/* Create button */}
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
                            className={`ml-auto rounded-[6px] px-5 py-2 text-[14px] font-[Gilroy-Medium] transition
                                ${
                                canCreate
                                    ? "bg-[var(--accent-color)] text-[var(--secondary-color)] cursor-pointer"
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