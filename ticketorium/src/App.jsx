// src/App.jsx
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import ScrollToTop from "./components/scroll-to-top/scroll_to_top.jsx";
import Nav from "./components/nav/nav.jsx";
import Footer from "./components/footer/Footer.jsx";

import SignupLogin from "./pages/SignupLogin.jsx";
import DummyUserHome from "./pages/DummyUserHome.jsx";
import UserHome from "./pages/UserHome.jsx";

import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EventPage from "./pages/Event.jsx";
import Bidding from "./pages/Bidding.jsx";

import Checkout from "./pages/payment/Checkout.jsx";
import Registration from "./pages/Registration.jsx";
import PaymentResult from "./pages/payment/PaymentResult.jsx";
import AboutOrganizer from "./pages/AboutOrganizer.jsx";

import CreateEvent from "./pages/events/CreateEvent.jsx";
import EditEvent from "./pages/events/EditEvent.jsx";
import Analytics from "./pages/Analytics.jsx";

import Disputes from "./pages/Disputes.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import ManageUniversities from "./pages/ManageUniversities.jsx";
import UniversitySelection from "./pages/UniversitySelection.jsx";
import SystemPolicies from "./pages/SystemPolicies.jsx";

import ThemeProvider from "./components/theme/ThemeProvider.jsx";

// 🔥 BACKEND API CALLS
import { fetchMe } from "./api/auth.js";
import { fetchEvents } from "./api/events.js";
import { fetchUserRegistrations } from "./api/eventRegistrations.js";

//////////////////////////////////////////////////////////////////////////////
// ROUTE GUARDS
//////////////////////////////////////////////////////////////////////////////

function RequireAuth({ user, children }) {
    if (!user) return <Navigate to="/log-in" replace />;
    return children;
}

function RequireNoAuth({ user, children }) {
    if (user) return <Navigate to="/home" replace />;
    return children;
}

function RequireRole({ user, allowedRoles, children }) {
    if (!user) return <Navigate to="/log-in" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/home" replace />;
    return children;
}

//////////////////////////////////////////////////////////////////////////////
// APP
//////////////////////////////////////////////////////////////////////////////

