import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function UniversityModal ({defaultTheme, isOpen, onClose, onSave, initialData, editId }) {
    // Form State
    const [uniKey, setUniKey] = useState('');
    const [name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [colors, setColors] = useState(defaultTheme);

    // Reset or Populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData && editId) {
                // Edit Mode
                setUniKey(editId);
                setName(initialData.name);
                setLogo(initialData.logo || '');
                setColors(initialData["theme-colors"]);
            } else {
                // Create Mode
                setUniKey('');
                setName('');
                setLogo('');
                setColors(defaultTheme);
            }
        }
    }, [isOpen, initialData, editId]);

    const handleColorChange = (key, value) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Create a local URL for previewing the image immediately
            const previewUrl = URL.createObjectURL(file);
            setLogo(previewUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newObject = {
            name,
            logo,
            "theme-colors": colors
        };
        onSave(uniKey, newObject);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-[Gilroy-Bold] text-[#1A1A1A]">
                        {editId ? 'Edit University' : 'Add New University'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Basic Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-[Gilroy-Bold] text-[var(--secondary-color)] mb-1">
                                ID / Key (e.g., KFUPM)
                            </label>

                            <input
                                type="text"
                                required
                                disabled={!!editId} // Cannot change ID during edit
                                value={uniKey}
                                onChange={(e) => setUniKey(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-[Gilroy-Bold] text-[var(--secondary-color)] mb-1">
                                University Name
                            </label>

                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-[Gilroy-Bold] text-[var(--secondary-color)] mb-1">
                                University Logo
                            </label>

                            <div className="flex items-center space-x-6">
                                {/* Image Preview Circle */}
                                <div className="shrink-0">
                                    {logo ? (
                                        <img
                                            className="object-cover border border-gray-200"
                                            src={logo}
                                            alt="Logo preview"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                            <span className="text-xs">No Logo</span>
                                        </div>
                                    )}
                                </div>

                                {/* File Input */}
                                <label className="block w-full">
                                    <span className="sr-only">Choose profile photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-[6px] file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-[var(--accent-color)] file:text-[var(--secondary-color)]
                                                    file:cursor-pointer
                                                    cursor-pointer"
                                    />
                                </label>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, or GIF up to 2MB</p>
                        </div>
                    </div>

                    {/* Theme Colors Group */}
                    <div>
                        <h3 className="text-lg font-[Gilroy-Bold] text-[var(--secondary-color)] mb-3">Theme Configuration</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(colors).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                                    />
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider">{key.replace(/-/g, ' ')}</label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleColorChange(key, e.target.value)}
                                            className="text-sm w-full border-b border-gray-200 outline-none py-1 font-mono"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 font-[Gilroy-Medium] text-[var(--warning-color)] border border-[var(--warning-color)]  rounded-[6px] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] font-[Gilroy-Medium] cursor-pointer"
                        >
                            Save University
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UniversityModal;