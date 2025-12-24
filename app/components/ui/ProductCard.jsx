"use client";
import Link from "next/link";
import { HiHeart, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { getProductUrl } from "@/app/utils/productUrl";
import { getColorHex } from "@/app/utils/colorUtils";

export default function ProductCard({ product }) {
 const [isImageHovered, setIsImageHovered] = useState(false);
 const [currentImageIndex, setCurrentImageIndex] = useState(0);
 const { addToFavorites, removeFromFavorites, isFavorite: checkFavorite } = useCart();
 const isFavorite = checkFavorite(product._id);

 const allColors = product._allColors || product.colors;
 const validColors = allColors ? allColors.filter(c => typeof c === 'object' && c.serialNumber) : [];
 const initialColor = validColors.length > 0 ? validColors[0] : null;
 const [selectedColorState, setSelectedColorState] = useState({ productId: product._id, color: null });
 const selectedColor = selectedColorState.productId === product._id ? selectedColorState.color : null;
 const currentColor = selectedColor || initialColor;
 const images = currentColor?.images && currentColor.images.length > 0
  ? currentColor.images
  : (product.images && product.images.length > 0 ? product.images : ["/products/beyaz-esya.webp"]);

 const colorPrice = currentColor?.price || product.price;
 const colorDiscountPrice = currentColor?.discountPrice !== undefined ? currentColor.discountPrice : product.discountPrice;
 const colorSerialNumber = currentColor?.serialNumber || product.serialNumber;

 const sortedColors = validColors;
 const hasMultipleColors = sortedColors.length > 1;

 const handleColorChange = (color) => {
  setSelectedColorState({ productId: product._id, color });
  const newColorImages = color?.images && color.images.length > 0 ? color.images : (product.images || []);
  if (currentImageIndex >= newColorImages.length) {
   setCurrentImageIndex(Math.max(0, newColorImages.length - 1));
  }
 };

 const hasDiscount = colorDiscountPrice && colorDiscountPrice < colorPrice;
 const discountPercentage = hasDiscount
  ? Math.round(((colorPrice - colorDiscountPrice) / colorPrice) * 100)
  : 0;

 const productUrl = getProductUrl(product, colorSerialNumber);

 return (
  <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
   <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
    {product.isNew && (
     <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center flex items-center justify-center">
      YENİ
     </span>
    )}
    {discountPercentage > 0 && (
     <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center flex items-center justify-center">
      %{discountPercentage} İNDİRİM
     </span>
    )}
   </div>

   <button
    onClick={(e) => {
     e.preventDefault();
     if (isFavorite) {
      removeFromFavorites(product._id);
     } else {
      addToFavorites(product);
     }
    }}
    className={`absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md transition-all cursor-pointer ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
     }`}
   >
    <HiHeart size={18} className={isFavorite ? "fill-current" : ""} />
   </button>

   <div
    className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-4"
    onMouseEnter={() => setIsImageHovered(true)}
    onMouseLeave={() => setIsImageHovered(false)}
   >
    <Link href={productUrl} className="w-full h-full flex items-center justify-center">
     {images[currentImageIndex] && images[currentImageIndex] !== null ? (
      <Image
       width={600}
       height={600}
       src={images[currentImageIndex]}
       alt={product.name}
       quality={90}
       className={`max-w-full max-h-full object-contain transition-transform duration-500 ${isImageHovered ? "scale-110" : "scale-100"
        }`}
       onError={(e) => {
        e.target.src = "/products/beyaz-esya.webp";
       }}
      />
     ) : (
      <Image
       width={600}
       height={600}
       src="/products/beyaz-esya.webp"
       alt={product.name}
       quality={90}
       className={`max-w-full max-h-full object-contain transition-transform duration-500 ${isImageHovered ? "scale-110" : "scale-100"
        }`}
      />
     )}
    </Link>

    {images.length > 1 && (
     <>
      <button
       onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
       }}
       className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-20 cursor-pointer"
       aria-label="Önceki resim"
      >
       <HiChevronLeft size={20} className="text-gray-700" />
      </button>
      <button
       onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
       }}
       className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-20 cursor-pointer"
       aria-label="Sonraki resim"
      >
       <HiChevronRight size={20} className="text-gray-700" />
      </button>
     </>
    )}
   </div>

   <div className="px-4 pt-3 pb-2 flex justify-center gap-2">
    {images.length > 1 ? (
     images.map((_, index) => (
      <button
       key={index}
       onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex(index);
       }}
       className={`transition-all ${currentImageIndex === index
        ? "w-2.5 h-2.5 bg-indigo-600 rounded-full"
        : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
        }`}
       aria-label={`Resim ${index + 1}`}
      />
     ))
    ) : (
     <div className="h-2.5" />
    )}
   </div>

   <div className="p-4 bg-gray-100 flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-2">
     {product.brand && (
      <p className="text-xs text-gray-500 uppercase tracking-wide">
       {product.brand}
      </p>
     )}
     {colorSerialNumber && (
      <span className="inline-block bg-indigo-100 text-indigo-700 font-mono text-xs px-2 py-0.5 rounded-md font-semibold normal-case">
       {colorSerialNumber}
      </span>
     )}
     {!product.brand && !colorSerialNumber && <div />}
    </div>

    <div className="flex items-center gap-2 mb-2">
     <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 min-w-0">
      <Link href={productUrl} className="hover:text-indigo-600 transition no-underline">
       {product.name}
      </Link>
     </h3>
     <div className="flex items-center gap-1 shrink-0">
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
      <span className="text-xs text-gray-500">
       {product.rating > 0 ? `(${product.reviewCount || 0})` : "(0)"}
      </span>
     </div>
    </div>


    <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-200">
     <div className="flex items-baseline gap-2">
      {hasDiscount ? (
       <>
        <span className="text-xl font-bold text-indigo-600 ">
         {colorDiscountPrice} ₺
        </span>
        <span className="text-sm text-gray-400 line-through">
         {colorPrice} ₺
        </span>
       </>
      ) : (
       <span className="text-xl font-bold text-gray-900">
        {colorPrice} ₺
       </span>
      )}
     </div>

     {hasMultipleColors && (
      <div className="flex gap-2 flex-wrap shrink-0">
       {sortedColors.map((color, idx) => {
        const isSelected = currentColor && currentColor.serialNumber === color.serialNumber;
        return (
         <button
          key={color.serialNumber || idx}
          onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           handleColorChange(color);
          }}
          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${isSelected
           ? "border-indigo-600 scale-110 ring-2 ring-indigo-200"
           : "border-gray-200 hover:border-gray-300"
           }`}
          style={{ backgroundColor: getColorHex(color) }}
          title={color.name}
          aria-label={`${color.name} rengini seç`}
         />
        );
       })}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
