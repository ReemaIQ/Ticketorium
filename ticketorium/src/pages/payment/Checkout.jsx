import { useState, useEffect, use } from 'react';
import PaymentInput from '../../components/payment/PaymentInput.jsx';

function handleCheckout (e) {
    e.preventDefault();
    let errorsFound = {};    
}

function Checkout () {
    const [errors, setErrors] = useState({}); // empty {} or object of errors
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    useEffect(() => {
        // Any side-effects or validations can be handled here
        console.log("Card Details Updated:", { cardName, cardNumber, expiryDate, cvv });
    }, [cardName, cardNumber, expiryDate, cvv]);

    return (
        <div className='h-screen w-full flex justify-center content-center'>
            <div className="lg:w-[50%] m-10 lg:m-20 flex flex-col gap-3">
                <h2 className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)]">Checkout</h2>
                <div id='price-and-card-options' className=' flex justify-between items-center'>
                    <img src="src/assets/images/payment/card_types.svg" className='h-13'/>
                    <span className="font-[Gilroy-Bold] text-[var(--secondary-color)] text-[22px]">Total: $45.00</span>
                </div>
                <form className="flex flex-col items-center gap-3">
                    <PaymentInput option="name-on-card" value={cardName} setter={setCardName}/>
                    <PaymentInput option="card-number" value={cardNumber} setter={setCardNumber}/>
                    <div className="flex gap-3 w-full">
                        <PaymentInput option="expiry-date" value={expiryDate} setter={setExpiryDate}/>
                        <PaymentInput option="cvv" value={cvv} setter={setCvv}/>
                    </div>
                    <button onClick={handleCheckout} className="cursor-pointer bg-[var(--accent-color)] font-[Epilogue-Bold] rounded-[0.1em] w-full h-[62px] mt-4 text-[var(--primary-black)]">Complete Purchase</button>
                </form>
                <img src={"src/assets/images/payment/powered_by_stripe.svg"} className='self-center mt-1'/>
            </div>
        </div>
    )
}
export default Checkout;