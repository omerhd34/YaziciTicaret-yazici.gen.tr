"use client";
import { HiShieldCheck } from "react-icons/hi";

export default function CookiePolicyHeader() {
 return (
  <div className="text-center mb-12">
   <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
    <HiShieldCheck className="text-indigo-600" size={40} />
   </div>
   <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
    Çerez Politikası
   </h1>
  </div>
 );
}
