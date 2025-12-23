"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function ReturnOrderModal({ show, orderId, onConfirm, onCancel }) {
 const [loading, setLoading] = useState(false);
 const [reason, setReason] = useState("");

 if (!show) return null;

 const handleConfirm = async () => {
  if (loading) return;
  if (!reason.trim()) {
   alert("Lütfen iade nedeninizi belirtin.");
   return;
  }
  setLoading(true);
  try {
   await onConfirm(orderId, reason.trim());
   setReason("");
  } finally {
   setLoading(false);
  }
 };

 const handleCancel = () => {
  setReason("");
  onCancel();
 };

 return (
  <div
   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
   onClick={handleCancel}
  >
   <div
    className="bg-white rounded-xl shadow-2xl max-w-md w-full"
    onClick={(e) => e.stopPropagation()}
   >
    <div className="p-6">
     <h3 className="text-lg font-bold text-gray-900 mb-2">İade Talebi Oluştur</h3>
     <p className="text-sm text-gray-600 mb-4">
      Bu sipariş için iade talebi oluşturmak istediğinize emin misiniz?
     </p>

     <div className="mb-4">
      <label htmlFor="return-reason" className="block text-sm font-semibold text-gray-700 mb-2">
       İade Nedeni <span className="text-red-500">*</span>
      </label>
      <textarea
       id="return-reason"
       value={reason}
       onChange={(e) => setReason(e.target.value)}
       placeholder="İade nedeninizi açıklayın (örn: Ürün beklentilerimi karşılamadı, Yanlış ürün geldi, vb.)"
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
       rows={4}
       maxLength={500}
       disabled={loading}
      />
      <p className="text-xs text-gray-500 mt-1">
       {reason.length}/500 karakter
      </p>
     </div>

     <div className="flex justify-end gap-3">
      <button
       onClick={handleCancel}
       disabled={loading}
       className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Vazgeç
      </button>
      <button
       onClick={handleConfirm}
       disabled={loading || !reason.trim()}
       className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
       {loading ? (
        <>
         <span className="opacity-0">İade Et</span>
         <span className="absolute inset-0 flex items-center justify-center">
          <FaSpinner className="animate-spin h-5 w-5 text-white" />
         </span>
        </>
       ) : (
        "İade Et"
       )}
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
