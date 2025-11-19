import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEventPage({ user, users, events, onUpdate }) {
    const navigate = useNavigate();
    const { eventId } = useParams();

    console.log(user, users) // to stop the error

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
    const [seats, setSeats] = useState(event?.seats || "");
    const [type, setType] = useState(event?.type || "Outdoor");

    // We don't store raw date/time separately, so keep a simple placeholder
    const [date, setDate] = useState(""); // optional change
    const [time, setTime] = useState("");

    const dateLabel = useMemo(() => event?.date || "", [event]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Event not found.</p>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newLocation = [building, room].filter(Boolean).join(" ");
        const newDateLabel =
            date && time
                ? new Date(`${date}T${time}`).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
                : dateLabel; // keep existing label if they didn't change

        onUpdate(eventId, {
            title,
            description,
            location: newLocation,
            date: newDateLabel,
            seats: seats ? Number(seats) : null,
            type,
        });

        navigate(`/event/${eventId}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A] mb-2">
                    Edit an Event
                </h1>

                <p className="text-sm text-slate-500 mb-8">{eventId} – {event.title}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event name */}
                    <div>
                        <label className="block text-sm text-slate-500 mb-1">
                            Event Name
                        </label>
                        <input
                            className="w-full border-b border-slate-300 py-2 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-slate-500 mb-1">
                            Event Description
                        </label>
                        <textarea
                            rows={5}
                            className="w-full border border-slate-300 rounded-md p-3 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Date / Time / Building / Room */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Current: {dateLabel || "not set"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Time</label>
                            <input
                                type="time"
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">
                                Building
                            </label>
                            <input
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={building}
                                onChange={(e) => setBuilding(e.target.value)}
                                placeholder="Outside B102"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Room</label>
                            <input
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                placeholder="Room -"
                            />
                        </div>
                    </div>

                    {/* Seats / Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">
                                Seats
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Type</label>
                            <select
                                className="w-full border-b border-slate-300 py-2 outline-none bg-transparent"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option>Indoor</option>
                                <option>Outdoor</option>
                                <option>Hybrid</option>
                            </select>
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
                            className="px-8 py-3 bg-[#FFDF4F] rounded-[6px] font-[Gilroy-Medium] text-[#14113B]"
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
