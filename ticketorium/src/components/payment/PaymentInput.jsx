function PaymentInput (props) {
const inputOptions = {
    "name-on-card": {
        placeholder: "Enter name on card",
        label: "Name on Card",
        maxLength: 32
    },
    "card-number": {
        placeholder: "Enter card number",
        label: "Card Number",
        maxLength: props.cardType === "amex" ? 17 : 19 // 16 digits + 3 spaces
    },
    "expiry-date": {
        placeholder: "MM/YY",
        label: "Expiration Date",
        maxLength: 5
    },
    "cvv": {
        placeholder: "CVV",
        label: "Security Code",
        maxLength: 3
    },
}

const cardTypes = {
    "visa": {
        "logo": "visa.svg",
        "styling": "absolute left-[6px] h-8 top-[-1px]"
    },
    "mastercard": {
        "logo": "mc.svg",
        "styling": "absolute left-[8px] h-[1.1em] top-[6px]"
    },
    "amex": {
        "logo": "amex.svg",
        "styling": "absolute left-[0] h-[3.2em] top-[-9px]"
    }
}
    return (
        <div className="flex flex-col w-full gap-2">
        <label htmlFor={props.option} className="text-[var(--primary-color)] font-[Gilroy-Medium]">{inputOptions[props.option].label}</label>
        <div className="relative w-full flex">
            {props.option === "card-number" && 
                <div className={`absolute left-3 top-[26%] h-8 w-12 ${props.cardType !== "amex"? "border-[1.5px]": ""} border-[rgba(0,0,0,0.3)] rounded-sm`}>
                    {props.cardType !== "unknown" && <img src={`src/assets/images/payment/${cardTypes[props.cardType].logo}`} className={cardTypes[props.cardType].styling}/>}
                </div>
            }
            <input id={props.option} type="text" maxLength={inputOptions[props.option].maxLength} placeholder={inputOptions[props.option].placeholder} value={props.value} onChange={props.updater} className={`border-[1.5px] rounded-[4px] py-2 pr-3 ${props.option === "card-number" ? "pl-[70px]" : "pl-3"} w-full ${props.errors[props.option]? "border-[var(--warning-color)]": "border-[rgba(0,0,0,0.3)]"} h-[65px]`}/>
            {props.option === "cvv" && <img src="src/assets/images/payment/cvv.svg" className="absolute right-3 h-10 top-[19%]"/>}
        </div>
        <p id="error-txt" className="text-[var(--warning-color)] mt-[-0.35em] font-[Gilroy-Medium]">{props.errors? props.errors[props.option]: ""}</p>
        </div>
    )
}
export default PaymentInput;