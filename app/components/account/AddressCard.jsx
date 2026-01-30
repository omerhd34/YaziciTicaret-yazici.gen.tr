"use client";
import { HiPencil, HiTrash, HiLocationMarker, HiPhone, HiStar } from "react-icons/hi";

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
 const fullName = [address.firstName || (address.fullName?.split(" ")[0] || ""), address.lastName || (address.fullName?.split(" ").slice(1).join(" ") || "")].filter(Boolean).join(" ");

 return (
  <div
   className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out
${address.isDefault ? "bg-linear-to-br from-indigo-50 via-white to-violet-50/50 border-2 border-indigo-200 shadow-md shadow-indigo-100/50" : "bg-white border border-gray-200/80 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50"}
`}
  >
   {/* Varsayılan badge */}
   {address.isDefault && (
    <div className="absolute top-0 right-0">
     <div className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold pl-3 pr-2.5 py-1 rounded-bl-xl shadow-sm">
      <HiStar size={12} className="shrink-0" />
      Varsayılan
     </div>
    </div>
   )}

   <div className="p-4 pt-5">
    {/* Başlık */}
    <div className="mb-2">
     <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600/80 mb-0.5">
      Adres Başlığı
     </span>
     <p className="text-base font-bold text-gray-900">{address.title}</p>
    </div>

    {/* Ad Soyad */}
    <p className="text-sm font-semibold text-gray-800 mb-2">{fullName}</p>

    {/* Adres satırı - ikonlu */}
    <div className="flex gap-2 mb-2">
     <div className="shrink-0 w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
      <HiLocationMarker size={14} />
     </div>
     <p className="text-sm text-gray-600 leading-snug line-clamp-2">{address.address}</p>
    </div>

    {/* İlçe / Şehir + Telefon */}
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
     <span className="text-xs text-gray-600 font-medium">{address.district} / {address.city}</span>
     <span className="text-gray-300">|</span>
     <span className="flex items-center gap-1 text-xs text-gray-600">
      <HiPhone size={12} className="shrink-0 text-gray-400" />
      <span className="tabular-nums">{address.phone}</span>
     </span>
    </div>
   </div>

   {/* Aksiyonlar */}
   <div className="flex flex-wrap justify-between items-center gap-2 px-4 py-3 bg-gray-50/70 border-t border-gray-100">
    {!address.isDefault && onSetDefault && (
     <button
      onClick={onSetDefault}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all hover:shadow-md hover:shadow-indigo-200 cursor-pointer"
     >
      <HiStar size={14} />
      Varsayılan Yap
     </button>
    )}
    <div className={`flex gap-2 ${address.isDefault ? "ml-auto" : ""}`}>
     <button
      onClick={() => onEdit(address)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all hover:shadow-md hover:shadow-indigo-200 cursor-pointer"
     >
      <HiPencil size={14} />
      Düzenle
     </button>
     <button
      onClick={() => onDelete(address._id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer"
     >
      <HiTrash size={14} />
      Sil
     </button>
    </div>
   </div>
  </div>
 );
}