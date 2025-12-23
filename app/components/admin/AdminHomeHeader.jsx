"use client";
import { HiLogout } from "react-icons/hi";

export default function AdminHomeHeader({ onLogout }) {
 return (
  <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white flex items-start justify-between gap-4">
   <div>
    <div className="text-sm font-semibold text-white/90">Yazıcı Ticaret</div>
    <h1 className="text-2xl font-black mt-1">Admin Paneli</h1>
   </div>
   <button
    type="button"
    onClick={onLogout}
    className="shrink-0 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
   >
    <HiLogout size={18} />
    Çıkış
   </button>
  </div>
 );
}
