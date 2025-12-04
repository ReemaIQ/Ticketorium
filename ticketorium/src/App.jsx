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

import { jwtDecode } from "jwt-decode";
import {
    initialDummyUsers,
    initialDummyUniversities,
    initialDummyNotifications,
    initialDummyEvents,
    initialDummyEventsJoined,
} from "../data/DummyData.js";

import {
    checkIfEmailExists as checkIfEmailExistsHelper,
    checkIfPhoneExists as checkIfPhoneExistsHelper,
    checkIfUsernameExists as checkIfUsernameExistsHelper,
    checkUsernamePassword as checkUsernamePasswordHelper,
    checkEmailPassword as checkEmailPasswordHelper,
    getUsernameFromEmail as getUsernameFromEmailHelper,
    addNewUser as addNewUserHelper,
    assignUni as assignUniHelper,
} from "../utils/UserHelpers.js";

// BACKEND API CALLS
// import { fetchMe } from "./api/auth.js";
// import { fetchEvents } from "./api/events.js";
// import { fetchUserRegistrations } from "./api/eventRegistrations.js";

import { searchContentHelper } from "../utils/SearchHelpers.js";
import { filterContentHelper } from "../utils/FilterHelpers.js";


//////////////////////////////////////////////////////////////////////////////
// ROUTE GUARDS
//////////////////////////////////////////////////////////////////////////////

function RequireAuth({ loggedInUser, children }) {
    if (!loggedInUser) return <Navigate to="/log-in" replace />;
    return children;
}

function RequireNoAuth({ loggedInUser, children }) {
    if (loggedInUser) return <Navigate to="/home" replace />;
    return children;
}

function RequireRole({ loggedInUser, dummyUsersRef, allowedRoles, children }) {
    if (!loggedInUser) return <Navigate to="/log-in" replace />;

    const userType = dummyUsersRef.current?.[loggedInUser]?.type;
    if (!allowedRoles.includes(userType)) return <Navigate to="/home" replace />;

    return children;
}

//////////////////////////////////////////////////////////////////////////////
// APP
//////////////////////////////////////////////////////////////////////////////

