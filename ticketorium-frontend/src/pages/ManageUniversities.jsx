import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import UniversityCard from '../components/university-card/UniversityCard';
import UniversityModal from '../components/modals/UniversityModal';

function ManageUniversities({ user }) {
    // universities stored as { [id]: data }
    const [universities, setUniversities] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = '/api/universities'; // adjust if your backend is on a different origin

    // ==== Helpers for shape mapping ====
    const normalizeUniversityFromApi = (uniFromApi) => ({
        id: uniFromApi._id,
        code: uniFromApi.code,
        name: uniFromApi.name,
        logo: uniFromApi.logo,
        "theme-colors": {
            "primary-color": uniFromApi.themeColors?.primaryColor ?? "#1A1A1A",
            "secondary-color": uniFromApi.themeColors?.secondaryColor ?? "#1F4C76",
            "accent-color": uniFromApi.themeColors?.accentColor ?? "#FFDF4F",
            "secondary-accent-color": uniFromApi.themeColors?.secondaryAccentColor ?? "#0800FF",
            "filter-buttons": uniFromApi.themeColors?.filterButtons ?? "#8200DB",
            "warning-color": uniFromApi.themeColors?.warningColor ?? "#F54141",
            "success-color": uniFromApi.themeColors?.successColor ?? "#46CA48",
            "footer-color": uniFromApi.themeColors?.footerColor ?? "#11223B",
            "dispute-chat": uniFromApi.themeColors?.disputeChat ?? "#d8e5dd",
        },
    });

    const serializeUniversityForApi = (uiUni) => ({
        code: uiUni.code,
        name: uiUni.name,
        logo: uiUni.logo,
        themeColors: {
            primaryColor: uiUni["theme-colors"]["primary-color"],
            secondaryColor: uiUni["theme-colors"]["secondary-color"],
            accentColor: uiUni["theme-colors"]["accent-color"],
            secondaryAccentColor: uiUni["theme-colors"]["secondary-accent-color"],
            filterButtons: uiUni["theme-colors"]["filter-buttons"],
            warningColor: uiUni["theme-colors"]["warning-color"],
            successColor: uiUni["theme-colors"]["success-color"],
            footerColor: uiUni["theme-colors"]["footer-color"],
            disputeChat: uiUni["theme-colors"]["dispute-chat"],
        },
    });

    // Optional: auth headers if you have a token on the user object
    const buildHeaders = () => {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (user?.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }
        return headers;
    };

    // ==== Initial fetch ====
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(API_BASE, {
                    headers: buildHeaders(),
                });

                if (!res.ok) {
                    throw new Error('Failed to load universities');
                }

                const data = await res.json(); // array
                const asObject = {};
                data.forEach((uni) => {
                    const normalized = normalizeUniversityFromApi(uni);
                    asObject[normalized.id] = normalized;
                });
                setUniversities(asObject);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    // ==== Handlers ====
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this university?')) return;

        try {
            const res = await fetch(`/api/universities/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to delete university');
            }

            // ✅ Update React state so UI reflects removal immediately
            setUniversities(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to delete university');
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

    /**
     * handleSave is called by UniversityModal.
     * - If editingId != null -> PUT /api/universities/:id
     * - Else -> POST /api/universities
     *
     * `data` should be in the same UI shape we store in state
     * (name, code, logo, "theme-colors"...).
     */
    const handleSave = async (_keyFromModal, data) => {
        try {
            const body = JSON.stringify(serializeUniversityForApi(data));

            if (editingId) {
                // UPDATE existing uni
                const res = await fetch(`${API_BASE}/${editingId}`, {
                    method: 'PUT',
                    headers: buildHeaders(),
                    body,
                });

                if (!res.ok) throw new Error('Failed to update university');

                const updatedUniFromApi = await res.json();
                const normalized = normalizeUniversityFromApi(updatedUniFromApi);

                setUniversities(prev => ({
                    ...prev,
                    [normalized.id]: normalized,
                }));
            } else {
                // CREATE new uni
                const res = await fetch(API_BASE, {
                    method: 'POST',
                    headers: buildHeaders(),
                    body,
                });

                if (!res.ok) throw new Error('Failed to create university');

                const createdUniFromApi = await res.json();
                const normalized = normalizeUniversityFromApi(createdUniFromApi);

                setUniversities(prev => ({
                    ...prev,
                    [normalized.id]: normalized,
                }));
            }

            setIsModalOpen(false);
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to save university');
        }
    };

    const defaultTheme = {
        "primary-color": "#1A1A1A",
        "secondary-color": "#1F4C76",
        "accent-color": "#FFDF4F",
        "secondary-accent-color": "#0800FF",
        "filter-buttons": "#8200DB",
        "warning-color": "#F54141",
        "success-color": "#46CA48",
        "footer-color": "#11223B",
        "dispute-chat": "#d8e5dd",
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-5xl mx-auto px-4 pt-10">
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

                {loading && (
                    <div className="text-center text-gray-500 py-10">
                        Loading universities...
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center text-red-500 py-10">
                        {error}
                    </div>
                )}

                {!loading && !error && (
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

                        {Object.keys(universities).length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No universities found. Click "Add new university" to get started.
                            </div>
                        )}
                    </div>
                )}
            </main>

            <UniversityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingId ? universities[editingId] : null}
                editId={editingId}
                defaultTheme={
                    editingId
                        ? universities[editingId]["theme-colors"]
                        : defaultTheme
                }
            />
        </div>
    );
}

export default ManageUniversities;
