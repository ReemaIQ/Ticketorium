// ticketorium/ticketorium-backend/seeds/seedAll.js
import dotenv from "dotenv";
dotenv.config();

console.log("DEBUG MONGO_URL from seedAll.js:", process.env.MONGO_URL);

import crypto from "crypto";
import mongoose from "mongoose";
import { connectDB } from "../database.js";

// Models
import { University } from "../models/University.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { EventRegistration } from "../models/EventRegistration.js";
import { EventStats } from "../models/EventStats.js";
import { Ticket } from "../models/Ticket.js";
import { Listing } from "../models/Listing.js";
import { Bid } from "../models/Bid.js";
import { Dispute } from "../models/Dispute.js";
import { NotificationTemplate } from "../models/NotificationTemplate.js";
import { Notification } from "../models/Notification.js";

// DATA MODULES
import { universitiesSeed } from "./data/universities.data.js";
import { usersSeed } from "./data/users.data.js";
import { eventsSeed } from "./data/events.data.js";
import { registrationsSeed } from "./data/registrations.data.js";
import { disputesSeed } from "./data/disputes.data.js";
import { notificationTemplatesSeed } from "./data/notifications.data.js";
import { ticketsSeed } from "./data/tickets.data.js";
import { listingsSeed } from "./data/listings.data.js";
import { bidsSeed } from "./data/bids.data.js";
import { eventStatsSeed } from "./data/eventStats.data.js";
import { notificationsSeed } from "./data/notificationInstances.data.js";

// ---------- helpers ----------
function generateTicketCode(eventObjectId, userHandle) {
    // UPDATED: Use last 4 digits of the ObjectId instead of numeric ID
    const eventSuffix = eventObjectId.toString().slice(-4).toUpperCase();
    const cleanUser = (userHandle || "USER").toUpperCase().slice(0, 6);
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `TKT-E${eventSuffix}-${cleanUser}-${randomPart}`;
}

function generateQrToken() {
    return crypto.randomBytes(8).toString("hex");
}

