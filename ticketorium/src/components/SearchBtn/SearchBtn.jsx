import {useState, useEffect} from "react";
// Font Awesome Setup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

function SearchBtn (props) {
    const [active, setActive] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [query, setQuery] = useState("")

    useEffect(() => {
        if (query.length > 0)
            setActive(true);
    }, [query]);

    return (
        <div onClick={() => !query.length && setActive(!active)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`border-2 rounded-full border-gray-600 w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] transition-all duration-300 hover:w-[90%] xl:hover:w-[50%] md:hover:w-[62%] flex justify-start gap-[0.2em] pl-3 ${active? "w-[90%] md:w-[62%] xl:w-[50%]": ""} align-center`}>
            <FontAwesomeIcon
            icon={"fa-solid fa-magnifying-glass"}
            className="self-center shrink-0"
            />
            {(active || hovered) && <input autoFocus type="text" value={query} placeholder="Search" onChange={(e) => {setQuery(e.target.value)}} className="h-full w-full outline-none rounded-full text-xl font-[DM-Sans-Light] px-1"/>}
            
        </div>
    );
}

export default SearchBtn;