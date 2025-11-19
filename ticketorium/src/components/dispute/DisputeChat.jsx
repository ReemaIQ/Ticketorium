import {useState} from "react";
import {Paperclip, Send} from "lucide-react";

function MessageBubble({ message }) {
    const isUser = message.from === "user" || message.from === "student" || message.from === "visitor";

    if (message["type"] === "image") {
        return (
            <div
                className={`flex mb-3 ${
                    isUser ? "justify-end" : "justify-start"
                }`}
            >
                <div
                    className={`rounded-2xl p-1 bg-[#ECF2FF] border border-[#D2E0FF] ${
                        isUser ? "rounded-tr-none" : "rounded-tl-none"
                    }`}
                >
                    <div className="w-[260px] h-[160px] bg-[#C8DAFF] rounded-xl" />
                    {message["caption"] && (
                        <p className="mt-2 text-[12px] text-[#1A1A1A] font-[Gilroy-Medium]">
                            {message["caption"]}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex items-end mb-3 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="w-4 h-4 rounded-full bg-[#D5E4FF] mr-2" />
            )}
            <div
                className={`px-3 py-2 rounded-2xl text-[13px] font-[Gilroy-Medium] ${
                    isUser
                        ? "bg-[#14113B] text-white rounded-br-none"
                        : "bg-[#ECF2FF] text-[#14113B] rounded-bl-none"
                }`}
            >
                {message["text"]}
            </div>
        </div>
    );
}

function DisputeChat({ dispute, onSendMessage }) {
    const [input, setInput] = useState("");
    const messages = Array.isArray(dispute.messages) ? dispute.messages : [];

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(dispute.id, input.trim());
        setInput("");
    };

    return (
        <div className="flex-1 flex flex-col px-4 md:px-8 pt-4 justify-end">
            {/* Just sample chat content area */}
            <div className="flex-1 overflow-y-auto pb-4">

                {messages.length === 0 && (
                    <p className="text-sm text-[#A0A0A0] mt-4">
                        This dispute has no messages yet. Start the conversation below.
                    </p>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>

            {/* Input row */}
            <div className="mt-3 mb-6 flex items-center gap-3">
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
                    className="w-9 h-9 rounded-full border border-[#DADADA] flex items-center justify-center hover:bg-[#F7F7F7]"
                >
                    <Paperclip className="w-4 h-4 text-[#14113B]" />
                </button>
                <button
                    type="button"
                    onClick={handleSend}
                    className="w-9 h-9 rounded-full bg-[#14113B] flex items-center justify-center hover:brightness-110"
                >
                    <Send className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}

export default DisputeChat;