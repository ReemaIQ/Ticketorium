import heroImg from "../assets/images/home-main/hero_img.svg"
import rightArrow from "../assets/images/signup/right_arrow.svg"
import {useNavigate, NavLink} from "react-router-dom"

// fetch all supported uni logos
const uniLogos = import.meta.glob("../assets/images/home-main/unis/*.{png,jpg,jpeg,svg}", {eager: true}); // get all images in the unis folder 
const uniImages = Object.values(uniLogos).map((img) => img.default); // arr of logo img paths
console.log("Uni Images:", uniImages[0]);

function DummyUserHome() {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate("/sign-up");
    }

    return (
        <>
        {/* Hero */}
        <div className="m-0 text-3xl flex flex-col gap-10 bg-[var(--secondary-color)] w-full">
            <div className="flex justify-between">
                <div className="p-20">
                    <h1 className="text-[130px] font-bold w-180 font-[Epilogue-Black] leading-[120px] text-white">Your seat to every milestone!</h1>
                    <p className="font-[DM-Sans-Light] text-[24px] text-white">All your university's events in one place.</p>
                </div>
                <img src={heroImg}/>
            </div>
            
            <div className="p-20">
                <button onClick={handleGetStarted} className="bg-[var(--accent-color)] text-[var(--primary-color)] text-[32px] font-[DM-Sans-ExtraLight] font-extralight py-2 px-6 rounded h-[74px] w-[399px] flex items-center justify-between gap-4 cursor-pointer">
                    <span>Get Started</span>
                    <img src={rightArrow} alt='arrow' />
                </button>
                <p className="font-[DM-Sans-Light] text-[16px] text-white mt-4">Returning user? <NavLink to="/log-in" className={"font-[DM-Sans-Light] underline"}>Log in</NavLink></p>
            </div>
        </div>

        {/* Universities Supported */}
        <div className="m-0 text-3xl flex flex-col gap-10 bg-white w-full">
            <div className="p-20">
                <h1 className="text-[130px] font-bold w-180 font-[Epilogue-Black] leading-[120px] text-[var(--primary-color)]">Universities Supported</h1>
            </div>
        </div>
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-3 place-items-center gap-[50px] w-[80%] pb-20">
                {uniImages.map(path => <img src={path} className="w-[320px]" key={path}/>)}
            </div>
        </div>
        </>
    );
}

export default DummyUserHome;