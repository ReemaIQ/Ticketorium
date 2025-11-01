// Font Awesome Setup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useState } from 'react'

library.add(fas, far, fab)

import "./signup_login.css"; 

import validator from "validator";
import SignupInputsList from "../../components/signup_login/signup_inputs_list/SignupInputsList";
import rightArrow from "../../assets/images/signup/right_arrow.svg";
import { NavLink, useNavigate } from 'react-router-dom';


// Options based on props


const options = {
    "log-in": {
        "title": "Log in",
        "buttonText": "Log in",
        "linkText": "New visitor?",
        "anchorText": "Sign up",
        "linkPath": "/sign-up",
    },
    "sign-up": {
        "title": "Sign Up",
        "buttonText": "Sign up",
        "linkText": "Already a user?",
        "anchorText": "Log in",
        "linkPath": "/log-in",
    },
    "sign-up-part-2": {
        "title": "Tell us more :)",
        "buttonText": "Create Account",
        "linkText": null,
        "linkPath": null,
    },
};
        

// Component


function SignupLogin(props) {

    const navigate = useNavigate();

    const [option, setOption] = useState(props.option); // "log-in", "sign-up", "signup-part-2"
    const [errors, setErrors] = useState({}); // empty {} or object of errors
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    // inputs and updater functions to pass to SignupInputsList component
    const inputsAndSetters = {
        "email-or-username": [emailOrUsername, setEmailOrUsername],
        "email": [email, setEmail],
        "password": [password, setPassword],
        "confirm-password": [confirmPassword, setConfirmPassword],
        "phone-number": [phoneNumber, setPhoneNumber],
        "first-name": [firstName, setFirstName],
        "last-name": [lastName, setLastName],
        "username": [username, setUsername],
        "gender": [gender, setGender],
        "date-of-birth": [dateOfBirth, setDateOfBirth],
    }

    useEffect(() => {
        setOption(props.option);
        setErrors({});
    }, [props.option])

    const handleSubmit = (e, option) => {
    e.preventDefault()
    let errorsFound = {} // This is then passed into setErrors()

    // depending on option, redirect to different pages
    if (option == "sign-up") {
         console.log(email);
        // email field
        if (!email) {
            errorsFound["email"] = "Please enter your email"
        }
        else if (!validator.isEmail(email)) {
            errorsFound["email"] = "Please enter a valid email"
        }
        else if (props.checkIfEmailExists(email)) {
            errorsFound["email"] = "An account with this email already exists"
        }
        // phone number field
        if (!phoneNumber) {
            errorsFound["phone-number"] = "Please enter your phone number"
        }
        else if (!validator.isMobilePhone(phoneNumber)) {
            errorsFound["phone-number"] = "Please enter a valid phone number"
        }
        else if (props.checkIfPhoneExists(phoneNumber)) {
            errorsFound["phone-number"] = "An account with this phone number already exists"
        }
        // password field
        if (!password) {
            errorsFound["password"] = "Please enter your password"
        }
        else if (!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
            errorsFound["password"] = "Password is too weak. It should be at least 8 characters long and include a mix of letters, numbers, and special characters."
        }
        // confirm password field
        if (!confirmPassword) {
            errorsFound["confirm-password"] = "Please confirm your password"
        }
        else if (password !== confirmPassword) {
            errorsFound["confirm-password"] = "Passwords do not match"
        }

        if (Object.keys(errorsFound).length > 0) {
            console.log("Errors found:", errorsFound)
            setErrors(errorsFound)
            return
        }
        props.setPart1Data({
            "email": email,
            "phone-number": phoneNumber,
            "password": password,
        });
        props.setFinishedPart1SignUp(true);
        navigate("/sign-up-2");
    }
        
    else if (option == "log-in") {
        const isUsername = !(/[^a-zA-Z0-9._-]/.test(emailOrUsername))  // This checks if the input is an username or email
        // email or username field
        if (!emailOrUsername) {
            console.log("bruh", emailOrUsername)
            errorsFound["email-or-username"] = "Please enter your email or username"
        }
        // first check format
        else if (isUsername && !props.checkIfUsernameExists(emailOrUsername)) {
            errorsFound["email-or-username"] = "There is no user with this username"
        }
        else if (!isUsername && !validator.isEmail(emailOrUsername)) {
            errorsFound["email-or-username"] = "Please enter a valid email address"
        }
        else if (!isUsername &&!props.checkIfEmailExists(emailOrUsername)) {
            errorsFound["email-or-username"] = "There is no user with this email"
        }

        // password field
        if (!password) {
            errorsFound["password"] = "Please enter your password"
        }
        // check if password is strong enough
        else if (!validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
            errorsFound["password"] = "Password is too weak. It should be at least 8 characters long and include a mix of letters, numbers, and special characters."
        }
        else if (isUsername && !props.checkUsernamePassword(emailOrUsername, password)) {
            errorsFound["password"] = "Incorrect password for this username"
        }
        else if (!isUsername && !props.checkEmailPassword(emailOrUsername, password)) {
            errorsFound["password"] = "Incorrect password for this email"
        }


        if (Object.keys(errorsFound).length > 0) {
            console.log("Errors found:", errorsFound)
            setErrors(errorsFound)
            return
        }

        // no errors, log in user, direct to home
        if (isUsername)
            props.setLoggedInUser(() =>emailOrUsername);
        else
            props.setLoggedInUser(() => props.getUsernameFromEmail(emailOrUsername));
        navigate("/home");
        localStorage.setItem("loggedInUser", emailOrUsername);
        
    }
    
    else if (option == "sign-up-part-2") {
        console.log(email)
        // username field
        if (!username) {
            errorsFound["username"] = "Please enter your username"
        }
        else if (/[^a-zA-Z0-9._-]/g.test(username)) {
            errorsFound["username"] = "Username can only contain letters, numbers, dots, underscores, and hyphens"
        }
        else if (username.length < 3 || username.length > 12) {
            errorsFound["username"] = "Username must be between 3 and 12 characters long"
        }
        else if (props.checkIfUsernameExists(username)) {
            errorsFound["username"] = "This username is already taken"
        }

        // first name field
        if (!firstName) {
            errorsFound["first-name"] = "Please enter your first name"
        }
        else if (validator.isAlpha(firstName) == false) {
            errorsFound["first-name"] = "First name can only contain letters"
        }
        // last name field
        if (!lastName) {
            errorsFound["last-name"] = "Please enter your last name"
        }
        else if (validator.isAlpha(lastName) == false) {
            errorsFound["last-name"] = "Last name can only contain letters"
        }
        // gender field
        if (!gender) {
            errorsFound["gender"] = "Please select your gender"
        }
        // date of birth field
        if (!dateOfBirth) {
            errorsFound["date-of-birth"] = "Please enter your date of birth"
        } 

        if (Object.keys(errorsFound).length > 0) {
            console.log("Errors found:", errorsFound)
            setErrors(errorsFound)
            return
        }

        // no errors, create account, direct to home
        props.addNewUser({
            "first-name": firstName,
            "last-name": lastName,
            "email": props.part1Data["email"],
            "phone-number": props.part1Data["phone-number"],
            "password": props.part1Data["password"],
            "username": username,
            "type": "visitor",
            "gender": gender,
            "date-of-birth": dateOfBirth,
            "university": "kfupm" // come back here
        })
        props.setLoggedInUser(() => username);
        localStorage.setItem("loggedInUser", username);
        navigate("/home");
    }




    // empty input fields
    setEmailOrUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setGender("");
    setDateOfBirth("");
}

    return (
    <form onSubmit={(e) => handleSubmit(e, props.option)}>
        <div className="width-full h-full flex flex-col gap-10 m-16">

            {/* Header: Log in or Sign Up */}
            <h1 className="text-[60px] font-[Epilogue-Black]">{options[option]["title"]}</h1>

            {/* List of all inputs, depends if page is login, signup part 1 or 2 */}
            <SignupInputsList option={option} errors={errors} inputsAndSetters={inputsAndSetters} />

            {/* Link to sign up or log in */}
            {options[option]["linkText"] && (
                <div className="text-[20px] font-[gilroy-medium] flex gap-2">
                    <span className="text-[var(--primary-color)]">{options[option]["linkText"]}</span> 
                    <NavLink to={options[option]["linkPath"]} end className="text-[var(--bright-blue-color)] cursor-pointer">{options[option]["anchorText"]}</NavLink>
                </div>
            )}

            {/* Login or Sign up button */}
            <button type="submit" className="bg-[var(--accent-color)] text-[var(--primary-color)] text-[32px] font-[DM-Sans-ExtraLight] font-extralight py-2 px-6 rounded h-[74px] w-[399px] flex items-center justify-between gap-4 cursor-pointer">
                <span>{options[option]["buttonText"]}</span>
                <img src={rightArrow} alt='arrow' />
            </button>

            {/* Decoration - Tilted Div */}
            <div className="absolute bg-[#1F4C76] rotate-[13.21deg] h-[1200px] w-[576.1037586593156px] top-[-30px] right-[-300px] object-contain"></div>
        </div>
    </form>
    )
}

export default SignupLogin;
