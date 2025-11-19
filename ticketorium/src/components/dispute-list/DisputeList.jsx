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
        <aside className="w-full md:w-[270px] border-b md:border-b-0 md:border-r border-[#E0E0E0] pb-3 md:pb-0 pr-0 md:pr-4">
            <div className="mt-3 md:mt-2 space-y-2">
                {list.length === 0 ? (
                    <p className="text-sm text-gray-500 font-[Gilroy-Medium] px-1">
                        No disputes found.
                    </p>
                ) : (
                    list.map((d) => (
                        <DisputeItem
                            key={d.id}
                            dispute={d}
                            selected={d.id === selectedId}
                            onSelect={() => onSelect(d.id)}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}

export default DisputeList;