function App() {
    const navigate = useNavigate();
    // ---------------- STATE ----------------
    const [loggedInUser, setLoggedInUser] = useState(null); // username only
    const [loggedInMongoUser, setLoggedInMongoUser] = useState(null); // full user object from DB

    const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
    const [part1Data, setPart1Data] = useState({});
    const [selectedUni, setSelectedUni] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const dummyUsers = useRef({});
    const dummyUniversities = useRef({});
    const dummyEvents = useRef({});
    const dummyNotifications = useRef({});
    const dummyEventsJoined = useRef({});

    // GLOBAL BACKEND DATA (used by home page and fallback)
    // const eventsRef = useRef({});
    // const registrationsRef = useRef({});

    // UI STATE
    const [successfulPayment, setSuccessfulPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(true);
    const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [organizerViewing, setOrganizerViewing] = useState(null);

    useEffect(() => {
    if (organizerViewing) // so to avoid navigation when val is changed to null
      navigate("/about-organizer");
  }, [organizerViewing]);

    ////////////////////////////////////////////////////////////////////////////
    // 2) LOAD EVENTS (GLOBAL — used by home page)
    ////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        async function initAuth() {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:  ", decoded);
                    setLoggedInMongoUser(decoded.user);
                    setLoggedInUser(decoded.user.handle)
                }
                catch (err) {
                        console.error("Token verification failed:", err);
                        localStorage.removeItem("token");
                        localStorage.removeItem("loggedInMongoUser");
                        setLoggedInMongoUser(null);
                }
            }
            else {
                setLoggedInMongoUser(null);
            }

            setIsLoading(false);
        }

        initAuth();

        //     useEffect(() => {
        //         async function loadEvents() {
        //             try {
        //                 const data = await fetchEvents();
        //                 const map = {};
        //
        //                 data.forEach((ev) => {
        //                     if (!ev?._id) return;
        //
        //                     map[ev._id] = {
        //                         ...ev,
        //                         university:
        //                             typeof ev.university === "string"
        //                                 ? ev.university
        //                                 : ev.university?.code ?? null,
        //                     };
        //                 });
        //
        //                 eventsRef.current = map;
        //             } catch (err) {
        //                 console.error("[App] Failed loading events:", err);
        //             }
        //         }
        //
        //         loadEvents();
        //     }, []);

        //   ////////////////////////////////////////////////////////////////////////////
        //     // 3) LOAD REGISTRATIONS for CURRENT USER
        //     ////////////////////////////////////////////////////////////////////////////
        //
        //     useEffect(() => {
        //         async function loadRegistrations() {
        //             if (!currentUser) {
        //                 registrationsRef.current = {};
        //                 return;
        //             }
        //
        //             try {
        //                 const rows = await fetchUserRegistrations(currentUser.id);
        //                 const map = {};
        //
        //                 rows.forEach((reg) => {
        //                     if (!reg?.event?._id) return;
        //
        //                     map[reg.event._id] = {
        //                         ...reg,
        //                         event: {
        //                             ...reg.event,
        //                             university:
        //                                 typeof reg.event.university === "string"
        //                                     ? reg.event.university
        //                                     : reg.event.university?.code ?? null,
        //                         },
        //                     };
        //                 });
        //
        //                 registrationsRef.current = {
        //                     [currentUser?.handle]: map,
        //                 };
        //             } catch (err) {
        //                 console.error("[App] Failed loading registrations:", err);
        //             }
        //         }
        //
        //         loadRegistrations();
        //     }, [currentUser]);

        // dummyUsers
        const emptyDummyUsers =
            localStorage.getItem("dummyUsers") === "null" ||
            !localStorage.getItem("dummyUsers");
        if (!emptyDummyUsers) {
            dummyUsers.current = JSON.parse(localStorage.getItem("dummyUsers"));
        } else {
            localStorage.setItem("dummyUsers", JSON.stringify(initialDummyUsers));
            dummyUsers.current = initialDummyUsers;
        }

        // dummyUniversities
        const emptyDummyUniversities =
            localStorage.getItem("dummyUniversities") === "null" ||
            !localStorage.getItem("dummyUniversities");
        if (!emptyDummyUniversities) {
            dummyUniversities.current = JSON.parse(
                localStorage.getItem("dummyUniversities")
            );
        } else {
            localStorage.setItem(
                "dummyUniversities",
                JSON.stringify(initialDummyUniversities)
            );
            dummyUniversities.current = initialDummyUniversities;
        }

        // dummyEvents
        const emptyDummyEvents =
            localStorage.getItem("dummyEvents") === "null" ||
            !localStorage.getItem("dummyEvents");
        if (!emptyDummyEvents) {
            dummyEvents.current = JSON.parse(localStorage.getItem("dummyEvents"));
        } else {
            localStorage.setItem("dummyEvents", JSON.stringify(initialDummyEvents));
            dummyEvents.current = initialDummyEvents;
        }

        // dummyNotifications
        const emptyDummyNotifications =
            localStorage.getItem("dummyNotifications") === "null" ||
            !localStorage.getItem("dummyNotifications");
        if (!emptyDummyNotifications) {
            dummyNotifications.current = JSON.parse(
                localStorage.getItem("dummyNotifications")
            );
        } else {
            localStorage.setItem(
                "dummyNotifications",
                JSON.stringify(initialDummyNotifications)
            );
            dummyNotifications.current = initialDummyNotifications;
        }

        // dummyEventsJoined
        const emptyDummyEventsJoined =
            localStorage.getItem("dummyEventsJoined") === "null" ||
            !localStorage.getItem("dummyEventsJoined");
        if (!emptyDummyEventsJoined) {
            dummyEventsJoined.current = JSON.parse(
                localStorage.getItem("dummyEventsJoined")
            );
        } else {
            localStorage.setItem(
                "dummyEventsJoined",
                JSON.stringify(initialDummyEventsJoined)
            );
            dummyEventsJoined.current = initialDummyEventsJoined;
        }


        setSelectedUni(null);

        // SHAYMA - backend - DO NOT REMOVE IN MERGING - START
        // if there is a token:
        if (localStorage.getItem("token")) {

        }
        // SHAYMA - backend - DO NOT REMOVE IN MERGING - END

        setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log("loggedInMongoUser changed:", loggedInMongoUser);
    }, [loggedInMongoUser]);

    // a safe current user reference (prevents crashes)
    const currentUser = loggedInUser
        ? dummyUsers.current?.[loggedInUser] || null
        : null;

    //
    ////////////////////////////////////////////////////////////////////////////
    // 4) ORGANIZER PROFILE REDIRECT
    ////////////////////////////////////////////////////////////////////////////
    //
    // useEffect(() => {
    //     if (organizerViewing) navigate("/about-organizer");
    // }, [organizerViewing]);
    //
    // ////////////////////////////////////////////////////////////////////////////
    // // 5) LOADING SCREEN
    // ////////////////////////////////////////////////////////////////////////////
    //
    // if (authLoading) {
    //     return (
    //         <h1 className="m-15 text-5xl self-center absolute h-[100vh]">
    //             Loading...
    //         </h1>
    //     );
    // }

    useEffect(() => {
        const user = loggedInUser ? dummyUsers.current?.[loggedInUser] : null;

        if (user && user.type !== "visitor" && user.type !== "system-admin") {
            setSelectedUni(true);
        } else if (!user) {
            setSelectedUni(null);
        }
    }, [loggedInUser]);

    // ---------------- HELPERS (WRAPPERS) ----------------

    const checkIfEmailExists = (email) =>
        checkIfEmailExistsHelper(dummyUsers, email);

    const checkIfPhoneExists = (phone) =>
        checkIfPhoneExistsHelper(dummyUsers, phone);

    const checkIfUsernameExists = (username) =>
        checkIfUsernameExistsHelper(dummyUsers, username);

    const checkUsernamePassword = (username, password) =>
        checkUsernamePasswordHelper(dummyUsers, username, password);

    const checkEmailPassword = (email, password) =>
        checkEmailPasswordHelper(dummyUsers, email, password);

    const getUsernameFromEmail = (email) =>
        getUsernameFromEmailHelper(dummyUsers, email);

    const addNewUser = (data) => addNewUserHelper(dummyUsers, data);

    const assignUni = (university) =>
        assignUniHelper(dummyUsers, loggedInUser, university);

    // generic filter/search wrapper used by children
    const filterContent = (
        typeOfFilter,
        content,
        setter,
        searchFor,
        searchValue = "",
        filterDetails = {}
    ) => {
        if (typeOfFilter === "search") {
            return searchContentHelper(searchFor, content, setter, searchValue, {
                mode: searchFor === "event" ? "title" : undefined,
                loggedInUser,
            });
        }

        if (typeOfFilter === "initial") {
            return filterContentHelper(
                searchFor,
                content,
                setter,
                filterDetails,
                loggedInUser
            );
        }

        console.warn(
            "[App.filterContent] Unknown typeOfFilter:",
            typeOfFilter,
            searchFor
        );
    };

    // ---------------- ROUTES ----------------

    return (
        <>
            <ScrollToTop />

            <ThemeProvider
                loggedInUser={loggedInUser}
                dummyUsersRef={dummyUsers}
                dummyUniversitiesRef={dummyUniversities}
            >
                <div className="flex-col">
                    <Nav
                        type={loggedInMongoUser?.type ?? "empty"}
                        user={loggedInUser}
                        setLoggedInUser={setLoggedInUser}
                        notifications={dummyNotifications.current}
                        users={dummyUsers.current}
                    />

                    {isLoading && (
                        <h1 className="m-15 text-5xl self-center absolute h-[100vh]">
                            Loading...
                        </h1>
                    )}

                    {!isLoading && (
                        <Routes>
                            {/* HOME */}
                            <Route
                                path="/home"
                                element={
                                    !loggedInUser ? (
                                        <DummyUserHome />
                                    ) : selectedUni ? (
                                        <UserHome
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            waitlistSuccess={waitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            uni={currentUser?.university ?? null}
                                            user={loggedInUser}
                                            users={dummyUsers.current}
                                            universities={dummyUniversities.current}
                                            notifications={dummyNotifications.current}
                                            events={dummyEvents.current}
                                            eventsJoined={dummyEventsJoined.current}
                                        />
                                    ) : (
                                        <Navigate to="/university-selection" />
                                    )
                                }
                            />

                            {/* LOGIN / SIGNUP */}
                            <Route
                                path="/log-in"
                                element={
                                    <RequireNoAuth loggedInUser={loggedInUser}>
                                        <SignupLogin
                                            option={"log-in"}
                                            checkIfEmailExists={checkIfEmailExists}
                                            checkIfUsernameExists={checkIfUsernameExists}
                                            checkUsernamePassword={checkUsernamePassword}
                                            checkEmailPassword={checkEmailPassword}
                                            setLoggedInUser={setLoggedInUser}
                                            setLoggedInMongoUser ={setLoggedInMongoUser}
                                            getUsernameFromEmail={getUsernameFromEmail}
                                        />
                                    </RequireNoAuth>
                                }
                            />

                            <Route
                                path="/sign-up"
                                element={
                                    <RequireNoAuth loggedInUser={loggedInUser}>
                                        <SignupLogin
                                            option={"sign-up"}
                                            checkIfEmailExists={checkIfEmailExists}
                                            checkIfUsernameExists={checkIfUsernameExists}
                                            checkUsernamePassword={checkUsernamePassword}
                                            checkEmailPassword={checkEmailPassword}
                                            checkIfPhoneExists={checkIfPhoneExists}
                                            setFinishedPart1SignUp={setFinishedPart1SignUp}
                                            setPart1Data={setPart1Data}
                                        />
                                    </RequireNoAuth>
                                }
                            />

                            <Route
                                path="/sign-up-2"
                                element={
                                    <RequireNoAuth loggedInUser={loggedInUser}>
                                        {finishedPart1SignUp ? (
                                            <SignupLogin
                                                option={"sign-up-part-2"}
                                                setLoggedInUser={setLoggedInUser}
                                                setLoggedInMongoUser ={setLoggedInMongoUser}
                                                checkIfUsernameExists={checkIfUsernameExists}
                                                addNewUser={addNewUser}
                                                part1Data={part1Data}
                                            />
                                        ) : (
                                            <Navigate to="/sign-up" replace />
                                        )}
                                    </RequireNoAuth>
                                }
                            />

                            {/* EVENTS LISTS */}
                            <Route
                                path="/my-events"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        <MyEvents
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            waitlistSuccess={waitlistSuccess}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            user={loggedInUser}
                                            users={dummyUsers.current}
                                            events={dummyEvents.current}
                                            eventsJoined={dummyEventsJoined.current}
                                            uni={currentUser?.university ?? null}
                                        />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/events"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        <AllEvents
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            waitlistSuccess={waitlistSuccess}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            user={loggedInUser}
                                            users={dummyUsers.current}
                                            events={dummyEvents.current}
                                            uni={currentUser?.university ?? null}
                                            eventsJoined={dummyEventsJoined.current}
                                        />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/event/:eventId"
                                element={
                                    <EventPage
                                        user={loggedInUser}
                                        users={dummyUsers.current}
                                        events={dummyEvents.current}
                                        eventsJoined={dummyEventsJoined.current} // pass joined records
                                    />
                                }
                            />

                            {/* BIDDING */}
                            <Route
                                path="/bidding"
                                element={
                                    <Bidding
                                        user={loggedInMongoUser}
                                    />
                                }
                            />

                            {/* ORGANIZER PAGES */}
                            <Route
                                path="/analytics"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["organizer"]}
                                    >
                                        <Analytics />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/create-event"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["organizer"]}
                                    >
                                        <CreateEvent />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/event/:eventId/edit"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["organizer", "admin", "system-admin"]}
                                    >
                                        <EditEvent
                                            user={loggedInUser}
                                            users={dummyUsers.current}
                                            events={dummyEvents.current}
                                        />
                                    </RequireRole>
                                }
                            />

                            {/* REGISTRATION & PAYMENT */}
                            <Route
                                path="/registration"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        <Registration />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/checkout"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        {!isPurchasing ? (
                                            <Navigate to="/home" replace />
                                        ) : (
                                            <Checkout
                                                setSuccess={setSuccessfulPayment}
                                                setProcessing={setProcessingPayment}
                                            />
                                        )}
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/payment-outcome"
                                element={
                                    processingPayment ? (
                                        <PaymentResult success={successfulPayment} />
                                    ) : (
                                        <Navigate to="/home" replace />
                                    )
                                }
                            />

                            {/* ADMIN / SYSTEM-ADMIN */}
                            <Route
                                path="/manage-users"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["admin", "system-admin"]}
                                    >
                                        <ManageUsers
                                            users={dummyUsers.current}
                                            user={loggedInUser}
                                        />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/manage-universities"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["system-admin"]}
                                    >
                                        <ManageUniversities
                                            initialUniversities={dummyUniversities.current}
                                        />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/system-policies"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["admin", "system-admin"]}
                                    >
                                        <SystemPolicies />
                                    </RequireRole>
                                }
                            />

                            {/* DISPUTES */}
                            <Route
                                path="/disputes"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        <Disputes
                                            user={loggedInMongoUser}
                                        />
                                    </RequireAuth>
                                }
                            />

                            {/* UNIVERSITY SELECTION */}
                            <Route
                                path="/university-selection"
                                element={
                                    <RequireRole
                                        loggedInUser={loggedInUser}
                                        dummyUsersRef={dummyUsers}
                                        allowedRoles={["visitor", "system-admin"]}
                                    >
                                        <UniversitySelection
                                            filterContent={filterContent}
                                            universities={dummyUniversities.current}
                                            assignUni={assignUni}
                                            setSelectedUni={setSelectedUni}
                                        />
                                    </RequireRole>
                                }
                            />

                            {/* ABOUT ORGANIZER */}
                            <Route
                                path="/about-organizer"
                                element={
                                    <RequireAuth loggedInUser={loggedInUser}>
                                        {organizerViewing ? <AboutOrganizer
                                            setOrganizerViewing={setOrganizerViewing}
                                            organizer={organizerViewing}
                                            users={dummyUsers.current}
                                            events={dummyEvents.current}
                                            userType={currentUser?.type ?? "empty"}
                                        /> : <Navigate to="/home" />}
                                    </RequireAuth>
                                }
                            />

                            {/* ROOT / 404 */}
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route
                                path="*"
                                element={
                                    loggedInUser ? (
                                        <h1 className="m-10 text-5xl font-bold text-[var(--secondary-color)] h-[100vh]">
                                            404 - Page Not Found :)
                                        </h1>
                                    ) : (
                                        <Navigate to="/log-in" replace />
                                    )
                                }
                            />
                        </Routes>
                    )}

                    <Footer type={currentUser?.type ?? "empty"} />
                </div>
            </ThemeProvider>
        </>
    );
}

export default App;
