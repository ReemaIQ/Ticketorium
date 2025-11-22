import React from 'react';

function UniversityCard({ id, data, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center transition-shadow hover:shadow-md">
            {/* Logo Section */}
            <div className="flex flex-col items-center h-full justify-around items-center">
                <div className="items-center justify-center mb-4 overflow-hidden text-indigo-800">
                    {data.logo ? (
                        <img src={`/src/assets/images/home-main/unis/${data.logo}`} alt={data.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-medium select-none">U</span>
                    )}
                </div>
            </div>


            <div className="flex flex-col items-center justify-between">
                {/* Name Section */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-6 line-clamp-2 h-14 flex items-center">
                    {data.name}
                </h3>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 w-full mt-auto">
                    <button
                        onClick={() => onDelete(id)}
                        className="px-4 py-2 border border-[var(--warning-color)] text-[var(--warning-color)] rounded hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => onEdit(id, data)}
                        className="px-4 py-2 border border-[var(--secondary-color)] text-[var(--secondary-color)] rounded hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                    >
                        Edit
                    </button>
                </div>
            </div>

        </div>
    );
}
export default UniversityCard;