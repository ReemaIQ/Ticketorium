// export default function NotificationList({notifications = {}, maxItems = 5, onItemClick,}) {
//     const visible = notifications.slice(0, maxItems);
//
//     if (!visible.length) {
//         return (
//             <div className="px-4 py-2 text-[13px] text-gray-500">
//                 No notifications yet.
//             </div>
//         );
//     }
//
//     return (
//         <div className="max-h-56 overflow-y-auto">
//             {visible.map((notif) => (
//                 <button
//                     key={notif.id}
//                     type="button"
//                     onClick={() => onItemClick && onItemClick(notif)}
//                     className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100 flex flex-col gap-0.5 ${
//                         notif.read
//                             ? "text-[#555]"
//                             : "text-[#14113B] font-[Gilroy-Medium]"
//                     }`}
//                 >
//                     <span className="truncate">{notif.title}</span>
//                     {notif.time && (
//                         <span className="text-[11px] text-gray-500">{notif.time}</span>
//                     )}
//                 </button>
//             ))}
//         </div>
//     );
// }
