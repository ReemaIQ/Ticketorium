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
 * Helper: run recomputeTopBids and transition expired listings to awaiting_payment (or delete if no bids).
 * Called before GET /api/listings returns data so UI doesn't see awaiting_payment.
 */
async function processExpiredListings() {
    try {
        const now = new Date();
        // find listings that are active and have expiresAt <= now (expired)
        const expiredActives = await Listing.find({
            status: "active",
            expiresAt: { $lte: now },
        });

        if (!expiredActives.length) return;

        for (const listing of expiredActives) {
            try {
                await recomputeTopBids(listing._id);

                // re-fetch so we have updated topBids
                const updated = await Listing.findById(listing._id).populate("topBids.bidder", "handle _id");

                const top = (updated.topBids || [])[0];

                if (!top) {
                    // no bids — remove listing (or mark expired — you asked for deletion)
                    await Listing.findByIdAndDelete(updated._id);
                    // remove any stray bids just in case (should be none)
                    await Bid.deleteMany({ listing: updated._id });
                    console.log("[processExpiredListings] deleted listing with no bids:", updated._id);
                } else {
                    // has a top bidder -> mark awaiting_payment and notify winner
                    updated.status = "awaiting_payment";
                    updated.winner = top.bidder._id || top.bidder;
                    updated.winningAmount = top.amount;
                    await updated.save();

                    // create notification for winner (silently continue on error)
                    try {
                        if (typeof Notification !== "undefined") {
                            await Notification.create({
                                user: updated.winner,
                                type: "won_listing",
                                data: {
                                    listingId: updated._id,
                                    amount: updated.winningAmount,
                                    title: updated.title,
                                },
                            });
                        }
                    } catch (nErr) {
                        console.warn("[processExpiredListings] Notification error:", nErr);
                    }

                    console.log("[processExpiredListings] set awaiting_payment and notified winner:", updated._id);
                }
            } catch (innerErr) {
                console.error("[processExpiredListings] error processing listing:", listing._id, innerErr);
            }
        }
    } catch (err) {
        console.error("[processExpiredListings] top-level error:", err);
    }
}

/**
 * GET /api/listings
 * Optional query:
 *   - status (active, expired, sold, cancelled)
 *   - includeAwaiting=true  (optional; default false)
 */
