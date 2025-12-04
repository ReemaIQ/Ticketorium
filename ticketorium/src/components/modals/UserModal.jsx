import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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

export function UserModal({
    open,
    onClose,
    onSave,
    currentType,
    initialData,
    takenUsernames = [],
}) {
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    const isEditMode = !!initialData;

    // Normalize initial data into the form shape (supports both old and new keys)
    const mapInitialDataToForm = (data) => {
        if (!data || typeof data !== "object") return initialFormState;

        return {
            username:
                data.username ||
                data.handle ||
                data.id ||
                "",
            firstName: data.firstName || data["first-name"] || "",
            lastName: data.lastName || data["last-name"] || "",
            email: data.email || "",
            phone: data.phone || "",
            password: "", // keep empty; only filled if changing
            type: data.type || "",
            university:
                data.university ||
                data.universityName ||
                "",
            gender: data.gender || "",
            dob: data.dob || data["date-of-birth"] || "",
        };
    };

    useEffect(() => {
        if (!open) return;

        // reset validation state
        setErrors({});

        // populate form for edit or reset for create
        if (initialData) {
            setForm(mapInitialDataToForm(initialData));
        } else {
            setForm(initialFormState);
        }

        // lock body scroll while modal is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [open, initialData]);

    /* ---------------- Role logic ---------------- */
    const currentRole = (currentType || "").toLowerCase();

    let allowedTypes = [];
    if (currentRole === "system-admin") {
        // System Admins → can manage regular Admins + System Admins
        allowedTypes = ["admin", "system-admin"];
    } else {
        // Regular Admins → can manage everyone except System Admins
        allowedTypes = ["visitor", "student", "organizer", "admin"];
    }

    /* ---------------- Validation ---------------- */
    const validate = () => {
        const e = {};

        // Username + uniqueness
        const usernameTrimmed = form.username.trim();
        if (!usernameTrimmed) {
            e.username = "Username is required.";
        } else {
            const isTaken = takenUsernames.includes(usernameTrimmed);
            const isSameUser = isEditMode && usernameTrimmed === (initialData?.id || initialData?.username);
            if (isTaken && !isSameUser) {
                e.username = "This username is already taken.";
            }
        }

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

        // Password validation:
        // - Create: required
        // - Edit: optional, validate only if provided
        if (!isEditMode && !form.password) {
            e.password = "Password is required.";
        }

        if (
            form.password &&
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)
        ) {
            e.password =
                "Password must contain 8+ chars, 1 upper, 1 number, 1 special.";
        }

        if (!form.type) e.type = "User type is required.";
        if (!form.university.trim()) e.university = "University is required.";
        if (!form.gender) e.gender = "Gender is required.";

        if (!form.dob) {
            e.dob = "Date of birth is required.";
        } else {
            const dobDate = new Date(form.dob);
            if (Number.isNaN(dobDate.getTime())) {
                e.dob = "Invalid date of birth.";
            } else {
                const ageYears =
                    (Date.now() - dobDate.getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000);
                if (ageYears < 16) {
                    e.dob = "User must be at least 16 years old.";
                }
            }
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

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
        if (!validate()) return;

        if (typeof onSave === "function") {
            onSave(form);
        }
    };

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />

            <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-xl px-6 py-5 h-auto max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-[Gilroy-Black] text-[24px]">
                        {isEditMode ? "Edit User" : "Create New User"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            Username
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.username
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.username && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.username}
                                </span>
                            )}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.email
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.email && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.email}
                                </span>
                            )}
                        </label>
                    </div>

                    {/* Names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="text-xs font-medium text-gray-600">
                            First Name
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.firstName
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.firstName && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.firstName}
                                </span>
                            )}
                        </label>
                        <label className="text-xs font-medium text-gray-600">
                            Last Name
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.lastName
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.lastName && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.lastName}
                                </span>
                            )}
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
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.phone
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.phone && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.phone}
                                </span>
                            )}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Password{" "}
                            {isEditMode && (
                                <span className="text-gray-400 font-normal">
                                    (Leave blank to keep current)
                                </span>
                            )}
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.password
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.password && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.password}
                                </span>
                            )}
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
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.type
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            >
                                <option value="">select…</option>
                                {allowedTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.type}
                                </span>
                            )}
                        </label>
                        <label className="text-xs font-medium text-gray-600">
                            University
                            <input
                                name="university"
                                value={form.university}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.university
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.university && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.university}
                                </span>
                            )}
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
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.gender
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            >
                                <option value="">Select…</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.gender}
                                </span>
                            )}
                        </label>

                        <label className="text-xs font-medium text-gray-600">
                            Date of Birth
                            <input
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                className={`mt-1 w-full border rounded-md px-3 py-2 text-sm focus:border-[#4F6FFF] ${
                                    errors.dob
                                        ? "border-[var(--warning-color)]"
                                        : "border-gray-400"
                                }`}
                            />
                            {errors.dob && (
                                <span className="text-xs text-[var(--warning-color)]">
                                    {errors.dob}
                                </span>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-[var(--warning-color)] text-[var(--warning-color)] rounded-[6px] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-[6px] font-medium transition bg-[var(--accent-color)] text-[var(--secondary-color)] cursor-pointer"
                        >
                            {isEditMode ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
