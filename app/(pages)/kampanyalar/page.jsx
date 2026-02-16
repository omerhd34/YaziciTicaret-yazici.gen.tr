"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { HiTicket, HiShoppingCart } from "react-icons/hi";
import { getProductUrl } from "@/app/utils/productUrl";
import { useCart } from "@/context/CartContext";
import Toast from "@/app/components/ui/Toast";

// expectedCode ile eşleşen renk varyantını bul
function findMatchingColor(product, expectedCode) {
 if (!expectedCode || !product?.colors?.length) return null;
 const code = String(expectedCode).trim().toLowerCase();
 return product.colors.find((c) => {
  const sn = c?.serialNumber?.trim().toLowerCase();
  return sn && sn === code;
 }) || null;
}

// Kompakt ürün kartı - expectedCode ile eşleşen varyantın görseli kullanılır
function BundleProductCard({ product, expectedCode }) {
 const matchingColor = findMatchingColor(product, expectedCode);
 const img = matchingColor?.images?.[0]
  || product.images?.[0]
  || product.colors?.[0]?.images?.[0];
 const url = getProductUrl(product, expectedCode || matchingColor?.serialNumber);
 const code = expectedCode || matchingColor?.serialNumber || product.serialNumber || product.colors?.[0]?.serialNumber || "—";
 const price = matchingColor?.price ?? product.price;
 const discountPrice = matchingColor?.discountPrice ?? product.discountPrice;
 const displayPrice =
  discountPrice != null && discountPrice < price ? discountPrice : price;
 const hasDiscount = discountPrice != null && discountPrice < price;

 return (
  <Link
   href={url}
   className="shrink-0 w-44 flex flex-col h-[365px] rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all bg-white group"
  >
   <div className="relative w-full h-44 shrink-0 bg-gray-50">
    {img ? (
     <Image
      src={img}
      alt={product.name}
      width={176}
      height={176}
      className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-200"
      unoptimized
     />
    ) : (
     <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
      ?
     </div>
    )}
   </div>
   <div className="p-3 flex flex-col flex-1 min-h-0 text-left border-t border-gray-100">
    {product.brand && (
     <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide shrink-0">
      {product.brand}
     </span>
    )}
    <span
     className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug shrink-0"
     title={product.name}
    >
     {product.name}
    </span>
    <span className="text-xs text-gray-500 mt-0.5 shrink-0">
     Ürün kodu: <span className="font-medium text-gray-700">{code}</span>
    </span>
    <div className="mt-auto pt-1.5 border-t border-gray-100 shrink-0">
     <span
      className={`text-sm font-bold ${hasDiscount ? "text-green-600" : "text-gray-900"}`}
     >
      {Number(displayPrice).toLocaleString("tr-TR")} ₺
     </span>
     {hasDiscount && (
      <span className="text-xs text-gray-400 line-through ml-1">
       {Number(price).toLocaleString("tr-TR")} ₺
      </span>
     )}
    </div>
   </div>
  </Link>
 );
}

// Kampanya kartı
function BundleCard({ bundle, productsMap, onAddToCart, isAdding, isPurchased }) {
 const productIds = bundle.productIds || [];
 const productCodes = bundle.productCodes || [];
 const productIdToCode = Object.fromEntries(
  productIds.map((id, i) => [id?.toString(), productCodes[i]]).filter(([id]) => id)
 );
 const bundleProducts = productIds
  .map((id) => productsMap[id?.toString()])
  .filter(Boolean);
 const count = productIds.length;
 const productCount = bundleProducts.length || count;

 return (
  <article
   className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
   aria-labelledby={`bundle-title-${bundle._id}`}
  >
   <div className="p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
     <h2
      id={`bundle-title-${bundle._id}`}
      className="text-lg font-bold text-gray-900"
     >
      {bundle.name || "Paket Kampanya"}
     </h2>
     <span
      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold"
      aria-hidden
     >
      <HiTicket className="w-4 h-4" />
      Kampanya
     </span>
    </div>

    <p className="text-2xl font-black text-indigo-600 mb-4">
     {Number(bundle.bundlePrice).toLocaleString("tr-TR")} ₺
    </p>

    <p className="text-sm font-medium text-gray-700 mb-3">
     Kampanyaya dahil ürünler ({productCount} ürün)
    </p>

    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
     {bundleProducts.length > 0 ? (
      bundleProducts.map((product) => (
       <BundleProductCard
        key={product._id}
        product={product}
        expectedCode={productIdToCode[product._id?.toString()]}
       />
      ))
     ) : (
      <p className="text-sm text-gray-500 py-4">
       {count} ürün sepete eklendiğinde paket fiyatı uygulanır.
      </p>
     )}
    </div>

    {isPurchased ? (
     <div className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-600 font-semibold rounded-xl border border-gray-200">
      <HiTicket className="w-5 h-5 shrink-0" />
      Daha önce satın alındı
     </div>
    ) : (
     <button
      type="button"
      onClick={() => onAddToCart(bundle, bundleProducts)}
      disabled={bundleProducts.length === 0 || isAdding}
      className="inline-flex items-center gap-2 w-full justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      aria-busy={isAdding}
     >
      <HiShoppingCart className="w-5 h-5 shrink-0" />
      {isAdding ? "Ekleniyor..." : "Sepete ekle"}
     </button>
    )}
   </div>
  </article>
 );
}

