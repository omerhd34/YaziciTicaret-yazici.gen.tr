"use client";
import { MdReceiptLong } from "react-icons/md";

export default function AdminStats({
 shippedOrders = 0,
 pendingOrders = 0,
 preparingOrders = 0,
}) {
 const stats = [
  { icon: MdReceiptLong, label: "Bekleyen", value: pendingOrders, color: "bg-yellow-500" },
  { icon: MdReceiptLong, label: "Hazırlanıyor", value: preparingOrders, color: "bg-yellow-500" },
  { icon: MdReceiptLong, label: "Kargoya Verilen", value: shippedOrders, color: "bg-blue-500" },
 ];

 return (
  <div className="container mx-auto px-4 -mt-6">
   <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
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
