import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronDown, HiArrowRight } from "react-icons/hi";
import { MENU_ITEMS } from "@/app/utils/menuItems";

export default function DesktopMenu() {
 const [activeMenu, setActiveMenu] = useState(null);

 const closeMenu = () => {
  setActiveMenu(null);
 };

 return (
  <nav
   className="hidden md:block border-t relative border-gray-100 bg-gray-100 z-40"
   onMouseLeave={closeMenu}
  >
   <div className="container mx-auto px-4">
    <ul className="flex items-center gap-3 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] font-bold text-slate-700 tracking-tight">
     {MENU_ITEMS.map((item) => (
      <li
       key={item.path}
       className={`py-3 lg:py-4 ${item.isSpecial ? 'hidden lg:block' : ''}`}
      >
       <Link
        href={item.path}
        onClick={closeMenu}
        onMouseEnter={item.subCategories ? () => setActiveMenu(item.name) : undefined}
        className={`flex items-center gap-1 lg:gap-2 transition-colors py-1 border-b-2 border-transparent whitespace-nowrap ${item.isSpecial
         ? "text-red-600 hover:border-red-600"
         : "hover:text-indigo-600 hover:border-indigo-600"
         } ${activeMenu === item.name ? "text-indigo-600 border-indigo-600" : ""}`}
       >
        {item.name}
        {item.subCategories && (
         <HiChevronDown
          size={14}
          className={`transition-transform duration-300 opacity-50 ${activeMenu === item.name ? "rotate-180 opacity-100" : ""
           }`}
         />
        )}
       </Link>

       {item.subCategories && (
        <div
         className={`absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out transform z-50 ${activeMenu === item.name ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-2"
          }`}
        >
         <div className="container mx-auto p-8">
          <div className="flex gap-12">
           <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
             {item.name} Koleksiyonu
             <span className="h-px flex-1 bg-slate-100"></span>
            </h3>
            <ul className="grid grid-cols-3 gap-x-8 gap-y-3">
             {item.subCategories.map((subItem) => (
              <li key={subItem.path}>
               <Link
                href={subItem.path}
                onClick={closeMenu}
                className="text-slate-500 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 text-[14px] flex items-center gap-2"
               >
                {subItem.name}
               </Link>
              </li>
             ))}
            </ul>

            <Link
             href={item.path}
             onClick={closeMenu}
             className="inline-flex items-center gap-2 mt-8 text-xs font-bold text-indigo-600 uppercase hover:underline"
            >
             Tüm {item.name} Ürünlerini Gör <HiArrowRight size={14} />
            </Link>
           </div>

           <div className="w-1/3 hidden lg:block">
            {(() => {
             const bannerImage = item.bannerImg || "/products/beyaz-esya.webp";
             return (
              <div className="relative h-full min-h-[200px] rounded-xl overflow-hidden group/card">
               <Image
                src={bannerImage}
                alt={item.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-700 group-hover/card:scale-105"
                unoptimized
                priority={false}
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <span className="text-white text-xs font-bold uppercase mb-2 bg-indigo-600 w-fit px-2 py-1 rounded">Özel Fırsatlar</span>
                <h4 className="text-white font-bold text-xl leading-tight">Koleksiyonumuzu Keşfedin</h4>
               </div>
              </div>
             );
            })()}
           </div>
          </div>
         </div>
        </div>
       )}
      </li>
     ))}
    </ul>
   </div>
  </nav>
 );
}