"use client";
import CartItemCard from "./CartItemCard";

export default function CartItemsList({ cartItems, onUpdateQuantity, onRemove, onClearCart }) {
 return (
  <div className="lg:col-span-2 space-y-4">
   <button
    onClick={onClearCart}
    className="text-red-600 hover:text-red-800 font-semibold text-sm cursor-pointer"
   >
    Sepeti Temizle
   </button>

   {cartItems.map((item, index) => (
    <CartItemCard
     key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${index}`}
     item={item}
     onUpdateQuantity={onUpdateQuantity}
     onRemove={onRemove}
    />
   ))}
  </div>
 );
}
