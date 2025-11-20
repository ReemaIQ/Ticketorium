import {useNavigate} from "react-router-dom";
function PaymentResult (props) {
    const navigate = useNavigate();
    return (
        <div className="w-full min-h-[80vh] my-10 lg:content-center">
            <div className="lg:w-[50%] xl:w-[44%] m-10 lg:m-20 flex flex-col gap-3">
                <h2 className="font-[Epilogue-Black] text-[50px] xl:text-[60px] text-[var(--primary-color)] lg:absolute lg:top-25 lg:left-10">Checkout</h2>
                <div className="flex flex-col gap-2 mb-2 flex-start">
                    <h2 className={`font-[Gilroy-Black] text-[4rem] lg:text-[6rem] xl:text-[7rem] leading-17 lg:leading-24 xl:leading-28 ${props.success ? "text-[var(--success-color)]" : "text-[var(--primary-black)]"} md:w-100`}>{props.success ? "Payment Successful" : "Oops!"}</h2>
                    {!props.success && <h3 className="text-3xl font-[Gilroy-ExtraBold] text-[var(--warning-color)]">Payment Unsuccessful!</h3>}
                    <p className="font-[Gilroy-Medium] text-xl">{props.success ? "Thank you for registering" : "Please try again."}</p>
                </div>
                {props.success? <img src="/src/assets/images/payment/successful_payment.svg" className="mb-[-2rem] w-100 lg:absolute md:w-120 lg:w-140 xl:w-190 lg:right-[-3em] xl:right-[-4em] lg:top-[18%] xl:top-[12%] z-[-1] max-lg:self-center" alt="Payment Successful" /> :
                <img src="/src/assets/images/payment/unsuccessful_payment.jpg" className="mb-[-2rem] w-90 lg:absolute md:w-110 lg:w-130 xl:w-180 lg:right-[-3em] xl:right-[-4em] lg:top-[18%] xl:top-[12%] z-[-1] max-lg:self-center" alt="Payment Failed" />}
                <div className="w-full flex justify-start mt-10 gap-5">
                    <button onClick={!props.success? () => navigate("/checkout") : undefined} className="cursor-pointer rounded-sm w-65 h-15 font-[DM-Sans-Black] bg-[var(--accent-color)] text-sm p-2">{props.success ? "View Event Details" : "Try Again"}</button>
                    {props.success && <button onClick={undefined} className="cursor-pointer border rounded-sm w-65 h-15 font-[DM-Sans-Black] border-[var(--secondary-color)] text-[var(--secondary-color)] hover:ring-1 ring-[var(--secondary-color)] text-sm p-2">View Ticket</button>}
                </div>
            </div>
        </div>
    )
}
export default PaymentResult;