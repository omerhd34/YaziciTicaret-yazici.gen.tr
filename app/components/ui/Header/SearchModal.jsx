/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiSearch, HiX } from "react-icons/hi";
import axiosInstance from "@/lib/axios";
import { getProductUrl } from "@/app/utils/productUrl";

export default function SearchModal({ isOpen, onClose }) {
 const [searchTerm, setSearchTerm] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const [searchTimeout, setSearchTimeout] = useState(null);

 useEffect(() => {
  if (!isOpen) {
   setSearchTerm("");
   setSearchResults([]);
   setShowSuggestions(false);
  }
 }, [isOpen]);

 if (!isOpen) return null;

 const fetchSearchSuggestions = async (term) => {
  if (!term || term.trim().length < 2) {
   setSearchResults([]);
   setShowSuggestions(false);
   return;
  }
  try {
   const res = await axiosInstance.get(`/api/products?search=${encodeURIComponent(term)}&limit=3`);
   if (res.data.success) {
    setSearchResults(res.data.data);
    setShowSuggestions(res.data.data.length > 0);
   } else {
    setSearchResults([]);
    setShowSuggestions(false);
   }
  } catch (error) {
   setSearchResults([]);
   setShowSuggestions(false);
  }
 };

 const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  if (searchTimeout) clearTimeout(searchTimeout);
  const timeout = setTimeout(() => fetchSearchSuggestions(value), 500);
  setSearchTimeout(timeout);
 };

 const handleSearchSubmit = (e) => {
  e.preventDefault();
  const term = searchTerm.trim();
  if (term) {
   onClose();
   window.location.href = `/arama?q=${encodeURIComponent(term)}`;
  }
 };

 return (
  <div className="fixed inset-0 bg-black/50 z-100 flex items-start justify-center pt-20 px-4" onClick={onClose}>
   <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl relative search-container" onClick={(e) => e.stopPropagation()}>
    <div className="p-6">
     <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-slate-900">Arama Yap</h2>
      <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer">
       <HiX size={24} className="text-slate-600" />
      </button>
     </div>
     <form className="w-full relative group" onSubmit={handleSearchSubmit}>
      <input
       type="text"
       value={searchTerm || ""}
       onChange={handleSearchChange}
       onFocus={() => { if (searchResults.length > 0) setShowSuggestions(true); }}
       placeholder="Ürün, kategori, marka veya seri no ara..."
       className="w-full bg-slate-100 border border-transparent rounded-full py-3 pl-5 pr-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
       autoFocus
      />
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-md">
       <HiSearch size={18} />
      </button>
     </form>

     {showSuggestions && searchResults.length > 0 && (
      <div className="mt-4 bg-white rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
       <div className="p-2">
        {searchResults.map((product) => {
         const productUrl = getProductUrl(product);
         return (
          <Link key={product._id} href={productUrl} onClick={onClose} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
           <div className="w-16 h-16 rounded-lg bg-white shrink-0 relative flex items-center justify-center p-1">
            {product.images?.[0] && <Image src={product.images[0]} alt={product.name} width={64} height={64} className="object-contain" />}
           </div>
           <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
            {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
            <div className="mt-1">
             <span className="text-sm font-bold text-indigo-600">{product.discountPrice || product.price} ₺</span>
            </div>
           </div>
          </Link>
         );
        })}
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}