"use client";
import Link from "next/link";
import { MdReceiptLong, MdInventory2, MdEmail } from "react-icons/md";
import { HiShoppingBag, HiTicket } from "react-icons/hi";

export default function QuickAccessCards() {
 return (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
   <Link
    href="/admin/son-siparisler"
    className="group border rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
   >
    <div className="flex items-center justify-between gap-5">
     <div>
      <div className="text-md font-black text-gray-900 mt-1">Siparişler</div>
     </div>
     <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition">
      <MdReceiptLong size={22} />
     </div>
    </div>
   </Link>

   <Link
    href="/admin/urun-yonetimi"
    className="group border rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
   >
    <div className="flex items-center justify-between gap-5">
     <div>
      <div className="text-md font-black text-gray-900 mt-1">Ürünler</div>
     </div>
     <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition">
      <MdInventory2 size={22} />
     </div>
    </div>
   </Link>

   <Link
    href="/admin/mesajlar"
    className="group border rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
   >
    <div className="flex items-center justify-between gap-5">
     <div>
      <div className="text-md font-black text-gray-900 mt-1">Mesajlar</div>
     </div>
     <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition">
      <MdEmail size={22} />
     </div>
    </div>
   </Link>

   <Link
    href="/admin/urun-istekleri"
    className="group border rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
   >
    <div className="flex items-center justify-between gap-5">
     <div>
      <div className="text-md font-black text-gray-900 mt-1">İstekler</div>
     </div>
     <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition">
      <HiShoppingBag size={22} />
     </div>
    </div>
   </Link>

   <Link
    href="/admin/paket-fiyatlari"
    className="group border rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition"
   >
    <div className="flex items-center justify-between gap-5">
     <div>
      <div className="text-md font-black text-gray-900 mt-1">Kampanyalar</div>
     </div>
     <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-indigo-700 transition">
      <HiTicket size={22} className="shrink-0" />
     </div>
    </div>
   </Link>

  </div>
 );
}
