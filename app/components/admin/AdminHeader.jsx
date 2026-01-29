"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiLogout } from "react-icons/hi";
import axiosInstance from "@/lib/axios";

const AdminHeader = () => {
 const router = useRouter();
 const pathname = usePathname();
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
  // AdminLayout zaten check yapıyor, burada tekrar yapmaya gerek yok
  // Sadece AdminLayout'tan gelen auth durumunu kullan
  // AdminLayout'tan prop olarak geçirilebilir ama şimdilik localStorage'dan oku
  const cachedAdminAuth = localStorage.getItem('admin_auth_status');
  const cachedAdminAuthTime = localStorage.getItem('admin_auth_status_time');
  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika cache

  if (cachedAdminAuth && cachedAdminAuthTime && (now - parseInt(cachedAdminAuthTime, 10)) < CACHE_DURATION) {
   setIsAuthenticated(cachedAdminAuth === 'true');
   return;
  }

  // Cache yoksa veya eskiyse check yap (ama sadece bir kez)
  const checkAuth = async () => {
   try {
    const res = await axiosInstance.get("/api/auth/check");
    const data = res.data;
    const authenticated = data.authenticated || false;
    setIsAuthenticated(authenticated);
    
    // Cache'e kaydet
    localStorage.setItem('admin_auth_status', authenticated.toString());
    localStorage.setItem('admin_auth_status_time', now.toString());
   } catch (error) {
    setIsAuthenticated(false);
    localStorage.setItem('admin_auth_status', 'false');
    localStorage.setItem('admin_auth_status_time', now.toString());
   }
  };

  checkAuth();
 }, []);

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   // Admin auth cache'lerini temizle
   if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_auth_status');
    localStorage.removeItem('admin_auth_status_time');
   }
   router.push("/admin-giris");
  } catch (_) { }
 };

 return (
  <header className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
   <div className="container mx-auto px-4 py-3">
    <div className="flex justify-between items-center gap-4">
     <Link href="/admin" className="flex items-center group shrink-0">
      <div className="flex flex-col leading-tight">
       <span className="font-[Open_Sans] text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-indigo-600 transition-colors duration-1000 ease-out group-hover:text-blue-900 select-none">
        YAZICI TİCARET
       </span>
      </div>
     </Link>
     <nav className="hidden lg:flex items-center gap-1">
      <Link
       href="/admin/son-siparisler"
       className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${pathname?.startsWith("/admin/son-siparisler")
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
       Siparişler
      </Link>
      <Link
       href="/admin/urun-yonetimi"
       className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${pathname?.startsWith("/admin/urun-yonetimi")
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
       Ürünler
      </Link>
      <Link
       href="/admin/mesajlar"
       className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${pathname?.startsWith("/admin/mesajlar")
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
       Mesajlar
      </Link>
      <Link
       href="/admin/urun-istekleri"
       className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${pathname?.startsWith("/admin/urun-istekleri")
        ? "bg-indigo-100 text-indigo-700 font-semibold"
        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`}
      >
       Ürün İstekleri
      </Link>
     </nav>
     <div className="flex items-center gap-4">
      {isAuthenticated && (
       <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 active:bg-red-200 border border-red-200 hover:border-red-300 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
       >
        <HiLogout size={20} />
        <span className="hidden sm:inline">Çıkış Yap</span>
       </button>
      )}
     </div>
    </div>
   </div>
  </header>
 );
};

export default AdminHeader;

