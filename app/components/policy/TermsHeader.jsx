"use client";
import { HiDocumentText } from "react-icons/hi";

export default function TermsHeader() {
 return (
  <div className="text-center mb-12">
   <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
    <HiDocumentText className="text-indigo-600" size={40} />
   </div>
   <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
    Kullanım Koşulları
   </h1>
  </div>
 );
}
