"use client";
import Link from "next/link";
import Image from "next/image";
import { HiPlus, HiMinus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { getProductUrl } from "@/app/utils/productUrl";

export default function CartItemCard({ item, onUpdateQuantity, onRemove }) {
 const hasDiscount = item.discountPrice && item.discountPrice < item.price;
 const itemPrice = hasDiscount ? item.discountPrice : item.price;
 const itemTotal = itemPrice * item.quantity;
 const originalPrice = item.price;
 const allColors = item._allColors || item.colors;
 const selectedColorObj = item.selectedColor && allColors && Array.isArray(allColors)
  ? allColors.find(c => typeof c === 'object' && c.name === item.selectedColor)
  : null;
 const productImages = selectedColorObj?.images && selectedColorObj.images.length > 0
  ? selectedColorObj.images
  : (item.images && item.images.length > 0 ? item.images : ["/products/beyaz-esya.webp"]);
 const displayImage = productImages[0];
 const displaySerialNumber = selectedColorObj?.serialNumber || item.serialNumber;
 const productUrl = getProductUrl(item, displaySerialNumber);

 const priceBlock = (
  <div className="text-center sm:text-right shrink-0">
   <p className="text-base font-semibold sm:font-bold text-indigo-600">
    {itemTotal.toFixed(2)} ₺
   </p>
   {hasDiscount && (
    <p className="text-sm text-gray-400 line-through">
     {(originalPrice * item.quantity).toFixed(2)} ₺
    </p>
   )}
   <p className="text-sm text-gray-500 mt-0.5">
    Birim: {itemPrice.toFixed(2)} ₺
   </p>
  </div>
 );

 return (
  <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-0 sm:gap-4 items-center sm:items-stretch">
   <Link href={productUrl} className="shrink-0 bg-white rounded-lg p-2 flex items-center justify-center mx-auto sm:mx-0 sm:self-start">
    <Image
     width={500}
     height={500}
     src={displayImage}
     alt={item.name}
     className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg"
    />
   </Link>

   <div className="flex-1 min-w-0 flex flex-col w-full text-center sm:text-left">
    <Link href={productUrl}>
     <h3 className="font-bold text-gray-800 hover:text-indigo-600 transition line-clamp-2 text-sm sm:text-base">
      {item.name}
     </h3>
    </Link>

    {item.brand && (
     <p className="text-xs text-gray-500 mb-1 sm:mb-2">
      {item.brand}
     </p>
    )}

    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm mb-2 sm:mb-3 justify-center sm:justify-start">
     {item.selectedColor && (
      <span className="text-gray-600">
       <span className="font-bold">Renk:</span> {item.selectedColor}
      </span>
     )}
     {displaySerialNumber && (
      <span className="text-gray-600">
       <span className="font-bold">Seri No:</span> <span className="font-mono break-all">{displaySerialNumber}</span>
      </span>
     )}
    </div>

    <div className="mt-auto space-y-3">
     <div className="flex items-center justify-center sm:justify-start">
      <div className="flex items-center gap-2">
       <div className="flex items-center border border-gray-300 rounded-lg">
        <button
         onClick={() =>
          onUpdateQuantity(
           item._id,
           item.selectedSize,
           item.selectedColor,
           item.quantity - 1
          )
         }
         className="p-2 hover:bg-gray-100 transition cursor-pointer touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center sm:min-h-0 sm:min-w-0"
        >
         <HiMinus size={14} />
        </button>
        <span className="px-2.5 sm:px-4 font-semibold min-w-[2ch] text-center text-sm">{item.quantity}</span>
        <button
         onClick={() =>
          onUpdateQuantity(
           item._id,
           item.selectedSize,
           item.selectedColor,
           item.quantity + 1
          )
         }
         className={`p-2 transition min-h-[36px] min-w-[36px] flex items-center justify-center sm:min-h-0 sm:min-w-0 ${item.quantity >= Math.min(item.stock || 10, 10)
          ? "text-gray-400 cursor-not-allowed opacity-60"
          : "hover:bg-gray-100 cursor-pointer"
          }`}
         disabled={item.quantity >= Math.min(item.stock || 10, 10)}
        >
         <HiPlus size={14} />
        </button>
       </div>

       <button
        onClick={() => onRemove(item._id, item.selectedSize, item.selectedColor)}
        className="text-red-600 hover:text-red-800 p-2 transition cursor-pointer touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center sm:min-h-0 sm:min-w-0"
       >
        <MdDelete size={16} />
       </button>
      </div>
     </div>

     <div className="sm:hidden w-full pt-1 border-t border-gray-100">
      {priceBlock}
     </div>
    </div>
   </div>

   <div className="hidden sm:block">
    {priceBlock}
   </div>
  </div>
 );
}
