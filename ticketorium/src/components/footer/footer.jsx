import { NavLink} from 'react-router-dom';

const footerContent = { // based on user type
    "student" : {
        "Invite Friends": {
            "Send Invitations": "/student/all-events",
            "Your Invitations": "/student/my-events"
        },
        "Join Events": {
            "All Events": "/student/all-events",
            "Your Events": "/student/my-events"
        },
        "Manage Your Tickets": {
            "Refund a Ticket": "/student/my-events",
            "Start a Bidding": "/student/bidding"
        },
        "Contact Us": {
            "Open a Dispute": "/student/disputes",
            "Your Disputes": "/student/disputes"
        },
    },
    "visitor" : {
        "Join Events": {
            "All Events": "/visitor/all-events",
            "Your Events": "/visitor/my-events"
        },
        "Contact Us": {
            "Open a Dispute": "/visitor/disputes",
            "Your Disputes": "/visitor/disputes"
        },
    },
    "organizer" : {
        "Manage Events": {
            "New Event": "/organizer/new-event",
            "Your Events": "/organizer/my-events"
        },
        "Contact Us": {
            "Open a Dispute": "/organizer/disputes",
            "Your Disputes": "/organizer/disputes"
        },
    }
}

// student, organizer, admin, visitor, not-logged-in, system-admin

function Footer(props) {
    return (
        <footer>
            <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="h-[48px] w-full bg-[var(--secondary-color)] text-white font-[DM-Sans-Light] text-[15px] flex justify-center items-center cursor-pointer">
                Back to top
            </div>
            <div className="h-[374px] w-full bg-[#11223B] flex flex-col justify-center p-30">
                {(props.type == "empty" || props.type == "admin" || props.type == "system-admin") && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[20px] text-white font-[DM-Sans-Black]">Contact Us</h3>
                        <div className="text-[16px] text-white font-[DM-Sans-Regular]">
                            <p>New University? Join us!</p>
                            <p>Contact us at <a href="mailto:ticketorium.support@gmail.com">ticketorium.support@gmail.com</a></p>
                        </div>
                    </div>
                )}
                {(props.type == "student" || props.type == "visitor" || props.type == "organizer") && (
                    <div className='flex gap-20 text-white justify-evenly'>
                        {Object.keys(footerContent[props.type]).map((sectionTitle) =>
                            <div className='flex flex-col gap-4' key={sectionTitle}>
                                <h3 className='font-[DM-Sans-Black] text-[20px]'>{sectionTitle}</h3>
                                <div className="flex flex-col gap-1">
                                            {Object.keys(footerContent[props.type][sectionTitle]).map(itemTitle => 
                                            <NavLink to={footerContent[props.type][sectionTitle][itemTitle]} end key={itemTitle}>
                                            <p className='font-[DM-Sans-Light] text-[16px]'>{itemTitle}</p>
                                            </NavLink>
                                            )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </footer>
    )
}


export default Footer;