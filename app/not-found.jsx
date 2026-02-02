"use client";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { HiSearch, HiSparkles, HiExclamationCircle } from "react-icons/hi";

export default function NotFound() {
 const router = useRouter();
 const [searchTerm, setSearchTerm] = useState("");

 const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
   router.push(`/arama?q=${encodeURIComponent(searchTerm.trim())}`);
  }
 };
 return (
  <>
   <Header />
   <main id="main-content" className="min-h-screen flex-1 bg-linear-to-br from-gray-50 via-indigo-50/30 to-gray-50 flex items-start justify-center px-4 pt-16 pb-8">
    <div className="max-w-4xl w-full">
     <div className="text-center mb-6">
      <div className="relative inline-block">
       <h1 className="text-7xl md:text-[7rem] font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse">
        404
       </h1>
       <div className="absolute -top-4 -right-4 animate-bounce delay-75">
        <HiExclamationCircle className="text-6xl text-indigo-400 opacity-60" />
       </div>
       <div className="absolute -bottom-4 -left-4 animate-bounce delay-150">
        <HiSparkles className="text-5xl text-purple-400 opacity-60" />
       </div>
      </div>
     </div>
     {/* Main Content */}
     <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-fadeIn">
      {/* Error Message */}
      <div className="text-center mb-8">
       <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Sayfa Bulunamadı.
       </h2>
       <p className="text-lg text-gray-600 mb-2">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
       </p>
       <p className="text-base text-gray-500">
        Lütfen URL&apos;yi kontrol edin.
       </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
       <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
         <HiSearch className="h-6 w-6 text-gray-400" />
        </div>
        <input
         type="text"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         placeholder="Ürün veya kategori ara..."
         className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
         type="submit"
         className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
        >
         Ara
        </button>
       </div>
       <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
         Bir sorun mu yaşıyorsunuz?{" "}
         <Link href="/destek" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
          Destek
         </Link>
         {" "}sayfamızdan bize ulaşabilirsiniz.
        </p>
       </div>
      </form>
     </div>
    </div>
   </main>
   <Footer />
  </>
 );
}