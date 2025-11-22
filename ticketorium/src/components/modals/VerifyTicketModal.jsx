// VERIFY modal
// - organizer/admin can verify tickets by code or by scanning QR

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

    async function runVerify(payload) {
        setLoading(true);
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

    async function handleVerifyByCode() {
        if (!code.trim()) {
            alert("Please enter a ticket code.");
            return;
        }
        await runVerify({ code: code.trim(), eventId });
    }

    async function handleVerifyByToken(token) {
        if (!token) return;

        // avoid spamming same token
        if (token === lastScanned && result?.valid !== undefined) return;
        setLastScanned(token);

        await runVerify({ token, eventId });
    }

    return (
        <div>
            {/* Tabs: Code vs QR */}
            <div className="flex mb-4 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setMode("code")}
                    className={`flex-1 py-2 text-sm font-medium ${
                        mode === "code"
                            ? "border-b-2 border-[#4F6FFF] text-[#4F6FFF]"
                            : "text-slate-500"
                    }`}
                >
                    Enter Ticket Code
                </button>
                <button
                    type="button"
                    onClick={() => setMode("scan")}
                    className={`flex-1 py-2 text-sm font-medium ${
                        mode === "scan"
                            ? "border-b-2 border-[#4F6FFF] text-[#4F6FFF]"
                            : "text-slate-500"
                    }`}
                >
                    Scan QR
                </button>
            </div>

            {/* CODE MODE */}
            {mode === "code" && (
                <>
                    <label className="block text-sm text-slate-600 mb-1">
                        Ticket Code
                    </label>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                        placeholder="Ex: TKT-KFUP-1234-ABCDEF"
                    />

                    <div className="flex justify-center mt-6 gap-3">
                        <button
                            onClick={handleVerifyByCode}
                            disabled={loading}
                            className="px-4 py-2 border rounded-md bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md bg-white hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                </>
            )}

            {/* SCAN MODE */}
            {mode === "scan" && (
                <div className="mt-2 text-sm text-slate-600 space-y-3">
                    <p className="text-xs text-slate-500">
                        Point the camera at the ticket&apos;s QR code. The
                        ticket will be verified automatically when scanned.
                    </p>

                    <div className="w-full max-w-xs mx-auto overflow-hidden rounded-lg border border-slate-200">
                        <Scanner
                            constraints={{ facingMode: "environment" }}
                            onScan={(detectedCodes) => {
                                if (!detectedCodes || detectedCodes.length === 0)
                                    return;

                                const token = detectedCodes[0].rawValue;
                                console.log("Scanned QR:", token);
                                handleVerifyByToken(token);
                            }}
                            onError={(error) => {
                                console.log("Scanner error:", error);
                            }}
                            styles={{
                                container: { width: "100%" },
                                video: { width: "100%" },
                            }}
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md bg-white hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Result panel */}
            {result && (
                <div
                    className={`mt-6 rounded-md border px-4 py-3 text-sm ${
                        result.valid
                            ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                            : "bg-rose-50 border-rose-400 text-rose-700"
                    }`}
                >
                    <div className="font-semibold mb-1">
                        {result.valid ? "Ticket Verified" : "Ticket Invalid"}
                    </div>
                    <div>{result.message}</div>

                    {result.ticket && (
                        <div className="mt-2 text-xs text-slate-700 space-y-1">
                            <div>
                                Ticket Code:{" "}
                                <span className="font-mono font-semibold">
                                    {result.ticket.ticketCode}
                                </span>
                            </div>
                            <div>Event ID: {result.ticket.eventId}</div>
                            <div>Status: {result.ticket.status}</div>
                            {result.ticket.seat && (
                                <div>Seat: {result.ticket.seat}</div>
                            )}
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
                <h3 className="text-xl font-semibold mb-4 text-center">
                    Verify Tickets
                </h3>
                <VerifyForm eventId={eventId} onClose={onClose} />
            </div>
        </Modal>
    );
}

export default VerifyTicketsModal;