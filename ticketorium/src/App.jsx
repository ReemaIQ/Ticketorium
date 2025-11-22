// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import Nav from "./components/nav/nav.jsx";
import Footer from "./components/footer/Footer.jsx";

import SignupLogin from "./pages/SignupLogin.jsx";
import DummyUserHome from "./pages/DummyUserHome.jsx";
import UserHome from "./pages/UserHome.jsx";

import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EventPage from "./pages/Event.jsx";

import CreateEvent from "./pages/events/CreateEvent.jsx";
import EditEvent from "./pages/events/EditEvent.jsx"; // reema: edit existing event
import Analytics from "./pages/Analytics.jsx";

import Disputes from "./pages/Disputes.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import UniversitySelection from "./pages/UniversitySelection.jsx";
import SystemPolicies from "./pages/SystemPolicies.jsx";

import Bidding from "./pages/Bidding.jsx";
import Checkout from "./pages/payment/Checkout.jsx";
import Registration from "./pages/Registration.jsx";
import PaymentResult from "./pages/payment/PaymentResult.jsx";
import AboutOrganizer from "./pages/AboutOrganizer.jsx";

import ScrollToTop from "./components/scroll-to-top/scroll_to_top.jsx";

// fyi, all uses of localstorage will be db later EXCEPT for loggedInUser

