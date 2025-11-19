import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function CreateEventPage({ user, users, onCreate }) {
    const navigate = useNavigate();

    const organizerName = useMemo(() => {
        const u = users?.[user];
        if (!u) return "Organizer";
        return `${u["first-name"]} ${u["last-name"]}`;
    }, [user, users]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");     // YYYY-MM-DD
    const [time, setTime] = useState("");     // HH:MM
    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");
    const [seats, setSeats] = useState("");
    const [type, setType] = useState("Indoor");
    const [createTickets, setCreateTickets] = useState(true);
    const [autoAssign, setAutoAssign] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !date || !time) {
            alert("Please fill in at least title, date, and time.");
            return;
        }

        const dateObj = new Date(`${date}T${time}`);
        const formattedDateLabel = dateObj.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const locationLabel = [building, room].filter(Boolean).join(" ");

        const newId = onCreate({
            title,
            description,
            dateLabel: formattedDateLabel,
            organizer: organizerName,
            price: 0,
            hasSeatingPlan: !!seats && Number(seats) > 0,
            location: locationLabel,
            seats: seats ? Number(seats) : null,
            type,
            createTickets,
            autoAssign,
            img: "graduation.png", // default image
        });

        // Go to new event page
        navigate(`/event/${newId}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A] mb-8">
                    Create an Event
                </h1>

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
                            placeholder="Event Name"
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
                            placeholder="Describe your event"
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
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Room</label>
                            <input
                                className="w-full border-b border-slate-300 py-2 outline-none"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Seats / Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">
                                Number of Seats
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

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={createTickets}
                                onChange={(e) => setCreateTickets(e.target.checked)}
                            />
                            <span className="text-sm text-slate-700">Create Tickets</span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={autoAssign}
                                onChange={(e) => setAutoAssign(e.target.checked)}
                            />
                            <span className="text-sm text-slate-700">
                Auto Assign Seats
              </span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-10">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-[#FFDF4F] rounded-[6px] font-[Gilroy-Medium] text-[#14113B]"
                        >
                            Create
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CreateEventPage;
