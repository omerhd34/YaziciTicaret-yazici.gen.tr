"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import AdminOrdersHeader from "@/app/components/admin/AdminOrdersHeader";
import {
 HiShoppingBag,
 HiClock,
 HiCalendar,
 HiUser,
 HiChevronDown,
 HiTrash,
} from "react-icons/hi";
import ConfirmDialog from "@/app/components/auth/ConfirmDialog";

export default function AdminUrunIstekleriPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);
 const [requests, setRequests] = useState([]);
 const [loading, setLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [filter, setFilter] = useState("all");
 const [selectedRequest, setSelectedRequest] = useState(null);
 const [stats, setStats] = useState({
  pending: 0,
  approved: 0,
  rejected: 0,
  cancelled: 0,
  total: 0,
 });
 const [statusForm, setStatusForm] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

 const fetchRequests = useCallback(async (statusFilter = filter) => {
  try {
   setLoading(true);
   const url = statusFilter === "all"
    ? "/api/admin/product-requests"
    : `/api/admin/product-requests?status=${statusFilter}`;

   const response = await axiosInstance.get(url);

   if (response.data.success) {
    setRequests(response.data.requests || []);
    if (response.data.stats) {
     setStats({
      pending: response.data.stats.pending || 0,
      approved: response.data.stats.approved || 0,
      rejected: response.data.stats.rejected || 0,
      cancelled: response.data.stats.cancelled || 0,
      total: response.data.stats.total || response.data.pagination?.total || 0,
     });
    }
   }
  } catch (error) {
   setToast({ show: true, message: "İstekler yüklenemedi", type: "error" });
  } finally {
   setLoading(false);
  }
 }, [filter]);

 useEffect(() => {
  (async () => {
   try {
    const checkRes = await axiosInstance.get("/api/auth/check");
    const checkData = checkRes.data;

    if (!checkData?.authenticated) {
     router.push("/admin-giris");
     return;
    }

    setIsAuthenticated(true);
    fetchRequests();
   } catch {
    router.push("/admin-giris");
   } finally {
    setAuthLoading(false);
   }
  })();
 }, [router, fetchRequests]);

 const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  fetchRequests(newFilter);
 };

 const handleStatusChange = async (e) => {
  const newStatus = e.target.value;
  if (!selectedRequest || !newStatus || newStatus === "") {
   setStatusForm(newStatus);
   return;
  }

  setSubmitting(true);

  try {
   const response = await axiosInstance.patch("/api/admin/product-requests", {
    id: selectedRequest._id,
    status: newStatus,
    adminResponse: "",
   });

   if (response.data.success) {
    setToast({ show: true, message: "Durum güncellendi", type: "success" });
    setSelectedRequest(response.data.request);
    setRequests(requests.map(req =>
     req._id === selectedRequest._id ? response.data.request : req
    ));
    setStatusForm("");
    fetchRequests(filter);
   }
  } catch (error) {
   setToast({ show: true, message: "İşlem başarısız", type: "error" });
  } finally {
   setSubmitting(false);
  }
 };

 const handleSelectRequest = (request) => {
  setSelectedRequest(request);
  if (request.status === "Onaylandı" || request.status === "Reddedildi") {
   setStatusForm(request.status);
  } else {
   setStatusForm("");
  }
 };

 const handleDelete = (e, requestId) => {
  e.stopPropagation();
  setDeleteConfirm({ show: true, id: requestId });
 };

 const confirmDelete = async () => {
  const id = deleteConfirm.id;
  setDeleteConfirm({ show: false, id: null });

  try {
   const response = await axiosInstance.delete(`/api/admin/product-requests?id=${id}`);

   if (response.data.success) {
    setRequests(requests.filter(req => req._id !== id));
    if (selectedRequest?._id === id) {
     setSelectedRequest(null);
     setStatusForm("");
    }
    setToast({ show: true, message: "İstek silindi", type: "success" });
    fetchRequests(filter);
   }
  } catch (error) {
   setToast({ show: true, message: "İstek silinemedi", type: "error" });
  }
 };

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   router.push("/admin-giris");
  } catch {
   setToast({ show: true, message: "Çıkış yapılamadı", type: "error" });
  }
 };

 if (authLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
     <p className="mt-4 text-gray-600">Yükleniyor...</p>
    </div>
   </div>
  );
 }

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
   day: "2-digit",
   month: "2-digit",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
  });
 };

 const getStatusColor = (status) => {
  const colors = {
   'Beklemede': 'bg-amber-100 text-amber-700 border-amber-300',
   'Onaylandı': 'bg-green-100 text-green-700 border-green-300',
   'Reddedildi': 'bg-red-100 text-red-700 border-red-300',
   'İptal Edildi': 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
 };

 return (
  <div className="min-h-screen bg-gray-50 pb-12">
   <Toast toast={toast} setToast={setToast} />
   <ConfirmDialog
    show={deleteConfirm.show}
    message="Bu ürün isteğini silmek istediğinize emin misiniz?"
    onConfirm={confirmDelete}
    onCancel={() => setDeleteConfirm({ show: false, id: null })}
    confirmText="Sil"
    cancelText="İptal"
    confirmColor="red"
   />
   <AdminOrdersHeader title="Ürün İstekleri" onLogout={handleLogout} />

   <div className="container mx-auto px-4 py-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
     <div className="p-6">
      {/* Üst Bar - Filtreler */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
       <div className="flex flex-wrap gap-3">
        <button
         onClick={() => handleFilterChange("all")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "all"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Tümü ({stats.total})
        </button>
        <button
         onClick={() => handleFilterChange("Beklemede")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "Beklemede"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Beklemede ({stats.pending})
        </button>
        <button
         onClick={() => handleFilterChange("Onaylandı")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "Onaylandı"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Onaylandı ({stats.approved})
        </button>
        <button
         onClick={() => handleFilterChange("Reddedildi")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "Reddedildi"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Reddedildi ({stats.rejected})
        </button>
        <button
         onClick={() => handleFilterChange("İptal Edildi")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "İptal Edildi"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         İptal Edildi ({stats.cancelled})
        </button>
       </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* İstek Listesi */}
       <div className="lg:col-span-1">
        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2 pb-8">
         {loading ? (
          <div className="text-center py-12">
           <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-sm text-gray-500">Yükleniyor...</p>
          </div>
         ) : requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
           <HiShoppingBag size={56} className="mx-auto mb-3 text-gray-300" />
           <p className="font-medium">İstek bulunamadı</p>
          </div>
         ) : (
          requests.map((request, index) => (
           <div
            key={request._id}
            onClick={() => handleSelectRequest(request)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 relative ${selectedRequest?._id === request._id
             ? "border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 shadow-lg"
             : request.status === "Beklemede"
              ? "border-amber-300 bg-linear-to-br from-amber-50/80 to-yellow-50/80 hover:border-amber-400 hover:shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
             }`}
           >
            <div className="flex items-start justify-between gap-2 mb-2">
             <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
               <p className="font-bold truncate text-gray-900 text-base">
                {request.productName}
               </p>
               {request.status === "Beklemede" && (
                <span className="w-3 h-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-full shrink-0 animate-pulse shadow-md"></span>
               )}
              </div>
              <p className="text-sm truncate text-gray-600 font-medium">
               {request.name}
              </p>
             </div>
             <button
              onClick={(e) => handleDelete(e, request._id)}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="İsteği sil"
              aria-label="İsteği sil"
             >
              <HiTrash size={18} />
             </button>
            </div>
            <div className="flex items-center justify-between gap-2">
             <div className="flex items-center gap-1.5">
              <HiClock size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400" suppressHydrationWarning>
               {formatDate(request.createdAt)}
              </p>
             </div>
             <span className={`text-xs px-2 py-1 rounded-full font-semibold border shrink-0 ${getStatusColor(request.status)}`}>
              {request.status}
             </span>
            </div>
           </div>
          ))
         )}
        </div>
       </div>

       {/* İstek Detayı */}
       <div className="lg:col-span-2">
        {selectedRequest ? (
         <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 max-h-[calc(100vh-280px)] flex flex-col">
          {/* Header */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-5 shrink-0">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
             <HiShoppingBag size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
             <div className="flex items-center gap-3 flex-wrap">
              <p className="font-bold text-gray-900 text-lg wrap-break-word">
               {selectedRequest.productName}
              </p>
             </div>
             <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(selectedRequest.status)}`}>
               {selectedRequest.status}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
               <HiCalendar size={16} className="text-indigo-500" />
               <span suppressHydrationWarning className="font-medium">{formatDate(selectedRequest.createdAt)}</span>
              </div>
             </div>
            </div>
           </div>
          </div>

          {/* İçerik */}
          <div className="px-6 py-6 overflow-y-auto flex-1">
           <div className="space-y-6">
            {/* Ürün Bilgileri */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
             <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <HiShoppingBag className="text-indigo-600" size={20} />
              Ürün Bilgileri
             </h3>
             <div className="space-y-3">
              <div className="flex gap-4 pb-3 border-b border-gray-200">
               <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">Ürün Adı:</span>
               <span className="text-gray-900 flex-1 wrap-break-word font-medium">{selectedRequest.productName}</span>
              </div>
              {selectedRequest.brand && (
               <div className="flex gap-4 pb-3 border-b border-gray-200">
                <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">Marka:</span>
                <span className="text-gray-900 flex-1 wrap-break-word font-medium">{selectedRequest.brand}</span>
               </div>
              )}
              {selectedRequest.model && (
               <div className="flex gap-4 pb-3 border-b border-gray-200">
                <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">Model:</span>
                <span className="text-gray-900 flex-1 wrap-break-word font-medium">{selectedRequest.model}</span>
               </div>
              )}
              {selectedRequest.productDescription && (
               <div className="flex gap-4">
                <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">Açıklama:</span>
                <span className="text-gray-900 flex-1 wrap-break-word font-medium whitespace-pre-wrap overflow-hidden">{selectedRequest.productDescription}</span>
               </div>
              )}
             </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
             <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <HiUser className="text-indigo-600" size={20} />
              İletişim Bilgileri
             </h3>
             <div className="space-y-3">
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
               <span className="font-bold text-gray-700 w-32 shrink-0 text-sm">İsim:</span>
               <span className="text-gray-900 flex-1 wrap-break-word font-medium">{selectedRequest.name}</span>
              </div>
              <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
               <span className="font-bold text-gray-700 w-32 shrink-0 text-sm">E-posta:</span>
               <span className="text-gray-900 flex-1 wrap-break-word font-medium">
                <a href={`mailto:${selectedRequest.email}`} className="text-indigo-600 hover:text-indigo-700 transition-colors inline-block">
                 {selectedRequest.email}
                </a>
               </span>
              </div>
              {selectedRequest.phone && (
               <div className="flex items-start gap-4">
                <span className="font-bold text-gray-700 w-32 shrink-0 text-sm">Telefon:</span>
                <span className="text-gray-900 flex-1 wrap-break-word font-medium">
                 <a href={`tel:${selectedRequest.phone}`} className="text-indigo-600 hover:text-indigo-700 transition-colors inline-block">
                  {selectedRequest.phone}
                 </a>
                </span>
               </div>
              )}
             </div>
            </div>

            {/* Durum Değiştirme */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
             <h3 className="text-lg font-bold mb-4 text-gray-900">Durum</h3>
             <div>
              <div className="relative">
               <select
                value={statusForm}
                onChange={handleStatusChange}
                disabled={submitting}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white hover:border-indigo-300"
               >
                <option value="">Durum Seçin</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Reddedildi">Reddedildi</option>
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <HiChevronDown className="w-5 h-5 text-indigo-600" />
               </div>
              </div>
              {submitting && (
               <p className="mt-2 text-sm text-gray-500">Güncelleniyor...</p>
              )}
             </div>
            </div>
           </div>
          </div>
         </div>
        ) : (
         <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-16 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <HiShoppingBag size={48} className="text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">Bir istek seçin</p>
          <p className="text-sm text-gray-500">Detayları görmek için soldaki listeden bir istek seçin</p>
         </div>
        )}
       </div>
      </div>
     </div>
    </div>
   </div>

   <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
     width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
     background: #f3f4f6;
     border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
     background: linear-gradient(to bottom, #6366f1, #8b5cf6);
     border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
     background: linear-gradient(to bottom, #4f46e5, #7c3aed);
    }
   `}</style>
  </div>
 );
}

