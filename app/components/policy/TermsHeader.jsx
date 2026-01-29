"use client";
import { HiDocumentText } from "react-icons/hi";

export default function TermsHeader() {
 return (
  <div className="text-center mb-8 md:mb-12">
   <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-indigo-100 rounded-full mb-4 sm:mb-6">
    <HiDocumentText className="text-indigo-600 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
   </div>
   <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
    Kullanım Koşulları
   </h1>
  </div>
 );
}
