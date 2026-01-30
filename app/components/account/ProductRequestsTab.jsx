"use client";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { HiShoppingBag, HiPlus, HiChevronDown, HiChevronUp } from "react-icons/hi";
import ProductRequestModal from "@/app/components/product/ProductRequestModal";
import ProductRequestCard from "./ProductRequestCard";
import Toast from "@/app/components/ui/Toast";

export default function ProductRequestsTab() {
 const [requests, setRequests] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showRequestModal, setShowRequestModal] = useState(false);
 const [cancelConfirm, setCancelConfirm] = useState({ show: false, requestId: null });
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

  try {
   let requestId = cancelConfirm.requestId;
   if (typeof requestId === 'object' && requestId.toString) {
    requestId = requestId.toString();
   } else if (typeof requestId !== 'string') {
    requestId = String(requestId);
   }

   const res = await axiosInstance.delete(`/api/product-requests/${requestId}`);

   const data = res.data;

   if (!data.success) {
    const errorMessage = data.message || `İstek iptal edilemedi`;
    setToast({ show: true, message: errorMessage, type: "error" });
    return;
   }

   setToast({ show: true, message: "İstek başarıyla iptal edildi!", type: "success" });
   setCancelConfirm({ show: false, requestId: null });
   fetchRequests();
  } catch (error) {
   setToast({ show: true, message: `Bir hata oluştu: ${error.message}`, type: "error" });
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

   {/* İptal Onay Modal */}
   {cancelConfirm.show && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">İsteği İptal Et</h3>
      <p className="text-gray-600 mb-6">
       Bu ürün isteğini iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
      </p>
      <div className="flex gap-4">
       <button
        onClick={() => setCancelConfirm({ show: false, requestId: null })}
        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
       >
        Vazgeç
       </button>
       <button
        onClick={handleCancelRequest}
        className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition cursor-pointer"
       >
        İptal Et
       </button>
      </div>
     </div>
    </div>
   )}

   <ProductRequestModal
    show={showRequestModal}
    onClose={() => setShowRequestModal(false)}
    onSuccess={handleRequestSubmitted}
   />
  </div>
 );
}

