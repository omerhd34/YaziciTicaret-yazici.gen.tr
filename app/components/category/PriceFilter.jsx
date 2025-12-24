"use client";

export default function PriceFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, isMobile = false }) {
 return (
  <div className={isMobile ? "mb-6" : "mb-6 pb-6 border-b"}>
   <h4 className="font-semibold mb-4">Fiyat Aralığı (₺)</h4>
   <div className="space-y-3">
    <input
     type="number"
     placeholder="Min"
     value={minPrice}
     onChange={(e) => onMinPriceChange(e.target.value)}
     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
    />
    <input
     type="number"
     placeholder="Max"
     value={maxPrice}
     onChange={(e) => onMaxPriceChange(e.target.value)}
     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
    />
   </div>
  </div>
 );
}
