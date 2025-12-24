"use client";
import { useState } from "react";
import Image from "next/image";
import { HiShoppingBag } from "react-icons/hi";

export default function BrandLogosSection() {
 const brands = [
  { name: "Profilo", src: "/brands/profilo.png" },
  { name: "Philips", src: "/brands/philips.png" },
  { name: "Miele", src: "/brands/miele.svg" },
  { name: "Arnica", src: "/brands/arnica.png" },
  { name: "Karcher", src: "/brands/karcher.png" },
  { name: "LG", src: "/brands/lg.png" },
  { name: "Samsung", src: "/brands/samsung.png" },
  { name: "Grundig", src: "/brands/grundig.png" },
  { name: "Electrolux", src: "/brands/electrolux.png" },
  { name: "Simfer", src: "/brands/simfer.png" },
  { name: "Ferre", src: "/brands/ferre.png" },
  { name: "Daikin", src: "/brands/daikin.png" },
  { name: "Mitsubishi", src: "/brands/mitsubishi.png" },
  { name: "Airfel", src: "/brands/airfel.png" },
 ];

 const [imageErrors, setImageErrors] = useState({});

 const handleImageError = (brandName) => {
  setImageErrors((prev) => ({ ...prev, [brandName]: true }));
 };

 return (
  <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
   <div className="max-w-6xl mx-auto">

    <div className="text-center mb-8 sm:mb-10 md:mb-12">
     <div className="flex items-center justify-center gap-3 mb-4">
      <HiShoppingBag className="text-indigo-600" size={32} />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
       Sattığımız Markalar
      </h2>
     </div>
     <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
      Güvenilir markaların kaliteli ürünlerini sizlerle buluşturuyoruz.
     </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8">
     {brands.map((brand, index) => {
      const logoPath = brand.src || `/logos/${brand.name.toLowerCase()}.png`;
      const hasError = imageErrors[brand.name];

      return (
       <div
        key={index}
        className="flex items-center justify-center p-4 sm:p-6 bg-gray-100 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group"
       >
        <div className="relative w-full h-12 sm:h-16 flex items-center justify-center">
         {!hasError && logoPath ? (
          <Image
           src={logoPath}
           alt={brand.name}
           width={120}
           height={60}
           className="object-contain max-w-full max-h-full opacity-70 group-hover:opacity-100 transition-opacity"
           onError={() => handleImageError(brand.name)}
          />
         ) : (
          <span className="text-gray-700 font-bold text-sm sm:text-base group-hover:text-indigo-600 transition-colors text-center">
           {brand.name}
          </span>
         )}
        </div>
       </div>
      );
     })}
    </div>
   </div>
  </section>
 );
}
