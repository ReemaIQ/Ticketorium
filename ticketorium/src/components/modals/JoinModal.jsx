// JOIN modal
// - picks seat (if hasSeatingPlan)
// - calls createTicket() backend
// - redirects to /registration success page

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
                       occupiedSeats = ["1B", "2C", "3D", "4E"], // demo dummy seats
                   }) {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [accessibilityNotes, setAccessibilityNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleJoin() {
        if (hasSeatingPlan && !selectedSeat) {
            alert("Please choose a seat before joining.");
            return;
        }

        if (!userId) {
            alert("You must be logged in to join events.");
            return;
        }

        try {
            setLoading(true);

            const createdTicket = await createTicket({
                eventId,
                userId,
                seat: hasSeatingPlan ? selectedSeat : null,
                price,
            });

            // store in parent state for Ticket modal
            setTicket({
                ...createdTicket,
                accessibilityNotes,
            });

            setViewState("joined");
            onClose();

            // go to registration status page
            navigate("/registration", {
                state: {
                    isSuccess: true,
                    eventId,
                    ticketId: createdTicket.id,
                    ticketCode: createdTicket.ticketCode,
                    seat: createdTicket.seat,
                    price: createdTicket.price,
                    fromEventId: eventId,
                },
            });
        } catch (err) {
            console.error("Error creating ticket:", err);

            // demo failure path → checkout
            navigate("/checkout", {
                state: {
                    isSuccess: false,
                    eventId,
                    fromEventId: eventId,
                },
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Join <span className="font-bold">{title}</span>?
                </h3>

                <p className="mt-2 text-slate-500">
                    {price > 0 ? (
                        <>
                            You will pay{" "}
                            <span className="text-[var(--primary-color)] font-medium">
                                ${price.toFixed(2)}
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

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium bg-white text-[var(--secondary-color)] border border-[var(--secondary-color)] rounded-[6px] cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                        {loading
                            ? "Processing..."
                            : price > 0
                                ? "Pay & Join"
                                : "Join"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default JoinModal;