router.get("/", async (req, res) => {
    try {
        // BEFORE returning anything, process expired listings (this transitions them)
        await processExpiredListings();

        const { status, includeAwaiting } = req.query;
        const filter = {};

        if (status) filter.status = status;

        // by default exclude awaiting_payment from UI results
        if (!includeAwaiting || String(includeAwaiting) !== "true") {
            filter.status = filter.status ? filter.status : { $ne: "awaiting_payment" };
        }

        const listings = await Listing.find(filter)
            .populate({
                path: "ticket",
                populate: { path: "event", select: "title eventId startAt imageUrl" },
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
 * POST /api/listings/:id/end
 * Body: { sellerId }
 *
 * Seller ends the auction early — if there's a top bidder, mark listing awaiting_payment and notify them.
 */
router.post("/:id/end", async (req, res) => {
    try {
        const listingId = req.params.id;
        const { sellerId: providedSellerId } = req.body || {};

        console.log("[SERVER] POST /api/listings/:id/end called:", { listingId, providedSellerId });

        if (!providedSellerId) {
            console.warn("[SERVER] Missing sellerId in request body");
            return res.status(400).json({ error: "sellerId is required in body" });
        }

        // Load listing, populate seller to see handle/_id
        const listing = await Listing.findById(listingId).populate("seller", "handle _id").populate("topBids.bidder", "handle _id");
        if (!listing) {
            console.warn("[SERVER] Listing not found:", listingId);
            return res.status(404).json({ error: "Listing not found" });
        }

        // Normalize listing seller id/handle
        const listingSellerId = listing.seller ? String(listing.seller._id || listing.seller) : null;
        const listingSellerHandle = listing.seller && listing.seller.handle ? String(listing.seller.handle) : null;

        console.log("[SERVER] listingSellerId:", listingSellerId, "listingSellerHandle:", listingSellerHandle);
        console.log("[SERVER] providedSellerId (raw):", providedSellerId);

        // Accept match if providedSellerId equals listingSellerId OR equals handle
        const matchesId = listingSellerId && (String(providedSellerId) === String(listingSellerId));
        const matchesHandle = listingSellerHandle && (String(providedSellerId) === String(listingSellerHandle));

        if (!matchesId && !matchesHandle) {
            console.warn("[SERVER] Seller mismatch — provided does not match listing seller");
            return res.status(403).json({
                error: "Only the listing's seller can end this listing",
                details: { listingSellerId, listingSellerHandle, providedSellerId }
            });
        }

        if (listing.status !== "active") {
            console.warn("[SERVER] Listing not active:", listing.status);
            return res.status(400).json({ error: `Listing not active (status=${listing.status})` });
        }

        // recompute top bids (existing helper)
        await recomputeTopBids(listing._id);

        // re-query listing to read updated topBids
        const updatedListing = await Listing.findById(listing._id).populate("topBids.bidder", "handle _id");

        // if no top bid, delete listing
        const top = (updatedListing.topBids || [])[0];
        if (!top) {
            await Listing.findByIdAndDelete(updatedListing._id);
            await Bid.deleteMany({ listing: updatedListing._id });
            return res.json({ ok: true, message: "No bids — listing deleted." });
        }

        // mark awaiting_payment and set winner/winningAmount
        updatedListing.status = "awaiting_payment";
        updatedListing.winner = top.bidder._id || top.bidder;
        updatedListing.winningAmount = top.amount;
        await updatedListing.save();

        // optional notification creation
        try {
            if (typeof Notification !== "undefined") {
                await Notification.create({
                    user: updatedListing.winner,
                    type: "won_listing",
                    data: { listingId: updatedListing._id, amount: top.amount, title: updatedListing.title }
                });
            }
        } catch (nErr) {
            console.warn("[SERVER] Notification creation error:", nErr);
        }

        const populated = await Listing.findById(updatedListing._id)
            .populate({ path: "ticket", populate: { path: "event", select: "title startAt" } })
            .populate("seller", "handle firstName lastName")
            .populate("topBids.bidder", "handle firstName lastName");

        console.log("[SERVER] End successful, listing set to awaiting_payment:", updatedListing._id);
        return res.json({ ok: true, listing: populated });
    } catch (err) {
        console.error("[SERVER] POST /api/listings/:id/end error:", err);
        return res.status(500).json({ error: "Internal server error while ending listing", details: err.message });
    }
});

/**
 * POST /api/listings/:id/confirm-payment
 * Body: { payerId }
 *
 * Called after successful payment by the winner. Transfers ticket ownership and cleans up listing/bids.
 */
router.post("/:id/confirm-payment", async (req, res) => {
    try {
        const listingId = req.params.id;
        const { payerId } = req.body || {};
        if (!payerId) return res.status(400).json({ error: "payerId is required" });

        const listing = await Listing.findById(listingId).populate("ticket seller topBids.bidder");
        if (!listing) return res.status(404).json({ error: "Listing not found" });

        if (listing.status !== "awaiting_payment") {
            return res.status(400).json({ error: "Listing is not awaiting payment" });
        }

        // Verify payer is the winner
        const winnerId = listing.winner ? String(listing.winner) : String(listing.topBids?.[0]?.bidder?._id);
        if (String(payerId) !== winnerId) {
            return res.status(403).json({ error: "Payer is not the recorded winner" });
        }

        // Transfer ticket ownership
        const ticket = await Ticket.findById(listing.ticket._id || listing.ticket);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        ticket.user = payerId;
        await ticket.save();

        // Delete related bids
        await Bid.deleteMany({ listing: listing._id });

        // Optionally: create a record of sale/payment (not implemented here)

        // Remove the listing
        await Listing.findByIdAndDelete(listing._id);

        // // notify both parties (seller and buyer) if you use Notifications
        // try {
        //     await Notification.create({
        //         user: payerId,
        //         type: "listing_purchase_confirmed",
        //         data: { listingId, ticketId: ticket._id, amount: listing.winningAmount },
        //     });
        //     await Notification.create({
        //         user: listing.seller,
        //         type: "listing_sold",
        //         data: { listingId, ticketId: ticket._id, amount: listing.winningAmount, buyerId: payerId },
        //     });
        // } catch (nErr) {
        //     console.warn("Notification failure:", nErr);
        // }

        res.json({ ok: true, ticket: ticket.toObject() });
    } catch (err) {
        console.error("POST /api/listings/:id/confirm-payment error:", err);
        res.status(500).json({ error: "Failed to confirm payment and transfer ticket" });
    }
});


export default router;
