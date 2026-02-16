"use client";
import Link from "next/link";
import { MdReceiptLong, MdInventory2, MdEmail, MdPeople } from "react-icons/md";
import { HiShoppingBag, HiTicket } from "react-icons/hi";

const items = [
 { label: "Siparişler", href: "/admin/son-siparisler", valueKey: "totalOrders", icon: MdReceiptLong, iconClass: "" },
 { label: "Ürünler", href: "/admin/urun-yonetimi", valueKey: "productCount", icon: MdInventory2, iconClass: "" },
 { label: "Kampanyalar", href: "/admin/paket-fiyatlari", valueKey: "bundleCount", icon: HiTicket, iconClass: "overflow-hidden" },
 { label: "Mesajlar", href: "/admin/mesajlar", valueKey: "totalContacts", icon: MdEmail, iconClass: "" },
 { label: "İstekler", href: "/admin/urun-istekleri", valueKey: "totalProductRequests", icon: HiShoppingBag, iconClass: "" },
 { label: "Kullanıcılar", href: null, valueKey: "userCount", icon: MdPeople, iconClass: "" },
];

export default function QuickAccessCards({ stats, loading }) {
 const getCount = (valueKey) => {
  if (loading) return "…";
  const value = stats?.[valueKey];
  return typeof value === "number" ? String(value) : "-";
 };

 return (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
   {items.map((item) => {
    const content = (
     <>
      <div className="flex items-center justify-between gap-2 sm:gap-5 min-w-0">
       <div className="min-w-0">
        <div className="text-sm sm:text-md font-black text-gray-900 mt-1 wrap-break-word line-clamp-2">
         {item.label} ({getCount(item.valueKey)})
        </div>
       </div>
       <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-600 shrink-0 text-white flex items-center justify-center transition ${item.iconClass} ${item.href ? "group-hover:bg-indigo-700" : ""}`}
       >
        <item.icon size={22} className={item.iconClass ? "shrink-0" : undefined} />
       </div>
      </div>
     </>
    );
    const cardClass = "border rounded-xl p-4 sm:p-5 lg:p-6 min-w-0 " + (item.href ? "group hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer" : "bg-gray-50 cursor-default");
    return item.href ? (
     <Link key={item.href} href={item.href} className={cardClass}>
      {content}
     </Link>
    ) : (
     <div key={item.label} className={cardClass}>
      {content}
     </div>
    );
   })}
  </div>
 );
}
