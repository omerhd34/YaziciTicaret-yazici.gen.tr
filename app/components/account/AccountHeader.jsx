"use client";
import { HiLogout } from "react-icons/hi";

export default function AccountHeader({ onLogout }) {
 return (
  <div className="mb-8 flex justify-between items-center">
   <div>
    <h1 className="text-3xl font-black text-gray-900 mb-2">Hesabım</h1>
    <p className="text-gray-600">Hesap bilgilerinizi ve siparişlerinizi yönetin</p>
   </div>
   <button
    onClick={onLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer"
   >
    <HiLogout size={20} />
    Çıkış
   </button>
  </div>
 );
}
