"use client";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

export default function FavoritesEmpty() {
 return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-32">
   <div className="container mx-auto px-4">
    <div className="text-center py-12">
     <FaHeart size={80} className="mx-auto text-gray-300 mb-4" />
     <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Favori Listeniz Boş
     </h2>
     <p className="text-gray-600 mb-6">
      Beğendiğiniz ürünleri favorilere ekleyerek kolayca ulaşabilirsiniz.
     </p>
     <Link
      href="/"
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition"
     >
      Alışverişe Başla <HiArrowRight size={20} />
     </Link>
    </div>
   </div>
  </div>
 );
}