export default function App() {
    const navigate = useNavigate();

    // AUTH STATE
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // GLOBAL BACKEND DATA (used by home page and fallback)
    const eventsRef = useRef({});
    const registrationsRef = useRef({});

    // UI STATE
    const [successfulPayment, setSuccessfulPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(true);
    const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [organizerViewing, setOrganizerViewing] = useState(null);

    const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
    const [part1Data, setPart1Data] = useState({});

    ////////////////////////////////////////////////////////////////////////////
    // 1) AUTH — LOAD CURRENT USER FROM TOKEN
    ////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        async function loadAuth() {
            const token = localStorage.getItem("token");
            if (!token) {
                setCurrentUser(null);
                setAuthLoading(false);
                return;
            }

            const user = await fetchMe();
            setCurrentUser(user || null);
            setAuthLoading(false);
        }

        loadAuth();
    }, []);

    ////////////////////////////////////////////////////////////////////////////
    // 2) LOAD EVENTS (GLOBAL — used by home page)
    ////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await fetchEvents();
                const map = {};

                data.forEach((ev) => {
                    if (!ev?._id) return;

                    map[ev._id] = {
                        ...ev,
                        university:
                            typeof ev.university === "string"
                                ? ev.university
                                : ev.university?.code ?? null,
                    };
                });

                eventsRef.current = map;
            } catch (err) {
                console.error("[App] Failed loading events:", err);
            }
        }

        loadEvents();
    }, []);

    ////////////////////////////////////////////////////////////////////////////
    // 3) LOAD REGISTRATIONS for CURRENT USER
    ////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        async function loadRegistrations() {
            if (!currentUser) {
                registrationsRef.current = {};
                return;
            }

            try {
                const rows = await fetchUserRegistrations(currentUser.id);
                const map = {};

                rows.forEach((reg) => {
                    if (!reg?.event?._id) return;

                    map[reg.event._id] = {
                        ...reg,
                        event: {
                            ...reg.event,
                            university:
                                typeof reg.event.university === "string"
                                    ? reg.event.university
                                    : reg.event.university?.code ?? null,
                        },
                    };
                });

                registrationsRef.current = {
                    [currentUser?.handle]: map,
                };
            } catch (err) {
                console.error("[App] Failed loading registrations:", err);
            }
        }

        loadRegistrations();
    }, [currentUser]);

    ////////////////////////////////////////////////////////////////////////////
    // 4) ORGANIZER PROFILE REDIRECT
    ////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (organizerViewing) navigate("/about-organizer");
    }, [organizerViewing]);

    ////////////////////////////////////////////////////////////////////////////
    // 5) LOADING SCREEN
    ////////////////////////////////////////////////////////////////////////////

    if (authLoading) {
        return (
            <h1 className="m-15 text-5xl self-center absolute h-[100vh]">
                Loading...
            </h1>
        );
    }

    ////////////////////////////////////////////////////////////////////////////
    // 6) ROUTES
    ////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <ScrollToTop />

            <ThemeProvider user={currentUser}>
                <div className="flex-col">
                    <Nav user={currentUser} setUser={setCurrentUser} />

                    <Routes>
                        {/* HOME */}
                        <Route
                            path="/home"
                            element={
                                !currentUser ? (
                                    <DummyUserHome />
                                ) : currentUser.university ? (
                                    <UserHome
                                        setOrganizerViewing={setOrganizerViewing}
                                        setWaitlistModalOpen={setWaitlistModalOpen}
                                        waitlistModalOpen={waitlistModalOpen}
                                        waitlistSuccess={waitlistSuccess}
                                        setWaitlistSuccess={setWaitlistSuccess}
                                        setIsPurchasing={setIsPurchasing}
                                        uni={currentUser?.university}
                                        user={currentUser?.handle}
                                        events={eventsRef.current}
                                        eventsJoined={registrationsRef.current}
                                    />
                                ) : (
                                    <Navigate to="/university-selection" />
                                )
                            }
                        />

                        {/* LOGIN */}
                        <Route
                            path="/log-in"
                            element={
                                <RequireNoAuth user={currentUser}>
                                    <SignupLogin option="log-in" />
                                </RequireNoAuth>
                            }
                        />

                        {/* SIGNUP STEP 1 */}
                        <Route
                            path="/sign-up"
                            element={
                                <RequireNoAuth user={currentUser}>
                                    <SignupLogin
                                        option="sign-up"
                                        setFinishedPart1SignUp={setFinishedPart1SignUp}
                                        setPart1Data={setPart1Data}
                                    />
                                </RequireNoAuth>
                            }
                        />

                        {/* SIGNUP STEP 2 */}
                        <Route
                            path="/sign-up-2"
                            element={
                                <RequireNoAuth user={currentUser}>
                                    {finishedPart1SignUp ? (
                                        <SignupLogin
                                            option="sign-up-part-2"
                                            part1Data={part1Data}
                                        />
                                    ) : (
                                        <Navigate to="/sign-up" replace />
                                    )}
                                </RequireNoAuth>
                            }
                        />

                        {/* ALL EVENTS */}
                        <Route
                            path="/events"
                            element={
                                <RequireAuth user={currentUser}>
                                    <AllEvents
                                        setOrganizerViewing={setOrganizerViewing}
                                        waitlistModalOpen={waitlistModalOpen}
                                        setWaitlistModalOpen={setWaitlistModalOpen}
                                        waitlistSuccess={waitlistSuccess}
                                        setWaitlistSuccess={setWaitlistSuccess}
                                        setIsPurchasing={setIsPurchasing}
                                        user={currentUser?.handle}
                                        uni={currentUser?.university}
                                        events={eventsRef.current}
                                        eventsJoined={registrationsRef.current}
                                    />
                                </RequireAuth>
                            }
                        />

                        {/* MY EVENTS */}
                        <Route
                            path="/my-events"
                            element={
                                <RequireAuth user={currentUser}>
                                    <MyEvents
                                        setOrganizerViewing={setOrganizerViewing}
                                        waitlistModalOpen={waitlistModalOpen}
                                        setWaitlistModalOpen={setWaitlistModalOpen}
                                        waitlistSuccess={waitlistSuccess}
                                        setWaitlistSuccess={setWaitlistSuccess}
                                        setIsPurchasing={setIsPurchasing}
                                        user={currentUser?.handle}
                                        uni={currentUser?.university}
                                        events={eventsRef.current}
                                        eventsJoined={registrationsRef.current}
                                    />
                                </RequireAuth>
                            }
                        />

                        {/* EVENT PAGE */}
                        <Route
                            path="/event/:eventId"
                            element={
                                <EventPage
                                    user={currentUser?.handle}
                                    events={eventsRef.current}
                                    eventsJoined={registrationsRef.current}
                                />
                            }
                        />

                        {/* ORGANIZER ROUTES */}
                        <Route
                            path="/analytics"
                            element={
                                <RequireRole user={currentUser} allowedRoles={["organizer"]}>
                                    <Analytics />
                                </RequireRole>
                            }
                        />

                        <Route
                            path="/create-event"
                            element={
                                <RequireRole user={currentUser} allowedRoles={["organizer"]}>
                                    <CreateEvent />
                                </RequireRole>
                            }
                        />

                        <Route
                            path="/event/:eventId/edit"
                            element={
                                <RequireRole
                                    user={currentUser}
                                    allowedRoles={["organizer", "admin", "system-admin"]}
                                >
                                    <EditEvent
                                        user={currentUser?.handle}
                                        events={eventsRef.current}
                                    />
                                </RequireRole>
                            }
                        />

                        {/* ADMIN */}
                        <Route
                            path="/manage-users"
                            element={
                                <RequireRole
                                    user={currentUser}
                                    allowedRoles={["admin", "system-admin"]}
                                >
                                    <ManageUsers user={currentUser} />
                                </RequireRole>
                            }
                        />

                        <Route
                            path="/manage-universities"
                            element={
                                <RequireRole user={currentUser} allowedRoles={["system-admin"]}>
                                    <ManageUniversities />
                                </RequireRole>
                            }
                        />

                        {/* DISPUTES */}
                        <Route
                            path="/disputes"
                            element={
                                <RequireAuth user={currentUser}>
                                    <Disputes user={currentUser} />
                                </RequireAuth>
                            }
                        />

                        {/* UNIVERSITY SELECTION */}
                        <Route
                            path="/university-selection"
                            element={
                                <RequireRole
                                    user={currentUser}
                                    allowedRoles={["visitor", "system-admin"]}
                                >
                                    <UniversitySelection user={currentUser} />
                                </RequireRole>
                            }
                        />

                        {/* DEFAULT ROUTES */}
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route
                            path="*"
                            element={
                                <h1 className="m-10 text-5xl font-bold h-[100vh]">
                                    404 - Page Not Found :)
                                </h1>
                            }
                        />
                    </Routes>

                    <Footer type={currentUser?.role || "empty"} />
                </div>
            </ThemeProvider>
        </>
    );
}
