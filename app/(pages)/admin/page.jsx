"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import AdminHomeLoading from "@/app/components/admin/AdminHomeLoading";
import AdminHomeHeader from "@/app/components/admin/AdminHomeHeader";
import QuickAccessCards from "@/app/components/admin/QuickAccessCards";


export default function AdminHomePage() {
 const router = useRouter();
 const [authLoading, setAuthLoading] = useState(true);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [dashboardLoading, setDashboardLoading] = useState(true);
 const [stats, setStats] = useState(null);
 const [recentOrders, setRecentOrders] = useState([]);

 useEffect(() => {
  const checkAuthQuick = async () => {
   try {
    const checkRes = await axiosInstance.get("/api/auth/check");
    const checkData = checkRes.data;
    if (!checkData?.authenticated) {
     router.replace("/admin-giris");
     return;
    }
    setIsAuthenticated(true);
   } catch {
    router.replace("/admin-giris");
   }
  };
  checkAuthQuick();
 }, [router]);

 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
 }, []);

 useEffect(() => {
  if (!isAuthenticated) return;

  (async () => {
   try {
    const checkRes = await axiosInstance.get("/api/auth/check");
    const checkData = checkRes.data;

    if (!checkData?.authenticated) {
     router.replace("/admin-giris");
     return;
    }

    setDashboardLoading(true);
    try {
     const [statsRes, ordersRes] = await Promise.all([
      axiosInstance.get("/api/admin/stats"),
      axiosInstance.get("/api/admin/orders"),
     ]);

     if (statsRes.status === 401 || !statsRes.data?.success) {
      router.replace("/admin-giris");
      return;
     }

     if (statsRes.data?.success) {
      setStats(statsRes.data.stats || null);
     } else {
      setStats(null);
     }

     if (ordersRes.data?.success) {
      setRecentOrders((ordersRes.data.orders || []).slice(0, 5));
     } else {
      setRecentOrders([]);
     }
    } catch (e) {
     if (e.response?.status === 401) {
      router.replace("/admin-giris");
      return;
     }
     setStats(null);
     setRecentOrders([]);
    } finally {
     setDashboardLoading(false);
    }
   } catch {
    router.replace("/admin-giris");
    return;
   } finally {
    setAuthLoading(false);
   }
  })();
 }, [router, isAuthenticated]);

 useEffect(() => {
  if (!authLoading) {
   window.scrollTo({ top: 0, behavior: "instant" });
  }
 }, [authLoading]);

 if (!isAuthenticated) {
  return null;
 }

 if (authLoading) {
  return <AdminHomeLoading />;
 }

 return (
  <div className="px-4 flex-1 flex flex-col">
   <div className="flex-1 flex flex-col justify-center py-20">
    <div className="w-full max-w-7xl mx-auto min-w-0 px-2 sm:px-4">
     <Toast toast={toast} setToast={setToast} />

     <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border">
      <AdminHomeHeader />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
       <QuickAccessCards stats={stats} loading={dashboardLoading} />
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
