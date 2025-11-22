import React from "react";
import Modal from "./Modal.jsx";
import QRCode from "react-qr-code";

function TicketModal({ isOpen, onClose, ticket, title }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Your Ticket</h3>

                {!ticket ? (
                    <p className="text-sm text-slate-500">
                        No ticket found. Please join the event first.
                    </p>
                ) : (
                    <>
                        {/* Ticket code */}
                        <p className="text-sm text-slate-600 mb-4">
                            Ticket Code:{" "}
                            <span className="font-mono font-semibold">
                                {ticket.ticketCode}
                            </span>
                        </p>

                        {/* QR Code */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 rounded-lg border inline-block">
                                <QRCode
                                    value={
                                        ticket.qrData ||
                                        ticket.qrToken ||
                                        ticket.ticketCode
                                    }
                                    size={160}
                                />
                            </div>
                        </div>

                        {/* Event & seat info */}
                        <div className="text-sm text-slate-600 space-y-1 mb-4">
                            <div>
                                Event:{" "}
                                <span className="font-semibold">{title}</span>
                            </div>
                            <div>
                                Seat:{" "}
                                <span className="font-semibold">
                                    {ticket.seat || "General Admission"}
                                </span>
                            </div>
                            <div>
                                Price:{" "}
                                <span className="font-semibold">
                                    {ticket.price > 0
                                        ? `SAR ${ticket.price.toFixed(2)}`
                                        : "Free"}
                                </span>
                            </div>
                            {ticket.accessibilityNotes && (
                                <div className="mt-2 text-xs text-slate-500">
                                    Accessibility notes:{" "}
                                    <span className="italic">
                                        {ticket.accessibilityNotes}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium border border-slate-300 bg-white text-slate-700 rounded-md shadow-sm hover:bg-slate-50"
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