// Yükleme iskeleti
function BundleSkeleton() {
 return (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
   <div className="p-6">
    <div className="flex justify-between mb-4">
     <div className="h-6 w-48 bg-gray-200 rounded" />
     <div className="h-6 w-24 bg-gray-200 rounded-full" />
    </div>
    <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
    <div className="h-4 w-40 bg-gray-200 rounded mb-6" />
    <div className="flex gap-4 overflow-hidden">
     {[1, 2, 3].map((i) => (
      <div key={i} className="shrink-0 w-44 h-[365px] bg-gray-100 rounded-xl" />
     ))}
    </div>
    <div className="h-12 w-full bg-gray-200 rounded-xl mt-6" />
   </div>
  </div>
 );
}

export default function KampanyalarPage() {
 const { addMultipleToCart, userId } = useCart();
 const [bundles, setBundles] = useState([]);
 const [productsMap, setProductsMap] = useState({});
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
 });
 const [addingBundleId, setAddingBundleId] = useState(null);
 const [purchasedBundleIds, setPurchasedBundleIds] = useState([]);

 useEffect(() => {
  const load = async () => {
   try {
    setLoading(true);
    setError(null);
    const [bundlesRes, productsRes] = await Promise.all([
     axiosInstance.get("/api/bundles"),
     axiosInstance.get("/api/products?limit=2000"),
    ]);

    const list =
     bundlesRes.data?.success && Array.isArray(bundlesRes.data.bundles)
      ? bundlesRes.data.bundles
      : [];
    setBundles(list);

    const products =
     productsRes.data?.data || productsRes.data?.products || [];
    const map = {};
    products.forEach((p) => {
     const id = p._id?.toString();
     if (id) map[id] = p;
    });
    setProductsMap(map);
   } catch (err) {
    setBundles([]);
    setError("Kampanyalar yüklenirken bir hata oluştu.");
   } finally {
    setLoading(false);
   }
  };
  load();
 }, []);

 useEffect(() => {
  if (!userId) {
   setPurchasedBundleIds([]);
   return;
  }
  const load = async () => {
   try {
    const res = await axiosInstance.get("/api/user/bundle-purchases");
    const ids = res.data?.purchasedBundleIds || [];
    setPurchasedBundleIds(Array.isArray(ids) ? ids : []);
   } catch {
    setPurchasedBundleIds([]);
   }
  };
  load();
 }, [userId]);

 const handleAddBundleToCart = useCallback(
  async (bundle, bundleProducts) => {
   if (!userId) {
    setToast({
     show: true,
     message: "Sepete eklemek için lütfen giriş yapın.",
     type: "error",
    });
    return;
   }
   if (bundleProducts.length === 0) return;
   if (purchasedBundleIds.includes(String(bundle._id))) {
    return;
   }

   setAddingBundleId(bundle._id);
   try {
    await addMultipleToCart(bundleProducts);
   } catch {
   } finally {
    setAddingBundleId(null);
   }
  },
  [userId, addMultipleToCart, purchasedBundleIds]
 );

 return (
  <>
   <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-10">
     <header className="mb-10">
      <div className="flex items-center gap-3 mb-2">
       <HiTicket className="text-indigo-600 w-8 h-8 shrink-0" aria-hidden />
       <h1 className="text-3xl font-black text-gray-900">Kampanyalar</h1>
      </div>
      <p className="text-gray-600 mb-1">
       Aşağıdaki ürün gruplarını birlikte sepete eklediğinizde kampanya
       paket fiyatı uygulanır. Tek tek fiyatlar yerine paket fiyatından
       yararlanın.
      </p>
      <p className="text-sm text-amber-700 font-medium">
       Her üye her kampanya paketini yalnızca bir kez satın alabilir.
      </p>
     </header>

     {loading ? (
      <div className="space-y-8">
       <BundleSkeleton />
       <BundleSkeleton />
      </div>
     ) : error ? (
      <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
       <p className="text-red-600 font-medium mb-4">{error}</p>
       <button
        type="button"
        onClick={() => window.location.reload()}
        className="text-indigo-600 font-semibold hover:underline"
       >
        Tekrar dene
       </button>
      </div>
     ) : bundles.length === 0 ? (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
       <HiTicket
        className="mx-auto text-gray-300 w-16 h-16 mb-4"
        aria-hidden
       />
       <p className="text-gray-500 font-medium">
        Şu an aktif kampanya bulunmuyor.
       </p>
       <Link
        href="/"
        className="inline-block mt-4 text-indigo-600 font-semibold hover:underline"
       >
        Alışverişe devam et →
       </Link>
      </div>
     ) : (
      <div className="space-y-8">
       {bundles.map((bundle) => (
        <BundleCard
         key={bundle._id}
         bundle={bundle}
         productsMap={productsMap}
         onAddToCart={handleAddBundleToCart}
         isAdding={addingBundleId === bundle._id}
         isPurchased={purchasedBundleIds.includes(String(bundle._id))}
        />
       ))}
      </div>
     )}
    </div>
   </div>
   <Toast toast={toast} setToast={setToast} />
  </>
 );
}
