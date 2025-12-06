/* Utility to show "10 min", "45 min", "1 hr" from lastActivityAt */
function timeAgoLabel(isoString) {
    const now = new Date();
    const t = new Date(isoString);
    const diffMin = Math.max(0, Math.round((now - t) / 60000));

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min`;
    const hours = Math.round(diffMin / 60);
    return `${hours} hr`;
}

function DisputeItem({ dispute, selected, onSelect }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(dispute.id)}
            className={`w-full text-left rounded-[10px] border border-[#E2E2E2] px-3 py-3 mb-3 flex items-start justify-between hover:shadow-sm transition
        ${selected ? "bg-[#E0E0E0] border-[#E0E0E0]" : "bg-white"}`}
        >
            <div className="flex-1 pr-2">
                <p className="font-[Gilroy-Bold] text-[18px] text-[#1A1A1A]">
                    {dispute.title}
                </p>
                <p className="font-[Gilroy-Medium] text-[14px] text-[#5B5B5B] mt-1 leading-snug">
                    {dispute.subtitle}
                </p>
            </div>
            <span className="text-[10px] text-[#5B5B5B] whitespace-nowrap mt-1">
        {timeAgoLabel(dispute.lastActivityAt || dispute.createdAt)}
      </span>
        </button>
    );
}

export default DisputeItem;