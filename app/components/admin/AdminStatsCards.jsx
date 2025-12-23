"use client";
import { MdReceiptLong, MdInventory2, MdPeople, MdTrendingUp, MdEmail } from "react-icons/md";
import Link from "next/link";

export default function AdminStatsCards({ stats, loading }) {
 const cards = [
  { label: "Toplam Kullanıcı", value: stats?.userCount, icon: MdPeople, color: "bg-emerald-500" },
  { label: "Toplam Sipariş", value: stats?.totalOrders, icon: MdReceiptLong, color: "bg-indigo-500" },
  { label: "Toplam Ürün", value: stats?.productCount, icon: MdInventory2, color: "bg-blue-500" },
 ];

 return (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
   {cards.map((c, idx) => (
    <div key={idx} className="bg-gray-50 rounded-xl border p-4 flex items-center gap-3">
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

   {/* Mesajlar Kartı */}
   <Link
    href="/admin/mesajlar"
    className="bg-gray-50 rounded-xl border p-4 flex items-center gap-3 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer group"
   >
    <div className="bg-indigo-500 w-10 h-10 rounded-lg text-white flex items-center justify-center group-hover:bg-indigo-600 transition">
     <MdEmail size={20} />
    </div>
    <div className="flex-1">
     <div className="text-xs text-gray-500 font-semibold">Mesajlar</div>
     <div className="flex items-center gap-2">
      <div className="text-xl font-black text-gray-900">
       {loading ? "…" : (typeof stats?.totalContacts === "number" ? stats.totalContacts : "-")}
      </div>
      {stats?.unreadContacts > 0 && (
       <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {stats.unreadContacts} yeni
       </span>
      )}
     </div>
    </div>
   </Link>
  </div>
 );
}
