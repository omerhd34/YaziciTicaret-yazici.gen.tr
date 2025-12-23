"use client";

export default function AdminHomeLoading() {
 return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
   <div className="w-full max-w-md">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
     <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
      <div className="text-sm font-semibold text-white/90">Yazıcı Ticaret</div>
      <h1 className="text-2xl font-black mt-1">Admin Paneli</h1>
      <p className="text-indigo-100 text-sm mt-1">Kontrol ediliyor…</p>
     </div>
     <div className="p-6">
      <div className="flex items-center gap-4">
       <div className="relative w-12 h-12 shrink-0">
        <div className="absolute inset-0 rounded-full bg-indigo-100" />
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
       </div>
       <div className="flex-1">
        <p className="font-semibold text-gray-900">Yetki kontrolü yapılıyor</p>
        <p className="text-sm text-gray-600">Lütfen bekleyin…</p>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
