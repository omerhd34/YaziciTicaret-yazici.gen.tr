"use client";
import Link from "next/link";
import { HiLogout } from "react-icons/hi";

export default function AdminOrdersHeader({ onLogout, title = "Son Siparişler" }) {
 return (
  <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
   <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center">
     <div>
      <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
      <p className="text-indigo-100">{title}</p>
     </div>
     <div className="flex items-center gap-3">
      <Link href="/admin/urun-yonetimi" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center min-w-[150px]">
       Ürün Yönetimi
      </Link>
      {title === "Mesajlar" ? (
       <Link href="/admin/son-siparisler" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center min-w-[150px]">
        Son Siparişler
       </Link>
      ) : (
       <Link href="/admin/mesajlar" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center min-w-[150px]">
        Mesajlar
       </Link>
      )}
      <button onClick={onLogout} className="bg-white/30 hover:bg-white/40 px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition min-w-[150px] cursor-pointer">
       <HiLogout size={20} />
       Çıkış Yap
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
