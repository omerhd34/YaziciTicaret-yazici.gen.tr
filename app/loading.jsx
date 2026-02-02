"use client";
import "./globals.css";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import { HiSparkles } from "react-icons/hi";

export default function Loading() {
 return (
  <>
   <Header />
   <main id="main-content" className="min-h-screen flex-1 bg-linear-to-br from-gray-50 via-indigo-50/30 to-gray-50 flex items-center justify-center px-4 py-12">
    <div className="text-center">
     <div className="relative inline-block mb-8">
      <HiSparkles className="text-6xl text-indigo-600 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
     </div>
     <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Yükleniyor...
     </h2>
     <p className="text-gray-600">
      Lütfen bekleyin.
     </p>
    </div>
   </main>
   <Footer />
  </>
 );
}

