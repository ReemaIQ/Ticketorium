// src/pages/events/EditEvent.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById, updateEvent } from "../../api/events.js";

function EditEventPage({ user }) {
    const navigate = useNavigate();

    // FIX: param name must match route: /event/:eventId/edit
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(
        "Join us in a wondrous hiking journey with Harvard female students only."
    );
    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");
    const [hasSeatingPlan, setHasSeatingPlan] = useState(false);
    const [seats, setSeats] = useState("");
    const [type, setType] = useState("Outdoor");
    const [imgValue, setImgValue] = useState("graduation.png");

    // Local date/time overrides (optional)
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    // -----------------------------
    // Load event from backend
    // -----------------------------
    useEffect(() => {
        if (!eventId) {
            setError("Missing event id in the URL.");
            setLoading(false);
            return;
        }

        async function loadEvent() {
            try {
                setLoading(true);
                setError("");

                // assumes eventId is Mongo _id (what we use in EventList)
                const ev = await fetchEventById(eventId);

                if (!ev) {
                    setError("Event not found.");
                    setEvent(null);
                    return;
                }

                setEvent(ev);

                // Title / description
                setTitle(ev.title || "");
                setDescription(
                    ev.description ||
                    "Join us in a wondrous hiking journey with Harvard female students only."
                );

                // Location: treat as "Building Room" single string if present
                const locationStr = ev.location || "";
                const [b, ...rest] = locationStr.split(" ");
                setBuilding(b || "");
                setRoom(rest.join(" "));

                // Seating / capacity
                setHasSeatingPlan(Boolean(ev.hasSeatingPlan));
                setSeats(
                    ev.capacityTotal != null ? String(ev.capacityTotal) : ""
                );

                // Event type (if your schema has it)
                setType(ev.type || "Outdoor");

                // Image: backend returns img as URL or /uploads path
                setImgValue(ev.img || "graduation.png");
            } catch (err) {
                console.error("Failed to load event:", err);
                setError("Failed to load event. Please try again.");
                setEvent(null);
            } finally {
                setLoading(false);
            }
        }

        loadEvent();
    }, [eventId]);

    // Human-readable date label from backend startAt
    const dateLabel = useMemo(() => {
        if (!event?.startAt) return "";
        const d = new Date(event.startAt);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, [event?.startAt]);

    // Helper to build Date from YYYY-MM-DD + HH:MM (24h)
    const buildDateFromInputs = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return null;

        const [y, m, d] = dateStr.split("-").map(Number);
        const [h, min] = timeStr.split(":").map(Number);

        if (!y || !m || !d || Number.isNaN(h) || Number.isNaN(min)) {
            return null;
        }

        const dt = new Date(y, m - 1, d, h, min);
        if (Number.isNaN(dt.getTime())) return null;

        return dt;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Loading event...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">
                    {error || "Event not found."}
                </p>
            </div>
        );
    }

    // -----------------------------
    // Submit → call backend update
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const newLocation = [building, room].filter(Boolean).join(" ");

        const updatePayload = {
            title,
            description,
            location: newLocation || event.location || "",
            hasSeatingPlan,
            type,
            img: imgValue || event.img || "graduation.png",
        };

        // seats → map to backend capacityTotal
        const seatsNumber =
            hasSeatingPlan && seats ? Number(seats) : null;
        if (seatsNumber != null && !Number.isNaN(seatsNumber)) {
            updatePayload.capacityTotal = seatsNumber;
        }

        // Optional date/time override: if both filled, recompute startAt
        if (date && time) {
            const dt = buildDateFromInputs(date, time);
            if (!dt) {
                setError(
                    "The selected date or time is not valid. Please try again."
                );
                return;
            }
            updatePayload.startAt = dt.toISOString();
        }

        try {
            setSaving(true);
            await updateEvent(event._id || eventId, updatePayload);
            navigate(`/event/${event._id || eventId}`, {
                replace: true,
            });
        } catch (err) {
            console.error("Failed to update event:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A] mb-1">
                    Edit Event
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    {eventId} – {event.title}
                </p>

                {/* inline warning banner */}
                {error && (
                    <div className="mb-6 rounded-md border border-[var(--warning-color)]/40 bg-[var(--warning-color)]/10 px-4 py-3 text-[13px] text-[var(--warning-color)] font-[Gilroy-Medium]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event name */}
                    <div>
                        <label className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-1 uppercase tracking-wide">
                            Event Name
                        </label>
                        <input
                            className="w-full border-b border-slate-300 py-2 outline-none text-[#1A1A1A]"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (error) setError("");
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-1 uppercase tracking-wide">
                            Event Description
                        </label>
                        <textarea
                            rows={5}
                            className="w-full border border-slate-200 rounded-md p-3 resize-none text-sm text-[#1A1A1A]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Date + Time */}
                    <div>
                        <p className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-2 uppercase tracking-wide">
                            Date &amp; Time
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    New Date (optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        if (error) setError("");
                                    }}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Current: {dateLabel || "not set"}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    New Time (optional)
                                </label>
                                <input
                                    type="time"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        if (error) setError("");
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <p className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-2 uppercase tracking-wide">
                            Location
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Building / Area
                                </label>
                                <input
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={building}
                                    onChange={(e) => setBuilding(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Room / Spot
                                </label>
                                <input
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seating + Type */}
                    <div>
                        <p className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-2 uppercase tracking-wide">
                            Seating &amp; Type
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Seating Plan
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-[var(--secondary-color)]"
                                        checked={hasSeatingPlan}
                                        onChange={(e) =>
                                            setHasSeatingPlan(e.target.checked)
                                        }
                                    />
                                    <span className="text-sm text-slate-700">
                                        Has seating map?
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Seats
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] disabled:text-slate-400 disabled:border-slate-200"
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    disabled={!hasSeatingPlan}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Event Type
                                </label>
                                <select
                                    className="w-full border-b border-slate-300 py-2 outline-none bg-transparent text-sm text-[#1A1A1A]"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-10">
                        <button
                            type="button"
                            className="px-6 py-3 border border-[var(--warning-color)] text-[var(--warning-color)] rounded-[6px] bg-white cursor-pointer"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-[var(--accent-color)] rounded-[6px] font-[Gilroy-Medium] text-[var(--secondary-color)] cursor-pointer disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Apply Edits →"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default EditEventPage;
