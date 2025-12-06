//
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, use} from "react";

import ScrollToTop from "./components/scroll-to-top/scroll_to_top.jsx";
import Nav from "./components/nav/nav.jsx";
import Footer from "./components/footer/Footer.jsx";

import SignupLogin from "./pages/SignupLogin.jsx";
import DummyUserHome from "./pages/DummyUserHome.jsx";
import UserHome from "./pages/UserHome.jsx";

import AllEvents from "./pages/AllEvents.jsx";
import MyTickets from "./pages/MyEvents.jsx";
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

// import ThemeProvider from "./components/theme/ThemeProvider.jsx";

import { searchContentHelper } from "../utils/SearchHelpers.js";
import { filterContentHelper } from "../utils/FilterHelpers.js";
import { assignUniHelper } from "../utils/UserHelpers.js"

// ---------- ROUTE GUARDS ----------

function RequireAuth({ token, children }) {
    if (!token) return <Navigate to="/log-in" replace />;
    return children;
}

function RequireNoAuth({ token, children }) {
    if (token) return <Navigate to="/home" replace />;
    return children;
}

function RequireRole({username, role, allowedRoles, children }) {
    if (!username) return <Navigate to="/log-in" replace />;
    console.log("funny role", role)
    console.log("funny username", username)

    if (!allowedRoles.includes(role)) return <Navigate to="/home" replace />;

    return children;
}

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log("ROUTE CHANGED →", location.pathname);
  }, [location]);

  return null; // it doesn't render anything
}

// ---------- APP ----------

