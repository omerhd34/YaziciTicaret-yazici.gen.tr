"use client";
import { MdInventory2, MdTrendingUp } from "react-icons/md";

export default function AdminProductsStats({ totalProducts, outOfStockProducts }) {
 const stats = [
  { icon: MdInventory2, label: "Toplam Ürün", value: totalProducts, color: "bg-blue-500" },
  { icon: MdTrendingUp, label: "Stokta Olmayan Ürünler", value: outOfStockProducts, color: "bg-red-500" },
 ];

 return (
  <div className="container mx-auto px-4 -mt-6">
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {stats.map((stat, idx) => (
     <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <div className={`${stat.color} p-4 rounded-lg text-white`}>
       <stat.icon size={28} />
      </div>
      <div>
       <p className="text-gray-500 text-sm">{stat.label}</p>
       <p className="text-2xl font-bold">{stat.value}</p>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}
