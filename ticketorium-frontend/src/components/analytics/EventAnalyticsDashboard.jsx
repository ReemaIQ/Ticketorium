// // ticketorium-frontend/src/components/analytics/EventAnalyticsDashboard.jsx
//
// import React, { useEffect, useState, useMemo } from "react";
// import { fetchEventAnalytics } from "../../api/analytics.js";
//
// export default function EventAnalyticsDashboard({ eventId }) {
//     const [payload, setPayload] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//
//     useEffect(() => {
//         let cancelled = false;
//
//         async function load() {
//             try {
//                 setLoading(true);
//                 setError("");
//                 const res = await fetchEventAnalytics(eventId);
//                 if (!cancelled) setPayload(res);
//             } catch (e) {
//                 console.error("[EventAnalyticsDashboard] error:", e);
//                 if (!cancelled) {
//                     setError(e.message || "Failed to load event analytics");
//                 }
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         }
//
//         if (eventId) load();
//
//         return () => {
//             cancelled = true;
//         };
//     }, [eventId]);
//
//     if (loading) {
//         return (
//             <p className="font-[DM-Sans-Light] text-[14px] text-[#6B7280]">
//                 Loading event analytics…
//             </p>
//         );
//     }
//
//     if (error || !payload) {
//         return (
//             <p className="font-[DM-Sans-Light] text-[14px] text-red-500">
//                 {error || "No analytics available for this event."}
//             </p>
//         );
//     }
//
//     const { event, stats } = payload;
//
//     const {
//         joinedCount,
//         waitlistedCount,
//         cancelledCount,
//         noShowCount,
//         capacityTotal,
//         genderBreakdown = {},
//         ageGroups = {},
//         universityBreakdown = {},
//     } = stats;
//
//     const totalStatus =
//         joinedCount + waitlistedCount + cancelledCount + noShowCount || 1;
//
//     const joinedPct = (joinedCount / (capacityTotal || totalStatus)) * 100;
//
//     // Donut segments (angles)
//     const donutData = [
//         { label: "Joined", value: joinedCount, color: "#4F46E5" },
//         { label: "Waitlisted", value: waitlistedCount, color: "#F59E0B" },
//         { label: "Cancelled", value: cancelledCount, color: "#EF4444" },
//         { label: "No-show", value: noShowCount, color: "#6B7280" },
//     ];
//
//     const donutStyle = useMemo(() => {
//         const total = donutData.reduce((sum, d) => sum + d.value, 0) || 1;
//         let currentAngle = 0;
//         const segments = donutData
//             .filter((d) => d.value > 0)
//             .map((d) => {
//                 const angle = (d.value / total) * 360;
//                 const from = currentAngle;
//                 const to = currentAngle + angle;
//                 currentAngle = to;
//                 return {
//                     color: d.color,
//                     from,
//                     to,
//                 };
//             });
//
//         if (!segments.length) {
//             return { background: "#E5E7EB" };
//         }
//
//         const gradient = segments
//             .map(
//                 (s) =>
//                     `${s.color} ${s.from.toFixed(1)}deg ${s.to.toFixed(1)}deg`,
//             )
//             .join(", ");
//
//         return {
//             backgroundImage: `conic-gradient(${gradient})`,
//         };
//     }, [donutData]);
//
//     const buildBars = (obj) => {
//         const entries = Object.entries(obj || {});
//         if (!entries.length) return [];
//
//         const max = Math.max(...entries.map(([, v]) => Number(v) || 0)) || 1;
//
//         return entries
//             .map(([key, value]) => {
//                 const n = Number(value) || 0;
//                 return {
//                     label: key,
//                     value: n,
//                     pct: (n / max) * 100,
//                 };
//             })
//             .sort((a, b) => b.value - a.value);
//     };
//
//     const genderBars = buildBars(genderBreakdown);
//     const ageBars = buildBars(ageGroups);
//     const uniBarsRaw = buildBars(universityBreakdown);
//
//     // Show top 2–3 universities + "Other"
//     const uniBars = useMemo(() => {
//         if (uniBarsRaw.length <= 3) return uniBarsRaw;
//         const top = uniBarsRaw.slice(0, 3);
//         const otherValue = uniBarsRaw
//             .slice(3)
//             .reduce((sum, u) => sum + u.value, 0);
//         return [
//             ...top,
//             {
//                 label: "Other",
//                 value: otherValue,
//                 pct:
//                     (otherValue /
//                         Math.max(
//                             ...uniBarsRaw.map((u) => u.value),
//                             otherValue,
//                         )) * 100,
//             },
//         ];
//     }, [uniBarsRaw]);
//
//     return (
//         <div className="flex flex-col gap-8">
//             {/* Event summary header */}
//             <div className="border border-[#E5E7EB] rounded-[16px] p-6 bg-white shadow-sm">
//                 <h2 className="font-[Gilroy-Black] text-[28px] text-[#111827] mb-1">
//                     {event.title}
//                 </h2>
//                 <p className="font-[DM-Sans-Light] text-[14px] text-[#6B7280]">
//                     {event.location || "Event location"}
//                 </p>
//                 <p className="font-[DM-Sans-Light] text-[14px] text-[#9CA3AF] mt-1">
//                     Capacity:{" "}
//                     <span className="font-[Gilroy-Medium]">
//                         {capacityTotal || "N/A"}
//                     </span>
//                 </p>
//             </div>
//
//             {/* 2. Attendance Donut + Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Donut */}
//                 <div className="flex flex-col items-center justify-center gap-4 border border-[#E5E7EB] rounded-[16px] p-6 bg-white shadow-sm">
//                     <div className="relative w-[180px] h-[180px] flex items-center justify-center">
//                         <div
//                             className="w-full h-full rounded-full"
//                             style={donutStyle}
//                         />
//                         <div className="absolute w-[100px] h-[100px] bg-white rounded-full flex flex-col items-center justify-center">
//                             <span className="font-[Epilogue-Black] text-[24px] text-[#111827]">
//                                 {joinedCount}
//                             </span>
//                             <span className="font-[DM-Sans-Light] text-[12px] text-[#6B7280]">
//                                 Joined
//                             </span>
//                         </div>
//                     </div>
//
//                     <div className="grid grid-cols-2 gap-3 w-full text-[13px]">
//                         {donutData.map((item) => (
//                             <div key={item.label} className="flex items-center gap-2">
//                                 <span
//                                     className="w-3 h-3 rounded-full"
//                                     style={{ backgroundColor: item.color }}
//                                 />
//                                 <span className="font-[DM-Sans-Light] text-[#4B5563]">
//                                     {item.label}:{" "}
//                                     <span className="font-[Gilroy-Medium]">
//                                         {item.value}
//                                     </span>
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//
//                     {/* Progress bar */}
//                     <div className="w-full mt-4">
//                         <p className="font-[DM-Sans-Light] text-[13px] text-[#6B7280] mb-1">
//                             Capacity usage
//                         </p>
//                         <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
//                             <div
//                                 className="h-full rounded-full"
//                                 style={{
//                                     width: `${Math.min(
//                                         Math.max(joinedPct, 0),
//                                         100,
//                                     ).toFixed(1)}%`,
//                                     background:
//                                         "linear-gradient(90deg, #4F46E5, #22C55E)",
//                                 }}
//                             />
//                         </div>
//                         <p className="font-[DM-Sans-Light] text-[12px] text-[#9CA3AF] mt-1">
//                             {joinedCount}/{capacityTotal || "?"} joined
//                         </p>
//                     </div>
//                 </div>
//
//                 {/* Audience breakdown */}
//                 <div className="flex flex-col gap-4 border border-[#E5E7EB] rounded-[16px] p-6 bg-white shadow-sm">
//                     <h3 className="font-[Gilroy-Black] text-[20px] text-[#111827]">
//                         Audience Breakdown
//                     </h3>
//
//                     {/* Gender */}
//                     <div>
//                         <p className="font-[DM-Sans-Light] text-[13px] text-[#6B7280] mb-2">
//                             By Gender
//                         </p>
//                         <div className="flex flex-col gap-2">
//                             {genderBars.length === 0 && (
//                                 <p className="text-[12px] text-[#9CA3AF]">
//                                     No gender data yet.
//                                 </p>
//                             )}
//                             {genderBars.map((g) => (
//                                 <div key={g.label} className="flex items-center gap-2">
//                                     <span className="w-16 text-[12px] text-[#4B5563] capitalize">
//                                         {g.label}
//                                     </span>
//                                     <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
//                                         <div
//                                             className="h-full rounded-full bg-[#4F46E5]"
//                                             style={{ width: `${g.pct.toFixed(1)}%` }}
//                                         />
//                                     </div>
//                                     <span className="w-8 text-right text-[11px] text-[#6B7280]">
//                                         {g.value}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Age groups */}
//                     <div>
//                         <p className="font-[DM-Sans-Light] text-[13px] text-[#6B7280] mb-2">
//                             By Age Group
//                         </p>
//                         <div className="flex flex-col gap-2">
//                             {ageBars.length === 0 && (
//                                 <p className="text-[12px] text-[#9CA3AF]">
//                                     No age data yet.
//                                 </p>
//                             )}
//                             {ageBars.map((a) => (
//                                 <div key={a.label} className="flex items-center gap-2">
//                                     <span className="w-16 text-[12px] text-[#4B5563]">
//                                         {a.label}
//                                     </span>
//                                     <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
//                                         <div
//                                             className="h-full rounded-full bg-[#10B981]"
//                                             style={{ width: `${a.pct.toFixed(1)}%` }}
//                                         />
//                                     </div>
//                                     <span className="w-8 text-right text-[11px] text-[#6B7280]">
//                                         {a.value}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Universities */}
//                     <div>
//                         <p className="font-[DM-Sans-Light] text-[13px] text-[#6B7280] mb-2">
//                             By University
//                         </p>
//                         <div className="flex flex-col gap-2">
//                             {uniBars.length === 0 && (
//                                 <p className="text-[12px] text-[#9CA3AF]">
//                                     No university data yet.
//                                 </p>
//                             )}
//                             {uniBars.map((u) => (
//                                 <div key={u.label} className="flex items-center gap-2">
//                                     <span className="w-24 text-[12px] text-[#4B5563] truncate">
//                                         {u.label}
//                                     </span>
//                                     <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
//                                         <div
//                                             className="h-full rounded-full bg-[#6366F1]"
//                                             style={{ width: `${u.pct.toFixed(1)}%` }}
//                                         />
//                                     </div>
//                                     <span className="w-8 text-right text-[11px] text-[#6B7280]">
//                                         {u.value}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }