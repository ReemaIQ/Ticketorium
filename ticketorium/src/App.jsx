import Nav from './components/nav/nav.jsx'
import Footer from './components/footer/footer.jsx'
import SignupLogin from './pages/signup_login/signup_login.jsx'
import {Route, Routes, Navigate} from 'react-router-dom'
import { useEffect, useState, useRef, use } from 'react'
import DummyUserHome from './pages/DummyUserHome.jsx'
import UserHome from './pages/user_home/UserHome.jsx'
import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import Checkout from './pages/payment/Checkout.jsx'
import UniversitySelection from './pages/UniversitySelection.jsx'
import PaymentResult from './pages/payment/PaymentResult.jsx'
import AboutOrganizer from './pages/AboutOrganizer.jsx'

// fyi, all uses of localstorage will be db later EXCEPT for loggedInUser

// oh pls work, pleeeeease

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
      "university": "Harvard", // does not belong to any university. but can choose which university's events to explore
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
      "university": "KFUPM", // cannot belong to any other university
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
      "university": null, // he is prompted upon login to choose which university to administer
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
      "university": "KFUPM", // cannot belong to any other university
      "gender": "male",
      "date-of-birth": "1997-01-01",
    },
    "chicken-tender":
    {
      "first-name": "Tender",
      "last-name": "Person",
      "email": "tender@harvard.edu",
      "phone": "01023456783",
      "password": "Chicken!1111",
      "type": "organizer",
      "university": "Harvard", // cannot belong to any other university
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
      "university": "KFUPM", // cannot belong to any other university
      "gender": "male",
      "date-of-birth": "2004-10-01",
    }
  }

  // dummyUniversities format
  // id is uni name abbreviated, e.g. kfupm, harvard, saud, etc. unique ids ofc
  const initialDummyUniversities = {
  "KFUPM": {
    "name": "King Fahd University of Petroleum and Minerals",
    "logo": "kfupm.png",
    "theme-colors": {
      "primary-color": "#006C35",
      "secondary-color": "#004B23",
      "accent-color": "#FFD700",
      "secondary-accent-color": "#003018",
      "filter-buttons": "#FFD700",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#002E1A"
    }
  },
  "Harvard": {
    "name": "Harvard University",
    "logo": "harvard.png",
    "theme-colors": {
      "primary-color": "#A51C30",
      "secondary-color": "#4A0C15",
      "accent-color": "#C4B7A6",
      "secondary-accent-color": "#7A1A24",
      "filter-buttons": "#A51C30",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#3B0A1E"
    }
  },
  "Saud": {
    "name": "King Saud University",
    "logo": "saud.png",
    "theme-colors": {
      "primary-color": "#004B8D",
      "secondary-color": "#002F5E",
      "accent-color": "#A5C8E1",
      "secondary-accent-color": "#013A73",
      "filter-buttons": "#004B8D",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#001F3B"
    }
  },
  "Manchester": {
    "name": "University of Manchester",
    "logo": "manchester.png",
    "theme-colors": {
      "primary-color": "#6A1B9A",
      "secondary-color": "#4A0F6E",
      "accent-color": "#FFCC00",
      "secondary-accent-color": "#B8860B",
      "filter-buttons": "#6A1B9A",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#3D0D5C"
    }
  },
  "Oxford": {
    "name": "University of Oxford",
    "logo": "oxford.png",
    "theme-colors": {
      "primary-color": "#002147",
      "secondary-color": "#00132B",
      "accent-color": "#A8996E",
      "secondary-accent-color": "#7A6A4A",
      "filter-buttons": "#002147",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#000D1A"
    }
  },
  "Cambridge": {
    "name": "University of Cambridge",
    "logo": "cambridge.png",
    "theme-colors": {
      "primary-color": "#A3C1AD",
      "secondary-color": "#6C8F7A",
      "accent-color": "#D6083B",
      "secondary-accent-color": "#8F062E",
      "filter-buttons": "#A3C1AD",
      "warning-color": "#F54141",
      "success-color": "#46CA48",
      "footer-color": "#4A6350"
    }
  }
  // more can be added by system admins only!
}


  // dummyEvents format
    const initialDummyEvents = {
        1: {
            university: "Harvard",
            img: "group-hiking.png",
            title: "2025 Group Hiking",
            date: "9:30 AM Nov 21, 2025",
            organizer: "chicken-nugget",
            price: 0,
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
        },
    }

    const initialDummyEventsJoined = {
        1: {
            eventId: 1, // just to be clear, event id here
            user: "yo-shayma", // user id
            state: "joined", // state: joined, waitlisted, invited
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
            invitee: "yo-shayma"
        },
    }

  const [loggedInUser, setLoggedInUser] = useState(null); //username only
  const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
  const [part1Data, setPart1Data] = useState({});
  const [selectedUni, setSelectedUni] = useState(null);
  const dummyUsers = useRef({});
  const dummyUniversities = useRef({});
  const dummyEvents = useRef({});
  const dummyEventsJoined = useRef({});
  const [isLoading, setIsLoading] = useState(true);



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

    // dummyEventsJoined
    const emptyDummyEventsJoined = localStorage.getItem("dummyEventsJoined") == "null" || !localStorage.getItem("dummyEventsJoined");
    !emptyDummyEventsJoined && (dummyEventsJoined.current = JSON.parse(localStorage.getItem("dummyEventsJoined")));
    emptyDummyEventsJoined && localStorage.setItem("dummyEventsJoined", JSON.stringify(initialDummyEventsJoined));
    emptyDummyEventsJoined && (dummyEventsJoined.current = initialDummyEventsJoined);

    setSelectedUni(null);

    // testingForceUser("yo-shayma");
    setIsLoading(false);
  }, []);

    useEffect(() => {
    const rootStyle = document.querySelector(':root').style;

    // Take theme of logged in user's uni, or stick to default
    rootStyle.setProperty('--secondary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-color"] : "#1F4C76");
    rootStyle.setProperty('--primary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["primary-color"] : "#1a1a1a");
    rootStyle.setProperty('--accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["accent-color"] : "#FFDF4F");
    rootStyle.setProperty('--secondary-accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-accent-color"] : "#0800FF");
    rootStyle.setProperty('--footer-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["footer-color"] : "#11223B");
    rootStyle.setProperty('--warning-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["warning-color"] : "#F54141");
    rootStyle.setProperty('--success-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["success-color"] : "#46CA48");

    if (loggedInUser && dummyUsers.current[loggedInUser] && 
        dummyUsers.current[loggedInUser].type !== "visitor" && 
        dummyUsers.current[loggedInUser].type !== "system-admin") {
      setSelectedUni(true);
    }
  }, [loggedInUser]);


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

  const assignUni = (university) => {
    if (loggedInUser) {
      dummyUsers.current[loggedInUser].university = university;
      localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers.current));
    }
  }

  // this is a very general function, to avoid repeating code in many places, it is anything and everything related to filtering content
  // this func sets ids only, in a list, unless typeOfFilter is initial, then it is an object
  const filterContent = (typeOfFilter, content, setter, searchFor, searchValue="", filterDetails) => { // we will utalize the fact that js makes unpassed arguments undefined
    // content is the content we will filter
    // searchFor is either university or event or event manager or student
    // typeOfFilter is either search or filterBtn or initial filtering(my-events or all-events)
    // search value is only if typeOfFilter is search
    // filterDetails is only if typeOfFilter is filterBtn or initial filtering(my or all or home)
    if (searchFor === "university") { // there is only one use of this, searching only, no filter, no initial state either
            const filtered = Object.keys(content).filter(uniId => content[uniId]["name"].toLowerCase().includes(searchValue.toLowerCase()) || uniId.toLowerCase().includes(searchValue.toLowerCase()));
            setter(filtered);
    }
    // if events, then search by event name, description, organizer
    if (typeOfFilter === "search" && searchFor === "event") {
        // console.log("HYYY", content)
        // just get the events and joinedevents in content (only for my-events)
          const filtered = Object.keys(content).filter(eventId => content[eventId]["title"].toLowerCase().includes(searchValue.toLowerCase()))
        setter(filtered);
    }
    else if (typeOfFilter === "initial" && searchFor === "event") {
      // console.log("Hi, I am here", filterDetails)
      let results = {};
      console.log("lol", filterDetails)
      console.log("burger", loggedInUser)
      console.log("nugget", filterDetails["list-type"] === "invites-received")
      console.log("taco", content)
      const ids = filterDetails["list-type"] === "all-events"? 
      Object.keys(content).filter(eventId => content[eventId]["university"] === filterDetails["university"])
      : (filterDetails["list-type"] === "my-events"?
      Object.keys(content["eventsJoined"]).filter(eventJoinedId => content["events"][content["eventsJoined"][eventJoinedId]["eventId"]]["university"] === filterDetails["university"] &&
              content["eventsJoined"][eventJoinedId]["user"] === loggedInUser && content["eventsJoined"][eventJoinedId]["state"] !== "invited")
      : (filterDetails["list-type"] === "invites-received"? Object.keys(content["eventsJoined"]).filter(eventJoinedId => content["events"][content["eventsJoined"][eventJoinedId]["eventId"]]["university"] === filterDetails["university"] &&
        content["eventsJoined"][eventJoinedId]["state"] === "invited" &&
        content["eventsJoined"][eventJoinedId]["invitee"] === loggedInUser) // includes uni, this user, invites received
      :(filterDetails["list-type"] === "invites-sent"? Object.keys(content["eventsJoined"]).filter(eventJoinedId => content["events"][content["eventsJoined"][eventJoinedId]["eventId"]]["university"] === filterDetails["university"] &&
        content["eventsJoined"][eventJoinedId]["state"] === "invited" &&
        content["eventsJoined"][eventJoinedId]["user"] === loggedInUser)
        :[])));
      console.log("IDs:", ids)
      for (let id of ids) {
        results[id] = filterDetails["list-type"] === "all-events"? content[id]: content["events"][content["eventsJoined"][id]["eventId"]];
      }
      // console.log("results:", results)
      setter.current = results
      // console.log("setter", setter)
      // console.log("content", filterDetails, content)
    }
  }

  // testing methods

  const testingForceUser = (username) => {
    setLoggedInUser(username);
    localStorage.setItem("loggedInUser", username);
  }

  const [successfulPayment, setSuccessfulPayment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [organizerViewing, setOrganizerViewing] = useState(null); // use it later in home, event, my-events, all-events

  return (
    <>
      <Nav type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"} userName={loggedInUser? dummyUsers.current[loggedInUser]["first-name"]: ""} setLoggedInUser={setLoggedInUser}/>
      {isLoading && <h1 className='m-15 text-5xl self-center absolute h-[100vh]'>Loading...</h1>}
      {!isLoading &&
      <Routes>
        <Route path="/home" element={!loggedInUser?<DummyUserHome/>: (selectedUni? <UserHome setWaitlistModalOpen={setWaitlistModalOpen} waitlistModalOpen={waitlistModalOpen} setWaitlistSuccess={setWaitlistSuccess} waitlistSuccess={waitlistSuccess} setIsPurchasing={setIsPurchasing} filterContent={filterContent} uni={dummyUsers.current[loggedInUser].university} user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current} eventsJoined={dummyEventsJoined.current} /> : <Navigate to="/university-selection" />)}/> {/* main home page for not logged in users */}
        <Route path="/university-selection" element={loggedInUser? ((dummyUsers.current[loggedInUser].type === "visitor" || dummyUsers.current[loggedInUser].type === "system-admin")? <UniversitySelection filterContent={filterContent} universities={dummyUniversities.current} assignUni={assignUni} setSelectedUni={setSelectedUni}/> : <Navigate to="/home" />): <Navigate to="/log-in" />}/>
        <Route path="/log-in" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"log-in"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} setLoggedInUser={setLoggedInUser} getUsernameFromEmail={getUsernameFromEmail}/>}/>
        <Route path="/sign-up" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"sign-up"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} checkIfPhoneExists={checkIfPhoneExists} setFinishedPart1SignUp={setFinishedPart1SignUp} setPart1Data={setPart1Data}/>}/>
        <Route path="/sign-up-2" element={loggedInUser? <Navigate to={`/home`}/> : finishedPart1SignUp?<SignupLogin option={"sign-up-part-2"} setLoggedInUser={setLoggedInUser} checkIfUsernameExists={checkIfUsernameExists} addNewUser={addNewUser} part1Data={part1Data}/> : <Navigate to="/sign-up" />}/>
        <Route path="/my-events" element={loggedInUser?<MyEvents setWaitlistModalOpen={setWaitlistModalOpen} waitlistModalOpen={waitlistModalOpen} waitlistSuccess={waitlistSuccess}  setWaitlistSuccess={setWaitlistSuccess} setIsPurchasing={setIsPurchasing} filterContent={filterContent} user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current} eventsJoined={dummyEventsJoined.current} uni={dummyUsers.current[loggedInUser].university}/>: <Navigate to="/log-in" />} />
        <Route path="/events" element={loggedInUser?<AllEvents setWaitlistModalOpen={setWaitlistModalOpen} waitlistModalOpen={waitlistModalOpen} waitlistSuccess={waitlistSuccess} setWaitlistSuccess={setWaitlistSuccess} setIsPurchasing={setIsPurchasing} filterContent={filterContent} user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current} uni={dummyUsers.current[loggedInUser].university}/>: <Navigate to="/log-in" />} />
        <Route path="/checkout" element={!loggedInUser?<Navigate to="/log-in"/>: (!isPurchasing? <Navigate to="/home"/>: <Checkout setSuccess={setSuccessfulPayment} setProcessing={setProcessingPayment}/>)} />
        <Route path="/payment-outcome" element={processingPayment? <PaymentResult success={successfulPayment}/>: <Navigate to="/home" />} />
        <Route path="/about-organizer" element={!loggedInUser? <Navigate to="/log-in"/>: <AboutOrganizer organizer={"chicken-tender"} users={dummyUsers.current} events={dummyEvents.current} userType={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"} />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={loggedInUser? <h1 className='m-10 text-5xl font-bold text-[var(--primary-color)] h-[100vh]'>404 - Page Not Found {":)"}</h1> : <Navigate to="/log-in" />}/>
      </Routes>
      }
      <Footer type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"}/>
    </>
  )
}

export default App
//1