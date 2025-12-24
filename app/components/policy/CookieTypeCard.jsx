"use client";
import { HiCheckCircle } from "react-icons/hi";

export default function CookieTypeCard({ title, description, items, note, bgColor, borderColor, iconColor }) {
 return (
  <div className={`${bgColor} rounded-lg p-6 border ${borderColor}`}>
   <div className="flex items-center gap-3 mb-3">
    <HiCheckCircle className={iconColor} size={24} />
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
   </div>
   <p className="text-gray-700 mb-3">{description}</p>
   <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
    {items.map((item, idx) => (
     <li key={idx}>{item}</li>
    ))}
   </ul>
   {note && (
    <p className="text-gray-600 text-sm mt-3 italic">{note}</p>
   )}
  </div>
 );
}
