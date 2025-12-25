"use client";
import { FaShoppingCart } from "react-icons/fa";
import { HiHeart, HiSwitchHorizontal } from "react-icons/hi";

export default function ProductActions({
 productId,
 stock,
 addedToCart,
 isFavorite,
 isInComparison,
 onAddToCart,
 onFavoriteToggle,
 onComparisonToggle,
}) {
 return (
  <div className="flex gap-3 mb-8">
   <button
    onClick={onAddToCart}
    disabled={stock === 0}
    className={`flex-1 py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 ${addedToCart
     ? "bg-green-600 text-white cursor-pointer"
     : stock > 0
      ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
     }`}
   >
    <FaShoppingCart size={24} />
    {addedToCart ? "Sepete Eklendi!" : "Sepete Ekle"}
   </button>
   <button
    onClick={onComparisonToggle}
    className={`p-4 rounded-lg border-2 transition cursor-pointer ${isInComparison
     ? "border-indigo-600 bg-indigo-600 text-white"
     : "border-gray-200 bg-white text-gray-400 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
     }`}
    title={isInComparison ? "Karşılaştırmadan Çıkar" : "Karşılaştırmaya Ekle"}
   >
    <HiSwitchHorizontal size={24} />
   </button>
   <button
    onClick={onFavoriteToggle}
    className={`p-4 rounded-lg border-2 transition cursor-pointer ${isFavorite
     ? "border-red-600 bg-red-600 text-white"
     : "border-gray-200 bg-white text-gray-400 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
     }`}
    title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
   >
    <HiHeart size={24} className={isFavorite ? "fill-current" : ""} />
   </button>
  </div>
 );
}