function App() {
    // ---------------- DUMMY DATA ----------------

    const initialDummyUsers = {
        "yo-shayma": {
            "first-name": "Shayma",
            "last-name": "Alarfaj",
            email: "shayma@gmail.com",
            phone: "01023456780",
            password: "Shayma!1111",
            type: "visitor",
            university: "Harvard",
            gender: "female",
            "date-of-birth": "2004-05-01",
        },
        "so-cool": {
            "first-name": "Cool",
            "last-name": "Person",
            email: "coolest-person@kfupm.edu.sa",
            phone: "01023456781",
            password: "Cool!1111",
            type: "admin",
            university: "KFUPM",
            gender: "male",
            "date-of-birth": "1995-01-01",
        },
        "so-dope": {
            "first-name": "Dope",
            "last-name": "Person",
            email: "dopest-person@kfupm.edu.sa",
            phone: "01023456782",
            password: "Dope!1111",
            type: "system-admin",
            university: "Harvard",
            gender: "male",
            "date-of-birth": "1995-01-01",
        },
        "chicken-nugget": {
            "first-name": "Chicken",
            "last-name": "Person",
            email: "chicken@kfupm.edu.sa",
            phone: "01023456783",
            password: "Chicken!1111",
            type: "organizer",
            university: "KFUPM", // r:changed it
            gender: "male",
            "date-of-birth": "1997-01-01",
        },
        "chicken-tender": {
            "first-name": "Tender",
            "last-name": "Person",
            email: "tender@harvard.edu",
            phone: "01023456783",
            password: "Chicken!1111",
            type: "organizer",
            university: "Harvard",
            gender: "male",
            "date-of-birth": "1997-01-01",
        },
        "boring-user": {
            "first-name": "Boring",
            "last-name": "Person",
            email: "s202212345@kfupm.edu.sa",
            phone: "01023456784",
            password: "Boring!1111",
            type: "student",
            university: "KFUPM",
            gender: "male",
            "date-of-birth": "2004-10-01",
        },
    };

    const initialDummyUniversities = {
        KFUPM: {
            name: "King Fahd University of Petroleum and Minerals",
            logo: "kfupm.png",
            "theme-colors": {
                "primary-color": "#006C35",
                "secondary-color": "#004B23",
                "accent-color": "#FFD700",
                "secondary-accent-color": "#003018",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#002E1A",
            },
        },
        Harvard: {
            name: "Harvard University",
            logo: "harvard.png",
            "theme-colors": {
                "primary-color": "#A51C30",
                "secondary-color": "#4A0C15",
                "accent-color": "#C4B7A6",
                "secondary-accent-color": "#7A1A24",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#3B0A1E",
            },
        },
        Saud: {
            name: "King Saud University",
            logo: "saud.png",
            "theme-colors": {
                "primary-color": "#004B8D",
                "secondary-color": "#002F5E",
                "accent-color": "#A5C8E1",
                "secondary-accent-color": "#013A73",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#001F3B",
            },
        },
        Manchester: {
            name: "University of Manchester",
            logo: "manchester.png",
            "theme-colors": {
                "primary-color": "#6A1B9A",
                "secondary-color": "#4A0F6E",
                "accent-color": "#FFCC00",
                "secondary-accent-color": "#B8860B",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#3D0D5C",
            },
        },
        Oxford: {
            name: "University of Oxford",
            logo: "oxford.png",
            "theme-colors": {
                "primary-color": "#002147",
                "secondary-color": "#00132B",
                "accent-color": "#A8996E",
                "secondary-accent-color": "#7A6A4A",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#000D1A",
            },
        },
        Cambridge: {
            name: "University of Cambridge",
            logo: "cambridge.png",
            "theme-colors": {
                "primary-color": "#A3C1AD",
                "secondary-color": "#6C8F7A",
                "accent-color": "#D6083B",
                "secondary-accent-color": "#8F062E",
                "filter-buttons": "#6A1B9A",
                "warning-color": "#F54141",
                "success-color": "#46CA48",
                "footer-color": "#4A6350",
            },
        },
    };

    const initialDummyNotifications = {
        /* EVENT JOIN / WAITLIST / REMINDERS */
        event_join_success: {
            id: "event_join_success",
            category: "event",
            titleTemplate: "You joined {{eventName}}",
            bodyTemplate: "You have successfully joined {{eventName}}.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_join_failed_full_or_closed: {
            id: "event_join_failed_full_or_closed",
            category: "event",
            titleTemplate: "Could not join {{eventName}}",
            bodyTemplate:
                "You could not join {{eventName}} because it is full or closed.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_waitlist_added: {
            id: "event_waitlist_added",
            category: "event",
            titleTemplate: "Waitlisted for {{eventName}}",
            bodyTemplate: "You have been added to the waitlist for {{eventName}}.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_time_changed: {
            id: "event_time_changed",
            category: "event",
            titleTemplate: "{{eventName}} time changed",
            bodyTemplate:
                "The time for {{eventName}} has changed to {{newDateTime}}.",
            roles: ["student", "visitor", "organizer"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_location_changed: {
            id: "event_location_changed",
            category: "event",
            titleTemplate: "{{eventName}} location changed",
            bodyTemplate:
                "The location for {{eventName}} has changed to {{newLocation}}.",
            roles: ["student", "visitor", "organizer"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_canceled: {
            id: "event_canceled",
            category: "event",
            titleTemplate: "{{eventName}} was cancelled",
            bodyTemplate: "{{eventName}} has been cancelled.",
            roles: ["student", "visitor", "organizer"],
            badge: true,
            inApp: true,
            email: true,
        },
        event_reminder_day_before: {
            id: "event_reminder_day_before",
            category: "event",
            titleTemplate: "{{eventName}} is tomorrow",
            bodyTemplate: "{{eventName}} starts tomorrow at {{startTime}}.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_reminder_hours_before: {
            id: "event_reminder_hours_before",
            category: "event",
            titleTemplate: "{{eventName}} starts soon",
            bodyTemplate: "{{eventName}} starts in {{timeUntilStart}}.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },
        event_invited: {
            id: "event_invited",
            category: "event",
            titleTemplate: "You were invited to {{eventName}}",
            bodyTemplate: "{{inviterName}} invited you to {{eventName}}.",
            roles: ["student", "visitor"],
            badge: true,
            inApp: true,
            email: false,
        },

        /* BIDDING */
        bidding_bid_placed: {
            id: "bidding_bid_placed",
            category: "bidding",
            titleTemplate: "Bid placed on {{listingTitle}} ticket",
            bodyTemplate:
                "Your bid of {{amount}} was placed on {{listingTitle}} ticket.",
            roles: ["student"],
            badge: true,
            inApp: true,
            email: false,
        },
        bidding_won: {
            id: "bidding_won",
            category: "bidding",
            titleTemplate: "You won the bidding for {{listingTitle}} ticket",
            bodyTemplate:
                "You won the bidding for {{listingTitle}} ticket. Complete your purchase.",
            roles: ["student"],
            badge: true,
            inApp: true,
            email: true,
        },
        bidding_ends_soon: {
            id: "bidding_ends_soon",
            category: "bidding",
            titleTemplate: "Bidding ends soon for {{listingTitle}} ticket",
            bodyTemplate:
                "Bidding for {{listingTitle}} ticket ends in {{timeUntilEnd}}.",
            roles: ["student"],
            badge: true,
            inApp: true,
            email: false,
        },

        /* LISTINGS */
        listing_received_bid: {
            id: "listing_received_bid",
            category: "listing",
            titleTemplate: "New bid on {{listingTitle}} ticket",
            bodyTemplate:
                "Your listing {{listingTitle}} ticket received a new bid.",
            roles: ["student"],
            badge: true,
            inApp: true,
            email: false,
        },
        listing_expired: {
            id: "listing_expired",
            category: "listing",
            titleTemplate: "Listing expired: {{listingTitle}}",
            bodyTemplate: "Your listing {{listingTitle}} has expired.",
            roles: ["student"],
            badge: false,
            inApp: true,
            email: false,
        },
        listing_sold: {
            id: "listing_sold",
            category: "listing",
            titleTemplate: "Your ticket was sold",
            bodyTemplate: "Your ticket {{listingTitle}} was sold for {{amount}}.",
            roles: ["student"],
            badge: true,
            inApp: true,
            email: true,
        },

        /* DISPUTES */
        dispute_created: {
            id: "dispute_created",
            category: "dispute",
            titleTemplate: "Dispute {{disputeTitle}} submitted",
            bodyTemplate: "Your dispute regarding {{eventName}} has been submitted.",
            roles: ["student", "visitor", "organizer"],
            badge: true,
            inApp: true,
            email: false,
        },
        "dispute_created-admin": {
            id: "dispute_created-admin",
            category: "dispute",
            titleTemplate: "New dispute titled {{disputeTitle}} was created",
            bodyTemplate: "A dispute regarding {{eventName}} has been created.",
            roles: ["admin", "system-admin"],
            badge: true,
            inApp: true,
            email: false,
        },
        dispute_new_message: {
            id: "dispute_new_message",
            category: "dispute",
            titleTemplate: "New reply in the dispute: {{disputeTitle}}",
            bodyTemplate:
                "There is a new message on your dispute for {{eventName}}.",
            roles: ["student", "visitor", "organizer", "admin", "system-admin"],
            badge: true,
            inApp: true,
            email: false,
        },

        /* ORGANIZER EVENT REMINDERS */
        organizer_event_reminder_day_before: {
            id: "organizer_event_reminder_day_before",
            category: "organizer_event",
            titleTemplate: "Your event {{eventName}} is tomorrow",
            bodyTemplate:
                "Your event {{eventName}} is scheduled for tomorrow at {{startTime}}.",
            roles: ["organizer"],
            badge: false,
            inApp: true,
            email: false,
        },
        organizer_event_reminder_hours_before: {
            id: "organizer_event_reminder_hours_before",
            category: "organizer_event",
            titleTemplate: "Your event {{eventName}} starts soon",
            bodyTemplate:
                "Your event {{eventName}} starts in {{timeUntilStart}}.",
            roles: ["organizer"],
            badge: false,
            inApp: true,
            email: false,
        },
        organizer_event_ended: {
            id: "organizer_event_ended",
            category: "organizer_event",
            titleTemplate: "{{eventName}} has ended",
            bodyTemplate:
                "Your event {{eventName}} has ended. Review attendance or feedback.",
            roles: ["organizer"],
            badge: false,
            inApp: true,
            email: false,
        },
        organizer_role_granted: {
            id: "organizer_role_granted",
            category: "account",
            titleTemplate: "Organizer role granted",
            bodyTemplate: "You have been granted organizer privileges.",
            roles: ["organizer"],
            badge: true,
            inApp: true,
            email: false,
        },
    };

    const initialDummyDisputes = {
        1: {
            title: "Ticket not received",
            subtitle: "Issue with email delivery for my ticket.",
            createdAt: "2025-11-21T09:15:00Z",
            lastActivityAt: "2025-11-21T09:20:00Z",
            status: "open",
            participants: ["yo-shayma", "so-cool"],
            messages: [
                {
                    id: "m1",
                    from: "yo-shayma",
                    type: "text",
                    text: "I have this issue with my ticket not arriving.",
                    createdAt: "2025-11-21T09:15:00Z",
                },
                {
                    id: "m2",
                    from: "so-cool",
                    type: "text",
                    text: "I’ll fix it right away!",
                    createdAt: "2025-11-21T09:17:00Z",
                },
                {
                    id: "m3",
                    from: "user",
                    type: "image",
                    url: "/src/assets/images/event/group-hiking.png",
                    caption: "This is what I see on my screen.",
                    createdAt: "2025-11-21T09:20:00Z",
                },
            ],
        },
        2: {
            title: "Double charge on payment",
            subtitle: "I was charged twice when buying tickets.",
            createdAt: "2025-11-21T08:40:00Z",
            lastActivityAt: "2025-11-21T08:50:00Z",
            status: "open",
            participants: ["chicken-nugget", "so-cool"],
            messages: [
                {
                    id: "m1",
                    from: "chicken-nugget",
                    type: "text",
                    text: "I have this issue with my ticket not arriving.",
                    createdAt: "2025-11-21T09:15:00Z",
                },
                {
                    id: "m2",
                    from: "so-cool",
                    type: "text",
                    text: "I’ll fix it right away!",
                    createdAt: "2025-11-21T09:17:00Z",
                },
            ],
        },
    };


    const initialDummyEvents = {
        1: {
            university: "Harvard",
            img: "group-hiking.png",
            title: "2025 Group Hiking",
            date: "9:30 AM Nov 21, 2025",
            organizer: "chicken-nugget",
            price: 0,
            hasSeatingPlan: true,
        },
        2: {
            university: "Harvard",
            img: "group-hiking.png",
            title: "2025 Group Hiking",
            date: "9:30 AM Nov 21, 2025",
            organizer: "chicken-nugget",
            price: 10.0,
            hasSeatingPlan: true,
        },
        3: {
            university: "Harvard",
            img: "spelling-bee.png",
            title: "2025 Spelling Bee",
            date: "Nov 21, 2025",
            organizer: "chicken-tender",
            price: 0,
        },
        4: {
            university: "KFUPM",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "chicken-nugget",
            price: 19.99,
        },
        5: {
            university: "KFUPM",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "chicken-nugget",
            price: 0,
        },
        6: {
            university: "Harvard",
            img: "graduation.png",
            title: "2025 Graduation Ceremony",
            date: "March 6, 2026",
            organizer: "chicken-tender",
            price: 0,
            hasSeatingPlan: false,
        },
    };

    const initialDummyEventsJoined = {
        1: {
            eventId: 1,
            user: "yo-shayma",
            state: "joined",
        },
        2: {
            eventId: 3,
            user: "boring-user",
            state: "joined",
        },
        3: {
            eventId: 3,
            user: "yo-shayma",
            state: "joined",
        },
        6: {
            eventId: 4,
            user: "boring-user",
            state: "invited",
            invitee: "yo-shayma",
        },
    };

    const initialDummyBids = {
        1: {
            user: "boring-user",
            topBid: 99.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        2: {
            user: "boring-user",
            topBid: 89.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        3: {
            user: "boring-user",
            topBid: 79.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        4: {
            user: "other-user",
            topBid: 19.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        5: {
            user: "other-user",
            topBid: 29.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        6: {
            user: "other-user",
            topBid: 39.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        7: {
            user: "other-user",
            topBid: 49.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        8: {
            user: "other-user",
            topBid: 49.99,
            topBiddingUser: "imaginary-student-user",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
    };

    // ---------------- STATE ----------------

    const [loggedInUser, setLoggedInUser] = useState(null); // username only
    const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
    const [part1Data, setPart1Data] = useState({});
    const [selectedUni, setSelectedUni] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const dummyUsers = useRef({});
    const dummyUniversities = useRef({});
    const dummyEvents = useRef({});
    const dummyBids = useRef({});
    const dummyNotifications = useRef({});
    const dummyDisputes = useRef({});
    const dummyEventsJoined = useRef({});

    const [successfulPayment, setSuccessfulPayment] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [organizerViewing, setOrganizerViewing] = useState(null); // reserved for later usage

    // ---------------- LOCAL STORAGE HYDRATION ----------------

    useEffect(() => {
        // loggedInUser
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser && storedUser !== "null") {
            setLoggedInUser(storedUser);
        } else {
            setLoggedInUser(null);
        }

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

        // dummyBids
        const emptyDummyBids =
            localStorage.getItem("dummyBids") === "null" ||
            !localStorage.getItem("dummyBids");
        if (!emptyDummyBids) {
            dummyBids.current = JSON.parse(localStorage.getItem("dummyBids"));
        } else {
            localStorage.setItem("dummyBids", JSON.stringify(initialDummyBids));
            dummyBids.current = initialDummyBids;
        }

        // dummyNotifications
        const emptyDummyNotificationsFlag =
            localStorage.getItem("dummyNotifications") === "null" ||
            !localStorage.getItem("dummyNotifications");
        if (!emptyDummyNotificationsFlag) {
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

        // dummyDisputes (bug fixed: use initialDummyDisputes)
        const emptyDummyDisputes =
            localStorage.getItem("dummyDisputes") === "null" ||
            !localStorage.getItem("dummyDisputes");
        if (!emptyDummyDisputes) {
            dummyDisputes.current = JSON.parse(localStorage.getItem("dummyDisputes"));
        } else {
            localStorage.setItem(
                "dummyDisputes",
                JSON.stringify(initialDummyDisputes)
            );
            dummyDisputes.current = initialDummyDisputes;
        }

        setIsLoading(false);
    }, []);

    // ---------------- THEME EFFECT ----------------

    useEffect(() => {
        const rootStyle = document.documentElement.style;

        const user = loggedInUser ? dummyUsers.current?.[loggedInUser] : null;
        const uniId = user?.university;
        const uniTheme = uniId
            ? dummyUniversities.current?.[uniId]?.["theme-colors"]
            : null;

        const fallbackTheme = {
            "secondary-color": "#1F4C76",
            "primary-color": "#1a1a1a",
            "accent-color": "#FFDF4F",
            "secondary-accent-color": "#0800FF",
            "footer-color": "#11223B",
            "warning-color": "#F54141",
            "success-color": "#46CA48",
            "filter-buttons": "oklch(49.6% 0.265 301.924)",
        };

        const theme = uniTheme || fallbackTheme;

        Object.entries(theme).forEach(([name, value]) => {
            rootStyle.setProperty(`--${name}`, value);
        });

        if (user && user.type !== "visitor" && user.type !== "system-admin") {
            setSelectedUni(true);
        }
    }, [loggedInUser]);

    // ---------------- HELPERS ----------------

    const checkIfEmailExists = (email) => {
        for (const username in dummyUsers.current) {
            if (dummyUsers.current[username].email === email) {
                return true;
            }
        }
        return false;
    };

    const checkIfPhoneExists = (phone) => {
        for (const username in dummyUsers.current) {
            if (dummyUsers.current[username].phone === phone) {
                return true;
            }
        }
        return false;
    };

    const checkIfUsernameExists = (username) => {
        return username in dummyUsers.current;
    };

    const checkUsernamePassword = (username, password) => {
        if (username in dummyUsers.current) {
            return dummyUsers.current[username].password === password;
        }
        return false;
    };

    const checkEmailPassword = (email, password) => {
        for (const username in dummyUsers.current) {
            if (dummyUsers.current[username].email === email) {
                return dummyUsers.current[username].password === password;
            }
        }
        return false;
    };

    const getUsernameFromEmail = (email) => {
        for (const username in dummyUsers.current) {
            if (dummyUsers.current[username].email === email) {
                return username;
            }
        }
        return null;
    };

    const addNewUser = (data) => {
        const userObject = {
            "first-name": data["first-name"],
            "last-name": data["last-name"],
            email: data["email"],
            phone: data["phone-number"],
            password: data["password"],
            type: "visitor",
            university: null,
            gender: data["gender"],
            "date-of-birth": data["date-of-birth"],
        };
        dummyUsers.current[data["username"]] = userObject;
        localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers.current));
    };

    const assignUni = (university) => {
        if (loggedInUser) {
            dummyUsers.current[loggedInUser].university = university;
            localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers.current));
        }
    };

    // super general filtering function (events / universities / invites etc.)
    // this is a very general function, to avoid repeating code in many places, it is anything and everything related to filtering content
    // this func sets ids only, in a list, unless typeOfFilter is initial, then it is an object

    const filterContent = (
        typeOfFilter,
        content,
        setter,
        searchFor,
        searchValue = "",
        filterDetails
    ) => {
        if (searchFor === "university") {
            const filtered = Object.keys(content).filter(
                (uniId) =>
                    content[uniId]["name"]
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    uniId.toLowerCase().includes(searchValue.toLowerCase())
            );
            setter(filtered);
        }

        if (typeOfFilter === "search" && searchFor === "event") {
            const filtered = Object.keys(content).filter((eventId) =>
                content[eventId]["title"]
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
            setter(filtered);
        } else if (typeOfFilter === "initial" && searchFor === "event") {
            let results = {};

            const ids =
                filterDetails["list-type"] === "all-events"
                    ? Object.keys(content).filter(
                        (eventId) =>
                            content[eventId]["university"] === filterDetails["university"]
                    )
                    : filterDetails["list-type"] === "my-events"
                        ? Object.keys(content["eventsJoined"]).filter(
                            (eventJoinedId) =>
                                content["events"][
                                    content["eventsJoined"][eventJoinedId]["eventId"]
                                    ]["university"] === filterDetails["university"] &&
                                content["eventsJoined"][eventJoinedId]["user"] ===
                                loggedInUser &&
                                content["eventsJoined"][eventJoinedId]["state"] !== "invited"
                        )
                        : filterDetails["list-type"] === "invites-received"
                            ? Object.keys(content["eventsJoined"]).filter(
                                (eventJoinedId) =>
                                    content["events"][
                                        content["eventsJoined"][eventJoinedId]["eventId"]
                                        ]["university"] === filterDetails["university"] &&
                                    content["eventsJoined"][eventJoinedId]["state"] ===
                                    "invited" &&
                                    content["eventsJoined"][eventJoinedId]["invitee"] ===
                                    loggedInUser
                            )
                            : filterDetails["list-type"] === "invites-sent"
                                ? Object.keys(content["eventsJoined"]).filter(
                                    (eventJoinedId) =>
                                        content["events"][
                                            content["eventsJoined"][eventJoinedId]["eventId"]
                                            ]["university"] === filterDetails["university"] &&
                                        content["eventsJoined"][eventJoinedId]["state"] ===
                                        "invited" &&
                                        content["eventsJoined"][eventJoinedId]["user"] === loggedInUser
                                )
                                : [];

            for (let id of ids) {
                results[id] =
                    filterDetails["list-type"] === "all-events"
                        ? content[id]
                        : content["events"][content["eventsJoined"][id]["eventId"]];
            }

            setter.current = results;
        }
    };

    // debug helper you used earlier
    const testingForceUser = (username) => {
        setLoggedInUser(username);
        localStorage.setItem("loggedInUser", username);
    };

    const currentUser = loggedInUser
        ? dummyUsers.current?.[loggedInUser] || null
        : null;

    // ---------------- ROUTES ----------------

    return (
        <>
            {/* Scroll-to-top on every route change */}
            <ScrollToTop />

            <div className="flex-col">
                <Nav
                    type={currentUser?.type || "empty"}
                    userName={currentUser?.["first-name"] || ""}
                    user={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                    notifications={dummyNotifications.current}
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
                                        setWaitlistModalOpen={setWaitlistModalOpen}
                                        waitlistModalOpen={waitlistModalOpen}
                                        setWaitlistSuccess={setWaitlistSuccess}
                                        waitlistSuccess={waitlistSuccess}
                                        setIsPurchasing={setIsPurchasing}
                                        filterContent={filterContent}
                                        uni={currentUser?.university}
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
                                loggedInUser ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <SignupLogin
                                        option={"log-in"}
                                        checkIfEmailExists={checkIfEmailExists}
                                        checkIfUsernameExists={checkIfUsernameExists}
                                        checkUsernamePassword={checkUsernamePassword}
                                        checkEmailPassword={checkEmailPassword}
                                        setLoggedInUser={setLoggedInUser}
                                        getUsernameFromEmail={getUsernameFromEmail}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/sign-up"
                            element={
                                loggedInUser ? (
                                    <Navigate to="/home" />
                                ) : (
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
                                )
                            }
                        />
                        <Route
                            path="/sign-up-2"
                            element={
                                loggedInUser ? (
                                    <Navigate to="/home" />
                                ) : finishedPart1SignUp ? (
                                    <SignupLogin
                                        option={"sign-up-part-2"}
                                        setLoggedInUser={setLoggedInUser}
                                        checkIfUsernameExists={checkIfUsernameExists}
                                        addNewUser={addNewUser}
                                        part1Data={part1Data}
                                    />
                                ) : (
                                    <Navigate to="/sign-up" />
                                )
                            }
                        />

                        {/* MY EVENTS + ALL EVENTS */}
                        <Route
                            path="/my-events"
                            element={
                                loggedInUser ? (
                                    <MyEvents
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
                                        uni={currentUser?.university}
                                    />
                                ) : (
                                    <Navigate to="/log-in" />
                                )
                            }
                        />
                        <Route
                            path="/events"
                            element={
                                loggedInUser ? (
                                    <AllEvents
                                        setWaitlistModalOpen={setWaitlistModalOpen}
                                        waitlistModalOpen={waitlistModalOpen}
                                        waitlistSuccess={waitlistSuccess}
                                        setWaitlistSuccess={setWaitlistSuccess}
                                        setIsPurchasing={setIsPurchasing}
                                        filterContent={filterContent}
                                        user={loggedInUser}
                                        users={dummyUsers.current}
                                        events={dummyEvents.current}
                                        uni={currentUser?.university}
                                        eventsJoined={dummyEventsJoined.current}
                                    />
                                ) : (
                                    <Navigate to="/log-in" />
                                )
                            }
                        />

                        {/* EVENT DETAILS (QR ticket / verify / invite / seating plan handled inside EventPage) */}
                        <Route
                            path="/event/:eventId"
                            element={
                                <EventPage
                                    user={loggedInUser}
                                    users={dummyUsers.current}
                                    events={dummyEvents.current}
                                />
                            }
                        />

                        {/* EDIT EVENT (organizer only) */}
                        <Route
                            path="/event/:eventId/edit"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : currentUser?.type !== "organizer" ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <EditEvent />
                                )
                            }
                        />

                        {/* BIDDING */}
                        <Route
                            path="/bidding"
                            element={<Bidding user={loggedInUser} biddings={dummyBids.current} />}
                        />

                        {/* ORGANIZER PAGES */}
                        <Route
                            path="/analytics"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : currentUser?.type !== "organizer" ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <Analytics />
                                )
                            }
                        />
                        <Route
                            path="/create-event"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : currentUser?.type !== "organizer" ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <CreateEvent />
                                )
                            }
                        />

                        {/* REGISTRATION + PAYMENT FLOW (kept for demo) */}
                        <Route
                            path="/registration"
                            element={
                                !loggedInUser ? <Navigate to="/log-in" /> : <Registration />
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : !isPurchasing ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <Checkout
                                        setSuccess={setSuccessfulPayment}
                                        setProcessing={setProcessingPayment}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/payment-outcome"
                            element={
                                processingPayment ? (
                                    <PaymentResult success={successfulPayment} />
                                ) : (
                                    <Navigate to="/home" />
                                )
                            }
                        />

                        {/* ADMIN / SYSTEM-ADMIN */}
                        <Route
                            path="/manage-users"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : currentUser?.type === "admin" ||
                                currentUser?.type === "system-admin" ? (
                                    <ManageUsers users={dummyUsers.current} user={loggedInUser} />
                                ) : (
                                    <Navigate to="/home" />
                                )
                            }
                        />
                        <Route
                            path="/disputes"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : (
                                    <Disputes
                                        disputes={dummyDisputes.current}
                                        user={loggedInUser}
                                        users={dummyUsers.current}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/system-policies"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : currentUser?.type === "admin" ||
                                currentUser?.type === "system-admin" ? (
                                    <SystemPolicies />
                                ) : (
                                    <Navigate to="/home" />
                                )
                            }
                        />

                        {/* UNIVERSITY SELECTION */}
                        <Route
                            path="/university-selection"
                            element={
                                loggedInUser ? (
                                    currentUser?.type === "visitor" ||
                                    currentUser?.type === "system-admin" ? (
                                        <UniversitySelection
                                            filterContent={filterContent}
                                            universities={dummyUniversities.current}
                                            assignUni={assignUni}
                                            setSelectedUni={setSelectedUni}
                                        />
                                    ) : (
                                        <Navigate to="/home" />
                                    )
                                ) : (
                                    <Navigate to="/log-in" />
                                )
                            }
                        />

                        {/* ABOUT ORGANIZER */}
                        <Route
                            path="/about-organizer"
                            element={
                                !loggedInUser ? (
                                    <Navigate to="/log-in" />
                                ) : (
                                    <AboutOrganizer
                                        organizer={"chicken-tender"}
                                        users={dummyUsers.current}
                                        events={dummyEvents.current}
                                        userType={currentUser?.type || "empty"}
                                    />
                                )
                            }
                        />

                        {/* ROOT + 404 */}
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route
                            path="*"
                            element={
                                loggedInUser ? (
                                    <h1 className="m-10 text-5xl font-bold text-[var(--secondary-color)] h-[100vh]">
                                        404 - Page Not Found :)
                                    </h1>
                                ) : (
                                    <Navigate to="/log-in" />
                                )
                            }
                        />
                    </Routes>
                )}

                <Footer type={currentUser?.type || "empty"} />
            </div>
        </>
    );
}

export default App;
