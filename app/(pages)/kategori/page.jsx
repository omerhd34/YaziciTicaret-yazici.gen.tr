"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ui/ProductCard";
import Link from "next/link";
import { MdInventory2 } from "react-icons/md";

export default function KategoriPage() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isAdmin, setIsAdmin] = useState(false);

 useEffect(() => {
  fetchProducts();
  checkAdmin();
 }, []);

 const checkAdmin = async () => {
  try {
   const res = await fetch("/api/auth/check");
   const data = await res.json();
   setIsAdmin(data.authenticated || false);
  } catch (error) {
   setIsAdmin(false);
  }
 };

 const fetchProducts = async () => {
  try {
   const res = await fetch("/api/products?limit=50");
   const data = await res.json();

   if (data.success) {
    setProducts(data.data);
   }
  } catch (error) {
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Header */}
   <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
    <div className="container mx-auto px-4">
     <h1 className="text-4xl font-black mb-2">Tüm Ürünler</h1>
     <p className="text-indigo-100">{products.length} ürün bulundu</p>
    </div>
   </div>

   <div className="container mx-auto px-4 py-8">
    {loading ? (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {[...Array(8)].map((_, i) => (
       <div
        key={i}
        className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
       >
        <div className="aspect-3/4 bg-gray-200"></div>
        <div className="p-4 space-y-3">
         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
       </div>
      ))}
     </div>
    ) : products.length === 0 ? (
     <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <MdInventory2 size={80} className="mx-auto text-gray-300 mb-4" />
      {isAdmin ? (
       <>
        <p className="text-gray-500 text-lg mb-4">Henüz ürün eklenmemiş</p>
        <p className="text-gray-400 text-sm mb-6">
         Admin panelinden ürün ekleyerek başlayabilirsiniz
        </p>
        <Link
         href="/admin"
         className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition"
        >
         Admin Paneline Git
        </Link>
       </>
      ) : (
       <>
        <p className="text-gray-500 text-lg mb-4">Şu anda ürün bulunmamaktadır</p>
        <p className="text-gray-400 text-sm mb-6">
         Yakında yeni ürünler eklenecektir. Lütfen daha sonra tekrar kontrol edin.
        </p>
        <Link
         href="/"
         className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition"
        >
         Ana Sayfaya Dön
        </Link>
       </>
      )}
     </div>
    ) : (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {products.map((product) => (
       <ProductCard key={product._id} product={product} />
      ))}
     </div>
    )}
   </div>
  </div>
 );
}
