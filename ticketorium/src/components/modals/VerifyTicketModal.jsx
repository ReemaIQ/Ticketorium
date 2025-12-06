// Ticketorium/ticketorium/src/components/modals/VerifyTicketModal.jsx

import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { verifyTicket } from "../../api/tickets.js";
import { Scanner } from "@yudiel/react-qr-scanner";

function VerifyForm({ eventId, onClose }) {
    const [mode, setMode] = useState("code"); // "code" | "scan"
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastScanned, setLastScanned] = useState("");
    const [inlineError, setInlineError] = useState("");

    // ---------------------------
    // Core verifier
    // ---------------------------
    async function runVerify(payload) {
        if (!eventId) {
            setResult({
                valid: false,
                message: "Missing event information. Please reload the page.",
            });
            return;
        }

        setLoading(true);
        setInlineError("");
        try {
            const response = await verifyTicket(payload);
            setResult(response);
        } catch (err) {
            console.error("Verify error:", err);
            setResult({
                valid: false,
                message: "Server error while verifying ticket.",
            });
        } finally {
            setLoading(false);
        }
    }

    // ---------------------------
    // Verify by manual code
    // ---------------------------
    async function handleVerifyByCode() {
        const trimmed = code.trim();
        if (!trimmed) {
            setInlineError("Please enter a ticket code.");
            setResult(null);
            return;
        }
        await runVerify({ code: trimmed, eventId });
    }

    // ---------------------------
    // Verify scanned QR token
    // ---------------------------
    async function handleVerifyByToken(token) {
        if (!token) return;

        // Prevent repeated scanning of same token unless result changed
        if (token === lastScanned && result?.valid !== undefined) return;
        setLastScanned(token);

        await runVerify({ token, eventId });
    }

    const safeOnClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    // Helpers for result
    const hasResult = !!result;
    const isValid = !!result?.valid;
    const resultMessage =
        result?.message ||
        (isValid
            ? "Ticket is valid."
            : "Ticket could not be verified.");

    const ticketInfo = result?.ticket || {};
    const ticketCode = ticketInfo.ticketCode || ticketInfo.code || "";
    const ticketEventId = ticketInfo.eventId ?? ticketInfo.event_id ?? "";
    const ticketStatus = ticketInfo.status || ticketInfo.state || "";
    const ticketSeat = ticketInfo.seat || "";

    return (
        <div>
            {/* Mode Tabs */}
            <div className="flex mb-4 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setMode("code")}
                    className={`flex-1 py-2 text-sm font-[Gilroy-Medium] ${
                        mode === "code"
                            ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)] cursor-pointer"
                            : "text-slate-500"
                    }`}
                >
                    Enter Ticket Code
                </button>

                <button
                    type="button"
                    onClick={() => setMode("scan")}
                    className={`flex-1 py-2 text-sm font-[Gilroy-Medium] ${
                        mode === "scan"
                            ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)] cursor-pointer"
                            : "text-slate-500"
                    }`}
                >
                    Scan QR
                </button>
            </div>

            {/* ----------------------------------------- */}
            {/* CODE MODE */}
            {/* ----------------------------------------- */}
            {mode === "code" && (
                <>
                    <label className="block text-sm font-[Gilroy-Medium] text-slate-800 mb-1">
                        Ticket Code
                    </label>

                    <input
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            if (inlineError) setInlineError("");
                        }}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        placeholder="Ex: TKT-KFUP-1234-ABCDEF"
                    />

                    {inlineError && (
                        <p className="mt-2 text-xs text-[var(--warning-color)]">
                            {inlineError}
                        </p>
                    )}

                    <div className="flex justify-center mt-6 gap-3">
                        <button
                            type="button"
                            onClick={handleVerifyByCode}
                            disabled={loading}
                            className="px-4 py-2 rounded-[6px] bg-[var(--accent-color)] cursor-pointer disabled:opacity-60 text-[var(--secondary-color)]"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>

                        <button
                            type="button"
                            onClick={safeOnClose}
                            className="px-4 py-2 border border-[var(--secondary-color)] rounded-[6px] bg-white cursor-pointer text-[var(--secondary-color)]"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}

            {/* ----------------------------------------- */}
            {/* QR SCAN MODE */}
            {/* ----------------------------------------- */}
            {mode === "scan" && (
                <div className="mt-2 text-sm text-slate-600 space-y-3">
                    <p className="text-xs text-slate-500">
                        Point the camera at the ticket&apos;s QR code. The
                        ticket will be automatically verified.
                    </p>

                    <div className="w-full max-w-xs mx-auto overflow-hidden rounded-lg border border-slate-200">
                        <Scanner
                            constraints={{ facingMode: "environment" }}
                            onScan={(detectedCodes) => {
                                if (
                                    !detectedCodes ||
                                    detectedCodes.length === 0
                                )
                                    return;

                                const token = detectedCodes[0]?.rawValue;
                                if (!token) return;

                                console.log("Scanned QR:", token);
                                handleVerifyByToken(token);
                            }}
                            onError={(error) =>
                                console.log("Scanner error:", error)
                            }
                            styles={{
                                container: { width: "100%" },
                                video: { width: "100%" },
                            }}
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={safeOnClose}
                            className="px-4 py-2 border rounded-md bg-white hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ----------------------------------------- */}
            {/* RESULT PANEL */}
            {/* ----------------------------------------- */}
            {hasResult && (
                <div
                    className={`mt-6 rounded-md border px-4 py-3 text-sm ${
                        isValid
                            ? "bg-emerald-50 border-[var(--success-color)] text-[var(--success-color)]"
                            : "bg-rose-50 border-[var(--warning-color)] text-[var(--warning-color)]"
                    }`}
                >
                    <div className="font-semibold mb-1">
                        {isValid ? "Ticket Verified" : "Ticket Invalid"}
                    </div>

                    <div>{resultMessage}</div>

                    {(ticketCode ||
                        ticketEventId ||
                        ticketStatus ||
                        ticketSeat) && (
                        <div className="mt-2 text-xs text-slate-700 space-y-1">
                            {ticketCode && (
                                <div>
                                    Ticket Code:{" "}
                                    <span className="font-mono font-semibold">
                                        {ticketCode}
                                    </span>
                                </div>
                            )}
                            {ticketEventId && (
                                <div>Event ID: {ticketEventId}</div>
                            )}
                            {ticketStatus && (
                                <div>Status: {ticketStatus}</div>
                            )}
                            {ticketSeat && <div>Seat: {ticketSeat}</div>}
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <p className="mt-2 text-xs text-slate-400">
                    Checking ticket...
                </p>
            )}
        </div>
    );
}

function VerifyTicketsModal({ isOpen, onClose, eventId }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h3 className="text-xl font-[Gilroy-Medium] mb-4 text-center">
                    Verify Tickets
                </h3>
                <VerifyForm eventId={eventId} onClose={onClose} />
            </div>
        </Modal>
    );
}

export default VerifyTicketsModal;
