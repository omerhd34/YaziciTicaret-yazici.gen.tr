"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";

export default function AdminLayout({ children }) {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);

 useEffect(() => {
  const checkAuth = async () => {
   // Önce cache'i kontrol et
   const cachedAdminAuth = localStorage.getItem('admin_auth_status');
   const cachedAdminAuthTime = localStorage.getItem('admin_auth_status_time');
   const now = Date.now();
   const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika cache

   // Cache geçerliyse kullan
   if (cachedAdminAuth === 'true' && cachedAdminAuthTime && (now - parseInt(cachedAdminAuthTime, 10)) < CACHE_DURATION) {
    setIsAuthenticated(true);
    setAuthLoading(false);
    return;
   }

   // Cache yoksa veya eskiyse API'den çek
   try {
    const res = await axiosInstance.get("/api/auth/check");
    const data = res.data;
    if (data.authenticated) {
     setIsAuthenticated(true);
     // Cache'e kaydet
     localStorage.setItem('admin_auth_status', 'true');
     localStorage.setItem('admin_auth_status_time', now.toString());
    } else {
     setIsAuthenticated(false);
     localStorage.setItem('admin_auth_status', 'false');
     localStorage.setItem('admin_auth_status_time', now.toString());
     router.replace("/admin-giris");
    }
   } catch {
    setIsAuthenticated(false);
    localStorage.setItem('admin_auth_status', 'false');
    localStorage.setItem('admin_auth_status_time', now.toString());
    router.replace("/admin-giris");
   } finally {
    setAuthLoading(false);
   }
  };

  checkAuth();
 }, [router]);

 if (authLoading || !isAuthenticated) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
     <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-gray-600 font-semibold">
      {authLoading ? "Yükleniyor..." : "Admin girişe yönlendiriliyor..."}
     </p>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
   <AdminHeader />
   <div className="flex-1">
    {children}
   </div>
   <AdminFooter />
  </div>
 );
}

