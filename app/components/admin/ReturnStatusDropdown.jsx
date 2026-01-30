"use client";

import { HiChevronDown } from "react-icons/hi";
import normalizeText from "@/lib/normalizeText";

const STATUS_STYLES = {
 talepedildi: "bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300 focus:border-amber-500 focus:ring-amber-500/20",
 onaylandi: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20",
 reddedildi: "bg-red-50 border-red-200 text-red-800 hover:border-red-300 focus:border-red-500 focus:ring-red-500/20",
};

function getStatusStyle(value) {
 const key = normalizeText(value || "").replace(/\s+/g, "");
 return STATUS_STYLES[key] || "bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20";
}

export default function ReturnStatusDropdown({ value, onChange, disabled }) {
 const baseClass = "appearance-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold shadow-sm transition cursor-pointer focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed border";
 const statusClass = getStatusStyle(value);

 return (
  <div className="relative inline-flex items-center">
   <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`${baseClass} ${statusClass}`}
   >
    <option value="Talep Edildi">Talep Edildi</option>
    <option value="Onaylandı">Onaylandı</option>
    <option value="Reddedildi">Reddedildi</option>
   </select>
   <span className="pointer-events-none absolute right-3 text-gray-500">
    <HiChevronDown size={18} aria-hidden="true" />
   </span>
  </div>
 );
}
