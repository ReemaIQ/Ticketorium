import {Route, Routes, Navigate} from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

import Nav from './components/nav/Nav.jsx'
import Footer from './components/footer/Footer.jsx'

import SignupLogin from './pages/SignupLogin.jsx'
import DummyUserHome from './pages/DummyUserHome.jsx'
import UserHome from './pages/UserHome.jsx'

import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EventPage from "./pages/Event.jsx";
import OrganizerHomePage from "./pages/home/Organizer.jsx" //r
import Analytics from "./pages/Analytics.jsx"; //r
import Registration from "./pages/Registration.jsx"; //r
import ManageUsers from "./pages/ManageUsers.jsx";
import Disputes from "./pages/Disputes.jsx";


import Bidding from "./pages/Bidding.jsx"

// fyi, all uses of localstorage will be db later EXCEPT for loggedInUser

function App() {
  // to be replaced in the db, for now, this is just dummy data
  // Dummy users format
  const initialDummyUsers = {
    "yo-shayma":
    {
      "first-name": "Shayma",
      "last-name": "Alarfaj",
      "email": "shayma@gmail.com",
      "phone": "01023456780",
      "password": "Shayma!1111",
      "type": "visitor",
      "university": "harvard", // does not belong to any university. but can choose which university's events to explore
      "gender": "female",
      "date-of-birth": "2004-05-01",
    },
    "so-cool":
    {
      "first-name": "Cool",
      "last-name": "Person",
      "email": "coolest-person@kfupm.edu.sa",
      "phone": "01023456781",
      "password": "Cool!1111",
      "type": "admin",
      "university": "kfupm", // cannot belong to any other university
      "gender": "male",
      "date-of-birth": "1995-01-01",
    },
    "so-dope":
    {
      "first-name": "Dope",
      "last-name": "Person",
      "email": "dopest-person@kfupm.edu.sa",
      "phone": "01023456782",
      "password": "Dope!1111",
      "type": "system-admin",
      "university": "harvard", // he is prompted upon login to choose which university to administer
      "gender": "male",
      "date-of-birth": "1995-01-01",
    },
    "chicken-nugget":
    {
      "first-name": "Chicken",
      "last-name": "Person",
      "email": "chicken@kfupm.edu.sa",
      "phone": "01023456783",
      "password": "Chicken!1111",
      "type": "organizer",
      "university": "kfupm", // cannot belong to any other university
      "gender": "male",
      "date-of-birth": "1997-01-01",
    },
    "boring-user":
    {
      "first-name": "Boring",
      "last-name": "Person",
      "email": "s202212345@kfupm.edu.sa",
      "phone": "01023456784",
      "password": "Boring!1111",
      "type": "student",
      "university": "kfupm", // cannot belong to any other university
      "gender": "male",
      "date-of-birth": "2004-10-01",
    }
  }

  // dummyUniversities format
  // id is uni name abbreviated, e.g. kfupm, harvard, saud, etc. unique ids ofc
  const initialDummyUniversities = {
    "kfupm": {
      "name": "King Fahd University of Petroleum and Minerals",
      "logo": "kfupm.png"
    },
    "harvard": {
      "name": "Harvard University",
      "logo": "harvard.png"
    },
    "saud": {
      "name": "King Saud University",
      "logo": "saud.png"
    },
    "manchester": {
      "name": "University of Manchester",
      "logo": "manchester.png"
    },
    "oxford": {
      "name": "University of Oxford",
      "logo": "oxford.png"
    },
    "cambridge": {
      "name": "University of Cambridge",
      "logo": "cambridge.png"
    }
    // more can be added by system admins only!
  }

  // dummyNotifications format
  const initialDummyNotifications = {
          "event_join_success": {
            "category": "event",
            "titleTemplate": "You joined {{eventName}}",
            "bodyTemplate": "You have successfully joined {{eventName}}.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
          },
          "event_join_failed_full_or_closed": {
            "category": "event",
            "titleTemplate": "Could not join {{eventName}}",
            "bodyTemplate": "You could not join {{eventName}} because it is full or closed.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
          },
          "event_waitlist_added": {
            "category": "event",
            "titleTemplate": "Waitlisted for {{eventName}}",
            "bodyTemplate": "You have been added to the waitlist for {{eventName}}.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
          },
          "event_time_changed": {
            "category": "event",
            "titleTemplate": "{{eventName}} time changed",
            "bodyTemplate": "The time for {{eventName}} has changed to {{newDateTime}}.",
            "roles": ["student", "visitor", "organizer"],
            "badge": true,
            "inApp": true,
            "email": false
          },
          "event_location_changed": {
            "category": "event",
            "titleTemplate": "{{eventName}} location changed",
            "bodyTemplate": "The location for {{eventName}} has changed to {{newLocation}}.",
            "roles": ["student", "visitor", "organizer"],
            "badge": true,
            "inApp": true,
            "email": false
        },
          "event_canceled": {
            "category": "event",
            "titleTemplate": "{{eventName}} was cancelled",
            "bodyTemplate": "{{eventName}} has been cancelled.",
            "roles": ["student", "visitor", "organizer"],
            "badge": true,
            "inApp": true,
            "email": true
        },
          "event_reminder_day_before": {
            "category": "event",
            "titleTemplate": "{{eventName}} is tomorrow",
            "bodyTemplate": "{{eventName}} starts tomorrow at {{startTime}}.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
        },
          "event_reminder_hours_before": {
            "category": "event",
            "titleTemplate": "{{eventName}} starts soon",
            "bodyTemplate": "{{eventName}} starts in {{timeUntilStart}}.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
        },
          "event_invited": {
            "category": "event",
            "titleTemplate": "You were invited to {{eventName}}",
            "bodyTemplate": "{{inviterName}} invited you to {{eventName}}.",
            "roles": ["student", "visitor"],
            "badge": true,
            "inApp": true,
            "email": false
        },

    /* BIDDING (STUDENT / ADMIN / ORGANIZER AS BIDDER) */

          "bidding_bid_placed":{
            "category": "bidding",
            "titleTemplate": "Bid placed on {{listingTitle}} ticket",
            "bodyTemplate": "Your bid of {{amount}} was placed on {{listingTitle}} ticket.",
            "roles": ["student"],
            "badge": true,
            "inApp": true,
            "email": false
        },
          "bidding_won":{
            "category": "bidding",
            "titleTemplate": "You won the bidding for {{listingTitle}} ticket",
            "bodyTemplate": "You won the bidding for {{listingTitle}} ticket. Complete your purchase.",
            "roles": ["student"],
            "badge": true,
            "inApp": true,
            "email": true
        },
          "bidding_ends_soon": {
            "category": "bidding",
            "titleTemplate": "Bidding ends soon for {{listingTitle}} ticket",
            "bodyTemplate": "Bidding for {{listingTitle}} ticket ends in {{timeUntilEnd}}.",
            "roles": ["student", "organizer", "admin"],
            "badge": true,
            "inApp": true,
            "email": false
        },

    /* LISTINGS (STUDENT AS SELLER, OPTIONALLY OTHERS) */

          "listing_received_bid": {
            "category": "listing",
            "titleTemplate": "New bid on {{listingTitle}} ticket",
            "bodyTemplate": "Your listing {{listingTitle}} ticket received a new bid.",
            "roles": ["student"],
            "badge": true,
            "inApp": true,
            "email": false
        },
          "listing_expired": {
            "category": "listing",
            "titleTemplate": "Listing expired: {{listingTitle}}",
            "bodyTemplate": "Your listing {{listingTitle}} has expired.",
            "roles": ["student"],
            "badge": false,
            "inApp": true,
            "email": false
        },
          "listing_sold": {
            "category": "listing",
            "titleTemplate": "Your ticket was sold",
            "bodyTemplate": "Your ticket {{listingTitle}} was sold for {{amount}}.",
            "roles": ["student"],
            "badge": true,
            "inApp": true,
            "email": true
        },

    /* DISPUTES (STUDENT / VISITOR / ORGANIZER / ADMIN AS COMPLAINANT) */

        "dispute_created": {
        "category": "dispute",
        "titleTemplate": "Dispute {{disputeTitle}} submitted",
        "bodyTemplate": "Your dispute regarding {{eventName}} has been submitted.",
        "roles": ["student", "visitor", "organizer"],
        "badge": true,
        "inApp": true,
        "email": false
    },
        "dispute_created-admin": {
          "category": "dispute",
          "titleTemplate": "New dispute titled {{disputeTitle}} was created",
          "bodyTemplate": "A dispute regarding {{eventName}} has been created.",
          "roles": ["admin"],
          "badge": true,
          "inApp": true,
          "email": false
      },
        "dispute_new_message": {
        "category": "dispute",
        "titleTemplate": "New reply in the dispute: {{disputeTitle}}",
        "bodyTemplate": "There is a new message on your dispute for {{eventName}}.",
        "roles": ["student", "visitor", "organizer", "admin"],
        "badge": true,
        "inApp": true,
        "email": false
    },

    /* ORGANIZER-SPECIFIC EVENT REMINDERS */

        "organizer_event_reminder_day_before": {
        "category": "organizer_event",
        "titleTemplate": "Your event {{eventName}} is tomorrow",
        "bodyTemplate": "Your event {{eventName}} is scheduled for tomorrow at {{startTime}}.",
        "roles": ["organizer"],
        "badge": false,
        "inApp": true,
        "email": false
    },
        "organizer_event_reminder_hours_before": {
        "category": "organizer_event",
        "titleTemplate": "Your event {{eventName}} starts soon",
        "bodyTemplate": "Your event {{eventName}} starts in {{timeUntilStart}}.",
        "roles": ["organizer"],
        "badge": false,
        "inApp": true,
        "email": false
    },
        "organizer_event_ended":{
        "category": "organizer_event",
        "titleTemplate": "{{eventName}} has ended",
        "bodyTemplate": "Your event {{eventName}} has ended. Review attendance or feedback.",
        "roles": ["organizer"],
        "badge": false,
        "inApp": true,
        "email": false
    },
        "organizer_role_granted": {
        "category": "account",
        "titleTemplate": "Organizer role granted",
        "bodyTemplate": "You have been granted organizer privileges.",
        "roles": ["organizer"],
        "badge": true,
        "inApp": true,
        "email": false
    },

    // /* ACCOUNT & SECURITY (ALL ROLES) */
    //
    // {
    //     "id": "account_password_changed",
    //     "category": "account",
    //     "titleTemplate": "Password changed",
    //     "bodyTemplate": "Your account password has been changed.",
    //     "roles": ["student", "visitor", "organizer", "admin"],
    //     "badge": true,
    //     "inApp": true,
    //     "email": true
    // },
    // {
    //     "id": "account_email_changed",
    //     "category": "account",
    //     "titleTemplate": "Email address changed",
    //     "bodyTemplate": "Your account email has been changed to {{newEmail}}.",
    //     "roles": ["student", "visitor", "organizer", "admin"],
    //     "badge": true,
    //     "inApp": true,
    //     "email": true
    // },
    // {
    //     "id": "account_new_login",
    //     "category": "security",
    //     "titleTemplate": "New login to your account",
    //     "bodyTemplate": "Your account was accessed from a new device or location: {{locationDescription}}.",
    //     "roles": ["student", "visitor", "organizer", "admin"],
    //     "badge": true,
    //     "inApp": true,
    //     "email": true
    // }
  }

  // dummyDisputes format
  const initialDummyDisputes = {
        1: {
            id: "d1",
            title: "Ticket not received",
            subtitle: "Issue with email delivery for my ticket.",
            createdAt: "2025-11-21T09:15:00Z",
            lastActivityAt: "2025-11-21T09:20:00Z",
            status: "open", // or 'pending', 'resolved'
            // derived in UI: "10 min", "45 min", "1 hr" from lastActivityAt
            messages: [
                {
                    id: "m1",
                    from: "user", // 'user' | 'support'
                    type: "text",
                    text: "I have this issue with my ticket not arriving.",
                    createdAt: "2025-11-21T09:15:00Z",
                },
                {
                    id: "m2",
                    from: "support",
                    type: "text",
                    text: "I’ll fix it right away!",
                    createdAt: "2025-11-21T09:17:00Z",
                }
                // {
                //     id: "m3",
                //     from: "user",
                //     type: "image",
                //     url: "/src/assets/disputes/example-screenshot.png",
                //     caption: "This is what I see on my screen.",
                //     createdAt: "2025-11-21T09:20:00Z",
                // },
            ],
        },
        2: {
            title: "Double charge on payment",
            subtitle: "I was charged twice when buying tickets.",
            createdAt: "2025-11-21T08:40:00Z",
            lastActivityAt: "2025-11-21T08:50:00Z",
            status: "open",
            messages: [],
        }
        // add more disputes...
    };


    // dummyEvents format
  const initialDummyEvents = {
        1: {
            state: "joined",
            img: "group-hiking.png",
            title: "2025 Group Hiking",
            date: "9:30 AM Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
        },

        2: {
            state: "joined",
            img: "group-hiking.png",
            title: "2025 Group Hiking",
            date: "9:30 AM Nov 21, 2025",
            organizer: "CS Department",
            price: 10,
        },

        3: {
            state: "not-joined",
            img: "game-dev.png",
            title: "2025 GameDev Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 19.99,
        },

        4: {
            state: "waitlist",
            img: "spelling-bee.png",
            title: "2025 Spelling Bee",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
        },

        5: {
            state: "waitlisted",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 19.99,
        },

        6: {
            state: "invited",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
            inviter: "Student"
        },

        7: {
            state: "graduation",
            img: "graduation.png",
            title: "2025 Graduation Ceremony",
            date: "March 6, 2026",
            organizer: "Harvard",
            price: 0,
        }
    }

  // dummyBids format
  const initialDummyBids = {
        1 : {
            user: "boring-user",
            topBid: "99.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        2 : {
            user: "boring-user",
            topBid: "89.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        3 : {
            user: "boring-user",
            topBid: "79.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        4 : {
            user: "other-user",
            topBid: "19.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        5 : {
            user: "other-user",
            topBid: "29.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        6 : {
            user: "other-user",
            topBid: "39.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        7 : {
            user: "other-user",
            topBid: "49.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        },
        8 : {
            user: "other-user",
            topBid: "49.99 $",
            date: "Dec 28th 7:00 P.M.",
            year: "2025",
        }
    }

  const [loggedInUser, setLoggedInUser] = useState(null); //username only
  const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
  const [part1Data, setPart1Data] = useState({});
  const dummyUsers = useRef({});
  const dummyUniversities = useRef({});
  const dummyEvents = useRef({});
  const dummyBids = useRef({});
  const dummyNotifications = useRef({});
  const dummyDisputes = useRef({});

  useEffect(() => {
    // loggedInUser 
    localStorage.getItem("loggedInUser") && setLoggedInUser(localStorage.getItem("loggedInUser")); // watch out for username = null
    !localStorage.getItem("loggedInUser") && setLoggedInUser(null);

    // dummyUsers
    const emptyDummyUsers = localStorage.getItem("dummyUsers") == "null" || !localStorage.getItem("dummyUsers");
    !emptyDummyUsers && (dummyUsers.current = JSON.parse(localStorage.getItem("dummyUsers")));
    emptyDummyUsers && localStorage.setItem("dummyUsers", JSON.stringify(initialDummyUsers));
    emptyDummyUsers && (dummyUsers.current = initialDummyUsers);

    // dummyUniversities
    const emptyDummyUniversities =  localStorage.getItem("dummyUniversities") == "null" || !localStorage.getItem("dummyUniversities");
    !emptyDummyUniversities && (dummyUniversities.current = JSON.parse(localStorage.getItem("dummyUniversities")));
    emptyDummyUniversities && localStorage.setItem("dummyUniversities", JSON.stringify(initialDummyUniversities));
    emptyDummyUniversities && (dummyUniversities.current = initialDummyUniversities)

    // dummyEvents
    const emptyDummyEvents = localStorage.getItem("dummyEvents") == "null" || !localStorage.getItem("dummyEvents");
    !emptyDummyEvents && (dummyEvents.current = JSON.parse(localStorage.getItem("dummyEvents")));
    emptyDummyEvents && localStorage.setItem("dummyEvents", JSON.stringify(initialDummyEvents));
    emptyDummyEvents && (dummyEvents.current = initialDummyEvents);

    // dummyBids
    const emptyDummyBids = localStorage.getItem("dummyBids") == "null" || !localStorage.getItem("dummyBids");
      !emptyDummyBids && (dummyBids.current = JSON.parse(localStorage.getItem("dummyBids")));
      emptyDummyBids && localStorage.setItem("dummyBids", JSON.stringify(initialDummyBids));
      emptyDummyBids && (dummyBids.current = initialDummyBids);

    // dummyNotifications
    const emptyDummyNotifications = localStorage.getItem("dummyNotifications") == "null" || !localStorage.getItem("dummyNotifications");
    !emptyDummyNotifications && (dummyNotifications.current = JSON.parse(localStorage.getItem("dummyNotifications")));
    emptyDummyNotifications && localStorage.setItem("dummyNotifications", JSON.stringify(initialDummyNotifications));
    emptyDummyNotifications && (dummyNotifications.current = initialDummyNotifications);

    const emptyDummyDisputes = localStorage.getItem("dummyDisputes") == "null" || !localStorage.getItem("dummyDisputes");
    !emptyDummyDisputes && (dummyDisputes.current = JSON.parse(localStorage.getItem("dummyDisputes")));
    emptyDummyDisputes && localStorage.setItem("dummyDisputes", JSON.stringify(dummyDisputes));
    emptyDummyDisputes && (dummyDisputes.current = initialDummyDisputes)

    console.log("Dummy Users:", dummyUsers.current);
    console.log("Dummy Universities:", dummyUniversities.current);
    console.log("Dummy Events:", dummyEvents.current, localStorage.getItem("dummyEvents"));
    console.log("Dummy Bids:", dummyBids.current, localStorage.getItem("dummyBids"));
    console.log("Dummy Notifications:", dummyNotifications.current, localStorage.getItem("dummyNotifications"));
    console.log("Dummy Disputes:", dummyDisputes.current, localStorage.getItem("dummyDisputes"));
    console.log("Logged in", localStorage.getItem("loggedInUser"));

  }, []);

  const checkIfEmailExists = (email) => {
    for (const username in dummyUsers.current) {
      if (dummyUsers.current[username].email === email) {
        return true;
      }
    }
    return false;
  }

  const checkIfPhoneExists = (phone) => {
    for (const username in dummyUsers.current) {
      if (dummyUsers.current[username].phone === phone) {
        return true;
      }
    }
    return false;
  }

  const checkIfUsernameExists = (username) => {
    return username in dummyUsers.current;
  }

  const checkUsernamePassword = (username, password) => {
    if (username in dummyUsers.current) {
      return dummyUsers.current[username].password === password;
    }
  }

  const checkEmailPassword = (email, password) => {
    for (const username in dummyUsers.current) {
      if (dummyUsers.current[username].email === email) {
        return dummyUsers.current[username].password === password;
      }
    }
    return false;
  }

  const getUsernameFromEmail = (email) => {
    for (const username in dummyUsers.current) {
      if (dummyUsers.current[username].email  === email) {
        return username;
      }
    }
    return null;
  }

  const addNewUser = (data) => {
    const userObject = {
      "first-name": data["first-name"],
      "last-name": data["last-name"],
      "email": data["email"],
      "phone": data["phone-number"],
      "password": data["password"],
      "type": "visitor",
      "university": null,
      "gender": data["gender"],
      "date-of-birth": data["date-of-birth"]
    }
    dummyUsers.current[data["username"]] = userObject;
    localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers.current));
  }


  return (
    <>
      <Nav type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"} userName={loggedInUser? dummyUsers.current[loggedInUser]["first-name"]: ""} user={loggedInUser} setLoggedInUser={setLoggedInUser}/>
      <Routes>

          <Route path="/home"
              element={
                  !loggedInUser ? (
                      <DummyUserHome /> //reema: not logged in to dummy landing home
                  ) : dummyUsers.current[loggedInUser]["type"] === "organizer" ? (
                      <OrganizerHomePage /> //reema: organizer home page
                  ) : (
                      <UserHome user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current}/>
                  )
              }
          />

          {/*<Route path="/home" element={!loggedInUser? <DummyUserHome/>:  <UserHome user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current}/>}/> /!* main home page for not logged in users *!/*/}
        {/*<Route path="/visitor/home" element={!loggedInUser? <DummyUserHome/> : dummyUsers.current[loggedInUser]["type"] != "visitor"? <Navigate to={`/${dummyUsers.current[loggedInUser]["type"]}/home`}/>: <UserHome user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current}/>}/>*/}
        {/*<Route path="/student/home" element={!loggedInUser? <DummyUserHome/> : dummyUsers.current[loggedInUser]["type"] != "student"? <Navigate to={`/${dummyUsers.current[loggedInUser]["type"]}/home`}/>: <UserHome user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current}/>}/>*/}
        <Route path="/log-in" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"log-in"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} setLoggedInUser={setLoggedInUser} getUsernameFromEmail={getUsernameFromEmail}/>}/>
        <Route path="/sign-up" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"sign-up"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} checkIfPhoneExists={checkIfPhoneExists} setFinishedPart1SignUp={setFinishedPart1SignUp} setPart1Data={setPart1Data}/>}/>
        <Route path="/sign-up-2" element={loggedInUser? <Navigate to={`/home`}/> : finishedPart1SignUp?<SignupLogin option={"sign-up-part-2"} setLoggedInUser={setLoggedInUser} checkIfUsernameExists={checkIfUsernameExists} addNewUser={addNewUser} part1Data={part1Data}/> : <Navigate to="/sign-up" />}/>

        <Route path="/my-events" element={<MyEvents user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current}/>} />
        <Route path="/events" element={<AllEvents user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current} />} />
        <Route path="/event/:eventId" element={<EventPage user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current}/>}/>

        <Route path="/bidding" element={<Bidding user={loggedInUser} biddings={dummyBids.current} />} />

        <Route path="/analytics" element={!loggedInUser ? (<Navigate to="/log-in" />) : dummyUsers.current[loggedInUser]["type"] !== "organizer" ? (<Navigate to="/home" />) : (<Analytics />) }/>
        {/* reema: Checkout / Registration Status page */}
        <Route path="/checkout" element={<Registration />} />

        <Route path="/manage-users" element={<ManageUsers users={dummyUsers.current} user={loggedInUser}/>}/>
        <Route path="/disputes" element={<Disputes disputes={dummyDisputes.current} user={loggedInUser}/>}/>

        <Route path="*" element={loggedInUser? <h1 className='m-10 text-5xl font-bold text-[var(--secondary-color)] h-[100vh]'>404 - Page Not Found {":)"}</h1> : <Navigate to="/log-in" />}/>

      </Routes>
      <Footer type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"}/>
    </>
  )
}

export default App
