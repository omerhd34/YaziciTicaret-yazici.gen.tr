"use client";
import "./globals.css";
import Link from "next/link";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import {
 HiExclamationCircle,
 HiRefresh,
 HiHome,
 HiArrowLeft
} from "react-icons/hi";

export default function Error({ reset }) {
 return (
  <>
   <Header />
   <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50/30 to-gray-50 flex items-start justify-center px-4 pt-16 pb-8">
    <div className="max-w-4xl w-full">
     <div className="text-center mb-6">
      <div className="relative inline-block">
       <h1 className="text-7xl md:text-[7rem] font-black text-transparent bg-clip-text bg-linear-to-r from-red-600 via-orange-600 to-red-600 animate-pulse">
        500
       </h1>
       <div className="absolute -top-4 -right-4 animate-bounce delay-75">
        <HiExclamationCircle className="text-6xl text-red-400 opacity-60" />
       </div>
      </div>
     </div>

     <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-fadeIn">
      <div className="text-center mb-8">
       <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Bir Hata Oluştu
       </h2>
       <p className="text-lg text-gray-600 mb-2">
        Üzgünüz, beklenmeyen bir hata meydana geldi.
       </p>
       <p className="text-base text-gray-500">
        Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
       </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
       <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
       >
        <HiRefresh className="h-5 w-5" />
        Tekrar Dene
       </button>
       <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
       >
        <HiArrowLeft className="h-5 w-5" />
        Geri Dön
       </button>
       <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
       >
        <HiHome className="h-5 w-5" />
        Ana Sayfa
       </Link>
      </div>

      <div className="text-center">
       <p className="text-sm text-gray-500">
        Sorun devam ediyorsa{" "}
        <Link href="/destek" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
         Destek
        </Link>
        {" "}sayfamızdan bize ulaşabilirsiniz.
       </p>
      </div>
     </div>
    </div>
   </div>
   <Footer />
  </>
 );
}

