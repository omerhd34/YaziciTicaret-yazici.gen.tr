"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import normalizeText from "@/lib/normalizeText";
import AdminOrdersHeader from "@/app/components/admin/AdminOrdersHeader";
import AdminStats from "@/app/components/admin/AdminStats";
import ActiveOrdersTable from "@/app/components/admin/ActiveOrdersTable";
import CompletedOrdersTable from "@/app/components/admin/CompletedOrdersTable";
import OrderDetailModal from "@/app/components/admin/OrderDetailModal";
import ReturnStatusChangeModal from "@/app/components/admin/ReturnStatusChangeModal";
import AdminCancelOrderModal from "@/app/components/admin/AdminCancelOrderModal";

export default function AdminSonSiparislerPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);

 const [adminStats, setAdminStats] = useState({ userCount: 0, totalOrders: 0 });
 const [recentOrders, setRecentOrders] = useState([]);
 const [updatingOrderId, setUpdatingOrderId] = useState(null);
 const [updatingReturnOrderId, setUpdatingReturnOrderId] = useState(null);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });

 const [detailModal, setDetailModal] = useState({ show: false, row: null });
 const [returnStatusModal, setReturnStatusModal] = useState({ show: false, orderId: null, currentStatus: "", newStatus: "" });
 const [cancelOrderModal, setCancelOrderModal] = useState({ show: false, orderId: null });
 const [completedFilter, setCompletedFilter] = useState("all");// all | cancelled | delivered | rr:*
 const [completedPage, setCompletedPage] = useState(0);

 const getRowBgClass = (order) => {
  const completedBg = "bg-emerald-50 hover:bg-emerald-100";
  const returnCompletedBg = "bg-emerald-100 hover:bg-emerald-200";
  const statusNorm = normalizeText(order?.status || "");
  const rrStatus = String(order?.returnRequest?.status || "").trim();
  const rrNorm = normalizeText(rrStatus);

  if (rrStatus) {
   if (rrNorm === normalizeText("Talep Edildi")) return "bg-purple-50 hover:bg-purple-100";
   if (rrNorm === normalizeText("Onaylandı")) return "bg-purple-50 hover:bg-purple-100";
   if (rrNorm === normalizeText("Reddedildi")) return "bg-purple-50 hover:bg-purple-100";
   if (rrNorm === normalizeText("Tamamlandı")) return returnCompletedBg;
   if (rrNorm === normalizeText("İptal Edildi")) return "bg-red-50 hover:bg-red-100";
   return "bg-purple-50 hover:bg-purple-100";
  }
  if (statusNorm.includes("iptal")) return "bg-red-50 hover:bg-red-100";
  if (statusNorm.includes("teslim")) return completedBg;
  if (statusNorm.includes("kargo") || statusNorm.includes("kargoya") || statusNorm.includes("yolda")) return "bg-blue-50 hover:bg-blue-100";
  if (statusNorm.includes("hazir")) return "bg-orange-50 hover:bg-orange-100";
  if (statusNorm.includes("bekle")) return "bg-yellow-50 hover:bg-yellow-100";
  return "hover:bg-gray-50";
 };

 useEffect(() => {
  checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(() => {
  if (isAuthenticated) {
   fetchAdminStats();
   fetchAdminOrders();
  }
 }, [isAuthenticated]);

 const checkAuth = async () => {
  try {
   const res = await axiosInstance.get("/api/auth/check");
   const data = res.data;
   if (data.authenticated) {
    setIsAuthenticated(true);
   } else {
    router.push("/admin-giris");
   }
  } catch {
   router.push("/admin-giris");
  } finally {
   setAuthLoading(false);
  }
 };

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   router.push("/admin-giris");
  } catch {
  }
 };

 const fetchAdminStats = async () => {
  try {
   const res = await axiosInstance.get("/api/admin/stats");
   if (res.data?.success) {
    setAdminStats({
     userCount: res.data.stats?.userCount || 0,
     totalOrders: res.data.stats?.totalOrders || 0,
    });
   }
  } catch {
  }
 };

 const fetchAdminOrders = async () => {
  try {
   const res = await axiosInstance.get("/api/admin/orders");
   if (res.data?.success) {
    setRecentOrders(res.data.orders || []);
   }
  } catch {
  }
 };

 const updateOrderStatus = async (orderId, status) => {
  try {
   setUpdatingOrderId(orderId);
   const res = await axiosInstance.patch(`/api/admin/orders/${orderId}`, { status });
   if (!res.data?.success) {
    setToast({ show: true, message: res.data?.message || "Durum güncellenemedi.", type: "error" });
    return;
   }
   setToast({ show: true, message: "Sipariş durumu güncellendi.", type: "success" });
   setRecentOrders(prev => prev.map(r => (r?.order?.orderId === orderId ? { ...r, order: { ...r.order, status } } : r)));
  } catch {
   setToast({ show: true, message: "Durum güncellenemedi.", type: "error" });
  } finally {
   setUpdatingOrderId(null);
  }
 };

 const handleReturnStatusChangeRequest = (orderId, newStatus) => {
  const row = recentOrders.find((r) => r?.order?.orderId === orderId);
  const currentStatus = row?.order?.returnRequest?.status || "";
  setReturnStatusModal({
   show: true,
   orderId,
   currentStatus,
   newStatus,
  });
 };

 const updateReturnStatus = async (newStatus, adminMessage) => {
  const orderId = returnStatusModal.orderId;
  if (!orderId) return;

  try {
   setUpdatingReturnOrderId(orderId);
   setReturnStatusModal({ show: false, orderId: null, currentStatus: "", newStatus: "" });

   const res = await axiosInstance.patch(`/api/admin/orders/${orderId}`, {
    returnRequestStatus: newStatus,
    adminMessage: adminMessage || "",
   });

   if (!res.data?.success) {
    setToast({ show: true, message: res.data?.message || "İade durumu güncellenemedi.", type: "error" });
    return;
   }
   setToast({ show: true, message: res.data?.message || "İade durumu güncellendi.", type: "success" });
   const explanation = adminMessage && String(adminMessage).trim() ? String(adminMessage).trim() : undefined;
   setRecentOrders((prev) =>
    (prev || []).map((r) => {
     if (r?.order?.orderId !== orderId) return r;
     const nextOrder = {
      ...(r.order || {}),
      returnRequest: {
       ...(r.order?.returnRequest || {}),
       status: newStatus,
       ...(explanation && { adminExplanation: explanation }),
      },
     };
     return { ...r, order: nextOrder };
    })
   );
   setDetailModal((prev) => {
    if (!prev?.show || prev?.row?.order?.orderId !== orderId) return prev;
    return {
     ...prev,
     row: {
      ...(prev.row || {}),
      order: {
       ...(prev.row?.order || {}),
       returnRequest: {
        ...(prev.row?.order?.returnRequest || {}),
        status: newStatus,
        ...(explanation && { adminExplanation: explanation }),
       },
      },
     },
    };
   });
  } catch {
   setToast({ show: true, message: "İade durumu güncellenemedi.", type: "error" });
  } finally {
   setUpdatingReturnOrderId(null);
  }
 };

 const openOrderDetail = async (row) => {
  setDetailModal({ show: true, row });
  try {
   const res = await axiosInstance.get("/api/admin/orders");
   if (res.data?.success && Array.isArray(res.data.orders)) {
    setRecentOrders(res.data.orders);
    const orderId = row?.order?.orderId;
    const freshRow = res.data.orders.find((r) => r?.order?.orderId === orderId);
    if (freshRow) setDetailModal((prev) => ({ ...prev, row: freshRow }));
   }
  } catch {
   // Modal zaten mevcut veriyle açıldı
  }
 };

 const closeOrderDetail = () => {
  setDetailModal({ show: false, row: null });
 };

 const handleCancelOrderClick = (orderId) => {
  setCancelOrderModal({ show: true, orderId });
 };

 const handleCancelOrderConfirm = async (orderId) => {
  if (!orderId) return;

  try {
   setUpdatingOrderId(orderId);
   setCancelOrderModal({ show: false, orderId: null });

   const res = await axiosInstance.patch(`/api/admin/orders/${orderId}`, {
    status: "İptal Edildi",
   });

   if (!res.data?.success) {
    setToast({ show: true, message: res.data?.message || "Sipariş iptal edilemedi.", type: "error" });
    return;
   }

   setToast({ show: true, message: "Sipariş başarıyla iptal edildi.", type: "success" });
   setRecentOrders((prev) =>
    prev.map((r) => (r?.order?.orderId === orderId ? { ...r, order: { ...r.order, status: "İptal Edildi" } } : r))
   );
   setDetailModal((prev) => {
    if (!prev?.show || prev?.row?.order?.orderId !== orderId) return prev;
    return {
     ...prev,
     row: {
      ...(prev.row || {}),
      order: {
       ...(prev.row?.order || {}),
       status: "İptal Edildi",
      },
     },
    };
   });
  } catch {
   setToast({ show: true, message: "Sipariş iptal edilemedi.", type: "error" });
  } finally {
   setUpdatingOrderId(null);
  }
 };


 const completedOrders = useMemo(() => {
  return (recentOrders || []).filter((row) => {
   const rawStatus = (row?.order?.status || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
   const statusNorm = normalizeText(rawStatus);
   return statusNorm.includes("teslim") || statusNorm.includes("iptal") || statusNorm.includes("tamam") || statusNorm.includes("completed");
  });
 }, [recentOrders]);

 const filteredCompletedOrders = useMemo(() => {
  const list = completedOrders || [];
  if (completedFilter === "all") return list;

  return list.filter((row) => {
   const o = row?.order || {};
   const statusNorm = normalizeText(o?.status || "");
   const rrStatus = String(o?.returnRequest?.status || "").trim();
   const hasRR = Boolean(rrStatus);
   const rrNorm = normalizeText(rrStatus);

   if (completedFilter === "cancelled") {
    return statusNorm.includes("iptal");
   }
   if (completedFilter === "delivered") {
    return !statusNorm.includes("iptal") && !hasRR;
   }
   if (completedFilter.startsWith("rr:")) {
    const want = completedFilter.slice(3);
    return hasRR && rrNorm === want;
   }
   return true;
  });
 }, [completedOrders, completedFilter]);

 useEffect(() => {
  setCompletedPage(0);
 }, [completedFilter]);

 const completedPageSize = 10;
 const completedTotal = filteredCompletedOrders.length;
 const completedTotalPages = Math.max(1, Math.ceil(completedTotal / completedPageSize));

 const pagedCompletedOrders = useMemo(() => {
  const start = completedPage * completedPageSize;
  return filteredCompletedOrders.slice(start, start + completedPageSize);
 }, [filteredCompletedOrders, completedPage]);

 const activeOrders = useMemo(() => {
  return (recentOrders || []).filter((row) => {
   const rawStatus = (row?.order?.status || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
   const statusNorm = normalizeText(rawStatus);
   return !(statusNorm.includes("teslim") || statusNorm.includes("iptal") || statusNorm.includes("tamam") || statusNorm.includes("completed"));
  });
 }, [recentOrders]);

 if (authLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-gray-600 font-semibold">Yetki kontrol ediliyor...</p>
    </div>
   </div>
  );
 }

 if (!isAuthenticated) return null;

 const selectedOrder = detailModal.row?.order || null;
 const selectedUser = detailModal.row?.user || null;

 return (
  <div className="min-h-screen bg-gray-50 pb-12">
   <Toast toast={toast} setToast={setToast} />
   <AdminOrdersHeader onLogout={handleLogout} />
   <AdminStats userCount={adminStats.userCount} totalOrders={adminStats.totalOrders} />

   <div className="container mx-auto px-4">
    <ActiveOrdersTable
     orders={activeOrders}
     getRowBgClass={getRowBgClass}
     onStatusChange={updateOrderStatus}
     onReturnStatusChange={handleReturnStatusChangeRequest}
     onDetailClick={openOrderDetail}
     onCancelClick={handleCancelOrderClick}
     updatingOrderId={updatingOrderId}
     updatingReturnOrderId={updatingReturnOrderId}
     onRefresh={fetchAdminOrders}
    />
   </div>

   <div className="container mx-auto px-4 mt-8">
    <CompletedOrdersTable
     orders={pagedCompletedOrders}
     filter={completedFilter}
     onFilterChange={setCompletedFilter}
     getRowBgClass={getRowBgClass}
     onReturnStatusChange={handleReturnStatusChangeRequest}
     onDetailClick={openOrderDetail}
     updatingReturnOrderId={updatingReturnOrderId}
     currentPage={completedPage}
     totalPages={completedTotalPages}
     onPageChange={setCompletedPage}
    />
   </div>

   <OrderDetailModal
    show={detailModal.show}
    order={selectedOrder}
    user={selectedUser}
    onClose={closeOrderDetail}
    onCancel={handleCancelOrderClick}
   />

   <ReturnStatusChangeModal
    show={returnStatusModal.show}
    currentStatus={returnStatusModal.currentStatus}
    newStatus={returnStatusModal.newStatus}
    orderId={returnStatusModal.orderId}
    onConfirm={updateReturnStatus}
    onCancel={() => setReturnStatusModal({ show: false, orderId: null, currentStatus: "", newStatus: "" })}
   />

   <AdminCancelOrderModal
    show={cancelOrderModal.show}
    orderId={cancelOrderModal.orderId}
    onConfirm={handleCancelOrderConfirm}
    onCancel={() => setCancelOrderModal({ show: false, orderId: null })}
   />
  </div>
 );
}

