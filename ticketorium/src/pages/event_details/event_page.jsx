import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventActions from "../../components/event/EventActions.jsx";
import { getUserCategory } from "../../components/event/getUserCategory.js";

/* ----------------------------- Modal Component ----------------------------- */
function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative mx-4 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                <button
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

/* ----------------------------- Invite Section ----------------------------- */
function InviteRow({ person, price }) {
    const [invited, setInvited] = useState(false);
    const initial = person.name.charAt(0).toUpperCase();
    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                    <span className="text-slate-600 text-sm">{initial}</span>
                </div>
                <div>
                    <div className="font-semibold">{person.name}</div>
                    <div className="text-xs text-slate-500">{person.subtitle}</div>
                </div>
            </div>
            <button
                disabled={invited}
                onClick={() => setInvited(true)}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-slate-300 ${
                    invited
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-yellow-400 text-slate-900 hover:bg-yellow-300"
                }`}
            >
                {invited ? "Invited" : price > 0 ? "Pay & Invite" : "Invite"}
            </button>
        </div>
    );
}

function InviteList({ price }) {
    const [query, setQuery] = useState("");
    const users = [
        { name: "Ahmad Fasial", subtitle: "Student · CS Department" },
        { name: "Alex White", subtitle: "Visitor · No Department" },
        { name: "Sarah Salem", subtitle: "Student · EE Department" },
    ];
    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="mt-6">
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-full border border-slate-300 px-4 py-2 pl-10"
                    placeholder="Search people"
                />
                {/* r search icon unified */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 lucide lucide-search"
                    aria-hidden="true"
                >
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                </svg>

            </div>
            <div className="mt-4 space-y-3">
                {filtered.map((u) => <InviteRow key={u.name} person={u} price={price} />)}
                {filtered.length === 0 && <div className="text-sm text-slate-500">No matches.</div>}
            </div>
        </div>
    );
}

/* ----------------------------- Verify Ticket ------------------------------ */
function VerifyForm({ onClose }) {
    const [code, setCode] = useState("");
    return (
        <div>
            <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Enter Ticket Code"
            />
            <div className="flex justify-center mt-6 gap-3">
                <button
                    onClick={() => {
                        if (!code.trim()) { alert("Please enter a code."); return; }
                        alert(`Ticket ${code} is VALID (demo).`);
                    }}
                    className="px-4 py-2 border rounded-md bg-yellow-400 hover:bg-yellow-300"
                >
                    Verify
                </button>
                <button onClick={onClose} className="px-4 py-2 border rounded-md bg-white hover:bg-slate-50">
                    Close
                </button>
            </div>
        </div>
    );
}

/* ----------------------------- Main Event Page ---------------------------- */
export default function EventPage(props) {
    const navigate = useNavigate();
    const { eventId } = useParams();

    // type: student / visitor / organizer / admin
    const type = useMemo(() => {
        const t = props?.users && props?.user ? props.users[props.user]?.type : "visitor";
        return (t || "visitor").toLowerCase();
    }, [props?.users, props?.user]);

    // map type -> EventActions category
    const category = getUserCategory(type);

    // event by :eventId
    const raw = props?.events?.[eventId] || null;

    // local UI state
    const [title, setTitle] = useState(raw?.title || "Event");
    const [location, setLocation] = useState(raw?.location || "Campus");
    const [description, setDescription] = useState("Join us for an amazing event. (Demo description)");
    const [cover] = useState(`/src/assets/images/event/${raw?.img || "graduation.png"}`);
    const [organizerName] = useState(raw?.organizer || "Organizer");
    const [start] = useState("2025-11-21T06:30:00Z");
    const [end] = useState("2025-11-21T12:30:00Z");
    const [capacity] = useState(50);
    const [attendees] = useState(20);
    const [locationUrl] = useState("#");

    // price + local view state for actions
    const [price] = useState(typeof raw?.price === "number" ? raw.price : 0);
    const [viewState, setViewState] = useState(raw?.state || "not-joined");

    // modals
    const [openModal, setOpenModal] = useState("none"); // 'join' | 'resign' | 'invite' | 'edit' | 'verify' | 'delete' | 'none'
    const [showDeleteBanner, setShowDeleteBanner] = useState(false);
    const closeModal = () => setOpenModal("none");

    // actions coming from EventActions buttons
    function handleAction(label) {
        switch (label) {
            // attend / waitlist
            case "Join":
            case "Pay & Join":
            case "Join Waitlist":
                setOpenModal("join");
                break;

            // ticket & invite
            case "Your Ticket":
                alert("Open ticket page…");
                break;
            case "Send Invite":
            case "Offer Ticket":
            case "Accept":
                setOpenModal("invite");
                break;
            case "Decline":
            case "Resign":
                setOpenModal("resign");
                break;

            // organizer/admin tools
            case "Edit":
                setOpenModal("edit");
                break;
            case "Verify Tickets":
            case "Verify Tickets →":
                setOpenModal("verify");
                break;
            case "Delete":
                setOpenModal("delete");
                break;

            // card-only default (safety)
            case "View":
                if (eventId) navigate(`/event/${eventId}`);
                break;

            default:
                // no-op
                break;
        }
    }

    // helpers
    const formatTimeRange = (a, b) => {
        const fmt = (d) => new Date(d).toLocaleString(undefined, {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        });
        return `${fmt(a)} – ${fmt(b)}`;
    };

    return (
        <div className="bg-white text-[#1A1A1A] min-h-screen">
            <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-8">
                {/* Back */}
                <button onClick={() => navigate(-1)} className="text-[#4F6FFF] hover:underline font-[Gilroy-Medium] text-[16px]">
                    ← Back
                </button>

                {/* Header */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-[Gilroy-Black] text-[#1A1A1A] text-[36px] leading-tight">{title}</h1>
                        <p className="font-[Gilroy-Medium] text-[16px] text-[#3E3E3E]">by {organizerName}</p>
                    </div>

                    {/* EXACT same buttons as cards, but wired via onAction */}
                    <EventActions
                        type={type}
                        category={category}
                        state={viewState}
                        eventId={eventId}
                        onAction={handleAction}
                    />

                </div>

                {/* Cover */}
                <figure className="mt-6 overflow-hidden rounded-xl shadow-sm">
                    <img
                        className="h-auto w-full object-cover"
                        alt={title}
                        src={cover}
                        onError={(e) => { e.currentTarget.src = "/src/assets/images/event/graduation.png"; }}
                    />
                </figure>

                {/* Description */}
                <article className="prose max-w-none mt-6 text-slate-700">
                    <p>{description}</p>
                </article>

                {/* Meta */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-indigo-700 font-medium">Time: {formatTimeRange(start, end)}</span>
                        <div className="flex gap-8 text-slate-500">
                            <span>{attendees} Seats taken</span>
                            <span>{Math.max(0, capacity - attendees)} Seats left</span>
                        </div>
                        <a href={locationUrl} className="text-indigo-700 font-medium hover:underline">
                            Location: {location}
                        </a>
                    </div>
                </div>
            </main>

            {/* -------------------------- Modals -------------------------- */}
            <Modal isOpen={openModal === "join"} onClose={closeModal}>
                <div className="text-center">
                    <h3 className="text-xl font-semibold">Join <span className="font-bold">{title}</span>?</h3>
                    <p className="mt-2 text-slate-500">
                        {price > 0 ? <>You will pay <span className="text-indigo-700 font-medium">${price.toFixed(2)}</span></> : <>This event is free</>}
                    </p>
                    <label className="mt-6 block text-sm text-slate-600">Accessibility needs (optional)</label>
                    <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="" />
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium border border-slate-300 bg-white text-slate-700 rounded-md shadow-sm hover:bg-slate-50">Cancel</button>

                        <button
                            onClick={() => { setViewState("joined"); closeModal(); }}
                            className="px-4 py-2 text-sm font-medium border border-slate-300 bg-yellow-400 text-slate-900 rounded-md shadow-sm hover:bg-yellow-300"
                        >
                            {price > 0 ? "Pay & Join" : "Join"}
                        </button>
                        {/* r edited to fix resign button */}




                    </div>
                </div>
            </Modal>

            <Modal isOpen={openModal === "resign"} onClose={closeModal}>
                <div className="text-center">
                    <h3 className="text-xl font-semibold">Resign from <span className="font-bold">{title}</span>?</h3>
                </div>
                {price > 0 && (
                    <p className="mt-2 text-slate-500 text-center">Refund: <span className="text-indigo-700 font-medium">${price.toFixed(2)}</span></p>
                )}
                <div className="mt-6 flex justify-center gap-3">

                    <button
                        onClick={() => { setViewState("not-joined"); closeModal(); }}
                        className="px-4 py-2 text-sm font-medium bg-white border border-rose-300 text-rose-600 rounded-md shadow-sm hover:bg-rose-50"
                    >
                        Resign
                    </button>
                    {/* r edited to fix resign button */}



                <button onClick={closeModal} className="px-4 py-2 text-sm font-medium border border-slate-300 bg-white text-slate-700 rounded-md shadow-sm hover:bg-slate-50">
                        Don't Resign
                    </button>
                </div>
            </Modal>

            <Modal isOpen={openModal === "invite"} onClose={closeModal}>
                <div>
                    <h3 className="text-xl font-semibold text-center">Invite to <span className="font-bold">{title}</span></h3>
                    <p className="mt-2 text-center text-slate-500">
                        {price > 0 ? <>You will pay <span className="text-indigo-700 font-medium">${price.toFixed(2)}</span></> : <>This invite is free</>}
                    </p>
                    <InviteList price={price} />
                </div>
            </Modal>

            <Modal isOpen={openModal === "edit"} onClose={closeModal}>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-center">Edit Event</h3>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); closeModal(); }}>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Title</label>
                            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Location</label>
                            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Description</label>
                            <textarea rows={4} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-md bg-white hover:bg-slate-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 border rounded-md bg-yellow-400 hover:bg-yellow-300">Save</button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={openModal === "verify"} onClose={closeModal}>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-center">Verify Tickets</h3>
                    <VerifyForm onClose={closeModal} />
                </div>
            </Modal>

            <Modal isOpen={openModal === "delete"} onClose={closeModal}>
                <div className="text-center">
                    <h3 className="text-xl font-semibold">Really delete <span className="font-bold">{title}</span>?</h3>
                    <p className="mt-2 text-slate-500">This action cannot be undone.</p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            onClick={() => { closeModal(); setShowDeleteBanner(true); setTimeout(() => setShowDeleteBanner(false), 2500); }}
                            className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-500"
                        >
                            Delete
                        </button>
                        <button onClick={closeModal} className="px-4 py-2 rounded-md border bg-white hover:bg-slate-50">Cancel</button>
                    </div>
                </div>
            </Modal>

            {showDeleteBanner && (
                <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-white shadow">
                    Event deleted (demo).
                </div>
            )}
        </div>
    );
}
