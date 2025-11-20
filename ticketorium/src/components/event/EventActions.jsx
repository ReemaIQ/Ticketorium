import React, {useEffect} from "react";
import { eventActionsConfig } from "./eventActionsConfig";
import { useNavigate } from "react-router-dom"; //r
import { ArrowRight, Tickets } from "lucide-react";
import {useState} from "react";

//import ResignModal from "./ResignModal";

function Modal({isOpen, onClose, children}) {
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
            <div className="relative mx-4 w-xl rounded-xl bg-white p-6 shadow-xl">
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

const baseBtn =
    "rounded-[6px] font-[Gilroy-Medium] text-[16px] px-3 py-2 flex items-center gap-1";

const variants = {
    primary: "bg-[var(--accent-color)] text-[#14113B]",
    secondary: "border bg-white text-[#14113B]",
    border: "border bg-white",
};

export default function EventActions({ type, category, state , eventId, onAction}) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(null);

    const actions = eventActionsConfig[category]?.[state] || eventActionsConfig[category]?.default;

    if (!actions) return null;
    const closeModal = () => setOpenModal(null);

    return (
        <>
            <div className="flex flex-wrap gap-2">

                {/* Filter actions: only show "Send Invite" or "Offer Ticket" if user is a student */}
                {actions.filter((action) => {
                        if (
                            (action.label === "Send Invite" || action.label === "Offer Ticket") &&
                            type !== "student"
                        ) {
                            return false;
                        }
                        return true;
                    })

                    // Map each item to its information to return the right button shape
                    .map((action, index) => {
                    const Icon = action.icon;
                    const colorClass = action.color || "";
                    const variantClass = variants[action.variant] || "";

                    const isArrowRight = Icon === ArrowRight;
                    const isTickets = Icon === Tickets;

                        const handleClick = () => { //r
                            // If the page provided a handler, let it decide (details page then open modals)
                            if (onAction) {
                                onAction(action.label);
                                return;
                            }

                            //Resign Button
                            if (action.label === "Resign") {
                                setOpenModal("resign");
                                return;
                            }

                            //View button
                            // Default behavior (lists/cards): keep your previous behavior
                            if ((action.label === "View" || action.label === "Join") && eventId) {
                                navigate(`/event/${eventId}`);
                                return;
                            }

                            console.log(`${action.label} clicked`);
                        };

                    return (
                        <button
                            key={index}
                            className={`${baseBtn} ${variantClass} ${colorClass}`}
                            // onClick={() => console.log(`${action.label} clicked`)}
                            onClick={handleClick} //r
                        >
                            {/* Show Tickets icon BEFORE text */}
                            {isTickets && <Icon size={16} />}

                            {action.label}

                            {/* Show ArrowRight AFTER text */}
                            {isArrowRight && <Icon size={16} />}
                        </button>
                    );
                })}
            </div>

        <Modal isOpen={openModal === "resign"} onClose={closeModal}>
            <div className="text-center">
                <h3 className="text-xl font-semibold">
                    Resign from <span className="font-bold">title var</span>?
                </h3>
            </div>

            {/*{price > 0 && (*/}
            {/*    <p className="mt-2 text-slate-500 text-center">*/}
            {/*        Refund: <span className="text-indigo-700 font-medium">${Number(price).toFixed(2)}</span>*/}
            {/*    </p>*/}
            {/*)}*/}

            <div className="mt-6 flex justify-center gap-3">
                <button
                    onClick={() => {
                        // Handle the actual resignation logic here
                        if(onAction) onAction("Resign Confirmed");
                        closeModal();
                    }}
                    className="px-4 py-2 text-sm font-medium bg-white border border-rose-600 text-rose-600 rounded-md shadow-sm hover:bg-rose-50"
                >
                    Resign
                </button>

                <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium border bg-white text-slate-700 rounded-md shadow-sm hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    </>

    );
}
