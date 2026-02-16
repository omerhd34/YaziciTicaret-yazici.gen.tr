"use client";

export default function AdminHomeHeader() {
 return (
  <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-6 text-white flex items-start justify-between gap-4 min-w-0">
   <div className="min-w-0">
    <div className="text-xs sm:text-sm font-semibold text-white/90">Yazıcı Ticaret</div>
    <h1 className="text-xl sm:text-2xl font-black mt-1 truncate">Admin Paneli</h1>
   </div>
  </div>
 );
}