// ---------- main ----------
async function runSeed() {
    try {
        await connectDB(process.env.MONGO_URL);
        console.log(" Connected to MongoDB");

        // 0) Wipe all relevant collections
        await Promise.all([
            University.deleteMany({}),
            User.deleteMany({}),
            Event.deleteMany({}),
            EventRegistration.deleteMany({}),
            EventStats.deleteMany({}),
            Ticket.deleteMany({}),
            Listing.deleteMany({}),
            Bid.deleteMany({}),
            Dispute.deleteMany({}),
            NotificationTemplate.deleteMany({}),
            Notification.deleteMany({}),
        ]);

        // Drop Event indexes to remove any old "eventId" unique constraint
        // This prevents the "duplicate key: null" error.
        try {
            await Event.collection.dropIndexes();
            console.log("Dropped old Event indexes to clear eventId constraints");
        } catch (e) {
            // Ignore if collection didn't exist
        }

        // 1) Universities
        const uniByCode = {};
        for (const uni of universitiesSeed) {
            const doc = await University.create(uni);
            uniByCode[uni.code] = doc;
        }
        console.log("Seeded universities:", Object.keys(uniByCode));

        // 2) Users
        const userByHandle = {};
        for (const u of usersSeed) {
            const uniDoc = u.universityCode ? uniByCode[u.universityCode] : null;
            const doc = await User.create({
                handle: u.handle,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone,
                passwordHash: u.password,
                role: u.role,
                university: uniDoc ? uniDoc._id : null,
                gender: u.gender,
                dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth) : null,
            });
            userByHandle[u.handle] = doc;
        }
        console.log("Seeded users:", Object.keys(userByHandle));

        // 3) Events
        const eventByKey = {};
        for (const e of eventsSeed) {
            const uniDoc = uniByCode[e.universityCode];
            const organizer = userByHandle[e.organizerHandle];

            const doc = await Event.create({
                university: uniDoc._id,
                organizer: organizer._id,
                title: e.title,
                description: "",
                img: e.img,
                startAt: new Date(e.startAt),
                price: e.price,
                state: e.state,
                hasSeatingPlan: e.hasSeatingPlan,
                capacityTotal: 100,
            });

            eventByKey[e.key] = doc;
        }
        console.log("Seeded events:", Object.keys(eventByKey));

        // 4) EventStats
        for (const s of eventStatsSeed) {
            const eventDoc = eventByKey[s.eventKey];
            if (!eventDoc) continue;

            await EventStats.create({
                event: eventDoc._id,
                totalVisitors: s.funnel.totalVisitors,
                clickedView: s.funnel.clickedView,
                joined: s.funnel.joined,
                joinedCount: s.attendance.joined,
                waitlistedCount: s.attendance.waitlisted,
                cancelledCount: s.attendance.cancelled,
                noShowCount: s.attendance.noShow,
                genderBreakdown: s.audience.gender,
                ageGroups: s.audience.ageGroups,
                universityBreakdown: s.audience.universities,
            });
        }
        console.log("Seeded EventStats:", eventStatsSeed.length);

        // 5) Event registrations
        let regCount = 0;

        for (const r of registrationsSeed) {
            const eventDoc = eventByKey[r.eventKey];
            const userDoc = userByHandle[r.userHandle];
            const invitedByDoc = r.invitedByHandle
                ? userByHandle[r.invitedByHandle]
                : null;

            if (!eventDoc || !userDoc) continue;

            const joinedAt =
                r.status === "joined" ? new Date() : undefined;

            const update = {
                invitedBy: invitedByDoc ? invitedByDoc._id : null,
                invitationSource: invitedByDoc ? "user-referral" : "direct",
                status: r.status,
            };

            if (joinedAt) {
                update.joinedAt = joinedAt;
            }

            await EventRegistration.findOneAndUpdate(
                { event: eventDoc._id, user: userDoc._id },
                { $set: update },
                { upsert: true, new: true }
            );

            regCount += 1;
        }

        console.log("Seeded/updated EventRegistrations rows:", regCount);

        // 6) Tickets
        const ticketByKey = {};
        const ticketDocs = [];
        for (const t of ticketsSeed) {
            const eventDoc = eventByKey[t.eventKey];
            const userDoc = userByHandle[t.userHandle];

            const qrToken = generateQrToken();
            const ticketCode = generateTicketCode(eventDoc._id, userDoc.handle);

            const ticket = await Ticket.create({
                event: eventDoc._id,
                user: userDoc._id,
                ticketCode,
                qrToken,
                qrData: `TICKET:${qrToken}`,
                seat: t.seat,
                price: t.price,
                status: t.status,
            });

            ticketByKey[t.key] = ticket;
            ticketDocs.push(ticket);
        }
        console.log("Seeded Tickets:", ticketDocs.length);

        // 7) Listings (FIXED: Derive event from ticket)
        const listingByKey = {};
        for (const L of listingsSeed) {
            const ticketDoc = ticketByKey[L.ticketKey];
            const sellerDoc = userByHandle[L.sellerHandle];

            // FIX: Get the event ID from the ticket document
            const eventId = ticketDoc.event;

            const listing = await Listing.create({
                ticket: ticketDoc._id,
                event: eventId, // Correctly linked
                seller: sellerDoc._id,
                title: L.title,
                startingPrice: L.startingPrice,
                currentPrice: L.startingPrice,
                status: L.status,
                expiresAt: new Date(L.expiresAt),
                topBids: [],
            });

            listingByKey[L.key] = listing;
        }
        console.log("Seeded Listings:", Object.keys(listingByKey).length);

        // 8) Bids
        const listingToBidDocs = {};
        for (const b of bidsSeed) {
            const listing = listingByKey[b.listingKey];
            const bidder = userByHandle[b.bidderHandle];

            const bidDoc = await Bid.create({
                listing: listing._id,
                bidder: bidder._id,
                amount: b.amount,
                isWinningBid: false,
                isActive: b.isActive,
            });

            if (!listingToBidDocs[listing._id]) listingToBidDocs[listing._id] = [];
            listingToBidDocs[listing._id].push(bidDoc);
        }

        // update topBids and currentPrice
        for (const [listingId, bids] of Object.entries(listingToBidDocs)) {
            const activeBids = bids.filter((b) => b.isActive);

            const sorted = activeBids.sort((a, b) => {
                if (b.amount === a.amount) {
                    return a.createdAt - b.createdAt;
                }
                return b.amount - a.amount;
            });

            const topThree = sorted.slice(0, 3);
            const listing = await Listing.findById(listingId);

            await Listing.findByIdAndUpdate(listingId, {
                currentPrice: topThree[0]?.amount ?? listing.startingPrice,
                topBids: topThree.map((b) => ({
                    bidder: b.bidder,
                    amount: b.amount,
                    placedAt: b.createdAt,
                })),
            });
        }
        console.log("Seeded Bids & updated topBids");

        // 9) Disputes (FIXED: Link event and ticket using keys)
        for (const d of disputesSeed) {
            const participants = d.participantsHandles.map(
                (h) => userByHandle[h]._id
            );

            // FIX: Use keys to get event and ticket IDs
            const eventDoc = eventByKey[d.eventKey];
            const ticketDoc = ticketByKey[d.ticketKey];

            const messages = d.messages.map((m) => ({
                from: userByHandle[m.fromHandle]._id,
                type: m.type,
                text: m.text,
                url: m.url,
                caption: m.caption,
                createdAt: new Date(m.createdAt),
            }));

            await Dispute.create({
                title: d.title,
                subtitle: d.subtitle,
                type: "ticket_issue",
                createdBy: participants[0],
                status: d.status,
                participants,
                event: eventDoc ? eventDoc._id : null, // Correctly linked
                ticket: ticketDoc ? ticketDoc._id : null, // Correctly linked
                messages,
                lastActivityAt: new Date(d.lastActivityAt),
            });
        }
        console.log("Seeded Disputes:", disputesSeed.length);

        // 10) NotificationTemplates
        const templateByKey = {};
        for (const t of notificationTemplatesSeed) {
            const doc = await NotificationTemplate.create(t);
            templateByKey[t.key] = doc;
        }
        console.log(
            "Seeded NotificationTemplates:",
            Object.keys(templateByKey).length
        );

        // 11) Notifications
        for (const n of notificationsSeed) {
            const userDoc = userByHandle[n.userHandle];
            const templateDoc = templateByKey[n.templateKey];

            await Notification.create({
                user: userDoc._id,
                template: templateDoc._id,
                data: n.data || {},
                channels: templateDoc.channels,
                seen: n.seen ?? false,
                readAt: n.seen ? new Date() : null,
            });
        }
        console.log("Seeded Notifications:", notificationsSeed.length);

        console.log("DONE: full seed for ALL models");
        await mongoose.connection.close();
    } catch (err) {
        console.error("Seed error:", err);
        await mongoose.connection.close();
        process.exit(1);
    }
}

runSeed();