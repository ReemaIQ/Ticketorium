import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEventPage({ user, users, events, onUpdate }) {
    const navigate = useNavigate();
    const { eventId } = useParams();

    console.log(user, users); // r: to silence unused warnings in dev

    const event = events?.[eventId];

    const [title, setTitle] = useState(event?.title || "");
    const [description, setDescription] = useState(
        event?.description ||
        "Join us in a wondrous hiking journey with Harvard female students only."
    );
    const [building, setBuilding] = useState(
        event?.location?.split(" ")[0] || ""
    );
    const [room, setRoom] = useState(
        event?.location?.split(" ").slice(1).join(" ") || ""
    );

    const [hasSeatingPlan, setHasSeatingPlan] = useState(
        Boolean(event?.hasSeatingPlan)
    );
    const [seats, setSeats] = useState(event?.seats || "");
    const [type, setType] = useState(event?.type || "Outdoor");

    const [date, setDate] = useState(""); // optional override
    const [time, setTime] = useState("");

    const [imgValue, setImgValue] = useState(event?.img || "graduation.png");

    const [error, setError] = useState(""); // r: inline error banner

    const dateLabel = useMemo(() => event?.date || "", [event]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Event not found.</p>
            </div>
        );
    }

    // r: safe builder to avoid invalid time values
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

    // r: apply edits instantly via onUpdate, but persistence depends on App.js
    const handleSubmit = (e) => {
        e.preventDefault();

        const newLocation = [building, room].filter(Boolean).join(" ");

        let newDateLabel = dateLabel;

        // only recompute if both date AND time are provided
        if (date && time) {
            const dt = buildDateFromInputs(date, time);
            if (!dt) {
                setError(
                    "The selected date or time is not valid. Please try again."
                );
                return;
            }
            newDateLabel = dt.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        }

        const seatsNumber = hasSeatingPlan && seats ? Number(seats) : null;

        onUpdate(eventId, {
            title,
            description,
            location: newLocation,
            date: newDateLabel,
            seats: seatsNumber,
            hasSeatingPlan,
            type,
            img: imgValue || event.img || "graduation.png",
        });

        setError("");
        navigate(`/event/${eventId}`, { replace: true }); // r: go back to event page after applying edits
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

                {/* r: inline warning banner */}
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
                                    onChange={(e) =>
                                        setBuilding(e.target.value)
                                    }
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
                            className="px-6 py-3 border border-rose-200 text-rose-500 rounded-md bg-white hover:bg-rose-50"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[var(--accent-color)] rounded-[6px] font-[Gilroy-Medium] text-[var(--primary-color)]"
                        >
                            Apply Edits →
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default EditEventPage;
