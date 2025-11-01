// Font Awesome Setup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useState, useEffect } from 'react'
import DropdownPopup from '../../dropdown_popup/DropdownPopup'

library.add(fas, far, fab)


// Options based on props

// const [inputOption, setInputOption] = useState("");

const inputOptions = {
    "email-or-username": {
        type: "text",
        placeholder: "Email or Username",
        icon: "fa-solid fa-circle-user",
    },
    "email": {
        type: "email",
        placeholder: "Email",
        icon: "fa-solid fa-envelope",
    },
    "password": {
        type: "password",
        placeholder: "Password",
        icon: "fa-solid fa-key",
    },
    "phone-number": {
        type: "tel",
        placeholder: "Phone Number",
        icon: "fa-solid fa-phone",
    },
    "confirm-password": {
        type: "password",
        placeholder: "Confirm Password",
        icon: "fa-solid fa-key",
    },
    "username": {
        type: "text",
        placeholder: "Username",
        icon: "fa-solid fa-user",
    },
    "first-name": {
        type: "text",
        placeholder: "First Name",
        icon: "fa-solid fa-id-badge",
    },
    "last-name": {
        type: "text",
        placeholder: "Last Name",
        icon: "fa-solid fa-id-badge",
    },
    "gender": {
        type: "dropdown",
        placeholder: "Gender",
        icon: "fa-solid fa-venus-mars",
    },
    "date-of-birth": {
        type: "date",
        placeholder: "Date of Birth",
        icon: "fa-solid fa-cake-candles",
    }
}


// Component

function SignupInput(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [error, setError] = useState(props.errorTxt);

    useEffect(() => {
        setError(props.errorTxt);
    }, [props.errorTxt]);

    const handleDropdownClick = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const handleDropdownOptionClick = (option) => { 
        setSelectedOption(option);
        props.valAndSetter[1](option);
    }


    return (
        <div className='w-[524px]'>
        {props.inputOption === "gender" && 
        <div onClick={handleDropdownClick} className="cursor-pointer">
        <div className="relative w-[524px] h-[60px]">
            <div className="p-5 pl-13 border-b-2 border-[rgba(0,0,0,0.2)] w-full h-full">
            </div>
            <FontAwesomeIcon
                icon={inputOptions[props.inputOption]["icon"]}
                className="absolute left-2 top-7 -translate-y-1/2 text-[rgba(0,0,0,0.2)] text-2xl"
            />
            {selectedOption && (
                <span className='absolute left-[54px] top-3 text-[var(--primary-color)] text-[22px] font-[gilroy-medium] select-none'>{selectedOption}</span>
            )}
            {!selectedOption &&
            <span className='absolute left-[54px] top-3 text-[rgba(0,0,0,0.2)] text-[22px] font-[gilroy-medium] select-none'>Select Your Gender</span>
        }
            <FontAwesomeIcon
                icon={"fa-solid fa-caret-down"}
                className="absolute left-[490px] top-7 -translate-y-1/2 text-[rgba(0,0,0,0.2)] text-2xl"
            />
        </div>
        <DropdownPopup onOptionClick={handleDropdownOptionClick} isOpen={dropdownOpen} />
        </div>
        }  

        {props.inputOption !== "gender" &&
            <div className="relative w-[524px] h-[60px]">
                <input
                onChange={(event) => props.valAndSetter[1](event.target.value)}
                type={inputOptions[props.inputOption]["type"]}
                placeholder={inputOptions[props.inputOption]["placeholder"]}
                value={props.valAndSetter[0]}
                className={`p-5 pl-13 border-b-2 ${error? "border-[var(--warning-color)]": "border-[rgba(0,0,0,0.2)]"} text-[22px] text-[var(--primary-color)] font-[gilroy-medium] placeholder-[rgba(0,0,0,0.2)] w-full h-full`}
                />
                <FontAwesomeIcon
                icon={inputOptions[props.inputOption]["icon"]}
                className="absolute left-2 top-7 -translate-y-1/2 text-[rgba(0,0,0,0.2)] text-2xl"
                />
            </div>
        }
        {/* Error text for this particular input field */}
        <div className="text-[var(--warning-color)] mt-1 font-[gilroy-medium] text-[16px] h-[24px]">{error? error : ""}</div>
        </div>

    )
}

export default SignupInput;