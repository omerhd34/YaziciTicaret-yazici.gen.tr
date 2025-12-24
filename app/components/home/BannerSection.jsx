"use client";
import Link from "next/link";
import Image from "next/image";
import { HiSparkles } from "react-icons/hi";

export default function BannerSection() {
 return (
  <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
   <div className="relative bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
    <div className="grid md:grid-cols-2 items-center">
     <div className="p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center md:text-left">
      <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
       <HiSparkles size={14} className="sm:w-4 sm:h-4" />
       Yeni Sezon
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">
       En Yeni Ürünler
       <br />
       <span className="text-yellow-200">Sizlerle Buluşuyor</span>
      </h2>
      <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-orange-100">
       Sezonun en trend ürünlerini keşfedin
      </p>
      <Link
       href="/kategori/yeniler"
       className="inline-block bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-200 transition shadow-lg"
      >
       Yeni Ürünleri Gör
      </Link>
     </div>
     <div className="hidden md:block max-h-64 lg:max-h-80 xl:max-h-96 overflow-hidden">
      <Image
       src="/products/fix.webp"
       width={800}
       height={700}
       alt="Sale Banner"
       className="w-full h-full object-cover"
      />
     </div>
    </div>
   </div>
  </section>
 );
}
