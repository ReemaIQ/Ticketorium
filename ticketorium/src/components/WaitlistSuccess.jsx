function WaitlistSuccess(props) {

    return (
        <>
        <div onClick={() => props.setWaitlistModalOpen(false)} className="w-full h-screen bg-black fixed top-0 opacity-50"></div>
        <div className="fixed w-[92%] lg:w-[70%] xl:w-[50%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-10 pt-15 pb-25 lg:py-20 rounded-[5px] font-[Gilroy-Medium] flex flex-col gap-4 z-[100]">
            <img src="/src/assets/images/close_modal.svg" onClick={() => props.setWaitlistModalOpen(false)} className="self-end w-[15px] h-[15px] cursor-pointer absolute top-5 right-4" alt="Modal close" />
                    <h2 className="waitlist-success-title">{props.waitlistSuccess? "Success! You have been waitlisted." : "Oops! Failed to waitlist."}</h2>
            <p className="waitlist-success-message mb-3">{props.waitlistSuccess? "An email will be sent if a spot opens" : "Please try again later."}</p>
            <button onClick={() => props.setWaitlistModalOpen(false)} className="absolute bottom-6 right-6 cursor-pointer bg-[var(--accent-color)] w-45 h-11 rounded-[2px] font-[DM-Sans-Black] text-[var(--primary-black)] self-end">Okay</button>
        </div>
        </>
    );
}
export default WaitlistSuccess;