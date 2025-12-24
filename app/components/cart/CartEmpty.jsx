"use client";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";

export default function CartEmpty() {
 return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-32">
   <div className="text-center py-12">
    <FaShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Boş</h2>
    <p className="text-gray-600 mb-6">Henüz sepetinize ürün eklemediniz.</p>
    <Link
     href="/"
     className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition"
    >
     Alışverişe Başla <HiArrowRight size={20} />
    </Link>
   </div>
  </div>
 );
}
