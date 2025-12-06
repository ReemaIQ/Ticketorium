import React from "react";

function SeatingPlan({ selectedSeat, onSelect, occupiedSeats = [] }) {
    const rows = [1, 2, 3, 4, 5, 6, 7];
    const cols = ["A", "B", "C", "D", "E", "F"];

    const isOccupied = (label) => occupiedSeats.includes(label);

    return (
        <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-slate-600 mb-3">
                Choose your seat (optional)
            </p>

            <div className="inline-block">
                {/* Header A–F */}
                <div className="flex justify-end mb-1 ml-8 gap-3 text-xs text-slate-500">
                    {cols.map((c) => (
                        <span key={c} className="w-6 text-center">
                            {c}
                        </span>
                    ))}
                </div>

                {/* Seat grid */}
                <div className="flex flex-col gap-1">
                    {rows.map((r) => (
                        <div key={r} className="flex items-center gap-3">
                            <span className="w-6 text-xs text-slate-500 text-right">
                                {r}
                            </span>

                            <div className="flex gap-1">
                                {cols.map((c) => {
                                    const label = `${r}${c}`;
                                    const occupied = isOccupied(label);
                                    const isSelected = selectedSeat === label;

                                    let classes =
                                        "w-7 h-7 rounded-[4px] border border-slate-300 cursor-pointer transition";
                                    if (occupied) {
                                        classes +=
                                            " bg-slate-400 cursor-not-allowed border-slate-400";
                                    } else if (isSelected) {
                                        classes +=
                                            " bg-[#4F6FFF] border-[#4F6FFF]";
                                    } else {
                                        classes +=
                                            " bg-slate-100 hover:bg-slate-200";
                                    }

                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            disabled={occupied}
                                            onClick={() =>
                                                !occupied && onSelect(label)
                                            }
                                            className={classes}
                                            aria-label={label}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeat && (
                <div className="mt-3 text-xs text-slate-600">
                    Selected seat:{" "}
                    <span className="font-semibold text-[#4F6FFF]">
                        {selectedSeat}
                    </span>
                </div>
            )}
        </div>
    );
}

export default SeatingPlan;