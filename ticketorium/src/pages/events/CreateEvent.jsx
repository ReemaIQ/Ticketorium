import React, { useState, useMemo, useRef } from "react";
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
    const [date, setDate] = useState(""); // YYYY-MM-DD
    const [time, setTime] = useState(""); // HH:MM
    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");

    const [hasSeatingPlan, setHasSeatingPlan] = useState(false);
    const [seats, setSeats] = useState("");
    const [type, setType] = useState("Indoor");

    const [createTickets, setCreateTickets] = useState(true);
    const [autoAssign, setAutoAssign] = useState(true);

    const [imgValue, setImgValue] = useState("graduation.png");
    const [previewSrc, setPreviewSrc] = useState(
        "/src/assets/images/event/graduation.png"
    );

    const fileInputRef = useRef(null);

    const [error, setError] = useState(""); // improved inline banner

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImgValue(url);
        setPreviewSrc(url);
    };


    //fix: robust date
    const buildDateFromInputs = (dateStr, timeStr) => {
        if (!dateStr || !timeStr) return null;

        const [y, m, d] = dateStr.split("-").map(Number);
        const [h, min] = timeStr.split(":").map(Number);

        // Check all are valid numbers
        if (
            !y || !m || !d ||
            Number.isNaN(h) || Number.isNaN(min)
        ) {
            return null;
        }

        const dt = new Date(y, m - 1, d, h, min);
        if (Number.isNaN(dt.getTime())) return null;

        return dt;
    };

    //r: better pop-up message
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !date || !time) {
            setError("Please fill in at least the event name, date, and time.");
            return;
        }

        const dateObj = buildDateFromInputs(date, time);
        if (!dateObj) {
            setError("The selected date or time is invalid. Please choose a valid date & time.");
            return;
        }

        const formattedDateLabel = dateObj.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const locationLabel = [building, room].filter(Boolean).join(" ");

        const seatsNumber =
            hasSeatingPlan && seats ? Number(seats) : null;

        const newId = onCreate({
            title,
            description,
            dateLabel: formattedDateLabel,
            organizer: organizerName,
            price: 0,
            hasSeatingPlan,
            location: locationLabel,
            seats: seatsNumber,
            type,
            createTickets,
            autoAssign,
            img: imgValue || "graduation.png",
        });

        setError("");
        navigate(`/event/${newId}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="font-[Gilroy-Black] text-[40px] text-[#1A1A1A] mb-2">
                    Create an Event
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    Fill out the details to publish your new event.
                </p>

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
                            className="w-full border-b border-slate-300 py-2 outline-none text-[#1A1A1A] placeholder:text-slate-400"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="Ex: 2025 Group Hiking"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-1 uppercase tracking-wide">
                            Event Description
                        </label>
                        <textarea
                            rows={5}
                            className="w-full border border-slate-200 rounded-md p-3 resize-none text-sm text-[#1A1A1A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]/30"
                            placeholder="Describe your event, who should attend, and what to expect."
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
                                    Date
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
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Time
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
                    {/* Building + Room */}
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
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400"
                                    value={building}
                                    onChange={(e) => setBuilding(e.target.value)}
                                    placeholder="Ex: KFUPM B24"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Room / Spot
                                </label>
                                <input
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    placeholder="Ex: Room 103 or Courtyard"
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
                                    Number of Seats
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] disabled:text-slate-400 disabled:border-slate-200 placeholder:text-slate-400"
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    disabled={!hasSeatingPlan}
                                    placeholder={
                                        hasSeatingPlan
                                            ? "Ex: 50"
                                            : "Enable seating first"
                                    }
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

                    {/* Image upload + preview */}
                    <div>
                        <p className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-2 uppercase tracking-wide">
                            Event Cover Image
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-6 items-center">
                            <figure className="w-full max-w-xs border border-slate-200 bg-slate-50 overflow-hidden">
                                <img
                                    src={previewSrc}
                                    alt="Event preview"
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/src/assets/images/event/graduation.png";
                                    }}
                                />
                            </figure>

                            <div>
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-slate-300 text-sm font-[Gilroy-Medium] text-[#1A1A1A] bg-white hover:bg-slate-50"
                                    onClick={() =>
                                        fileInputRef.current &&
                                        fileInputRef.current.click()
                                    }
                                >
                                    Upload image from device
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <p className="text-[11px] text-slate-400 mt-2">
                                    If you don&apos;t upload an image, the
                                    default graduation image will be used.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-[var(--secondary-color)]"
                                checked={createTickets}
                                onChange={(e) =>
                                    setCreateTickets(e.target.checked)
                                }
                            />
                            <span className="text-sm text-slate-700">
                                Create tickets for this event
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-[var(--secondary-color)]"
                                checked={autoAssign}
                                onChange={(e) =>
                                    setAutoAssign(e.target.checked)
                                }
                            />
                            <span className="text-sm text-slate-700">
                                Auto assign seats on registration
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-color)] rounded-[6px] font-[Gilroy-Medium] text-[var(--primary-color)]"
                        >
                            Create Event
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CreateEventPage;
