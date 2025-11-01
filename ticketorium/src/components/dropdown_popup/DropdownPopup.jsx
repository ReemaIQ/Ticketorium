function DropdownPopup(props) {
    return (
        <div className={`border-[rgba(0,0,0,0.2)] border bg-white rounded w-[524px] h-auto flex-col absolute top-148 left-16 shadow-[0_4px_16px_rgba(0,0,0,0.1)] font-[gilroy-medium] text-[var(--primary-color)] z-10 select-none ${props.isOpen ? 'flex' : 'hidden'}`}>
            <div onClick={() => props.onOptionClick("Male")} className="p-3 border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50 hover:cursor-pointer">Male</div>
            <div onClick={() => props.onOptionClick("Female")} className="p-3 border-b border-[rgba(0,0,0,0.2)] hover:bg-gray-50 hover:cursor-pointer">Female</div>
            <div onClick={() => props.onOptionClick("Rather not say")} className="p-3 hover:bg-gray-50 hover:cursor-pointer">Rather Not Say</div>
        </div>
    )
}

export default DropdownPopup;