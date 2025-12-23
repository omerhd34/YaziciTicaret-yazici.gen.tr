"use client";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiSparkles } from "react-icons/hi";

export default function HeroSection() {
 return (
  <section className="relative bg-linear-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
   <div className="absolute inset-0 bg-black/10"></div>
   <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
    <div className="flex items-center gap-8 lg:gap-12">
     <div className="flex-1 max-w-3xl">
      <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
       <HiSparkles size={18} />
       Hızlı ve Güvenilir Teslimat
      </span>
      <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
       Yazıcı Ticaret
       <br />
       <span className="text-yellow-300">Kalite ve Güven</span>
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-indigo-100">
       Beyaz eşyadan elektroniğe kadar tüm ürünlerimiz, güvenle sizleri bekliyor.
      </p>
      <div className="flex flex-wrap gap-4">
       <Link
        href="/kategori/kampanyalar"
        className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-gray-900 transition-all duration-500 ease-in-out flex items-center gap-2 shadow-lg"
       >
        Kampanyalar <HiArrowRight size={20} />
       </Link>
       <Link
        href="/kategori/indirim"
        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-500 ease-in-out"
       >
        İndirimleri Keşfet
       </Link>
      </div>
     </div>
     <div className="hidden lg:block flex-1 max-w-2xl ml-auto">
      <div className="relative flex justify-end">
       <Image
        src="/products/ankastre/ankastre.jpg"
        alt="PROFILO"
        width={1200}
        height={800}
        className="w-full h-auto object-contain border-4 rounded-4xl"
        priority
       />
      </div>
     </div>
    </div>
   </div>

   {/* Decorative Elements */}
   <div className="absolute -bottom-1 left-0 right-0">
    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path
      d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
      fill="#F9FAFB"
     />
    </svg>
   </div>
  </section>
 );
}
