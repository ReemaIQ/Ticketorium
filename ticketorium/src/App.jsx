import Nav from './components/nav/nav.jsx'
import Footer from './components/footer/footer.jsx'
import SignupLogin from './pages/signup_login/signup_login.jsx'
import {Route, Routes, Navigate} from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import DummyUserHome from './pages/DummyUserHome.jsx'
import UserHome from './pages/user_home/UserHome.jsx'
import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import EventPage from "./pages/event_details/event_page.jsx";
import OrganizerHomePage from "./pages/home/Organizer.jsx" //r
import OrganizerAnalyticsPage from "./pages/organizer/organizer_analytics_page.jsx"; //r


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
            state: "not-joined",
            img: "game-dev.png",
            title: "2025 GameDev Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 19.99,
        },

        3: {
            state: "waitlist",
            img: "spelling-bee.png",
            title: "2025 Spelling Bee",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
        },

        4: {
            state: "waitlisted",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 19.99,
        },

        5: {
            state: "invited",
            img: "game-dev.png",
            title: "2025 Coding Competition",
            date: "Nov 21, 2025",
            organizer: "CS Department",
            price: 0,
            inviter: "Student"
        },

        6: {
            state: "graduation",
            img: "graduation.png",
            title: "2025 Graduation Ceremony",
            date: "March 6, 2026",
            organizer: "Harvard",
            price: 0,
        }
    }

  const [loggedInUser, setLoggedInUser] = useState(null); //username only
  const [finishedPart1SignUp, setFinishedPart1SignUp] = useState(false);
  const [part1Data, setPart1Data] = useState({});
  const dummyUsers = useRef({});
  const dummyUniversities = useRef({});
  const dummyEvents = useRef({});

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

    console.log("Dummy Users:", dummyUsers.current);
    console.log("Dummy Universities:", dummyUniversities.current);
    console.log("Dummy Events:", dummyEvents.current, localStorage.getItem("dummyEvents"));
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
      <Nav type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"} userName={loggedInUser? dummyUsers.current[loggedInUser]["first-name"]: ""} setLoggedInUser={setLoggedInUser}/>
      <Routes>

          <Route path="/home"
              element={
                  !loggedInUser ? (
                      <DummyUserHome /> //reema: not logged in to dummy landing home
                  ) : dummyUsers.current[loggedInUser]["type"] === "organizer" ? (
                      <OrganizerHomePage /> //reema: organizer page
                  ) : (
                      <UserHome
                          user={loggedInUser}
                          users={dummyUsers.current}
                          universities={dummyUniversities.current}
                          events={dummyEvents.current}
                      />
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

          <Route //r
              path="/organizer/analytics"
              element={
                  !loggedInUser ? (
                      <Navigate to="/log-in" />
                  ) : dummyUsers.current[loggedInUser]["type"] !== "organizer" ? (
                      <Navigate to="/home" />
                  ) : (
                      <OrganizerAnalyticsPage />
                  )
              }
          />

          <Route path="*" element={loggedInUser? <h1 className='m-10 text-5xl font-bold text-[var(--secondary-color)] h-[100vh]'>404 - Page Not Found {":)"}</h1> : <Navigate to="/log-in" />}/>
      </Routes>
      <Footer type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"}/>
    </>
  )
}

export default App
