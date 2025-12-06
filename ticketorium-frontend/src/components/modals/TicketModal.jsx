import React from "react";
import Modal from "./Modal.jsx";
import QRCode from "react-qr-code";

function TicketModal({ isOpen, onClose, ticket, title }) {
    const safeTitle = title || "this event";

    const hasTicket = !!ticket;
    const ticketCode = ticket?.ticketCode || ticket?.code || "";
    const seatLabel = ticket?.seat || "General Admission";

    const numericPrice =
        typeof ticket?.price === "number" ? ticket.price : 0;
    const isPaid = numericPrice > 0;

    const accessibilityNotes = ticket?.accessibilityNotes;

    // Prefer qrData → qrToken → ticketCode; ensure it's a string
    const qrValue =
        String(
            ticket?.qrData ||
                ticket?.qrToken ||
                ticketCode ||
                "",
        );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Your Ticket</h3>

                {!hasTicket ? (
                    <p className="text-sm text-slate-500">
                        No ticket found. Please join the event first.
                    </p>
                ) : (
                    <>
                        {/* Ticket code */}
                        {ticketCode && (
                            <p className="text-sm text-slate-600 mb-4">
                                Ticket Code:{" "}
                                <span className="font-mono font-semibold">
                                    {ticketCode}
                                </span>
                            </p>
                        )}

                        {/* QR Code */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 rounded-lg border inline-block">
                                <QRCode
                                    value={qrValue}
                                    size={160}
                                />
                            </div>
                        </div>

                        {/* Event & seat info */}
                        <div className="text-sm text-slate-600 space-y-1 mb-4">
                            <div>
                                Event:{" "}
                                <span className="font-semibold">
                                    {safeTitle}
                                </span>
                            </div>
                            <div>
                                Seat:{" "}
                                <span className="font-semibold">
                                    {seatLabel}
                                </span>
                            </div>
                            <div>
                                Price:{" "}
                                <span className="font-semibold">
                                    {isPaid
                                        ? `SAR ${numericPrice.toFixed(2)}`
                                        : "Free"}
                                </span>
                            </div>
                            {accessibilityNotes && (
                                <div className="mt-2 text-xs text-slate-500">
                                    Accessibility notes:{" "}
                                    <span className="italic">
                                        {accessibilityNotes}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-[Gilroy-Medium] border border-[var(--secondary-color)] bg-white text-[var(--secondary-color)] rounded-[6px] cursor-pointer"
                        >
                            Close
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
}

export default TicketModal;
