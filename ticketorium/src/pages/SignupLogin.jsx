import validator from "validator";
import SignupInputsList from "../components/signup_login/signup_inputs_list/SignupInputsList.jsx";
import rightArrow from "../assets/images/signup/right_arrow.svg";
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'

// Font Awesome Setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

// Configuration
const BASE_URL = "http://localhost:4000/api";

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

function SignupLogin(props) {
    const navigate = useNavigate();

    const [option, setOption] = useState(props.option);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // New Loading State

    // Form States
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

    const handleSubmit = async (e, option) => {
        e.preventDefault();
        
        // Prevent double submission
        if(isLoading) return;

        let errorsFound = {};
        setIsLoading(true); // Start loading

        try {
            // ==========================================
            // OPTION: SIGN UP (PART 1)
            // ==========================================
            if (option === "sign-up") {
                // Email Validation
                if (!email) {
                    errorsFound["email"] = "Please enter your email";
                } else if (!validator.isEmail(email)) {
                    errorsFound["email"] = "Please enter a valid email";
                }

                // Async Email Check
                if (!errorsFound["email"]) {
                    try {
                        const response = await fetch(`${BASE_URL}/users/email-exists/${encodeURIComponent(email)}`);
                        const data = await response.json();
                        if (data["exists"]) {
                            errorsFound["email"] = "An account with this email already exists";
                        }
                    } catch (err) {
                        console.error("API Error checking email", err);
                        errorsFound["email"] = "Unable to verify email at this time";
                    }
                }

                // Phone Validation
                if (!phoneNumber) {
                    errorsFound["phone-number"] = "Please enter your phone number";
                } else if (!validator.isMobilePhone(phoneNumber)) {
                    errorsFound["phone-number"] = "Please enter a valid phone number";
                }

                // Password Validation
                if (!password) {
                    errorsFound["password"] = "Please enter your password";
                } else if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                    errorsFound["password"] = "Password must be 8+ chars, with letters, numbers, and symbols.";
                }

                // Confirm Password
                if (!confirmPassword) {
                    errorsFound["confirm-password"] = "Please confirm your password";
                } else if (password !== confirmPassword) {
                    errorsFound["confirm-password"] = "Passwords do not match";
                }

                // Final Check for Part 1
                if (Object.keys(errorsFound).length > 0) {
                    setErrors(errorsFound);
                    setIsLoading(false);
                    return;
                }

                // Success Part 1
                props.setPart1Data({
                    "email": email,
                    "phone-number": phoneNumber,
                    "password": password,
                });
                props.setFinishedPart1SignUp(true);
                navigate("/sign-up-2");
            }

            // ==========================================
            // OPTION: LOG IN
            // ==========================================
            else if (option === "log-in") {
                const isUsername = !(/[^a-zA-Z0-9._-]/.test(emailOrUsername));

                if (!emailOrUsername) {
                    errorsFound["email-or-username"] = "Please enter your email or username";
                } else if (!isUsername && !validator.isEmail(emailOrUsername)) {
                    errorsFound["email-or-username"] = "Please enter a valid email address";
                }

                if (!password) {
                    errorsFound["password"] = "Please enter your password";
                }

                if (Object.keys(errorsFound).length > 0) {
                    setErrors(errorsFound);
                    setIsLoading(false);
                    return;
                }

                // Prepare Payload
                let jsonPayload = { "password": password };
                if (isUsername) jsonPayload["username"] = emailOrUsername;
                else jsonPayload["email"] = emailOrUsername;

                const response = await fetch(`${BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jsonPayload),
                });

                const data = await response.json();

                if (response.status !== 200) {
                    // Combine errors to be safe or specific based on backend response
                    errorsFound["email-or-username"] = "Incorrect credentials"; 
                    errorsFound["password"] = "Incorrect credentials";
                    setErrors(errorsFound);
                } else {
                    localStorage.setItem("token", data["token"]);
                    navigate("/home");
                }
            }

            // ==========================================
            // OPTION: SIGN UP (PART 2)
            // ==========================================
            else if (option === "sign-up-part-2") {
                // Validate Username
                if (!username) {
                    errorsFound["username"] = "Please enter your username";
                } else if (/[^a-zA-Z0-9._-]/.test(username)) {
                    errorsFound["username"] = "Letters, numbers, dots, underscores, hyphens only";
                } else if (username.length < 3 || username.length > 12) {
                    errorsFound["username"] = "Username must be 3-12 characters";
                }

                // Async Username Check
                if (!errorsFound["username"]) {
                    try {
                        const response = await fetch(`${BASE_URL}/users/username-exists/${encodeURIComponent(username)}`);
                        const data = await response.json();
                        if (data["exists"]) {
                            errorsFound["username"] = "This username is already taken";
                        }
                    } catch (err) {
                        console.error("API Error checking username", err);
                    }
                }

                // Personal Info Validation
                if (!firstName) errorsFound["first-name"] = "Please enter your first name";
                else if (!validator.isAlpha(firstName)) errorsFound["first-name"] = "Letters only";

                if (!lastName) errorsFound["last-name"] = "Please enter your last name";
                else if (!validator.isAlpha(lastName)) errorsFound["last-name"] = "Letters only";

                if (!gender) errorsFound["gender"] = "Please select your gender";
                if (!dateOfBirth) errorsFound["date-of-birth"] = "Please enter your date of birth";

                // Final Check for Part 2
                if (Object.keys(errorsFound).length > 0) {
                    setErrors(errorsFound);
                    setIsLoading(false);
                    return;
                }

                // Create Account
                const payload = {
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": props.part1Data ? props.part1Data["email"] : "", // Safety check
                    "phoneNumber": props.part1Data ? props.part1Data["phone-number"] : "",
                    "password": props.part1Data ? props.part1Data["password"] : "",
                    "username": username,
                    "type": "visitor",
                    "gender": gender.toLowerCase(),
                    "dateOfBirth": dateOfBirth,
                    "university": undefined
                };

                const response = await fetch(`${BASE_URL}/users/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const token = await response.json();

                if (response.status !== 200) {
                    alert("Error creating account: " + (token.message || "Please try again"));
                } else {
                    localStorage.setItem("token", token["token"]);
                    navigate("/home");
                }
            }

        } catch (error) {
            console.error("Critical Error in HandleSubmit:", error);
            alert("A network error occurred. Is the server running?");
        } finally {
            setIsLoading(false); // Stop loading regardless of success/fail
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, props.option)} className='flex justify-center xl:justify-start items-center mb-[20vh]'>
            <div className="width-full h-full flex flex-col gap-10 m-16">

                {/* Header */}
                <h1 className="text-[50px] sm:text-[60px] font-[Epilogue-Black]">{options[option]["title"]}</h1>

                {/* Inputs */}
                <SignupInputsList option={option} errors={errors} inputsAndSetters={inputsAndSetters} />

                {/* Links */}
                {options[option]["linkText"] && (
                    <div className="text-[20px] font-[gilroy-medium] flex gap-2">
                        <span className="text-[var(--primary-color)]">{options[option]["linkText"]}</span>
                        <NavLink to={options[option]["linkPath"]} end className="text-[var(--secondary-accent-color)] cursor-pointer">
                            {options[option]["anchorText"]}
                        </NavLink>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`bg-[var(--accent-color)] text-[var(--primary-color)] text-[32px] font-[DM-Sans-ExtraLight] font-extralight py-2 px-6 rounded h-[74px] w-[399px] flex items-center justify-between gap-4 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    <span>{isLoading ? "Processing..." : options[option]["buttonText"]}</span>
                    {!isLoading && <img src={rightArrow} alt='arrow' />}
                </button>

            </div>
        </form>
    )
}

export default SignupLogin;