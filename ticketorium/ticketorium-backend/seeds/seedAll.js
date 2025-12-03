// ticketorium-backend/seeds/seedAll.js
import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import mongoose from "mongoose";
import { connectDB } from "../database.js";

import { Counter } from "../models/Counter.js";
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
function generateTicketCode(eventId, userHandle) {
    const cleanEvent = String(eventId).padStart(3, "0");
    const cleanUser = (userHandle || "USER").toUpperCase().slice(0, 6);
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
    return `TKT-E${cleanEvent}-${cleanUser}-${randomPart}`;
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
            Counter.deleteMany({}),
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
        const eventByEventId = {};
        for (const e of eventsSeed) {
            const uniDoc = uniByCode[e.universityCode];
            const organizer = userByHandle[e.organizerHandle];

            const doc = await Event.create({
                eventId: e.eventId, // explicit; pre-save hook will not overwrite
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
            eventByEventId[e.eventId] = doc;
        }
        console.log("Seeded events:", Object.keys(eventByKey));

        // 3b) Counter for eventId (so next created event gets eventId 10, etc.)
        const maxEventId = Math.max(...eventsSeed.map((e) => e.eventId));
        await Counter.findOneAndUpdate(
            { name: "eventId" },
            { $set: { name: "eventId", seq: maxEventId } },
            { upsert: true }
        );
        console.log("Seeded Counter for eventId with seq =", maxEventId);

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

        // // 5) Event registrations
        // for (const r of registrationsSeed) {
        //     const eventDoc = eventByKey[r.eventKey];
        //     const userDoc = userByHandle[r.userHandle];
        //     const invitedByDoc = r.invitedByHandle
        //         ? userByHandle[r.invitedByHandle]
        //         : null;
        //
        //     await EventRegistration.create({
        //         event: eventDoc._id,
        //         user: userDoc._id,
        //         invitedBy: invitedByDoc ? invitedByDoc._id : null,
        //         invitationSource: invitedByDoc ? "user-referral" : "direct",
        //         status: r.status,
        //         joinedAt: r.status === "joined" ? new Date() : null,
        //     });
        // }
        // console.log("Seeded EventRegistrations:", registrationsSeed.length);
        // 5) Event registrations (idempotent upsert by event+user)

        let regCount = 0;

        for (const r of registrationsSeed) {
            const eventDoc = eventByKey[r.eventKey];
            const userDoc = userByHandle[r.userHandle];
            const invitedByDoc = r.invitedByHandle
                ? userByHandle[r.invitedByHandle]
                : null;

            if (!eventDoc || !userDoc) continue;

            const joinedAt =
                r.status === "joined" ? new Date() : undefined; // keep old joinedAt if exists

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
            const ticketCode = generateTicketCode(eventDoc.eventId, userDoc.handle);

            const ticket = await Ticket.create({
                event: eventDoc._id,
                user: userDoc._id,
                eventId: eventDoc.eventId,
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

        // 7) Listings
        const listingByKey = {};
        for (const L of listingsSeed) {
            const ticketDoc = ticketByKey[L.ticketKey];
            const sellerDoc = userByHandle[L.sellerHandle];

            const listing = await Listing.create({
                ticket: ticketDoc._id,
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

        // 8) Bids + compute top 3 per listing
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

        // update topBids and currentPrice on each listing
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

        // 9) Disputes
        for (const d of disputesSeed) {
            const participants = d.participantsHandles.map(
                (h) => userByHandle[h]._id
            );

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
                type: "ticket_issue", // you can specialize per dispute
                createdBy: participants[0],
                status: d.status,
                participants,
                event: null, // could attach eventByKey["ev4"] for example
                ticket: ticketDocs[0]?._id ?? null,
                messages,
                lastActivityAt: new Date(d.lastActivityAt),
            });
        }
        console.log("Seeded Disputes:", disputesSeed.length);

        // 10) NotificationTemplates (ALL from notifications.data.js)
        const templateByKey = {};
        for (const t of notificationTemplatesSeed) {
            const doc = await NotificationTemplate.create(t);
            templateByKey[t.key] = doc;
        }
        console.log(
            "Seeded NotificationTemplates:",
            Object.keys(templateByKey).length
        );

        // 11) Notification instances (Notification model)
        for (const n of notificationsSeed) {
            const userDoc = userByHandle[n.userHandle];
            const templateDoc = templateByKey[n.templateKey];

            await Notification.create({
                user: userDoc._id,
                template: templateDoc._id,
                data: n.data || {},
                channels: templateDoc.channels, // inherit from template
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
