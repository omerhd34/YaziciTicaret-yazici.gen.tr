"use client";
import { HiLogout } from "react-icons/hi";

export default function AccountHeader({ onLogout }) {
 return (
  <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
   <div>
    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Hesabım</h1>
    <p className="text-sm sm:text-base text-gray-600">Hesap bilgilerinizi ve siparişlerinizi yönetin</p>
   </div>
   <button
    onClick={onLogout}
    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
   >
    <HiLogout size={20} />
    Çıkış
   </button>
  </div>
 );
}
