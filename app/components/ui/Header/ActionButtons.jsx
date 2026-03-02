import Link from "next/link";
import { HiSearch, HiUser, HiHeart, HiMenu, HiX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";

export default function ActionButtons({
 setIsSearchModalOpen,
 handleHesabimClick,
 handleSepetClick,
 isMobileMenuOpen,
 setIsMobileMenuOpen,
 cartCount,
 favoriteCount
}) {
 return (
  <div className="flex items-center gap-1 md:gap-2 lg:gap-3 xl:gap-4 text-slate-700">
   <button
    onClick={() => setIsSearchModalOpen(true)}
    aria-label="Ara"
    className="search-icon-button flex flex-col items-center justify-center group hover:bg-slate-50 min-w-[44px] min-h-[44px] p-1 sm:p-2 rounded-lg transition cursor-pointer"
   >
    <HiSearch size={22} className="group-hover:text-indigo-600 transition" />
   </button>

   <button
    onClick={handleHesabimClick}
    aria-label="Hesabım"
    className="hidden xs:flex flex-col items-center justify-center group hover:bg-slate-50 min-w-[44px] min-h-[44px] p-1 sm:p-2 rounded-lg transition cursor-pointer"
   >
    <HiUser size={22} className="group-hover:text-indigo-600 transition" />
   </button>

   <button
    type="button"
    onClick={handleSepetClick}
    aria-label={cartCount > 0 ? `Sepet (${cartCount} ürün)` : "Sepet"}
    className="hidden xs:flex flex-col items-center justify-center group relative hover:bg-slate-50 min-w-[44px] min-h-[44px] p-1 sm:p-2 rounded-lg transition cursor-pointer"
   >
    <div className="relative">
     <FaShoppingCart size={22} className="group-hover:text-indigo-600 transition" />
     {cartCount > 0 && (
      <span className={`absolute bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm leading-none tabular-nums ${cartCount >= 9 ? "px-1.5 min-w-[22px] h-4 -top-3 -right-2" : "w-4 h-4 -top-2 -right-2"}`}>
       {cartCount >= 9 ? "9+" : cartCount}
      </span>
     )}
    </div>
   </button>

   <Link
    href="/favoriler"
    aria-label={favoriteCount > 0 ? `Favoriler (${favoriteCount} ürün)` : "Favoriler"}
    className="hidden xs:flex flex-col items-center justify-center group relative hover:bg-slate-50 min-w-[44px] min-h-[44px] p-1 sm:p-2 rounded-lg transition"
   >
    <div className="relative">
     <HiHeart size={22} className="group-hover:text-indigo-600 transition" />
     {favoriteCount > 0 && (
      <span className={`absolute bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm leading-none tabular-nums ${favoriteCount >= 9 ? "px-1.5 min-w-[22px] h-4 -top-3 -right-2" : "w-4 h-4 -top-2 -right-2"}`}>
       {favoriteCount >= 9 ? "9+" : favoriteCount}
      </span>
     )}
    </div>
   </Link>

   <button
    className="md:hidden text-slate-900 min-w-[44px] min-h-[44px] flex items-center justify-center p-1 sm:p-2 cursor-pointer"
    aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
   >
    {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
   </button>
  </div>
 );
}