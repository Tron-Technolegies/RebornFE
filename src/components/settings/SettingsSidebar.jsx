// import React, { useState } from "react";

// export default function SettingsSidebar({ active, setActive }) {
//   const items = [/*"Store Details", "Billing & Tax",*/ "Access & Security"];

//   return (
//     <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0">
//       {items.map((item) => (
//         <div
//           key={item}
//           onClick={() => setActive(item)}
//           className={`px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer text-sm whitespace-nowrap transition-all ${active === item
//             ? "bg-yellow-400 text-black font-bold shadow-sm"
//             : "text-gray-500 hover:bg-gray-100 bg-white border border-gray-100 md:border-transparent"
//             }`}
//         >
//           {item}
//         </div>
//       ))}
//     </div>
//   );
// }
