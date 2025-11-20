import heroImg from "../assets/images/home-main/hero_img.svg"
import rightArrow from "../assets/images/signup/right_arrow.svg"
import {useNavigate, NavLink} from "react-router-dom"

// fetch all supported uni logos
const uniLogos = import.meta.glob("../assets/images/home-main/unis/*.{png,jpg,jpeg,svg}", {eager: true}); // get all images in the unis folder 
const uniImages = Object.values(uniLogos).map((img) => img.default); // arr of logo img paths
// console.log("Uni Images:", uniImages[0]);

function DummyUserHome() {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate("/sign-up");
    }

    return (
        <>
        {/* Hero */}
        <div className="m-0 text-3xl flex flex-col align-center justify-center gap-15 bg-[var(--secondary-color)] w-full p-10 xl:p-20">

                <div className="self-center xl:self-start text-center xl:text-left" xl:order-2>
                    <h1 className="flex flex-col items-center text-[80px] sm:text-[110px] md:text-[130px] font-bold font-[Epilogue-Black] md:leading-[125px] text-white">Your seat<br/>to every<br/>milestone!</h1>
                    <p className="font-[DM-Sans-Light] text-[24px] text-white">All your university's events in one place.</p>
                </div>
                <div className="flex flex-col items-center xl:order-3 self-center xl:self-start ">
                    <button onClick={handleGetStarted} className="bg-[var(--accent-color)] text-[var(--primary-color)] text-[32px] font-[DM-Sans-ExtraLight] font-extralight py-2 px-6 rounded h-[74px] w-[399px] flex items-center justify-between gap-4 cursor-pointer">
                        <span>Get Started</span>
                        <img src={rightArrow} alt='arrow' />
                    </button>
                    <p className="font-[DM-Sans-Light] text-[16px] text-white mt-4">Returning user? <NavLink to="/log-in" className={"font-[DM-Sans-Light] underline"}>Log in</NavLink></p>
                </div>
                <img src={heroImg} className="h-65 sm:h-100 xl:h-[40%] 2xl:h-[60%] self-center xl:absolute xl:order-1 xl:right-[-3em]"/>
        </div>

        {/* Universities Supported */}
        <div className="m-0 text-3xl flex flex-col gap-10 bg-white w-full">
            <div className="p-10 md:p-20">
                <h1 className="text-[50px] md:text-[100px] lg:text-[130px] font-bold md:w-180 font-[Epilogue-Black] md:leading-[120px] text-[var(--primary-color)]">Universities Supported</h1>
            </div>
        </div>
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 place-items-center gap-[50px] w-[80%] pb-20">
                {uniImages.map(path => <img src={path} className="w-[320px]" key={path}/>)}
            </div>
        </div>
        </>
    );
}

export default DummyUserHome;