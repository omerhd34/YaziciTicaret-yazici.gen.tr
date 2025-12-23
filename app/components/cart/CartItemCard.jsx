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

 const productUrl = getProductUrl(item, item.serialNumber);

 return (
  <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
   <Link href={productUrl} className="shrink-0 bg-white rounded-lg p-2 flex items-center justify-center">
    <Image
     width={500}
     height={500}
     src={item.images[0]}
     alt={item.name}
     className="w-24 h-24 object-contain rounded-lg"
    />
   </Link>

   <div className="flex-1">
    <Link href={productUrl}>
     <h3 className="font-bold text-gray-800 hover:text-indigo-600 transition">
      {item.name}
     </h3>
    </Link>

    {item.brand && (
     <p className="text-xs text-gray-500 mb-2">
      {item.brand}
     </p>
    )}

    <div className="flex flex-wrap gap-3 text-sm mb-3">
     {item.selectedColor && (
      <span className="text-gray-600">
       <span className="font-bold">Renk:</span> {item.selectedColor}
      </span>
     )}
     {item.serialNumber && (
      <span className="text-gray-600">
       {item.selectedColor ? " - " : ""}
       <span className="font-bold">Seri No:</span> <span className="font-mono">{item.serialNumber}</span>
      </span>
     )}
    </div>

    <div className="flex items-center gap-3">
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
       className="p-2 hover:bg-gray-100 transition"
      >
       <HiMinus size={16} />
      </button>
      <span className="px-4 font-semibold">{item.quantity}</span>
      <button
       onClick={() =>
        onUpdateQuantity(
         item._id,
         item.selectedSize,
         item.selectedColor,
         item.quantity + 1
        )
       }
       className="p-2 hover:bg-gray-100 transition"
       disabled={item.quantity >= Math.min(item.stock || 10, 10)}
      >
       <HiPlus size={16} />
      </button>
     </div>

     <button
      onClick={() => onRemove(item._id, item.selectedSize, item.selectedColor)}
      className="text-red-600 hover:text-red-800 p-2 transition"
     >
      <MdDelete size={18} />
     </button>
    </div>
   </div>

   <div className="text-right">
    <p className="text-lg font-bold text-indigo-600">
     {itemTotal.toFixed(2)} ₺
    </p>
    {hasDiscount && (
     <p className="text-sm text-gray-400 line-through">
      {(item.price * item.quantity).toFixed(2)} ₺
     </p>
    )}
    <p className="text-xs text-gray-500 mt-1">
     Birim: {itemPrice.toFixed(2)} ₺
    </p>
   </div>
  </div>
 );
}
