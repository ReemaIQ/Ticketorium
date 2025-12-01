import express from "express";
import { Listing } from "../models/Listing.js";
import { Ticket } from "../models/Ticket.js";
import { Bid } from "../models/Bid.js";
import { User } from "../models/User.js";

const router = express.Router();

/**
 * Helper: recompute top 3 bids and update listing.topBids + currentPrice
 */
async function recomputeTopBids(listingId) {
    const bids = await Bid.find({ listing: listingId, isActive: true }).sort({
        amount: -1,
        createdAt: 1,
    });

    const topThree = bids.slice(0, 3);
    const listing = await Listing.findById(listingId);

    if (!listing) return;

    listing.currentPrice = topThree[0]?.amount ?? listing.startingPrice;
    listing.topBids = topThree.map((b) => ({
        bidder: b.bidder,
        amount: b.amount,
        placedAt: b.createdAt,
    }));

    await listing.save();
}

/**
 * GET /api/listings
 * Optional query:
 *   - status (active, expired, sold, cancelled)
 */
router.get("/", async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const listings = await Listing.find(filter)
            .populate({
                path: "ticket",
                populate: { path: "event", select: "title eventId startAt" },
            })
            .populate("seller", "handle firstName lastName")
            .populate("topBids.bidder", "handle firstName lastName")
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (err) {
        console.error("GET /api/listings error:", err);
        res.status(500).json({ error: "Failed to load listings" });
    }
});

/**
 * POST /api/listings
 * Body: { ticketId, sellerId, title?, startingPrice? }
 */
// routes/listings.js (inside router.post("/", ...))
router.post("/", async (req, res) => {
    try {
        const { ticketId, sellerId, title, startingPrice = 0, deadline } = req.body || {};

        if (!ticketId || !sellerId) {
            return res.status(400).json({ error: "ticketId and sellerId are required" });
        }

        const ticket = await Ticket.findById(ticketId).populate("event");
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        const seller = await User.findById(sellerId);
        if (!seller) return res.status(404).json({ error: "Seller not found" });

        const listingObj = {
            ticket: ticket._id,
            seller: seller._id,
            title: title || `${ticket.event?.title || "Event"} – Seat ${ticket.seat}`,
            startingPrice,
            currentPrice: startingPrice,
            status: "active",
            topBids: [],
        };

        if (deadline) {
            const d = new Date(deadline);
            if (!isNaN(d.getTime())) listingObj.expiresAt = d;
            // otherwise ignore invalid date — you may want to validate and return 400 instead
        }

        const listing = await Listing.create(listingObj);

        // populate so frontend gets nested fields (ticket.event, seller)
        const populated = await Listing.findById(listing._id)
            .populate({
                path: "ticket",
                populate: { path: "event", select: "title eventId startAt" },
            })
            .populate("seller", "handle firstName lastName");

        res.status(201).json(populated);
    } catch (err) {
        console.error("POST /api/listings error:", err);
        res.status(500).json({ error: "Failed to create listing" });
    }
});


/**
 * POST /api/listings/:id/bids
 * Body: { bidderId, amount }
 */
router.post("/:id/bids", async (req, res) => {
    try {
        const { bidderId, amount } = req.body || {};
        if (!bidderId || amount == null) {
            return res.status(400).json({ error: "bidderId and amount are required" });
        }

        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found" });

        if (listing.status !== "active") {
            return res.status(400).json({ error: "Listing is not active" });
        }

        const bidder = await User.findById(bidderId);
        if (!bidder) return res.status(404).json({ error: "Bidder not found" });

        const bid = await Bid.create({
            listing: listing._id,
            bidder: bidder._id,
            amount,
            isWinningBid: false,
            isActive: true,
        });

        // recompute top 3 and update listing.topBids + currentPrice
        await recomputeTopBids(listing._id);

        // optional: set isWinningBid flags on Bid documents:
        // find top bid and mark it as winning; mark others not winning (small performance cost)
        // but since you store topBids on listing, frontend can read that to show top bids.
        // If you want DB-level isWinningBid flags, you can implement here.

        // return the created bid and the updated, populated listing
        const updatedListing = await Listing.findById(listing._id)
            .populate({
                path: "ticket",
                populate: { path: "event", select: "title eventId startAt" },
            })
            .populate("seller", "handle firstName lastName")
            .populate("topBids.bidder", "handle firstName lastName");

        res.status(201).json({ bid, listing: updatedListing });
    } catch (err) {
        console.error("POST /api/listings/:id/bids error:", err);
        res.status(500).json({ error: "Failed to place bid" });
    }
});


/**
 * POST /api/listings/:id/cancel
 * Body: { sellerId }
 */
router.post("/:id/cancel", async (req, res) => {
    try {
        const { sellerId } = req.body || {};
        if (!sellerId) {
            return res.status(400).json({ error: "sellerId is required" });
        }

        const listing = await Listing.findOne({
            _id: req.params.id,
            seller: sellerId,
        });

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        listing.status = "cancelled";
        await listing.save();

        res.json({ ok: true, listing });
    } catch (err) {
        console.error("POST /api/listings/:id/cancel error:", err);
        res.status(500).json({ error: "Failed to cancel listing" });
    }
});

export default router;
