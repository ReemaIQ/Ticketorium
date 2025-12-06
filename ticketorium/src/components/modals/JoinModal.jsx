// JOIN modal
// - picks seat (if hasSeatingPlan)
// - calls createTicket() backend
// - redirects to /registration or /checkout

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";
import SeatingPlan from "../event/SeatingPlan.jsx";
import { createTicket } from "../../api/tickets.js";

function JoinModal({
    isOpen,
    onClose,
    eventId,
    title,
    price,
    hasSeatingPlan,
    userId,
    setTicket,
    setViewState,
    occupiedSeats = [], // no more hardcoded dummy seats
}) {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [accessibilityNotes, setAccessibilityNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const numericPrice =
        typeof price === "number" ? price : 0;
    const isPaid = numericPrice > 0;
    const safeTitle = title || "this event";

    async function handleJoin() {
        // reset error on new attempt
        setError("");

        if (!eventId) {
            setError("Missing event information. Please try again.");
            return;
        }

        if (!userId) {
            setError("You must be logged in to join events.");
            return;
        }

        if (hasSeatingPlan && !selectedSeat) {
            setError("Please choose a seat before joining.");
            return;
        }

        try {
            setLoading(true);

            const createdTicket = await createTicket({
                eventId,
                userId,
                seat: hasSeatingPlan ? selectedSeat : null,
                price: numericPrice,
            });

            // store in parent state for Ticket modal (if provided)
            if (typeof setTicket === "function") {
                setTicket({
                    ...createdTicket,
                    accessibilityNotes,
                });
            }

            if (typeof setViewState === "function") {
                setViewState("joined");
            }

            onClose?.();

            const ticketId =
                createdTicket._id ?? createdTicket.id ?? createdTicket.ticketId;

            if (isPaid) {
                // redirect to checkout for paid events
                navigate("/checkout", {
                    state: {
                        eventId,
                        ticketId,
                        fromEventId: eventId,
                        price: createdTicket.price ?? numericPrice,
                    },
                });
            } else {
                // go to registration status page for free events
                navigate("/registration", {
                    state: {
                        isSuccess: true,
                        eventId,
                        ticketId,
                        ticketCode: createdTicket.ticketCode,
                        seat: createdTicket.seat,
                        price: createdTicket.price,
                        fromEventId: eventId,
                    },
                });
            }
        } catch (err) {
            console.error("Error creating ticket:", err);
            setError("Failed to join this event. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Join <span className="font-bold">{safeTitle}</span>?
                </h3>

                <p className="mt-2 text-slate-500">
                    {isPaid ? (
                        <>
                            You will pay{" "}
                            <span className="text-[var(--primary-color)] font-medium">
                                ${numericPrice.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <>This event is free</>
                    )}
                </p>

                {hasSeatingPlan && (
                    <SeatingPlan
                        selectedSeat={selectedSeat}
                        onSelect={setSelectedSeat}
                        occupiedSeats={occupiedSeats}
                    />
                )}

                <label className="mt-6 block text-sm text-slate-600">
                    Accessibility needs (optional)
                </label>
                <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                    placeholder=""
                    value={accessibilityNotes}
                    onChange={(e) => setAccessibilityNotes(e.target.value)}
                />

                {error && (
                    <p className="mt-3 text-xs text-red-500 text-left">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-white text-[var(--secondary-color)] border border-[var(--secondary-color)] rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleJoin}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                        {loading
                            ? "Processing..."
                            : isPaid
                            ? "Pay & Join"
                            : "Join"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default JoinModal;
