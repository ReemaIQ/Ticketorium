import { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";

function MessageBubble({ message, username }) {
    const isUser = message.from === username;

    if (message.type === "image") {
        return (
            <div className="flex">
                {!isUser && <div className="w-5 h-5 rounded-full bg-[var(--dispute-chat)] mr-2" />}
                <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`rounded-2xl p-2 bg-[var(--dispute-chat)] ${
                            isUser ? "rounded-tr-none" : "rounded-tl-none"
                        }`}
                    >
                        <div className="w-[260px] h-[160px] bg-[var(--primary-color)] rounded-xl" />
                        {message.caption && (
                            <p className="mt-2 text-[13px] text-[#1A1A1A] font-[Gilroy-Medium]">
                                {message.caption}
                            </p>
                        )}
                    </div>
                </div>
            </div>

        );
    }

    return (
        <div className={`flex items-end mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && <div className="w-5 h-5 rounded-full bg-[var(--dispute-chat)] mr-2" />}
            <div
                className={`px-3 py-2 rounded-2xl text-[13px] font-[Gilroy-Medium] ${
                    isUser
                        ? "bg-[var(--secondary-color)] text-white rounded-br-none"
                        : "bg-[var(--dispute-chat)] text-[#1A1A1A] rounded-bl-none"
                }`}
            >
                {message.text}
            </div>
        </div>
    );
}

function DisputeChat({ dispute, onSendMessage, username }) {
    const [input, setInput] = useState("");
    const messages = Array.isArray(dispute.messages) ? dispute.messages : [];
    const fileInputRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(dispute.id, input.trim(), username);
        setInput("");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {

            // For demo purposes, we read the file locally to display it immediately.
            const reader = new FileReader();
            reader.onload = (e) => {
                // You should collect the caption from the user if needed,
                // but for this demo, we'll send it immediately.
                const imageUrl = e.target.result;

                onSendMessage(
                    dispute.id,
                    "Image attached.", // Placeholder text, or prompt for caption
                    username,
                    "image",
                    imageUrl // Pass the image URL (base64 data URL)
                );
            };
            reader.readAsDataURL(file);
        }

        // Reset the file input so the same file can be selected again
        event.target.value = null;
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 h-[450px] px-0 md:px-4 pt-2">
            {/* Messages area (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-4 pr-2">
                {messages.length === 0 && (
                    <p className="text-sm text-[#A0A0A0] mt-4">
                        This dispute has no messages yet. Start the conversation below.
                    </p>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} username={username} />
                ))}
            </div>

            {/* Input row pinned at bottom */}
            <div className="mt-3 mb-2 flex items-center gap-3">

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" // Keep it hidden
                />

                <div className="flex-1 bg-[#F6F9FF] rounded-full px-5 py-3 flex items-center">
                    <input
                        className="flex-1 bg-transparent outline-none text-[14px] font-[Gilroy-Medium]"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                </div>
                <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-[var(--secondary-color)] flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    <Paperclip className="w-4 h-4 text-[var(--secondary-color)]" />
                </button>
                <button
                    type="button"
                    onClick={handleSend}
                    className="w-9 h-9 rounded-full bg-[var(--accent-color)] flex items-center justify-center cursor-pointer"
                >
                    <Send className="w-4 h-4 text-[var(--secondary-color)]" />
                </button>
            </div>
        </div>
    );
}

export default DisputeChat;
