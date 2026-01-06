"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import axiosInstance from "@/lib/axios";
import ProductCard from "@/app/components/ui/ProductCard";
import { MENU_ITEMS } from "@/app/utils/menuItems";

export default function ProductSimilarProducts({ product }) {
 const [similarProducts, setSimilarProducts] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!product) {
   setLoading(false);
   return;
  }

  const fetchSimilarProducts = async () => {
   try {
    setLoading(true);

    let url = "/api/products?limit=1000";

    if (product.subCategory && product.subCategory.trim()) {
     url += `&subCategory=${encodeURIComponent(product.subCategory)}`;
    } else if (product.category) {
     url += `&category=${encodeURIComponent(product.category)}`;
    }

    const res = await axiosInstance.get(url);
    const data = res.data;

    if (data.success) {
     let filtered = data.data.filter((p) => {
      if (p._id === product._id) return false;

      if (product.subCategory && product.subCategory.trim()) {
       const productSubCat = (product.subCategory || '').trim().toLowerCase();
       const pSubCat = (p.subCategory || '').trim().toLowerCase();
       if (productSubCat && pSubCat && productSubCat === pSubCat) {
        return true;
       }
      } else if (product.category) {
       const productCat = (product.category || '').trim().toLowerCase();
       const pCat = (p.category || '').trim().toLowerCase();
       if (productCat && pCat && productCat === pCat) {
        return true;
       }
      }

      return false;
     });

     setSimilarProducts(filtered.slice(0, 4));
    }
   } catch (error) {
    console.error("Benzer ürünler yüklenemedi:", error);
   } finally {
    setLoading(false);
   }
  };

  fetchSimilarProducts();
 }, [product]);

 const getCategoryUrl = () => {
  if (!product) return "/";

  if (product.subCategory && product.subCategory.trim()) {
   for (const menuItem of MENU_ITEMS) {
    if (menuItem.subCategories) {
     const subCat = menuItem.subCategories.find(sub => sub.name === product.subCategory);
     if (subCat) {
      return subCat.path;
     }
    }
   }
  }

  if (product.category) {
   const mainMenuItem = MENU_ITEMS.find(item => item.name === product.category);
   if (mainMenuItem) {
    return mainMenuItem.path;
   }
  }

  return "/";
 };


 if (loading) {
  return (
   <div className="mt-6 sm:mt-8 md:mt-12">
    <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
     <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
      Benzer Ürünler
     </h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
     {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
       <div className="aspect-square bg-gray-200" />
       <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
       </div>
      </div>
     ))}
    </div>
   </div>
  );
 }

 if (similarProducts.length === 0) {
  return null;
 }

 const categoryUrl = getCategoryUrl();

 return (
  <div className="mt-6 sm:mt-8 md:mt-12">
   <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
    <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
     Benzer Ürünler
    </h2>
    <Link
     href={categoryUrl}
     className="text-indigo-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm sm:text-base"
    >
     Tümünü Gör
     <HiArrowRight size={18} className="sm:w-5 sm:h-5" />
    </Link>
   </div>

   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
    {similarProducts.map((similarProduct, index) => (
     <ProductCard key={similarProduct._id} product={similarProduct} priority={index < 4} />
    ))}
   </div>
  </div>
 );
}

