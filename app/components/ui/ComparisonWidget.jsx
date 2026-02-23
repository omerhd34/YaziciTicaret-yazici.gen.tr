"use client";
import { useState, useEffect } from "react";
import { useComparison } from "@/context/ComparisonContext";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiX, HiSwitchHorizontal, HiChevronUp } from "react-icons/hi";
import { getProductUrl } from "@/app/utils/productUrl";

export default function ComparisonWidget() {
 const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
 const router = useRouter();
 const pathname = usePathname();
 const [isExpanded, setIsExpanded] = useState(false);
 const [mounted, setMounted] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);

 // Client-side mount kontrolü (hydration hatasını önlemek için)
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
 }, []);

 // Modal açık mı kontrol et
 useEffect(() => {
  if (!mounted) return;

  const checkModal = () => {
   // Modal overlay'i kontrol et (fixed inset-0 z-50 class'ına sahip element)
   const modalOverlay = document.querySelector('.fixed.inset-0.z-50.bg-black');
   setIsModalOpen(!!modalOverlay);
  };

  // İlk kontrol
  checkModal();

  // MutationObserver ile DOM değişikliklerini izle
  const observer = new MutationObserver(checkModal);
  observer.observe(document.body, {
   childList: true,
   subtree: true,
   attributes: true,
   attributeFilter: ['class'],
  });

  return () => observer.disconnect();
 }, [mounted]);

 // Client-side render kontrolü
 if (!mounted) {
  return null;
 }

 // Modal açıkken widget'ı gizle
 if (isModalOpen) {
  return null;
 }

 // Admin, giriş ve diğer bazı sayfalarda widget'ı gösterme
 if (pathname?.startsWith("/admin") ||
  pathname?.startsWith("/giris") ||
  pathname?.startsWith("/sepet") ||
  pathname?.startsWith("/odeme")) {
  return null;
 }

 if (comparisonItems.length === 0) {
  return null;
 }

 const handleCompare = () => {
  setIsExpanded(false); // Widget'ı kapat
  router.push("/urun-karsilastir");
 };

 return (
  <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto z-50 sm:w-full sm:max-w-xs">
   <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
    <button
     onClick={() => setIsExpanded(!isExpanded)}
     className="w-full bg-indigo-600 text-white px-4 py-3 sm:px-3 sm:py-2 flex items-center justify-between hover:bg-indigo-700 transition cursor-pointer active:bg-indigo-800"
    >
     <div className="flex items-center gap-2 sm:gap-1.5 min-w-0 flex-1">
      <HiSwitchHorizontal className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" />
      <span className="font-semibold text-sm sm:text-xs truncate">
       Karşılaştırmak için {comparisonItems.length} ürün
      </span>
     </div>
     <HiChevronUp
      className={`w-5 h-5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
     />
    </button>

    {/* Content - mobilde daha geniş padding ve font */}
    {isExpanded && (
     <div className="p-4 sm:p-3 max-h-[70vh] sm:max-h-[400px] overflow-y-auto">
      <div className="space-y-3 sm:space-y-1.5 mb-3 sm:mb-2">
       {comparisonItems.map((product) => {
        const priceInfo = product.discountPrice && product.discountPrice < product.price
         ? { price: product.price, discountPrice: product.discountPrice, displayPrice: product.discountPrice }
         : { price: product.price, discountPrice: null, displayPrice: product.price };

        return (
         <div
          key={product._id}
          className="flex items-center gap-3 sm:gap-2 p-3 sm:p-2 bg-gray-50 rounded-xl sm:rounded-lg hover:bg-gray-100 transition border border-gray-200"
         >
          <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl sm:rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
           {product.images && product.images[0] ? (
            <Image
             src={product.images[0]}
             alt={product.name}
             fill
             className="object-contain p-2 sm:p-1.5"
             onError={(e) => {
              e.target.src = "/products/beyaz-esya.webp";
             }}
            />
           ) : (
            <Image
             src="/products/beyaz-esya.webp"
             alt={product.name}
             fill
             className="object-contain p-2 sm:p-1.5"
            />
           )}
          </div>
          <div className="flex-1 min-w-0">
           <Link
            href={getProductUrl(product)}
            className="text-sm sm:text-xs font-semibold text-gray-900 hover:text-indigo-600 transition line-clamp-2 mb-1"
           >
            {product.name}
           </Link>
           {(product.brand || product.serialNumber) && (
            <p className="text-xs sm:text-[10px] text-gray-500 mb-1 line-clamp-1">
             {product.brand && product.serialNumber
              ? `${product.brand} - ${product.serialNumber}`
              : product.brand || product.serialNumber}
            </p>
           )}
           <div className="flex items-center gap-1">
            {priceInfo.discountPrice ? (
             <>
              <span className="text-sm sm:text-xs font-bold text-indigo-600">
               {priceInfo.displayPrice} ₺
              </span>
              <span className="text-xs sm:text-[10px] text-gray-400 line-through">
               {priceInfo.price} ₺
              </span>
             </>
            ) : (
             <span className="text-sm sm:text-xs font-bold text-gray-900">
              {priceInfo.displayPrice} ₺
             </span>
            )}
           </div>
          </div>
          <button
           onClick={() => removeFromComparison(product._id)}
           className="p-2.5 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition shrink-0 cursor-pointer touch-manipulation"
           title="Kaldır"
          >
           <HiX className="w-5 h-5 sm:w-[14px] sm:h-[14px]" />
          </button>
         </div>
        );
       })}
      </div>

      <div className="flex gap-2 sm:gap-1.5 pt-3 sm:pt-2 border-t border-gray-200">
       <button
        onClick={clearComparison}
        className="flex-1 px-4 py-2.5 sm:px-3 sm:py-1.5 bg-gray-100 text-gray-700 rounded-xl sm:rounded-lg text-sm sm:text-xs font-semibold hover:bg-gray-200 transition cursor-pointer active:bg-gray-300"
       >
        Sıfırla
       </button>
       <button
        onClick={handleCompare}
        disabled={comparisonItems.length < 2}
        className={`flex-1 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg text-sm sm:text-xs font-semibold transition cursor-pointer touch-manipulation ${comparisonItems.length >= 2
         ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
         : "bg-gray-300 text-gray-500 cursor-not-allowed"
         }`}
       >
        Karşılaştır
       </button>
      </div>

      {comparisonItems.length < 2 && (
       <p className="text-xs sm:text-[10px] text-gray-500 text-center mt-2 sm:mt-1.5">
        Karşılaştırmak için en az 2 ürün seçin.
       </p>
      )}
     </div>
    )}
   </div>
  </div>
 );
}