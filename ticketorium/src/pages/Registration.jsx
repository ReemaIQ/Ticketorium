import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import successImg from "../assets/images/registration/Correct.jpg";
import failureImg from "../assets/images/registration/Wrong.jpg";

function Registration() {
    const navigate = useNavigate();
    const location = useLocation();

    /* ---------------------------------------------------------
       1) Determine if the registration is successful or not.
          - Prefer location.state.isSuccess if passed.
          - Fallback to DEMO_DEFAULT_SUCCESS for safety.
    --------------------------------------------------------- */
    const DEMO_DEFAULT_SUCCESS = true; // change to false to test failure UI

    const isSuccessFromState = location.state?.isSuccess;
    const isSuccess =
        typeof isSuccessFromState === "boolean"
            ? isSuccessFromState
            : DEMO_DEFAULT_SUCCESS;

    // event data from navigation state
    const eventId = location.state?.eventId || null;
    const fromEventId = location.state?.fromEventId || eventId || null;

    /* ---------------------------------------------------------
       2) Text + image depend on success/failure
    --------------------------------------------------------- */
    const headingLine1 = isSuccess ? "Registration" : "Oops!";
    const headingLine2 = isSuccess
        ? "Successful"
        : "Registration Unsuccessful!";
    const smallText = isSuccess
        ? "Thank you for registering"
        : "Please try again";

    const badgeImage = isSuccess ? successImg : failureImg;

    /* ---------------------------------------------------------
       3) Button handlers
    --------------------------------------------------------- */

    function handlePrimaryClick() {
        if (isSuccess) {
            // SUCCESS: go back to event (or just back if no id)
            if (eventId) {
                navigate(`/event/${eventId}`);
            } else if (fromEventId) {
                navigate(`/event/${fromEventId}`);
            } else {
                navigate(-1);
            }
        } else {
            // FAILURE: go back to event & reopen JOIN modal
            if (fromEventId) {
                navigate(`/event/${fromEventId}`, {
                    state: { openJoinModal: true }, // tell EventPage to open the Join modal
                });
            } else {
                navigate(-1);
            }
        }
    }

    function handleSecondaryClick() {
        if (isSuccess) {
            // SUCCESS: View Ticket → go to event page and open ticket modal
            const targetEventId = eventId || fromEventId;
            if (!targetEventId) {
                alert("Missing event info – cannot open ticket.");
                return;
            }

            navigate(`/event/${targetEventId}`, {
                state: { openTicketModal: true }, // tell EventPage to open the Ticket modal
            });
        } else {
            // FAILURE: Get Help : disputes / help center
            navigate("/disputes");
        }
    }

    return (
        // Only the main content – Nav & Footer come from App.jsx
        <main className="min-h-[calc(100vh-422px)] bg-white flex flex-col items-center px-6 md:px-20 py-12">
            {/* Top title ("Checkout") */}
            <div className="w-full max-w-6xl">
                <h1 className="font-[Epilogue-Black] text-[40px] text-[var(--primary-color)] mb-12">
                    Checkout
                </h1>
            </div>

            {/* Main 2-column layout */}
            <section className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Left: Text */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Big heading */}
                    <div className="leading-[1.05]">
                        <span
                            className={`block font-[Epilogue-Black] text-[56px] ${
                                isSuccess ? "text-[#22C55E]" : "text-[#F97373]"
                            }`}
                        >
                            {headingLine1}
                        </span>
                        <span
                            className={`block font-[Epilogue-Black] text-[56px] ${
                                isSuccess ? "text-[#22C55E]" : "text-[#F97373]"
                            }`}
                        >
                            {headingLine2}
                        </span>
                    </div>

                    {/* Small text */}
                    <p className="mt-2 font-[DM-Sans-Light] text-[20px] text-[#4B5563]">
                        {smallText}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        {/* Primary */}
                        <button
                            type="button"
                            onClick={handlePrimaryClick}
                            className="px-8 py-3 rounded-[6px] text-[16px] font-[DM-Sans-Black]
                         bg-[#FFDF4F] text-[#111827] border border-[#FFDF4F]
                         hover:bg-[#f7cf1e] transition"
                        >
                            {isSuccess ? "View Event Details" : "Try Again"}
                        </button>

                        {/* Secondary */}
                        <button
                            type="button"
                            onClick={handleSecondaryClick}
                            className="px-8 py-3 rounded-[6px] text-[16px] font-[DM-Sans-Black]
                         border border-[#CBD5E1] text-[#1F4C76] bg-white
                         hover:bg-[#F8FAFC] transition"
                        >
                            {isSuccess ? "View Ticket" : "Get Help"}
                        </button>
                    </div>
                </div>

                {/* Right: Badge image */}
                <div className="flex-1 flex justify-center md:justify-end">
                    <img
                        src={badgeImage}
                        alt={
                            isSuccess
                                ? "Registration successful"
                                : "Registration unsuccessful"
                        }
                        className="max-w-[280px] md:max-w-[340px] object-contain"
                    />
                </div>
            </section>
        </main>
    );
}

export default Registration;
