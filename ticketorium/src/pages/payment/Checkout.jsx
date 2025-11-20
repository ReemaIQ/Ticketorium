import { useState, useEffect } from 'react';
import PaymentInput from '../../components/payment/PaymentInput.jsx';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';


function Checkout (props) {
    const [errors, setErrors] = useState({}); // empty {} or object of errors
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState("unknown");

    const navigate = useNavigate();

    function handleCheckout (e) {
        e.preventDefault();

        const currentTime = new Date();

        let errorsFound = {};   
        // Name on Card
        if (cardName.trim() === "")
            errorsFound["name-on-card"] = "Enter name on your card";
        // Card Number
        if (cardNumber.trim() === "")
            errorsFound["card-number"] = "Enter card number";
        else if (cardNumber.replace(/\s/g, "").length !== 16)
            errorsFound["card-number"] = "Enter a complete card number";
        else if (validator.isCreditCard(cardNumber.replace(/\s/g, "")) === false)
            errorsFound["card-number"] = "Invalid card number";
        // Expiry Date
        if (expiryDate.trim() === "")
            errorsFound["expiry-date"] = "Enter expiry date";
        else if (expiryDate.replace(/\D/, "").length !== 4)
            errorsFound["expiry-date"] = "Complete expiry date";
        else if (parseInt(expiryDate.slice(3,5)) < currentTime.getFullYear() % 100 || (parseInt(expiryDate.slice(3,5)) === currentTime.getFullYear() % 100 && parseInt(expiryDate.slice(0,2)) < currentTime.getMonth()+1))
            errorsFound["expiry-date"] = "Card has expired";
        // CVV
        if (cvv.trim() === "")
            errorsFound["cvv"] = "Enter CVV";

        console.log(currentTime.getFullYear(), currentTime.getMonth()+1);

        console.log("Errors found during checkout:", errorsFound);
        if (Object.keys(errorsFound).length > 0) {
            setErrors(errorsFound);
            return
        }
        else {
            setErrors({}); // to empty previous errors
            // I'll make a 4/10 chance of payment failure for demo purposes
            if (Math.random() < 0.4) {
                props.setSuccess(false);
            }
            else {
                props.setSuccess(true);
            }
            props.setProcessing(true);
            navigate("/payment-outcome");
        }
            
    }

    const handleChangeName = (e) => {
        setCardName(e.target.value);
    }

    const handleChangeNumber = (e) => {
        let cleaned = e.target.value.replace(/\D/g, "");
        if (cardType !== "amex")
            cleaned = cleaned.replace(/(.{4})/g, "$1 ").trim();
        else {
            if (cleaned.length > 4 && cleaned.length <= 10) {
                cleaned = cleaned.replace(/^(\d{4})(\d+)/, "$1 $2");
            } else if (cleaned.length > 10) {
                cleaned = cleaned.replace(/^(\d{4})(\d{6})(\d+)/, "$1 $2 $3");
}
        }
        setCardType(cleaned.startsWith("34") || cleaned.startsWith("37") ? "amex" : (cleaned.startsWith("4") ? "visa" : (cleaned.startsWith("5") ? "mastercard" : "unknown")));
        setCardNumber(cleaned);
    }

    const handleChangeDate = (e) => {
        let cleaned = e.target.value.replace(/\D/g, "").replace(/^(.{2})(.+)/, "$1/$2").trim();
        // next, we ensure month is valid
        cleaned = cleaned.replace(/^[2-9]/, "0$&"); // prepend 0 if 2-9
        cleaned = cleaned.replace(/^00/, "0") // prevents month: 00
        cleaned = cleaned.replace(/^1[3-9]/, "1") // max month is 12
        // whether the year is valid or not, is not checked here, but at handleCheckout
        setExpiryDate(cleaned);
    }

    const handleChangeCVV = (e) => {
        let cleaned = e.target.value.replace(/\D/g, "");
        setCvv(cleaned);
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    return (
        <div className='h-screen w-full flex justify-center content-center'>
            <div className="lg:w-[50%] xl:w-[44%] m-10 lg:m-20 flex flex-col gap-3">
                <h2 className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)]">Checkout</h2>
                <div id='price-and-card-options' className=' flex justify-between items-center'>
                    <img src="src/assets/images/payment/card_types.svg" className='h-13'/>
                    <span className="font-[Gilroy-Bold] text-[var(--secondary-color)] text-[22px]">Total: $45.00</span>
                </div>
                <form className="flex flex-col items-center gap-3">
                    <PaymentInput option="name-on-card" value={cardName} updater={handleChangeName} errors={errors} />
                    <PaymentInput option="card-number" value={cardNumber} updater={handleChangeNumber} errors={errors} cardType={cardType} />
                    <div className="flex gap-3 w-full">
                        <PaymentInput option="expiry-date" value={expiryDate} updater={handleChangeDate} errors={errors} />
                        <PaymentInput option="cvv" value={cvv} updater={handleChangeCVV} errors={errors} />
                    </div>
                    <button onClick={handleCheckout} className="cursor-pointer bg-[var(--accent-color)] font-[Epilogue-Bold] rounded-[0.1em] w-full h-[62px] mt-4 text-[var(--primary-black)]">Complete Purchase</button>
                </form>
                <img src={"src/assets/images/payment/powered_by_stripe.svg"} className='self-center mt-1'/>
            </div>
        </div>
    )
}
export default Checkout;