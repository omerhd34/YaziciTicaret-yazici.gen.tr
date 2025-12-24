"use client";
import { MdReceiptLong, MdInventory2, MdPeople, MdTrendingUp, MdEmail } from "react-icons/md";
import { HiShoppingBag } from "react-icons/hi";

export default function AdminStatsCards({ stats, loading }) {
 const cards = [
  { label: "Toplam Kullanıcı", value: stats?.userCount, icon: MdPeople, color: "bg-emerald-500" },
  { label: "Toplam Sipariş", value: stats?.totalOrders, icon: MdReceiptLong, color: "bg-indigo-500" },
  { label: "Toplam Ürün", value: stats?.productCount, icon: MdInventory2, color: "bg-blue-500" },
 ];

 return (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
   {cards.map((c, idx) => (
    <div key={idx} className="bg-gray-50 rounded-xl border p-5 flex items-center gap-4">
     <div className={`${c.color} w-10 h-10 rounded-lg text-white flex items-center justify-center`}>
      <c.icon size={20} />
     </div>
     <div>
      <div className="text-xs text-gray-500 font-semibold">{c.label}</div>
      <div className="text-xl font-black text-gray-900">
       {loading ? "…" : (typeof c.value === "number" ? c.value : "-")}
      </div>
     </div>
    </div>
   ))}

   {/* Ürün İsteği Adeti Kartı */}
   <div className="bg-gray-50 rounded-xl border p-5 flex items-center gap-4">
    <div className="bg-indigo-500 w-10 h-10 rounded-lg text-white flex items-center justify-center">
     <HiShoppingBag size={20} />
    </div>
    <div className="flex-1">
     <div className="text-xs text-gray-500 font-semibold">Ürün İsteği Adeti</div>
     <div className="flex items-center gap-2">
      <div className="text-xl font-black text-gray-900">
       {loading ? "…" : (typeof stats?.totalProductRequests === "number" ? stats.totalProductRequests : "-")}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
