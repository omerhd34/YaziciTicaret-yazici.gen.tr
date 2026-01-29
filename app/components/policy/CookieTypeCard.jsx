"use client";
import { HiCheckCircle } from "react-icons/hi";

export default function CookieTypeCard({ title, description, items, note, bgColor, borderColor, iconColor }) {
 return (
  <div className={`${bgColor} rounded-lg p-4 sm:p-6 border ${borderColor}`}>
   <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
    <HiCheckCircle className={`${iconColor} w-5 h-5 sm:w-6 sm:h-6 shrink-0`} />
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{title}</h3>
   </div>
   <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-3 leading-relaxed">{description}</p>
   <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4 text-gray-700 text-sm sm:text-base">
    {items.map((item, idx) => (
     <li key={idx}>{item}</li>
    ))}
   </ul>
   {note && (
    <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3 italic">{note}</p>
   )}
  </div>
 );
}
