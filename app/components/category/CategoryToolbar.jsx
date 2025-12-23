"use client";
import { HiAdjustments } from "react-icons/hi";

export default function CategoryToolbar({ sortBy, onSortChange, onFiltersClick }) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
   <button
    onClick={onFiltersClick}
    className="lg:hidden flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
   >
    <HiAdjustments size={18} />
    Filtreler
   </button>

   <div className="flex items-center gap-2">
    <span className="text-sm text-gray-600 font-medium">Sırala:</span>
    <div className="relative inline-flex items-center">
     <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
     >
      <option value="-createdAt">Yeni Ürünler</option>
      <option value="price">Fiyat: Düşükten Yükseğe</option>
      <option value="-price">Fiyat: Yüksekten Düşüğe</option>
      <option value="-rating">En Yüksek Puan</option>
      <option value="-soldCount">En Çok Satan</option>
     </select>
     <span className="pointer-events-none absolute right-3 inline-flex items-center justify-center text-gray-700">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
       <path d="M6.5 8.25l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
     </span>
    </div>
   </div>
  </div>
 );
}
