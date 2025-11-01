import SignupInput from "../signup_input/SignupInput";

const options = {
    "log-in": ["email-or-username", "password"],
    "sign-up": ["email", "phone-number", "password", "confirm-password"],
    "sign-up-part-2": ["username", "first-name", "last-name", "gender", "date-of-birth"],
};

function SignupInputsList(props) {

    return (
        <div className="flex flex-col gap-1">
            {options[props.option].map((inputOption) => (
                <SignupInput key={inputOption} inputOption={inputOption} errorTxt={props.errors[inputOption]} valAndSetter={props.inputsAndSetters[inputOption]} />
            ))}
        </div>
    )
}

export default SignupInputsList;