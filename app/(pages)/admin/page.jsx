"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import AdminHomeLoading from "@/app/components/admin/AdminHomeLoading";
import AdminHomeHeader from "@/app/components/admin/AdminHomeHeader";
import QuickAccessCards from "@/app/components/admin/QuickAccessCards";
import AdminStatsCards from "@/app/components/admin/AdminStatsCards";


export default function AdminHomePage() {
 const router = useRouter();
 const [authLoading, setAuthLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [dashboardLoading, setDashboardLoading] = useState(true);
 const [stats, setStats] = useState(null);
 const [recentOrders, setRecentOrders] = useState([]);

 useEffect(() => {
  (async () => {
   try {
    const checkRes = await axiosInstance.get("/api/auth/check");
    const checkData = checkRes.data;

    if (!checkData?.authenticated) {
     router.push("/admin-giris");
     return;
    }

    setDashboardLoading(true);
    try {
     const [statsRes, ordersRes] = await Promise.all([
      axiosInstance.get("/api/admin/stats"),
      axiosInstance.get("/api/admin/orders"),
     ]);

     if (statsRes.status === 401 || !statsRes.data?.success) {
      router.push("/admin-giris");
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
      router.push("/admin-giris");
      return;
     }
     setStats(null);
     setRecentOrders([]);
    } finally {
     setDashboardLoading(false);
    }
   } catch {
    router.push("/admin-giris");
    return;
   } finally {
    setAuthLoading(false);
   }
  })();
 }, [router]);

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   router.push("/admin-giris");
  } catch {
   setToast({ show: true, message: "Çıkış yapılamadı", type: "error" });
  }
 };

 if (authLoading) {
  return <AdminHomeLoading />;
 }

 return (
  <div className="min-h-screen bg-gray-50 px-4 py-20">
   <div className="w-full max-w-7xl mx-auto">
    <Toast toast={toast} setToast={setToast} />

    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
     <AdminHomeHeader onLogout={handleLogout} />

     <div className="p-8 space-y-8">
      <QuickAccessCards />
      <AdminStatsCards stats={stats} loading={dashboardLoading} />
     </div>
    </div>
   </div>
  </div>
 );
}
