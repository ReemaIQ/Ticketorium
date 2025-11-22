import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function SystemPolicies() {
    // State for form fields
    const [formData, setFormData] = useState({
        currency: "USD ($)",
        maxEventPrice: "300",
        gradTicketPrice: "300",
        maxTicketsOwn: "5",
        resignHours: "24",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] px-4 md:px-8 pt-6 pb-12 font-[Gilroy-Medium]">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <h1 className="font-[Gilroy-Black] text-[40px] leading-none text-[#1A1A1a]">
                    System Policies
                </h1>
            </div>

            {/* Form Content */}
            <div className="max-w-3xl space-y-10">

                {/* Section: General */}
                <section>
                    <h2 className="text-[28px] font-[Gilroy-Bold] text-[#1A1A1a] mb-4">
                        General
                    </h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] text-[#1A1A1A]">Currency</label>
                        <div className="relative w-[160px]">
                            <select
                                value={formData.currency}
                                onChange={(e) => handleChange("currency", e.target.value)}
                                className="w-full appearance-none border border-[#E0E0E0] rounded-[6px] px-4 py-3 text-[16px] outline-none focus:border-[#14113B] bg-white cursor-pointer"
                            >
                                <option value="USD ($)">USD ($)</option>
                                <option value="EUR (€)">EUR (€)</option>
                                <option value="SAR (﷼)">SAR (﷼)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0] pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* Section: Event Managers */}
                <section>
                    <h2 className="text-[28px] font-[Gilroy-Bold] text-[#1A1A1a] mb-4">
                        Event Managers
                    </h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-[15px] text-[#1A1A1A]">Maximum Event Price</label>
                        <div className="relative w-[160px]">
                            <input
                                type="text"
                                value={formData.maxEventPrice}
                                onChange={(e) => handleChange("maxEventPrice", e.target.value)}
                                className="w-full border border-[#E0E0E0] rounded-[6px] pl-4 pr-8 py-3 text-[16px] outline-none focus:border-[#14113B]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">$</span>
                        </div>
                    </div>
                </section>

                {/* Section: Students & Visitors */}
                <section>
                    <h2 className="text-[28px] font-[Gilroy-Bold] text-[#1A1A1a] mb-4">
                        Students & Visitors
                    </h2>

                    <div className="space-y-6">
                        {/* Input 1 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[15px] text-[#1A1A1A]">Maximum Graduation Ticket Price</label>
                            <div className="relative w-[160px]">
                                <input
                                    type="text"
                                    value={formData.gradTicketPrice}
                                    onChange={(e) => handleChange("gradTicketPrice", e.target.value)}
                                    className="w-full border border-[#E0E0E0] rounded-[6px] pl-4 pr-8 py-3 text-[16px] outline-none focus:border-[#14113B]"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">$</span>
                            </div>
                        </div>

                        {/* Input 2 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[15px] text-[#1A1A1A]">Maximum tickets to own</label>
                            <div className="w-[160px]">
                                <input
                                    type="number"
                                    value={formData.maxTicketsOwn}
                                    onChange={(e) => handleChange("maxTicketsOwn", e.target.value)}
                                    className="w-full border border-[#E0E0E0] rounded-[6px] px-4 py-3 text-[16px] outline-none focus:border-[#14113B]"
                                />
                            </div>
                        </div>

                        {/* Input 3 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[15px] text-[#1A1A1A]">Cannot resign before event by</label>
                            <div className="relative w-[200px]">
                                <input
                                    type="text"
                                    value={formData.resignHours}
                                    onChange={(e) => handleChange("resignHours", e.target.value)}
                                    className="w-full border border-[#E0E0E0] rounded-[6px] pl-4 pr-12 py-3 text-[16px] outline-none focus:border-[#14113B]"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] text-sm font-medium">hours</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        className="bg-[var(--accent-color)] text-[var(--secondary-color)] font-[Gilroy-Medium] text-[16px] px-8 py-3 rounded-[6px] hover:brightness-105 transition-all"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}