import React, { useState } from "react";
import { X } from "lucide-react";

export function CreateUserModal({ open, onClose, onCreate, currentType }) {
    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        type: "visitor",
        university: "",
        gender: "",
        dob: "",
    });

    if (!open) return null;

    // admins cannot create system admins, system admins can create anyone
    const currentRole = (currentType || "").toLowerCase();
    const allowedTypes =
        currentRole === "admin"
            ? ["visitor", "student", "organizer", "admin"]
            : ["admin", "system admin"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.username.trim()) {
            alert("Please enter a username.");
            return;
        }
        if (!form.email.trim()) {
            alert("Please enter an email.");
            return;
        }

        onCreate(form);  // let parent transform+store
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* dialog */}
            <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-xl px-6 py-5">
                {/* header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-[Gilroy-Black] text-[24px] text-[#1A1A1A]">
                        Create new user
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* username */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Username
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                                placeholder="yo-shayma"
                            />
                        </label>

                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Email
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                                placeholder="user@example.com"
                            />
                        </label>
                    </div>

                    {/* first / last */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            First name
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                            />
                        </label>

                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Last name
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                            />
                        </label>
                    </div>

                    {/* phone / password */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Phone
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                            />
                        </label>

                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Password
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                            />
                        </label>
                    </div>

                    {/* type / university */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* TYPE DROPDOWN */}
                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Type
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF] bg-white"
                            >
                                {allowedTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            University
                            <input
                                name="university"
                                value={form.university}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                                placeholder="kfupm / harvard / …"
                            />
                        </label>
                    </div>

                    {/* gender / DOB */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Gender
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF] bg-white"
                            >
                                <option value="">Select…</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label className="text-xs font-[Gilroy-Medium] text-gray-600">
                            Date of birth
                            <input
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4F6FFF]"
                            />
                        </label>
                    </div>

                    {/* actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-[6px] border border-red-600 bg-white text-red-600 text-[14px] font-[Gilroy-Medium] hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-[6px] border border-[#FFDF4F] bg-[#FFDF4F] text-[#14113B] text-[14px] font-[Gilroy-Medium] hover:brightness-105"
                        >
                            Create user
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