function App() {
    const navigate = useNavigate();
    // ---------------- STATE ----------------
    const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
    const [part1Data, setPart1Data] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [url, setUrl] = useState(true);

    const universities = useRef({});
    const events = useRef({});
    const dummyBids = useRef({});
    const dummyNotifications = useRef({});
    const dummyDisputes = useRef({});
    const eventsJoined = useRef({});

    const [successfulPayment, setSuccessfulPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(true);
    const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [organizerViewing, setOrganizerViewing] = useState(null);


    // SHAYMA: BACKEND - DO NOT REMOVE IN MERGING - START
    // info about user
    const [token, setToken] = useState(null)
    const [username, setUsername] = useState(null)
    const [gender, setGender] = useState(null)
    const [role, setRole] = useState(null)
    const [university, setUniversity] = useState(null)
    const [dateOfBirth, setDateOfBirth] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userObj, setUserObj] = useState(null)


    const refreshNeededData = async () => {
            console.log("Flute 1")
            await refreshUserData();
            console.log("Flute role", role)
            console.log("Flute uni", university)
            if (university) { // if the user has a uni assigned to him, then fetch the data of that uni
                await refreshEventsData();   
            }             
            else if (role === "visitor" || role === "system-admin") {
                navigate("/university-selection")
            }
    }

    const refreshUserData = async () => {
        const response = await fetch("http://localhost:4000/api/users/all-data", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
        })
        const userData = await response.json();
        if (userData.university) {
            const uniResponse = await fetch("http://localhost:4000/api/universities/" + encodeURIComponent(userData.university), {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
            })
            const uniData = await uniResponse.json();
            setUniversity(uniData);
        }
        console.log("Main fetch", userData);
        console.log("just checking", userData._id)
        setUsername(userData.handle);
        setGender(userData.gender);
        setRole(userData.role);
        setDateOfBirth(userData.dateOfBirth);
        setEmail(userData.email);
        setPhoneNumber(userData.phone);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setUserId(userData._id)
        setUserObj(userData)
        console.log("flute X")
        if (userData.role === "visitor" || userData.role === "system-admin") {
                await refreshUnisData();
                console.log("Flute unis", universities.current)
        }
    }

    const refreshEventsData = async () => {
        const uniEventsResponse = await fetch("http://localhost:4000/api/events/uni-all/" + encodeURIComponent(university["_id"]), {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
        })
        const uniEventsData = await uniEventsResponse.json();
        // const eventsJoinedResponse = await fetch("http://localhost:4000/api/events/joined/" + encodeURIComponent(userId) + "/" + encodeURIComponent(university._id), {
        //             headers: {
        //                 Authorization: `Bearer ${token}`
        //             }
        // })
        // const eventsJoinedData = await eventsJoinedResponse.json();
        events.current = uniEventsData;
        // eventsJoined.current = eventsJoinedData;
        eventsJoined.current = []
        console.log("Uni events fetch", uniEventsData);
        // console.log("User joined events", eventsJoinedData)


    }

    const refreshUnisData = async () => {
        const uniEventsResponse = await fetch("http://localhost:4000/api/universities/all", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        const unisData = await uniEventsResponse.json();
        universities.current = unisData;
        console.log("Unis fetch", universities.current);

    }
    // SHAYMA: BACKEND - DO NOT REMOVE IN MERGING - END
    

    useEffect(() => {
        if (organizerViewing) // so to avoid navigation when val is changed to null
            navigate("/about-organizer");
    }, [organizerViewing]);

    // ---------------- LOCAL STORAGE HYDRATION ----------------

    // SHAYMA: CONFLICT-RESOLVING-TIP: This entire useEffect, replace it with what I have here (ALL OF IT)
    useEffect(() => {

        const effectCall = async () => {
            console.log("App mounted")
            // if there is a token:
            const fetchedToken = localStorage.getItem("token");
            if (fetchedToken && fetchedToken !== token) {
                setToken(fetchedToken); // first time only, on first mount
            } else {
                console.log("No user logged in")
                setIsLoading(false)
                // setUsername(null);
                // setGender(null);
                // setRole(null);
                // setUniversity(null);
                // setDateOfBirth(null);
                // setEmail(null);
                // setPhoneNumber(null);
                // setFirstName(null);
                // setLastName(null);
                // navigate("/home"); // main home page of non-logged in users
            }
        }

        effectCall()
    }, []);

    useEffect(() => {
        const effectCall = async () => {
            console.log("Jordan", token)
            if (token) {
                setIsLoading(true)
                await refreshNeededData()
                setIsLoading(false);
            }
            // only when token is removed or cleared
            else {
                setUsername(null);
                setGender(null);
                setRole(null);
                setUniversity(null);
                setDateOfBirth(null);
                setEmail(null);
                setPhoneNumber(null);
                setFirstName(null);
                setLastName(null);
                setUserId(null);
                setUserObj(null);
                const rootStyle = document.querySelector(':root').style;
                    // console.log(rootStyle)
                    rootStyle.setProperty('--secondary-color', "#1F4C76");
                    rootStyle.setProperty('--primary-color', "#1a1a1a");
                    rootStyle.setProperty('--accent-color', "#FFDF4F");
                    rootStyle.setProperty('--secondary-accent-color', "#0800FF");
                    rootStyle.setProperty('--footer-color', "#11223B");
                    rootStyle.setProperty('--warning-color', "#F54141");
                    rootStyle.setProperty('--success-color', "#46CA48");
            }
        }
        
        effectCall()
    }, [token])

    useEffect(() => {
        const effectCall = async () => {
            console.log("Peter", token)
            if (token) {
                if (university) {
                    const rootStyle = document.querySelector(':root').style;
                    // console.log(rootStyle)
                    rootStyle.setProperty('--secondary-color', university["themeColors"]["secondaryColor"]);
                    rootStyle.setProperty('--primary-color', university["themeColors"]["primaryColor"]);
                    rootStyle.setProperty('--accent-color', university["themeColors"]["accentColor"]);
                    rootStyle.setProperty('--secondary-accent-color', university["themeColors"]["secondaryAccentColor"]);
                    rootStyle.setProperty('--footer-color', university["themeColors"]["footerColor"]);
                    rootStyle.setProperty('--warning-color', university["themeColors"]["warningColor"]);
                    rootStyle.setProperty('--success-color', university["themeColors"]["successColor"]);
                    rootStyle.setProperty('--filter-buttons', university["themeColors"]["filterButtons"]);
                    rootStyle.setProperty('--dispute-chat', university["themeColors"]["disputeChat"]);
                }
                console.log("tomato", university)
                await refreshEventsData()
            }
        }
        
        effectCall()
    }, [university])



    // a safe current user reference (prevents crashes)
    const currentUser = username

    // ---------------- SELECTED UNI EFFECT ----------------
    // useEffect(() => {
    //     const user = token ? username : null;

    //     if (user && user.type !== "visitor" && user.type !== "system-admin") {
    //         setSelectedUni(true);
    //     } else if (!user) {
    //         setSelectedUni(null);
    //     }
    // }, [token]);

    // ---------------- HELPERS (WRAPPERS) ----------------


    const assignUni = (university) =>
        assignUniHelper(token, setUniversity, university);

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
                username,
            });
        }

        if (typeOfFilter === "initial") {
            return filterContentHelper(
                searchFor,
                content,
                setter,
                filterDetails,
                username
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

            
                <RouteLogger />
                <div className="flex-col">
                    <Nav
                        type={role? role: "empty"}
                        setToken={setToken} // for the logout
                        notifications={dummyNotifications.current}
                        user={userObj}
                        firstName={firstName}
                        hasUniversity={university? true: false}
                    />

                    {isLoading && (
                        <></>
                    )}

                    {!isLoading && (
                        <Routes>
                            {/* HOME */}
                            <Route
                                path="/home"
                                element={
                                    !token ? (
                                        <DummyUserHome />
                                    ) : university ? (
                                        <UserHome
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            waitlistSuccess={waitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            uni={university}
                                            user={username}
                                            firstName={firstName}
                                            role={role}
                                            users={[]}
                                            universities={universities.current}
                                            notifications={dummyNotifications.current}
                                            events={events.current}
                                            eventsJoined={eventsJoined.current}
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
                                    <RequireNoAuth token={token}>
                                        <SignupLogin
                                            option={"log-in"}
                                            setToken={setToken}
                                        />
                                    </RequireNoAuth>
                                }
                            />

                            <Route
                                path="/sign-up"
                                element={
                                    <RequireNoAuth token={token}>
                                        <SignupLogin
                                            option={"sign-up"}
                                            setToken={setToken}
                                            setFinishedPart1SignUp={setFinishedPart1SignUp}
                                            setPart1Data={setPart1Data}
                                        />
                                    </RequireNoAuth>
                                }
                            />

                            <Route
                                path="/sign-up-2"
                                element={
                                    <RequireNoAuth token={token}>
                                        {finishedPart1SignUp ? (
                                            <SignupLogin
                                                option={"sign-up-part-2"}
                                                setToken={setToken}
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
                                    <RequireAuth token={token}>
                                        <MyTickets
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            waitlistSuccess={waitlistSuccess}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            user={userObj}
                                            users={[]}
                                            events={events.current}
                                            eventsJoined={eventsJoined.current}
                                            uni={currentUser?.university ?? null}
                                        />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/events"
                                element={
                                    <RequireAuth token={token}>
                                        <AllEvents
                                            setOrganizerViewing={setOrganizerViewing}
                                            setWaitlistModalOpen={setWaitlistModalOpen}
                                            waitlistModalOpen={waitlistModalOpen}
                                            waitlistSuccess={waitlistSuccess}
                                            setWaitlistSuccess={setWaitlistSuccess}
                                            setIsPurchasing={setIsPurchasing}
                                            filterContent={filterContent}
                                            user={userObj}
                                            events={events.current}
                                            uni={university}
                                            eventsJoined={eventsJoined.current}
                                            role={role}
                                        />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/event/:eventId"
                                element={
                                    <EventPage
                                        user={userObj}
                                        users={[]}
                                        events={events.current}
                                        eventsJoined={eventsJoined.current} // pass joined records
                                    />
                                }
                            />

                            {/* BIDDING */}
                            <Route
                                path="/bidding"
                                element={
                                    <Bidding
                                        user={userObj}
                                        biddings={dummyBids.current}
                                    />
                                }
                            />

                            {/* ORGANIZER PAGES */}
                            <Route
                                path="/analytics"
                                element={
                                    <RequireRole
                                        username={userObj}
                                        role={role}
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
                                        username={userObj}
                                        role={role}
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
                                        username={userObj}
                                        role={role}
                                        allowedRoles={["organizer", "admin", "system-admin"]}
                                    >
                                        <EditEvent
                                            user={userObj}
                                            users={[]}
                                            events={events.current}
                                        />
                                    </RequireRole>
                                }
                            />

                            {/* REGISTRATION & PAYMENT */}
                            <Route
                                path="/registration"
                                element={
                                    <RequireAuth token={token}>
                                        <Registration />
                                    </RequireAuth>
                                }
                            />

                            <Route
                                path="/checkout"
                                element={
                                    <RequireAuth token={token}>
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
                                        username={username}
                                        role={role}
                                        allowedRoles={["admin", "system-admin"]}
                                    >
                                        <ManageUsers
                                            users={[]}
                                            user={username}
                                        />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/manage-universities"
                                element={
                                    <RequireRole
                                        username={username}
                                        role={role}
                                        allowedRoles={["system-admin"]}
                                    >
                                        <ManageUniversities
                                            initialUniversities={universities.current}
                                        />
                                    </RequireRole>
                                }
                            />

                            <Route
                                path="/system-policies"
                                element={
                                    <RequireRole
                                        username={userObj}
                                        role={role}
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
                                    <RequireAuth token={token}>
                                        <Disputes
                                            disputes={dummyDisputes.current}
                                            user={userObj}
                                            users={[]}
                                        />
                                    </RequireAuth>
                                }
                            />

                            {/* UNIVERSITY SELECTION */}
                            <Route
                                path="/university-selection"
                                element={
                                    <RequireRole
                                        username={username}
                                        role={role}
                                        allowedRoles={["visitor", "system-admin"]}
                                    >
                                        <UniversitySelection
                                            filterContent={filterContent} // this is the filter function, btw
                                            universities={universities.current}
                                            assignUni={assignUni} // also function
                                        />
                                    </RequireRole>
                                }
                            />

                            {/* ABOUT ORGANIZER */}
                            <Route
                                path="/about-organizer"
                                element={
                                    <RequireAuth token={token}>
                                        {organizerViewing ? <AboutOrganizer
                                            setOrganizerViewing={setOrganizerViewing}
                                            organizer={organizerViewing}
                                            users={[]}
                                            events={events.current}
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
                                    token ? (
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

                    {!isLoading && <Footer type={currentUser?.type ?? "empty"} />}
                </div>
            
        </>
    );
}

export default App;