"use client";
import React, { useState, useEffect } from "react";
import { useComparison } from "@/context/ComparisonContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { HiX, HiSwitchHorizontal, HiHeart } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { getProductUrl } from "@/app/utils/productUrl";
import Toast from "@/app/components/ui/Toast";

export default function UrunKarsilastirPage() {
 const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
 const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [addedToCart, setAddedToCart] = useState({});
 const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
 }, []);

 if (!mounted) {
  return (
   <div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
     <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-6">
       <HiSwitchHorizontal size={64} className="mx-auto text-gray-300" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Karşılaştırma</h1>
      <p className="text-gray-600 mb-8">
       Yükleniyor...
      </p>
     </div>
    </div>
   </div>
  );
 }

 if (comparisonItems.length === 0) {
  return (
   <div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
     <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-6">
       <HiSwitchHorizontal size={64} className="mx-auto text-gray-300" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Karşılaştırma</h1>
      <p className="text-gray-600 mb-8">
       Karşılaştırmak istediğiniz ürünleri ekleyin. En fazla 4 ürün karşılaştırabilirsiniz.
      </p>
      <Link
       href="/"
       className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
       Ürünlere Göz At
      </Link>
     </div>
    </div>
   </div>
  );
 }

 // Tüm ürünlerin özelliklerini birleştir
 const getAllSpecifications = () => {
  const allSpecs = new Map();

  comparisonItems.forEach((product) => {
   const specs = product.specifications || [];
   specs.forEach((specCategory) => {
    const categoryName = specCategory.category;
    if (!allSpecs.has(categoryName)) {
     allSpecs.set(categoryName, new Map());
    }
    const categoryMap = allSpecs.get(categoryName);
    specCategory.items.forEach((item) => {
     categoryMap.set(item.key, true);
    });
   });
  });

  return allSpecs;
 };

 const allSpecs = getAllSpecifications();

 const handleAddToCart = (product) => {
  const stockToCheck = product.stock || 0;
  if (stockToCheck === 0) {
   setToast({ show: true, message: "Bu ürün stokta bulunmamaktadır.", type: "error" });
   return;
  }

  addToCart(product, null, null, 1);
  setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
  setTimeout(() => {
   setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
  }, 2000);
  setToast({ show: true, message: "Ürün sepete eklendi", type: "success" });
 };

 const handleFavoriteToggle = (product) => {
  if (isFavorite(product._id)) {
   removeFromFavorites(product._id);
   setToast({ show: true, message: "Favorilerden çıkarıldı", type: "success" });
  } else {
   addToFavorites(product);
   setToast({ show: true, message: "Favorilere eklendi", type: "success" });
  }
 };

 const getSpecValue = (product, categoryName, key) => {
  const specs = product.specifications || [];
  const category = specs.find((c) => c.category === categoryName);
  if (!category) return "-";
  const item = category.items.find((i) => i.key === key);
  return item ? item.value : "-";
 };

 const getPrice = (product) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  return {
   price: product.price,
   discountPrice: product.discountPrice,
   hasDiscount,
   displayPrice: hasDiscount ? product.discountPrice : product.price,
  };
 };

 // Bir özelliğin tüm ürünlerde farklı olup olmadığını kontrol et
 const isDifferent = (categoryName, key) => {
  if (!showOnlyDifferences) return true; // Filtre kapalıysa tümünü göster

  const values = comparisonItems.map((product) => {
   return getSpecValue(product, categoryName, key);
  });

  // Tüm değerleri normalize et (büyük/küçük harf, boşluk vs.)
  const normalizedValues = values.map(v => String(v).trim().toLowerCase());

  // Eğer tüm değerler aynıysa false döndür (gizle)
  const uniqueValues = new Set(normalizedValues);
  return uniqueValues.size > 1;
 };

 // Genel bilgilerin farklı olup olmadığını kontrol et
 const isGeneralInfoDifferent = (infoType) => {
  if (!showOnlyDifferences) return true;

  if (infoType === 'price') {
   const prices = comparisonItems.map(p => {
    const priceInfo = getPrice(p);
    return priceInfo.displayPrice;
   });
   return new Set(prices).size > 1;
  }

  if (infoType === 'stock') {
   const stocks = comparisonItems.map(p => p.stock > 0 ? 'var' : 'yok');
   return new Set(stocks).size > 1;
  }

  if (infoType === 'rating') {
   const ratings = comparisonItems.map(p => Math.round(p.rating || 0));
   return new Set(ratings).size > 1;
  }

  if (infoType === 'brand') {
   const brands = comparisonItems.map(p => (p.brand || '').trim().toLowerCase());
   return new Set(brands).size > 1;
  }

  return true;
 };

 return (
  <div className="min-h-screen bg-gray-50 py-12" suppressHydrationWarning>
   <Toast toast={toast} setToast={setToast} />

   <div className="container mx-auto px-4" suppressHydrationWarning>
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
     <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Karşılaştırma</h1>
      <p className="text-gray-600">
       {comparisonItems.length} ürün karşılaştırılıyor
      </p>
     </div>
     <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 cursor-pointer">
       <input
        type="checkbox"
        checked={showOnlyDifferences}
        onChange={(e) => setShowOnlyDifferences(e.target.checked)}
        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
       />
       <span className="text-sm font-medium text-gray-700">
        Sadece farkları göster
       </span>
      </label>
      <button
       onClick={clearComparison}
       className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
      >
       Tümünü Temizle
      </button>
     </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
     <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse">
       <thead>
        <tr className="border-b-2 border-gray-200">
         <th className="p-3 text-left font-bold text-gray-900 sticky left-0 bg-white z-20 min-w-[150px] max-w-[150px] border-r border-gray-200">
          Ürünler
         </th>
         {comparisonItems.map((product) => (
          <th key={product._id} className="p-4 text-center align-top min-w-[300px] w-[300px]">
           <div className="relative flex flex-col items-center">
            <button
             onClick={() => removeFromComparison(product._id)}
             className="absolute top-2 right-2 z-30 bg-white p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition rounded-full shadow-md border border-gray-200 hover:border-red-300 cursor-pointer"
             title="Karşılaştırmadan Kaldır"
            >
             <HiX size={20} />
            </button>

            <Link href={getProductUrl(product)} className="block w-full mb-3">
             <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              {product.images && product.images[0] ? (
               <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-3"
                onError={(e) => {
                 e.target.src = "/products/beyaz-esya.webp";
                }}
               />
              ) : (
               <Image
                src="/products/beyaz-esya.webp"
                alt={product.name}
                fill
                className="object-contain p-3"
               />
              )}
             </div>
            </Link>

            <Link href={getProductUrl(product)} className="w-full">
             <h3 className="font-bold text-gray-900 mb-2 hover:text-indigo-600 transition line-clamp-2 text-base text-center min-h-12">
              {product.name}
             </h3>
            </Link>

            {product.brand && (
             <p className="text-xs text-gray-500 mb-2 text-center">{product.brand}</p>
            )}

            <div className="mb-3 w-full">
             {(() => {
              const priceInfo = getPrice(product);
              return (
               <div className="flex flex-col items-center gap-1">
                {priceInfo.hasDiscount ? (
                 <>
                  <span className="text-lg font-bold text-indigo-600">
                   {priceInfo.displayPrice} ₺
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                   {priceInfo.price} ₺
                  </span>
                 </>
                ) : (
                 <span className="text-lg font-bold text-gray-900">
                  {priceInfo.displayPrice} ₺
                 </span>
                )}
               </div>
              );
             })()}
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-3">
             <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
               <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? "fill-current" : "fill-transparent stroke-gray-300"}`}
                viewBox="0 0 20 20"
                strokeWidth={1}
               >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
               </svg>
              ))}
             </div>
             <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
             </span>
            </div>

            <div className="flex flex-col gap-2 w-full">
             <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5  ${addedToCart[product._id]
               ? "bg-green-600 text-white"
               : product.stock > 0
                ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
               }`}
             >
              <FaShoppingCart size={14} />
              {addedToCart[product._id] ? "Eklendi" : "Sepete Ekle"}
             </button>

             <div className="flex gap-2">
              <button
               onClick={() => handleFavoriteToggle(product)}
               className={`flex-1 py-2 rounded-lg border-2 transition flex items-center justify-center cursor-pointer ${isFavorite(product._id)
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-200 hover:border-red-500 hover:text-red-500"
                }`}
              >
               <HiHeart
                size={16}
                className={isFavorite(product._id) ? "fill-current" : ""}
               />
              </button>

              <Link
               href={getProductUrl(product)}
               className="flex-1 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 text-center font-semibold text-xs transition flex items-center justify-center"
              >
               Detay
              </Link>
             </div>
            </div>
           </div>
          </th>
         ))}
        </tr>
       </thead>
       <tbody>
        {/* Genel Bilgiler */}
        {isGeneralInfoDifferent('price') && (
         <tr className="bg-gray-50 border-b border-gray-100">
          <td className="p-3 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-20 border-r border-gray-200 align-middle min-w-[150px] max-w-[150px]">
           Fiyat
          </td>
          {comparisonItems.map((product) => {
           const priceInfo = getPrice(product);
           return (
            <td key={product._id} className="p-4 text-center align-middle">
             {priceInfo.hasDiscount ? (
              <div className="flex flex-col items-center gap-1">
               <span className="text-lg font-bold text-indigo-600">
                {priceInfo.displayPrice} ₺
               </span>
               <span className="text-sm text-gray-400 line-through">
                {priceInfo.price} ₺
               </span>
              </div>
             ) : (
              <span className="text-lg font-bold text-gray-900">
               {priceInfo.displayPrice} ₺
              </span>
             )}
            </td>
           );
          })}
         </tr>
        )}

        {isGeneralInfoDifferent('stock') && (
         <tr className="border-b border-gray-100">
          <td className="p-3 font-semibold text-gray-900 sticky left-0 bg-white z-20 border-r border-gray-200 align-middle min-w-[150px] max-w-[150px]">
           Stok Durumu
          </td>
          {comparisonItems.map((product) => (
           <td key={product._id} className="p-4 text-center align-middle">
            <span
             className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
            >
             {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
            </span>
           </td>
          ))}
         </tr>
        )}

        {isGeneralInfoDifferent('rating') && (
         <tr className="bg-gray-50 border-b border-gray-100">
          <td className="p-3 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-20 border-r border-gray-200 align-middle min-w-[150px] max-w-[150px]">
           Değerlendirme
          </td>
          {comparisonItems.map((product) => (
           <td key={product._id} className="p-4 text-center align-middle">
            <div className="flex items-center justify-center gap-2">
             <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
               <svg
                key={i}
                className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? "fill-current" : "fill-transparent stroke-gray-300"}`}
                viewBox="0 0 20 20"
                strokeWidth={1}
               >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
               </svg>
              ))}
             </div>
             <span className="text-sm text-gray-600">
              {product.rating > 0 ? product.rating.toFixed(1) : "0.0"} ({product.reviewCount || 0})
             </span>
            </div>
           </td>
          ))}
         </tr>
        )}

        {comparisonItems.some(p => p.brand) && isGeneralInfoDifferent('brand') && (
         <tr className="border-b border-gray-100">
          <td className="p-3 font-semibold text-gray-900 sticky left-0 bg-white z-20 border-r border-gray-200 align-middle min-w-[150px] max-w-[150px]">
           Marka
          </td>
          {comparisonItems.map((product) => (
           <td key={product._id} className="p-4 text-center align-middle">
            {product.brand || "-"}
           </td>
          ))}
         </tr>
        )}

        {/* Özellikler */}
        {Array.from(allSpecs.entries()).map(([categoryName, keysMap]) => {
         // Kategorideki farklı özellikleri filtrele
         const differentKeys = Array.from(keysMap.keys()).filter(key => isDifferent(categoryName, key));

         // Eğer bu kategoride farklı özellik yoksa, kategoriyi gösterme
         if (differentKeys.length === 0) return null;

         return (
          <React.Fragment key={categoryName}>
           <tr className="bg-indigo-50">
            <td
             colSpan={comparisonItems.length + 1}
             className="p-3 font-bold text-indigo-900 uppercase text-sm"
            >
             {categoryName}
            </td>
           </tr>
           {differentKeys.map((key) => (
            <tr key={key} className="border-b border-gray-100">
             <td className="p-3 text-gray-700 sticky left-0 bg-white z-20 border-r border-gray-200 align-middle font-medium min-w-[150px] max-w-[150px] text-sm">
              {key}
             </td>
             {comparisonItems.map((product) => (
              <td key={product._id} className="p-4 text-center text-gray-600 align-middle">
               {getSpecValue(product, categoryName, key)}
              </td>
             ))}
            </tr>
           ))}
          </React.Fragment>
         );
        })}
       </tbody>
      </table>
     </div>
    </div>
   </div>
  </div>
 );
}

