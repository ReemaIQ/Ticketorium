import Nav from './components/nav/nav.jsx'
import Footer from './components/footer/footer.jsx'
import SignupLogin from './pages/signup_login/signup_login.jsx'
import {Route, Routes, Navigate} from 'react-router-dom'
import { useEffect, useState, useRef, use } from 'react'
import DummyUserHome from './pages/DummyUserHome.jsx'
import UserHome from './pages/user_home/UserHome.jsx'
import AllEvents from "./pages/AllEvents.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import UniversitySelection from './pages/UniversitySelection.jsx'

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
    "logo": "kfupm.png",
    "theme-colors": {
      "primary-color": "#006C35",
      "secondary-color": "#004B23",
      "accent-color": "#FFD700",
      "secondary-accent-color": "#003018",
      "filter-buttons": "#FFD700",
      "warning-color": "#FFD700",
      "footer-color": "#002E1A"
    }
  },
  "harvard": {
    "name": "Harvard University",
    "logo": "harvard.png",
    "theme-colors": {
      "primary-color": "#A51C30",
      "secondary-color": "#4A0C15",
      "accent-color": "#C4B7A6",
      "secondary-accent-color": "#7A1A24",
      "filter-buttons": "#A51C30",
      "warning-color": "#A51C30",
      "footer-color": "#3B0A1E"
    }
  },
  "saud": {
    "name": "King Saud University",
    "logo": "saud.png",
    "theme-colors": {
      "primary-color": "#004B8D",
      "secondary-color": "#002F5E",
      "accent-color": "#A5C8E1",
      "secondary-accent-color": "#013A73",
      "filter-buttons": "#004B8D",
      "warning-color": "#004B8D",
      "footer-color": "#001F3B"
    }
  },
  "manchester": {
    "name": "University of Manchester",
    "logo": "manchester.png",
    "theme-colors": {
      "primary-color": "#6A1B9A",
      "secondary-color": "#4A0F6E",
      "accent-color": "#FFCC00",
      "secondary-accent-color": "#B8860B",
      "filter-buttons": "#6A1B9A",
      "warning-color": "#FFCC00",
      "footer-color": "#3D0D5C"
    }
  },
  "oxford": {
    "name": "University of Oxford",
    "logo": "oxford.png",
    "theme-colors": {
      "primary-color": "#002147",
      "secondary-color": "#00132B",
      "accent-color": "#A8996E",
      "secondary-accent-color": "#7A6A4A",
      "filter-buttons": "#002147",
      "warning-color": "#A8996E",
      "footer-color": "#000D1A"
    }
  },
  "cambridge": {
    "name": "University of Cambridge",
    "logo": "cambridge.png",
    "theme-colors": {
      "primary-color": "#A3C1AD",
      "secondary-color": "#6C8F7A",
      "accent-color": "#D6083B",
      "secondary-accent-color": "#8F062E",
      "filter-buttons": "#A3C1AD",
      "warning-color": "#D6083B",
      "footer-color": "#4A6350"
    }
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
  const [choseUni, setChoseUni] = useState(false);
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

    // testingForceUser("yo-shayma");

  }, []);

  useEffect(() => {
    const rootStyle = document.querySelector(':root').style;

    // Take theme of logged in user's uni, or stick to default
    rootStyle.setProperty('--secondary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-color"] : "#1F4C76");
    rootStyle.setProperty('--primary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["primary-color"] : "#1a1a1a");
    rootStyle.setProperty('--accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["accent-color"] : "#FFDF4F");
    rootStyle.setProperty('--secondary-accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-accent-color"] : "#0800FF");
    rootStyle.setProperty('--footer-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["footer-color"] : "#11223B");
    rootStyle.setProperty('--filter-buttons', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["filter-buttons"] : "oklch(49.6% 0.265 301.924)");
    rootStyle.setProperty('--warning-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["warning-color"] : "#F54141");
    console.log("Current user university:", (loggedInUser && dummyUsers.current[loggedInUser]["university"])? dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]: "No user logged in");
  }, [choseUni]);

    useEffect(() => {
    const rootStyle = document.querySelector(':root').style;

    // Take theme of logged in user's uni, or stick to default
    rootStyle.setProperty('--secondary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-color"] : "#1F4C76");
    rootStyle.setProperty('--primary-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["primary-color"] : "#1a1a1a");
    rootStyle.setProperty('--accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["accent-color"] : "#FFDF4F");
    rootStyle.setProperty('--secondary-accent-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["secondary-accent-color"] : "#0800FF");
    rootStyle.setProperty('--footer-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["footer-color"] : "#11223B");
    rootStyle.setProperty('--filter-buttons', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["filter-buttons"] : "oklch(49.6% 0.265 301.924)");
    rootStyle.setProperty('--warning-color', (loggedInUser && dummyUsers.current[loggedInUser]["university"])?dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]["warning-color"] : "#F54141");
    console.log("Current user university:", (loggedInUser && dummyUsers.current[loggedInUser]["university"])? dummyUniversities.current[dummyUsers.current[loggedInUser]["university"]]["theme-colors"]: "No user logged in");
  });

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

  // testing methods

  const testingForceUser = (username) => {
    setLoggedInUser(username);
    localStorage.setItem("loggedInUser", username);
  }

  return (
    <>
      <Nav type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"} userName={loggedInUser? dummyUsers.current[loggedInUser]["first-name"]: ""} setLoggedInUser={setLoggedInUser}/>
      <Routes>
        <Route path="/home" element={!loggedInUser?<DummyUserHome/>: (dummyUsers.current[loggedInUser]["university"]? <UserHome user={loggedInUser} users={dummyUsers.current} universities={dummyUniversities.current} events={dummyEvents.current}/> : <Navigate to="/university-selection" />)}/> {/* main home page for not logged in users */}
        <Route path="/university-selection" element={loggedInUser? ((dummyUsers.current[loggedInUser].type === "visitor" || dummyUsers.current[loggedInUser].type === "system-admin")? <UniversitySelection universities={dummyUniversities.current} assignUni={assignUni} setChoseUni={setChoseUni}/> : <Navigate to="/home" />): <Navigate to="/log-in" />}/>
        <Route path="/log-in" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"log-in"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} setLoggedInUser={setLoggedInUser} getUsernameFromEmail={getUsernameFromEmail}/>}/>
        <Route path="/sign-up" element={loggedInUser? <Navigate to={`/home`}/> : <SignupLogin option={"sign-up"} checkIfEmailExists={checkIfEmailExists} checkIfUsernameExists={checkIfUsernameExists} checkUsernamePassword={checkUsernamePassword} checkEmailPassword={checkEmailPassword} checkIfPhoneExists={checkIfPhoneExists} setFinishedPart1SignUp={setFinishedPart1SignUp} setPart1Data={setPart1Data}/>}/>
        <Route path="/sign-up-2" element={loggedInUser? <Navigate to={`/home`}/> : finishedPart1SignUp?<SignupLogin option={"sign-up-part-2"} setLoggedInUser={setLoggedInUser} checkIfUsernameExists={checkIfUsernameExists} addNewUser={addNewUser} part1Data={part1Data}/> : <Navigate to="/sign-up" />}/>

        <Route path="/my-events" element={<MyEvents user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current}/>} />
        <Route path="/events" element={<AllEvents user={loggedInUser} users={dummyUsers.current} events={dummyEvents.current} />} />
        <Route path="*" element={loggedInUser? <h1 className='m-10 text-5xl font-bold text-[var(--secondary-color)] h-[100vh]'>404 - Page Not Found {":)"}</h1> : <Navigate to="/log-in" />}/>
      </Routes>
      <Footer type={loggedInUser? dummyUsers.current[loggedInUser]["type"]: "empty"}/>
    </>
  )
}

export default App
