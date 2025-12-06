// ticketorium-frontend/src/pages/UniversitySelection.jsx

import SearchBtn from "../components/search-button/SearchBtn";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//1
function UniversitySelection(props) {
    const navigate = useNavigate();

    const handleSelectUniversity = (university) => {
        props.assignUni(university);
        navigate("/home");
    }

    const [filteredUnis, setFilteredUnis] = useState([...Object.keys(props.universities)]);

    return (
        <div className="flex justify-center"> {/* page itself */}
            <div className="w-[90%] md:w-[35em] self-start px-5 py-8 my-6 border-gray-300 border rounded-[5px]"> {/* box */}
                <h2 className="text-2xl font-[Epilogue-Bold] text-[var(--primary-color)]">Select University</h2>
                <p className="text-gray-500 mb-6">If you don't see the school you are looking for below, it means it hasn't been registered to our system yet</p>
                <div className="flex flex-col items-center gap-[13px]">
                {/* <SearchBtn content={props.universities} searchFor="university" setFiltered={setFilteredUnis} expandable={false} rounded={"6px"}/> */}
                <SearchBtn filterFunc={(searchValue) => {props.filterContent("search", props.universities, setFilteredUnis, "university", searchValue)}} expandable={false} rounded={"6px"}/>

                <div className="m-0 p-0"></div> {/* spacer */}
                {filteredUnis.map(university => {
                    return (
                        <button onClick={() => {console.log("basket", props.universities[university]); handleSelectUniversity(props.universities[university])}} className="p-4 border-gray-500 border rounded-[3px] cursor-pointer text-center font-[Gilroy-SemiBold] text-[var(--secondary-color)] ring-[var(--secondary-color)] hover:ring-1 transition-all duration-200 w-[90%] focus:border-[var(--secondary-accent-color)]">
                            {props.universities[university]["name"]}
                        </button>
                    );
                })}
                {(!props.universities || props.universities.length === 0) && <p>No matching universities</p>}
                </div>
            </div>
        </div>
    );
}


export default UniversitySelection;