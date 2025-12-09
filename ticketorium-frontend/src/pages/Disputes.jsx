import React, {useEffect, useMemo, useState} from "react";
import { Plus } from "lucide-react";

import DisputeList from "../components/dispute-list/DisputeList.jsx";
import DisputeChat from "../components/dispute/DisputeChat.jsx";

/* ---------------- New Dispute Form ---------------- */

function NewDisputeForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            alert("Please fill in both fields.");
            return;
        }
        onSubmit({ title, body }); // parent will add createdById
        setTitle("");
        setBody("");
    }

    return (
        <div className="flex-1 flex flex-col px-4 md:px-8 pt-6">
            <form className="w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Dispute Title"
                        className="w-full border-b border-[#E0E0E0] py-2 text-[16px] font-[Gilroy-Medium] outline-none placeholder:text-[#B5B5B5]"
                    />
                </div>

                <div className="mb-6">
          <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your issue"
              className="w-full border border-[#E0E0E0] rounded-[10px] px-4 py-3 text-[14px] font-[Gilroy-Medium] outline-none placeholder:text-[#B5B5B5] h-[200px]"
          />
                </div>

                <div className="flex justify-end gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2 rounded-[6px] border border-[var(--secondary-color)] text-[14px] font-[Gilroy-Medium] text-[var(--secondary-color)] bg-white hover:bg-[#F7F7F7]"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-8 py-2 rounded-[6px] bg-[var(--accent-color)] text-[var(--secondary-color)] text-[14px] font-[Gilroy-Medium] hover:brightness-105"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Disputes(props) {
    const [disputesObj, setDisputesObj] = useState({}); // object keyed by dispute._id
    const [selectedId, setSelectedId] = useState(null);
    const [mode, setMode] = useState("empty"); // 'empty' | 'new' | 'chat'
    const currentUserId = props.user._id;

    // load disputes list on mount (optionally filter by participant/userId)
    useEffect(() => {
        async function load() {
            try {
                const q = currentUserId ? `?userId=${encodeURIComponent(currentUserId)}` : "";
                const res = await fetch(`/api/disputes${q}`);
                if (!res.ok) throw new Error("Failed to fetch disputes");
                const data = await res.json(); // array of disputes (populated)
                // convert to object keyed by _id so rest of your UI works
                const obj = {};
                data.forEach((d) => {
                    obj[d._id] = { id: d._id, ...d };
                });
                console.log("Parent passes user prop to DisputeChat:", props.user);
                setDisputesObj(obj);
            } catch (err) {
                console.error("Load disputes error", err);
            }
        }
        load();
    }, [currentUserId]);

    // fetch a single dispute (fresh messages / participants) when selecting
    async function handleSelectDispute(id) {
        try {
            const res = await fetch(`/api/disputes/${id}`);
            if (!res.ok) throw new Error("Failed to load dispute");
            const d = await res.json(); // populated dispute
            setDisputesObj((prev) => ({ ...prev, [d._id]: { id: d._id, ...d } }));
            setSelectedId(d._id);
            setMode("chat");
        } catch (err) {
            console.error("Select dispute error", err);
        }
    }

// create dispute -> POST /api/disputes
    async function handleCreateDispute({ title, body }) {
        try {
            const payload = {
                title,
                subtitle: body.slice(0, 200),
                createdById: currentUserId,
                participantIds: [], // optionally pass other participant ids
                type: "other",
            };
            const res = await fetch("/api/disputes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to create dispute");
            }
            const d = await res.json(); // created dispute (has _id)
            setDisputesObj((prev) => ({ ...prev, [d._id]: { id: d._id, ...d } }));
            setSelectedId(d._id);
            setMode("chat");
        } catch (err) {
            console.error("Create dispute error", err);
            alert("Could not create dispute: " + err.message);
        }
    }

    // handleSendMessage now POSTS to backend and updates local state with response
    async function handleSendMessage(disputeId, text, fromId, type = "text", url = null, caption = null) {
        try {
            const payload = { fromId, type };
            if (type === "text") payload.text = text;
            if (url) {
                payload.url = url;
                if (caption) payload.caption = caption;
            }
            const res = await fetch(`/api/disputes/${disputeId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to send message");
            const updated = await res.json(); // full dispute returned
            setDisputesObj((prev) => ({ ...prev, [updated._id]: { id: updated._id, ...updated } }));
        } catch (err) {
            console.error("Send message error", err);
            alert("Message failed to send");
        }
    }

    // convert object-of-objects to array for list component
    const disputesArray = useMemo(() => {
        return Object.values(disputesObj).sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));
    }, [disputesObj]);

    const selectedDispute = disputesObj[selectedId] || null;

    return (
        <div className="flex flex-col h-screen bg-white text-[#1A1A1A]">
            <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4">
                <h1 className="font-[Gilroy-Black] text-[60px] w-full justify-start leading-none py-10">
                    My Disputes
                </h1>

                {(props.user.role !== "admin" && props.user.role !== "system-admin") && (
                    <div className="flex w-full justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setMode("new");
                                setSelectedId(null);
                            }}
                            className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] px-5 py-2.5 text-[14px] font-[Gilroy-Medium] cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            New Dispute
                        </button>
                    </div>
                )}
            </header>

            <section
                className="
                        flex flex-col md:flex-row
                        px-4 md:px-8 pb-6 gap-4 md:gap-6
                        h-[800px] md:h-[700px] overflow-y-hidden
                    "
            >                {/* Left: Dispute list */}
                <DisputeList
                    disputes={disputesArray}
                    selectedId={selectedId}
                    onSelect={handleSelectDispute}
                />

                {/* Right: main area (empty / new / chat) */}
                <div className="flex-1 flex flex-col md:h-[600px] h-[850px] mt-3 md:mt-0">

                    {mode === "empty" && (
                        <div className="flex items-center justify-center text-center text-[#A0A0A0] font-[Gilroy-Medium] text-[14px] md:text-[16px] h-full">
                            Select a chat to start messaging.
                        </div>
                    )}

                    {mode === "new" && (
                        <NewDisputeForm
                            username={props.user}
                            onSubmit={handleCreateDispute}
                            onCancel={() =>
                                selectedDispute ? setMode("chat") : setMode("empty")
                            }
                        />
                    )}

                    {mode === "chat" && selectedDispute && (

                        <DisputeChat
                            dispute={selectedDispute}
                            onSendMessage={handleSendMessage}
                            user={props.user}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}