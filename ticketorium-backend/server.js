// const express = require("express");
// const cors = require("cors");
// const crypto = require("crypto");
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// // !!! TEMP: in-memory tickets instead of DB
// let tickets = [];
// let nextId = 1;
//
// // Helper to generate a human-friendly ticket code
// function generateTicketCode(eventId, userId) {
//     const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
//     const cleanEvent = String(eventId || "EVT").slice(0, 4).toUpperCase();
//     const cleanUser = String(userId || "USR").slice(-4).toUpperCase();
//
//     return `TKT-${cleanEvent}-${cleanUser}-${randomPart}`;
// }
//
// // Helper to generate QR data token
// function generateQrToken() {
//     return crypto.randomBytes(16).toString("hex"); // 32-char random hex string
// }
//
// /**
//  * POST /api/tickets
//  * Body: { eventId, userId, seat, price }
//  * Returns: created ticket object
//  */
// app.post("/api/tickets", (req, res) => {
//     const { eventId, userId, seat = null, price = 0 } = req.body || {};
//
//     if (!eventId || !userId) {
//         return res.status(400).json({
//             error: "eventId and userId are required to create a ticket",
//         });
//     }
//
//     const ticketCode = generateTicketCode(eventId, userId);
//     const qrToken = generateQrToken();
//
//     const ticket = {
//         id: nextId++,
//         ticketCode,
//         qrToken,                // secret-ish part
//         qrData: `TICKET:${qrToken}`,
//         eventId,
//         userId,
//         seat,
//         price,
//         status: "active",       // later: "cancelled", "used", etc.
//         createdAt: new Date().toISOString(),
//     };
//
//     tickets.push(ticket);
//
//     console.log("Ticket created (in-memory):", ticket);
//
//     res.status(201).json(ticket);
// });
//
// // OPTIONAL: simple GET for debugging / dummy tickets
// app.get("/api/tickets", (_req, res) => {
//     res.json(tickets);
// });
//
// /**
//  * Cancel a ticket when the user RESIGNS
//  * POST /api/tickets/cancel
//  * Body: { ticketId, userId }
//  */
// app.post("/api/tickets/cancel", (req, res) => {
//     const { ticketId, userId } = req.body || {};
//
//     if (!ticketId || !userId) {
//         return res.status(400).json({
//             error: "ticketId and userId are required to cancel a ticket",
//         });
//     }
//
//     const ticket = tickets.find(
//         (t) =>
//             Number(t.id) === Number(ticketId) &&
//             String(t.userId) === String(userId)
//     );
//
//     if (!ticket) {
//         return res.status(404).json({ error: "Ticket not found" });
//     }
//
//     ticket.status = "cancelled";
//     console.log("Ticket cancelled:", ticket);
//
//     return res.json({ ok: true, ticket });
// });
//
// /**
//  * GET /api/tickets/verify
//  * Query params:
//  *   - code: ticketCode  OR
//  *   - token: qrToken / qrData
//  *   - eventId: optional, ensures ticket belongs to this event
//  *
//  * Response:
//  *   { valid, reason, message, ticket? }
//  */
// app.get("/api/tickets/verify", (req, res) => {
//     const { code, token, eventId } = req.query;
//
//     if (!code && !token) {
//         return res.status(400).json({
//             valid: false,
//             reason: "bad-request",
//             message: "You must provide either code or token",
//         });
//     }
//
//     function matchesToken(t, incomingToken) {
//         if (!incomingToken) return false;
//
//         if (t.qrToken === incomingToken) return true;
//         if (t.qrData === incomingToken) return true;
//
//         if (incomingToken.startsWith("TICKET:")) {
//             return t.qrToken === incomingToken.slice("TICKET:".length);
//         }
//
//         return false;
//     }
//
//     let ticket;
//
//     if (token) {
//         ticket = tickets.find((t) => matchesToken(t, token));
//     } else if (code) {
//         ticket = tickets.find((t) => t.ticketCode === code);
//     }
//
//     if (!ticket) {
//         return res.json({
//             valid: false,
//             reason: "not-found",
//             message: "Ticket not found",
//         });
//     }
//
//     if (eventId && String(ticket.eventId) !== String(eventId)) {
//         return res.json({
//             valid: false,
//             reason: "wrong-event",
//             message: "Ticket belongs to a different event",
//             ticket: {
//                 id: ticket.id,
//                 eventId: ticket.eventId,
//                 ticketCode: ticket.ticketCode,
//                 status: ticket.status,
//             },
//         });
//     }
//
//     if (ticket.status !== "active") {
//         return res.json({
//             valid: false,
//             reason: "inactive",
//             message:
//                 ticket.status === "used"
//                     ? "Ticket has already been used"
//                     : "Ticket is not active",
//             ticket: {
//                 id: ticket.id,
//                 eventId: ticket.eventId,
//                 ticketCode: ticket.ticketCode,
//                 status: ticket.status,
//             },
//         });
//     }
//
//     ticket.status = "used";
//
//     return res.json({
//         valid: true,
//         reason: "ok",
//         message: "Ticket is valid and has been marked as used.",
//         ticket: {
//             id: ticket.id,
//             eventId: ticket.eventId,
//             userId: ticket.userId,
//             ticketCode: ticket.ticketCode,
//             seat: ticket.seat,
//             price: ticket.price,
//             status: ticket.status,
//             createdAt: ticket.createdAt,
//         },
//     });
// });
//
// // Only keep ONE app.listen in this file
// const PORT = 4000;
// app.listen(PORT, () => {
//     console.log(`Tickets service running at http://localhost:${PORT}`);
// });
