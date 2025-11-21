import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import DisputeList from "../components/dispute-list/DisputeList.jsx";
import DisputeChat from "../components/dispute/DisputeChat.jsx";

/* ---------------- New Dispute Form ---------------- */

function NewDisputeForm({ onSubmit, onCancel, username }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            alert("Please fill in both fields.");
            return;
        }
        onSubmit({ title, body }, username);
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
                            className="px-5 py-2 rounded-[6px] border border-[#14113B] text-[14px] font-[Gilroy-Medium] text-[#14113B] bg-white hover:bg-[#F7F7F7]"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-8 py-2 rounded-[6px] bg-[#FFDF4F] text-[#14113B] text-[14px] font-[Gilroy-Medium] hover:brightness-105"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Disputes(props) {
    const [disputes, setDisputes] = useState(props.disputes || {});
    const [selectedId, setSelectedId] = useState(null);
    const [mode, setMode] = useState("empty"); // 'empty' | 'new' | 'chat'
    //mode = props.mode || "empty";

    // Turn object into array for lists (and make sure each item has an id)
    const disputesArray = useMemo(
        () => {
            if (!disputes) return [];

            const allDisputesArray = Object.entries(disputes).map(([id, d]) => ({
                id,
                ...d,
            }));

            // Filtering Logic: Show disputes only if the current user is a participant.
            return allDisputesArray.filter(dispute => {
                // A common check: See if the current user has sent or received *any* message.
                // **BETTER**: Filter based on a dedicated `participants` array on the dispute object.

                // Assuming you add a 'participants' array to your dispute objects:
                if (dispute.participants && dispute.participants.includes(props.user)) {
                    return true;
                }

                // Fallback check (less reliable, but works if participants aren't stored):
                const messages = Array.isArray(dispute.messages) ? dispute.messages : [];
                const isParticipant = messages.some(msg => msg.from === props.user);

                return isParticipant;
            });
        },
        [disputes, props.user]
    );

    // Get the currently selected dispute from the ARRAY, which always has id
    const selectedDispute = useMemo(
        () => disputesArray.find((d) => d.id === selectedId) || null,
        [disputesArray, selectedId]
    );


    // When selecting from list → go to chat mode
    function handleSelectDispute(id) {
        setSelectedId(id);
        setMode("chat");
    }

    function handleCreateDispute({ title, body }, username) {
        const nowIso = new Date().toISOString();
        const newId = `d_${Date.now()}`;

        const newDispute = {
            id: newId,
            title,
            subtitle: body.slice(0, 80) + (body.length > 80 ? "…" : ""),
            createdAt: nowIso,
            lastActivityAt: nowIso,
            status: "open",
            participants: [username, "so-cool"],
            messages: [
                {
                    id: `m_${Date.now()}`,
                    from: username,
                    type: "text",
                    text: body,
                    createdAt: nowIso,
                },
            ],
        };

        // Add to object-of-objects
        setDisputes((prev) => ({
            ...prev,
            [newId]: newDispute,
        }));

        setSelectedId(newId);
        setMode("chat");
    }

    function handleSendMessage(disputeId, text, username, type = "text", url = null) {
        const nowIso = new Date().toISOString();

        setDisputes((prev) => {
            const existing = prev[disputeId];
            if (!existing) return prev;

            let updatedParticipants = existing.participants ? [...existing.participants] : [];

            if (!updatedParticipants.includes(username)) {
                updatedParticipants.push(username);
            }

            return {
                ...prev,
                [disputeId]: {
                    ...existing,
                    lastActivityAt: nowIso,
                    participants: updatedParticipants,
                    messages: [
                        ...(existing.messages || []),
                        {
                            id: `m_${Date.now()}`,
                            from: username,
                            type: type,
                            text: text,
                            url: url,
                            createdAt: nowIso,
                        },
                    ],
                },
            };
        });
    }

    return (
        <div className="flex flex-col h-screen bg-white text-[#1A1A1A]">
            <header className="flex items-center justify-between px-4 md:px-8 py-4">
                <h1 className="font-[Gilroy-Black] text-[40px] md:text-[48px] leading-none py-10">
                    My Disputes
                </h1>

                {(props.users[props.user]['type'] !== "admin" && props.users[props.user]['type'] !== "system-admin") && (
                    <button
                    type="button"
                    onClick={() => {
                        setMode("new");
                        setSelectedId(null);
                    }}
                    className="flex items-center gap-2 bg-[#FFDF4F] text-[#14113B] rounded-[6px] px-5 py-2.5 text-[14px] font-[Gilroy-Medium] hover:brightness-105"
                >
                    <Plus className="w-4 h-4" />
                    New Dispute
                </button>
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
                                username={props.user}
                            />
                        )}
                </div>
            </section>
        </div>
    );
}
