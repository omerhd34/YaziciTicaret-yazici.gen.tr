"use client";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import ProductCard from "@/app/components/ui/ProductCard";

/**
 * Product Section 
 * Ürün listesi bölümü (Öne Çıkan Ürünler veya Yeniler)
 * 
 * @param {string} title - Bölüm başlığı
 * @param {string} description - Bölüm açıklaması
 * @param {Array} products - Ürün listesi
 * @param {boolean} loading - Yükleme durumu
 * @param {string} viewAllLink - "Tümünü Gör" linki
 */
export default function ProductSection({ title, description, products, loading, viewAllLink }) {
 if (products.length === 0 && !loading) return null;

 return (
  <section className="container mx-auto px-4 py-12">
   <div className="flex justify-between items-center mb-8">
    <div>
     <h2 className="text-3xl font-black text-gray-900 mb-2">{title}</h2>
     <p className="text-gray-600">{description}</p>
    </div>
    {viewAllLink && (
     <Link
      href={viewAllLink}
      className="text-indigo-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
     >
      Tümünü Gör <HiArrowRight size={20} />
     </Link>
    )}
   </div>

   {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
     {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
       <div className="aspect-3/4 bg-gray-200"></div>
       <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
       </div>
      </div>
     ))}
    </div>
   ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
     {products.map((product) => (
      <ProductCard key={product._id} product={product} />
     ))}
    </div>
   )}
  </section>
 );
}
