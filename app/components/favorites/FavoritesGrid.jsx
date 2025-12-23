"use client";
import ProductCard from "@/app/components/ui/ProductCard";

export default function FavoritesGrid({ products }) {
 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
   {products.map((product) => (
    <ProductCard key={product._id} product={product} />
   ))}
  </div>
 );
}
