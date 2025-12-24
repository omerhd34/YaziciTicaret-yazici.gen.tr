"use client";

export default function ReturnStatusDropdown({ value, onChange, disabled }) {
 return (
  <select
   value={value}
   onChange={onChange}
   disabled={disabled}
   className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm shadow-xs transition cursor-pointer
    hover:border-slate-300 hover:shadow-md
    focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20
    disabled:opacity-70 disabled:cursor-not-allowed"
  >
   <option value="Talep Edildi">Talep Edildi</option>
   <option value="Onaylandı">Onaylandı</option>
   <option value="Reddedildi">Reddedildi</option>
  </select>
 );
}
