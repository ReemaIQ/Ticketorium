// src/pages/events/CreateEvent.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";

function CreateEvent({ loggedInUser }) {
    const navigate = useNavigate();

    // ----- backend organizer (User) -----
    const [backendUser, setBackendUser] = useState(null);

    // ----- form state -----
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [date, setDate] = useState(""); // start date YYYY-MM-DD
    const [time, setTime] = useState(""); // start time HH:MM

    const [endDate, setEndDate] = useState(""); // optional
    const [endTime, setEndTime] = useState(""); // optional

    const [building, setBuilding] = useState("");
    const [room, setRoom] = useState("");

    const [hasSeatingPlan, setHasSeatingPlan] = useState(false);
    const [seats, setSeats] = useState("");

    const [price, setPrice] = useState("");
    const [capacityReserved, setCapacityReserved] = useState("");
    const [capacityWaitlist, setCapacityWaitlist] = useState("");

    const [type, setType] = useState("Indoor");

    const [imgFile, setImgFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(
        "/src/assets/images/event/graduation.png"
    );

    const fileInputRef = useRef(null);

    const [error, setError] = useState(""); // top banner error
    const [fieldErrors, setFieldErrors] = useState({}); // per-field errors
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* -------------------------------------------------
       Load backend user (organizer) by handle
    -------------------------------------------------- */
    useEffect(() => {
        if (!loggedInUser) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${API_BASE}/api/users/by-handle/${encodeURIComponent(loggedInUser)}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!res.ok) {
                    throw new Error("Failed to load organizer");
                }
                const data = await res.json();
                setBackendUser(data);
            } catch (err) {
                console.error("Failed to load organizer", err);
                setError(
                    "Could not load organizer data. Please refresh and try again."
                );
            }
        };

        fetchUser();
    }, [loggedInUser]);

    /* -------------------------------------------------
       Build ISO-like datetime "YYYY-MM-DDTHH:MM:00"
       (backend does new Date(startAt) on this)
    -------------------------------------------------- */
    const buildDateTimeString = (d, t) => {
        if (!d || !t) return null;
        return `${d}T${t}:00`;
    };

    /* -------------------------------------------------
       Image change + preview
    -------------------------------------------------- */
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setImgFile(file);
        const url = URL.createObjectURL(file);
        setPreviewSrc(url);
    };

    /* -------------------------------------------------
       Validation helper
    -------------------------------------------------- */
    const validateForm = () => {
        const newFieldErrors = {};

        if (!title.trim()) {
            newFieldErrors.title = "Event name is required.";
        }
        if (!date) {
            newFieldErrors.date = "Please select a date.";
        }
        if (!time) {
            newFieldErrors.time = "Please select a time.";
        }

        if (price && Number(price) < 0) {
            newFieldErrors.price = "Price cannot be negative.";
        }
        if (seats && Number(seats) < 0) {
            newFieldErrors.seats = "Number of seats cannot be negative.";
        }
        if (capacityReserved && Number(capacityReserved) < 0) {
            newFieldErrors.capacityReserved =
                "Reserved capacity cannot be negative.";
        }
        if (capacityWaitlist && Number(capacityWaitlist) < 0) {
            newFieldErrors.capacityWaitlist =
                "Waitlist capacity cannot be negative.";
        }

        setFieldErrors(newFieldErrors);
        return Object.keys(newFieldErrors).length === 0;
    };

    /* -------------------------------------------------
       Submit new event to backend
    -------------------------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (isSubmitting) return;

        if (!backendUser) {
            setError("Unable to load organizer data.");
            return;
        }

        const isValid = validateForm();
        if (!isValid) {
            setError("Please fix the highlighted fields.");
            return;
        }

        const startAt = buildDateTimeString(date, time);
        if (!startAt) {
            setError("Invalid start date/time.");
            return;
        }

        const endAt =
            endDate && endTime ? buildDateTimeString(endDate, endTime) : "";

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description || "");

        formData.append("startAt", startAt);
        if (endAt) formData.append("endAt", endAt);

        // numeric defaults
        formData.append("price", price || 0);

        // Seating – capacityTotal == seats if seating plan; else 0
        formData.append("hasSeatingPlan", hasSeatingPlan);
        formData.append("capacityTotal", hasSeatingPlan ? seats || 0 : 0);

        formData.append("capacityReserved", capacityReserved || 0);
        formData.append("capacityWaitlist", capacityWaitlist || 0);

        // Combine building + room into a single location string
        const location = [building, room].filter(Boolean).join(" ");
        if (location) {
            formData.append("location", location);
        }

        // optional extras; backend can use `type` if schema supports it
        formData.append("type", type || "Indoor");

        // organizer & university from backend user
        formData.append("organizer", backendUser._id);
        if (backendUser.university && backendUser.university._id) {
            formData.append("university", backendUser.university._id);
        }

        if (imgFile) {
            formData.append("img", imgFile);
        }

        try {
            setIsSubmitting(true);

            const res = await fetch(`${API_BASE}/api/events`, {
                method: "POST",
                credentials: "include",
                body: formData, // no manual Content-Type; browser sets multipart boundary
            });

            const createdEvent = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(createdEvent.error || "Failed to create event.");
                return;
            }

            const targetId = createdEvent._id;
            if (!targetId) {
                setError(
                    "Event was created, but no ID was returned from the server."
                );
                return;
            }

            navigate(`/event/${targetId}`);
        } catch (err) {
            console.error(err);
            setError("Error connecting to backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* -------------------------------------------------
       UI
    -------------------------------------------------- */
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

                {!backendUser && (
                    <p className="mb-4 text-xs text-slate-400">
                        Loading organizer info…
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event name */}
                    <div>
                        <label className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-1 uppercase tracking-wide">
                            Event Name
                        </label>
                        <input
                            className={`w-full border-b border-slate-300 py-2 outline-none text-[#1A1A1A] placeholder:text-slate-400 ${
                                fieldErrors.title
                                    ? "border-[var(--warning-color)]"
                                    : ""
                            }`}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (error) setError("");
                                if (fieldErrors.title) {
                                    setFieldErrors((prev) => ({
                                        ...prev,
                                        title: undefined,
                                    }));
                                }
                            }}
                            placeholder="Ex: 2025 Group Hiking"
                        />
                        {fieldErrors.title && (
                            <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                {fieldErrors.title}
                            </p>
                        )}
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
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] ${
                                        fieldErrors.date
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        if (error) setError("");
                                        if (fieldErrors.date) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                date: undefined,
                                            }));
                                        }
                                    }}
                                />
                                {fieldErrors.date && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] ${
                                        fieldErrors.time
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        if (error) setError("");
                                        if (fieldErrors.time) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                time: undefined,
                                            }));
                                        }
                                    }}
                                />
                                {fieldErrors.time && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* End date/time optional */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    End Date (optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    End Time (optional)
                                </label>
                                <input
                                    type="time"
                                    className="w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A]"
                                    value={endTime}
                                    onChange={(e) =>
                                        setEndTime(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setBuilding(e.target.value)
                                    }
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
                                        onChange={(e) => {
                                            setHasSeatingPlan(e.target.checked);
                                            if (!e.target.checked) {
                                                setSeats("");
                                                if (fieldErrors.seats) {
                                                    setFieldErrors((prev) => ({
                                                        ...prev,
                                                        seats: undefined,
                                                    }));
                                                }
                                            }
                                        }}
                                    />
                                    <span className="text-sm text-slate-700">
                                        Has seating map?
                                    </span>
                                </label>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Number of Seats (capacityTotal)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] disabled:text-slate-400 disabled:border-slate-200 placeholder:text-slate-400 ${
                                        fieldErrors.seats
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={seats}
                                    onChange={(e) => {
                                        setSeats(e.target.value);
                                        if (fieldErrors.seats) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                seats: undefined,
                                            }));
                                        }
                                    }}
                                    disabled={!hasSeatingPlan}
                                    placeholder={
                                        hasSeatingPlan
                                            ? "Ex: 50 (default is 0 if empty)"
                                            : "Enable seating first"
                                    }
                                />
                                {fieldErrors.seats && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.seats}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Event Type
                                </label>
                                <select
                                    className="w-full border-b border-slate-300 py-2 outline-none bg-transparent text-sm text-[#1A1A1A]"
                                    value={type}
                                    onChange={(e) =>
                                        setType(e.target.value)
                                    }
                                >
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Capacity */}
                    <div>
                        <p className="block text-xs font-[Gilroy-Medium] text-slate-500 mb-2 uppercase tracking-wide">
                            Pricing &amp; Capacity
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Ticket Price (SAR)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400 ${
                                        fieldErrors.price
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                        if (fieldErrors.price) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                price: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Default is 0"
                                />
                                {fieldErrors.price && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Reserved Capacity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400 ${
                                        fieldErrors.capacityReserved
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={capacityReserved}
                                    onChange={(e) => {
                                        setCapacityReserved(e.target.value);
                                        if (fieldErrors.capacityReserved) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                capacityReserved: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Default is 0"
                                />
                                {fieldErrors.capacityReserved && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.capacityReserved}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">
                                    Waitlist Capacity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full border-b border-slate-300 py-2 outline-none text-sm text-[#1A1A1A] placeholder:text-slate-400 ${
                                        fieldErrors.capacityWaitlist
                                            ? "border-[var(--warning-color)]"
                                            : ""
                                    }`}
                                    value={capacityWaitlist}
                                    onChange={(e) => {
                                        setCapacityWaitlist(e.target.value);
                                        if (fieldErrors.capacityWaitlist) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                capacityWaitlist: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Default is 0"
                                />
                                {fieldErrors.capacityWaitlist && (
                                    <p className="mt-1 text-[11px] text-[var(--warning-color)]">
                                        {fieldErrors.capacityWaitlist}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-400">
                            If you leave any number empty, it will be saved as 0.
                        </p>
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
                                    If you don&apos;t upload an image, the default
                                    graduation image will be used.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={!backendUser || isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-color)] rounded-[6px] font-[Gilroy-Medium] text-[var(--secondary-color)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Event"}
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CreateEvent;
