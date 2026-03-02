import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiSearch, HiUser, HiHeart, HiX, HiChevronDown, HiArrowRight, HiGift, HiTag, HiTicket } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { MENU_ITEMS } from "@/app/utils/menuItems";
import Logo from "../Logo";

export default function MobileMenu({
 isOpen,
 closeMenu,
 handleHesabimClick,
 handleSepetClick,
 cartCount,
 favoriteCount
}) {
 const router = useRouter();
 const [searchTerm, setSearchTerm] = useState("");
 const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

 if (!isOpen) return null;

 const toggleMobileSubmenu = (itemName) => {
  setExpandedMobileMenu(expandedMobileMenu === itemName ? null : itemName);
 };

 const handleSearchSubmit = (e) => {
  e.preventDefault();
  const term = searchTerm?.trim();
  if (term) {
   closeMenu();
   router.push(`/arama?q=${encodeURIComponent(term)}`);
  }
 };

 return (
  <>
   {/* Arka plan overlay */}
   <div
    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out"
    onClick={closeMenu}
   />

   {/* Yan Menü Paneli */}
   <div className="md:hidden fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">

    {/* Üst Kısım (Logo ve Kapat Butonu) */}
    <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-purple-600 text-white z-10 shadow-lg">
     <div className="flex items-center justify-between px-4 sm:px-5 py-3">
      <Logo closeMenu={closeMenu} href="/" variant="light" />
      <button
       onClick={closeMenu}
       className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
       aria-label="Menüyü Kapat"
      >
       <HiX size={22} className="text-white" />
      </button>
     </div>
    </div>

    {/* Mobil Arama Çubuğu */}
    <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3">
     <form className="flex gap-2" onSubmit={handleSearchSubmit}>
      <input
       type="search"
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       placeholder="Ürün, kategori ara..."
       className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <button
       type="submit"
       className="flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white transition hover:bg-indigo-700 active:scale-95"
      >
       <HiSearch size={20} />
      </button>
     </form>
    </div>

    {/* Hızlı Bağlantılar (Hesabım, Favoriler, Sepet) */}
    <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-4 space-y-2">
     <button
      type="button"
      onClick={(e) => { closeMenu(); handleHesabimClick(e); }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all cursor-pointer text-left w-full"
     >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
       <HiUser size={20} className="text-indigo-600" />
      </div>
      <span className="font-semibold text-gray-800">Hesabım</span>
     </button>

     <Link
      href="/favoriler"
      onClick={closeMenu}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all text-left w-full"
     >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 relative">
       <HiHeart size={20} className="text-indigo-600" />
       {favoriteCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full">
         {favoriteCount >= 9 ? "9+" : favoriteCount}
        </span>
       )}
      </div>
      <span className="font-semibold text-gray-800">Favoriler</span>
     </Link>

     <button
      type="button"
      onClick={(e) => { closeMenu(); handleSepetClick(e); }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all cursor-pointer text-left w-full"
     >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 relative">
       <FaShoppingCart size={20} className="text-indigo-600" />
       {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full">
         {cartCount >= 9 ? "9+" : cartCount}
        </span>
       )}
      </div>
      <span className="font-semibold text-gray-800">Sepetim</span>
     </button>
    </div>

    {/* Akordeon Kategoriler */}
    <nav className="py-2 bg-gray-50">
     <div className="bg-white mb-2">
      <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategoriler</h3>
      </div>
      <ul className="flex flex-col">
       {MENU_ITEMS.filter(item => !item.isSpecial).map((item) => (
        <li key={item.path} className="border-b border-gray-100 last:border-none">
         {item.subCategories ? (
          <div className="flex flex-col">
           <button
            onClick={() => toggleMobileSubmenu(item.name)}
            className="flex items-center justify-between px-4 sm:px-5 py-4 font-semibold text-gray-900 hover:bg-indigo-50 active:bg-indigo-100 transition-all duration-200 w-full text-left group cursor-pointer"
           >
            <span className="text-base">{item.name}</span>
            <div className="flex items-center gap-2">
             <span className="text-xs text-gray-400 font-normal">{item.subCategories.length} alt kategori</span>
             <HiChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${expandedMobileMenu === item.name ? 'rotate-180 text-indigo-600' : ''}`} />
            </div>
           </button>
           <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMobileMenu === item.name ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="bg-linear-to-b from-gray-50 to-white px-4 sm:px-5 py-3 space-y-1">
             {item.subCategories.map((sub) => (
              <li key={sub.path}>
               <Link href={sub.path} onClick={closeMenu} className="flex items-center gap-2 py-2.5 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium">
                {sub.name}
               </Link>
              </li>
             ))}
             <li className="pt-2 mt-2 border-t border-gray-200">
              <Link href={item.path} onClick={closeMenu} className="flex items-center justify-between gap-2 py-2.5 px-3 text-sm font-bold text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all group">
               <span>Tüm {item.name} Ürünleri</span>
               <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
             </li>
            </ul>
           </div>
          </div>
         ) : (
          <Link href={item.path} onClick={closeMenu} className="flex items-center px-4 sm:px-5 py-4 font-semibold text-gray-900 hover:bg-indigo-50 transition-all text-base">
           {item.name}
          </Link>
         )}
        </li>
       ))}
      </ul>
     </div>

     {/* Özel Fırsatlar Kısmı */}
     <div className="bg-white px-4 sm:px-5 py-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Özel Fırsatlar</h3>
      <div className="flex flex-col gap-2.5">
       {MENU_ITEMS.filter(item => item.isSpecial).map((item) => {
        const getStyles = () => {
         if (item.name === "Yeniler") return "text-red-600 bg-linear-to-r from-red-50 to-red-50/50 hover:from-red-100 border-red-100";
         if (item.name === "İndirimler") return "text-green-600 bg-linear-to-r from-green-50 to-green-50/50 hover:from-green-100 border-green-100";
         if (item.name === "Kampanyalar") return "text-indigo-600 bg-linear-to-r from-indigo-50 to-indigo-50/50 hover:from-indigo-100 border-indigo-100";
         return "text-red-600 bg-red-50 border-red-100"; // Fallback
        };

        return (
         <Link
          key={item.path}
          href={item.path}
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-3.5 font-bold rounded-xl transition-all border ${getStyles()}`}
         >
          <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center shrink-0">
           {item.name === "Yeniler" && <HiGift size={20} />}
           {item.name === "İndirimler" && <HiTag size={20} />}
           {item.name === "Kampanyalar" && <HiTicket size={20} />}
          </div>
          <span>{item.name}</span>
         </Link>
        );
       })}
      </div>
     </div>
    </nav>
   </div>
  </>
 );
}