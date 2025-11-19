import React, { useMemo } from "react";
import DisputeItem from "../dispute/DisputeItem.jsx";

function DisputeList({ disputes, selectedId, onSelect }) {
    // normalize: array or object
    const list = useMemo(() => {
        if (!disputes) return [];
        if (Array.isArray(disputes)) return disputes;
        return Object.entries(disputes).map(([id, d]) => ({ id, ...d }));
    }, [disputes]);

    return (
        <aside
            className="
                w-full md:w-[350px]
                border-b md:border-b-0 md:border-r border-[#E0E0E0]
                pb-3 md:pb-0 pr-0 md:pr-4
                flex flex-col min-h-0
                h-[350px] md:h-[600px]
            "
        >
            <div className="mt-3 md:mt-2 space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                {disputes.map((d) => (
                    <DisputeItem
                        key={d.id}
                        dispute={d}
                        selected={d.id === selectedId}
                        onSelect={() => onSelect(d.id)}
                    />
                ))}
            </div>
        </aside>
    );
}

export default DisputeList;
