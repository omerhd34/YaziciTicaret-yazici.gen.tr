"use client";

import { HiChevronDown } from "react-icons/hi";

export default function StatusDropdown({ value, onChange, disabled }) {
 return (
  <div className="relative inline-flex items-center">
   <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="appearance-none border border-gray-200 bg-white rounded-lg pl-3 pr-11 py-2 text-sm shadow-xs transition cursor-pointer
     hover:border-slate-300 hover:shadow-md
     focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20
     disabled:opacity-70 disabled:cursor-not-allowed"
   >
    <option value="Beklemede">Beklemede</option>
    <option value="Hazırlanıyor">Hazırlanıyor</option>
    <option value="Kargoya Verildi">Kargoya Verildi</option>
    <option value="Teslim Edildi">Teslim Edildi</option>
   </select>

   <span className="pointer-events-none absolute right-2 inline-flex h-7 w-9 items-center justify-center text-gray-700">
    <HiChevronDown size={18} aria-hidden="true" />
   </span>
  </div>
 );
}
