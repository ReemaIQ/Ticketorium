import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import UniversityCard from '../components/university-card/UniversityCard';
import UniversityModal from '../components/modals/UniversityModal';

function ManageUniversities(props)  {
    // State for the list of universities
    const [universities, setUniversities] = useState(props.initialUniversities);

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Handlers
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this university?')) {
            const newUniversities = { ...universities };
            delete newUniversities[id];
            setUniversities(newUniversities);
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSave = (key, data) => {
        setUniversities(prev => ({
            ...prev,
            [key]: data
        }));
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Note: Nav is assumed to exist outside or above this component */}

            <main className="max-w-5xl mx-auto px-4 pt-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <h1 className="text-[60px] font-[Gilroy-Black] text-[#1A1A1A] tracking-tight">
                        Manage Universities
                    </h1>

                    <button
                        onClick={handleAddNew}
                        className="group bg-[var(--accent-color)] text-[var(--secondary-color)] font-[Gilroy-Medium] py-3 px-6 rounded-[6px] flex items-center transition-all"
                    >
                        Add new university
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(universities).map(([key, data]) => (
                        <UniversityCard
                            key={key}
                            id={key}
                            data={data}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* Empty State Helper */}
                    {Object.keys(universities).length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No universities found. Click "Add new university" to get started.
                        </div>
                    )}
                </div>
            </main>

            <UniversityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingId ? universities[editingId] : null}
                editId={editingId}
                defaultTheme={editingId ? universities[editingId]["theme-colors"]:
                    {"primary-color": "#1A1A1A",
                    "secondary-color": "#1F4C76",
                    "accent-color": "#FFDF4F",
                    "secondary-accent-color": "#0800FF",
                    "filter-buttons": "#8200DB",
                    "warning-color": "#F54141",
                    "success-color": "#46CA48",
                    "footer-color": "#11223B",
                    "dispute-chat": "#d8e5dd"
                    }}
            />
        </div>
    );
}

export default ManageUniversities;