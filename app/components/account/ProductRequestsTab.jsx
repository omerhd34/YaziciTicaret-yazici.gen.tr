"use client";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { HiShoppingBag, HiPlus, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import ProductRequestModal from "@/app/components/product/ProductRequestModal";
import ProductRequestCard from "./ProductRequestCard";
import Toast from "@/app/components/ui/Toast";
import {
 AlertDialog,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ProductRequestsTab() {
 const [requests, setRequests] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showRequestModal, setShowRequestModal] = useState(false);
 const [cancelConfirm, setCancelConfirm] = useState({ show: false, requestId: null });
 const [cancelLoading, setCancelLoading] = useState(false);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [showAllRequests, setShowAllRequests] = useState(false);

 const fetchRequests = useCallback(async () => {
  try {
   setLoading(true);
   const res = await axiosInstance.get("/api/product-requests");

   const data = res.data;

   if (data.success) {
    setRequests(data.requests || []);
   }
  } catch (error) {
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  fetchRequests();
 }, [fetchRequests]);

 const handleRequestSubmitted = () => {
  setShowRequestModal(false);
  fetchRequests();
 };

 const handleCancelRequest = async () => {
  if (!cancelConfirm.requestId) {
   setToast({ show: true, message: "İptal edilecek istek bulunamadı.", type: "error" });
   return;
  }

  setCancelLoading(true);
  try {
   let requestId = cancelConfirm.requestId;
   if (typeof requestId === "object" && requestId.toString) {
    requestId = requestId.toString();
   } else if (typeof requestId !== "string") {
    requestId = String(requestId);
   }

   const res = await axiosInstance.delete(`/api/product-requests/${requestId}`);
   const data = res.data;

   if (!data.success) {
    const errorMessage = data.message || "İstek iptal edilemedi";
    setToast({ show: true, message: errorMessage, type: "error" });
    return;
   }

   setToast({ show: true, message: "İstek başarıyla iptal edildi!", type: "success" });
   setCancelConfirm({ show: false, requestId: null });
   fetchRequests();
  } catch (error) {
   setToast({ show: true, message: `Bir hata oluştu: ${error.message}`, type: "error" });
  } finally {
   setCancelLoading(false);
  }
 };

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

 if (loading) {
  return (
   <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="text-center py-12">
     <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-sm text-gray-500">Yükleniyor...</p>
    </div>
   </div>
  );
 }

 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <Toast toast={toast} setToast={setToast} />
   <div className="flex items-center justify-between mb-6">
    <div>
     <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
      <HiShoppingBag className="text-indigo-600" size={28} />
      Ürün İsteklerim
     </h2>
     <p className="text-sm text-gray-500 mt-1">Gönderdiğiniz ürün isteklerini takip edin. İsteğiniz onaylanırsa yakın zamanda ürün şubelerimize gelecektir. İptal edilirse ürün bulunmamaktadır.</p>
    </div>
    <button
     onClick={() => setShowRequestModal(true)}
     className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
    >
     <HiPlus size={20} />
     Yeni İstek
    </button>
   </div>

   {requests.length === 0 ? (
    <div className="text-center py-12">
     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <HiShoppingBag size={40} className="text-gray-400" />
     </div>
     <p className="text-lg font-semibold text-gray-700 mb-2">Henüz ürün isteğiniz yok</p>
     <p className="text-sm text-gray-500 mb-4">Ürün isteğinde bulunmak için aşağıdaki butona tıklayın.</p>
     <button
      onClick={() => setShowRequestModal(true)}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer mx-auto"
     >
      <HiPlus size={20} />
      Yeni Ürün İsteği
     </button>
    </div>
   ) : (
    <div className="grid md:grid-cols-2 gap-4">
     {(showAllRequests ? requests : requests.slice(0, 5)).map((request) => (
      <ProductRequestCard
       key={request._id}
       request={request}
       formatDate={formatDate}
       onCancel={(requestId) => setCancelConfirm({ show: true, requestId })}
      />
     ))}
     {requests.length > 5 ? (
      <div className="md:col-span-2 pt-2 flex justify-center">
       {!showAllRequests ? (
        <button
         type="button"
         onClick={() => setShowAllRequests(true)}
         className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition inline-flex items-center gap-2 cursor-pointer"
        >
         Diğerleri <HiChevronDown className="w-5 h-5" />
        </button>
       ) : (
        <button
         type="button"
         onClick={() => setShowAllRequests(false)}
         className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition inline-flex items-center gap-2 cursor-pointer"
        >
         Son 5 <HiChevronUp className="w-5 h-5" />
        </button>
       )}
      </div>
     ) : null}
    </div>
   )}

   <AlertDialog
    open={cancelConfirm.show}
    onOpenChange={(open) => {
     if (!open) setCancelConfirm({ show: false, requestId: null });
    }}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>İsteği İptal Et</AlertDialogTitle>
      <AlertDialogDescription>
       Bu ürün isteğini iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
      </AlertDialogDescription>
     </AlertDialogHeader>
     <AlertDialogFooter>
      <AlertDialogCancel disabled={cancelLoading}>Vazgeç</AlertDialogCancel>
      <Button
       variant="destructive"
       disabled={cancelLoading}
       onClick={handleCancelRequest}
       className="relative cursor-pointer"
      >
       {cancelLoading ? (
        <>
         <span className="opacity-0">İptal Et</span>
         <span className="absolute inset-0 flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin size-4" />
         </span>
        </>
       ) : (
        "İptal Et"
       )}
      </Button>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>

   <ProductRequestModal
    show={showRequestModal}
    onClose={() => setShowRequestModal(false)}
    onSuccess={handleRequestSubmitted}
   />
  </div>
 );
}