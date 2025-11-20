import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// initial state to reuse for resetting

const initialFormState = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    type: "",
    university: "",
    gender: "",
    dob: "",
};

export function CreateUserModal({ open, onClose, onCreate, currentType }) {
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    // Update useEffect to handle Scroll Lock and Form Reset
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';

            // Reset form and errors every time modal opens
            setForm(initialFormState);
            setErrors({});
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    /* ---------------- Role logic ---------------- */

    const currentRole = (currentType || "").toLowerCase();
    const allowedTypes =
        currentRole === "admin"
            ? ["visitor", "student", "organizer", "admin"]
            : ["visitor", "student", "organizer", "admin", "system admin"];

    /* ---------------- Validation ---------------- */

    const validate = () => {
        const e = {};

        if (!form.username.trim()) e.username = "Username is required.";
        if (!form.firstName.trim()) e.firstName = "First name is required.";
        if (!form.lastName.trim()) e.lastName = "Last name is required.";

        if (!form.email.trim()) {
            e.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            e.email = "Invalid email format.";
        }

        if (!form.phone.trim()) {
            e.phone = "Phone number is required.";
        } else if (!/^\d{10,}$/.test(form.phone)) {
            e.phone = "Phone must be at least 10 digits.";
        }

        if (!form.password.trim()) {
            e.password = "Password is required.";
        } else if (
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)
        ) {
            e.password = "Password must contain 8+ chars, 1 upper, 1 number, 1 special.";
        }

        if (!form.type) e.type = "User type is required.";
        if (!form.university.trim()) e.university = "University is required.";
        if (!form.gender) e.gender = "Gender is required.";

        if (!form.dob) {
            e.dob = "Date of birth is required.";
        } else {
            const age = (Date.now() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000);
            if (age < 16) e.dob = "User must be at least 16 years old.";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ---------------- Handlers ---------------- */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));

        //Clear the error for this specific field as the user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate is called here. If it fails, errors are set, preventing submit.
        if (!validate()) return;

        onCreate(form);
        onClose();
    };

    if (!open) return null;

    /* ---------------- UI ---------------- */

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-xl px-6 py-5 h-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-[Gilroy-Black] text-[24px]">Create new user</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            Username
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.username ? 'border-red-500' : 'border-gray-400'}`}
                                placeholder="Username"
                            />
                            {errors.username && <span className="text-xs text-red-500">{errors.username}</span>}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.email ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                        </label>
                    </div>

                    {/* First / Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            First Name
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.firstName ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Last Name
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.lastName ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                        </label>
                    </div>

                    {/* Phone + Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            Phone
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.phone ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Password
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.password ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                        </label>
                    </div>

                    {/* Type + University */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            Type
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.type ? 'border-red-500' : 'border-gray-400'}`}
                            >
                                <option value="">select…</option>
                                {allowedTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            University
                            <input
                                name="university"
                                value={form.university}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.university ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.university && <span className="text-xs text-red-500">{errors.university}</span>}
                        </label>
                    </div>

                    {/* Gender + DOB */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            Gender
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.gender ? 'border-red-500' : 'border-gray-400'}`}
                            >
                                <option value="">Select…</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Date of Birth
                            <input
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${errors.dob ? 'border-red-500' : 'border-gray-400'}`}
                            />
                            {errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-[6px]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 rounded-[6px] font-medium transition bg-[#FFDF4F] text-[#14113B] hover:bg-[#FFE77A]"
                        >
                            Create user
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}