
const inputOptions = {
    "name-on-card": {
        placeholder: "Enter name on card",
        label: "Name on Card"
    },
    "card-number": {
        placeholder: "Enter card number",
        label: "Card Number"
    },
    "expiry-date": {
        placeholder: "MM/YY",
        label: "Expiration Date"
    },
    "cvv": {
        placeholder: "CVV",
        label: "Security Code"
    },
}

function PaymentInput (props) {
    return (
        <div className="flex flex-col w-full gap-2">
        <label htmlFor={props.option} className="text-[var(--primary-color)] font-[Gilroy-Medium]">{inputOptions[props.option].label}</label>
        <input id={props.option} type="text" placeholder={inputOptions[props.option].placeholder} value={props.value} onChange={(e) =>{props.setter(e.target.value)}} className={`border-[1.5px] rounded-[4px] py-2 px-3 w-full border-[rgba(0,0,0,0.3)] h-[65px]`}/>
        </div>
    )
}
export default PaymentInput;