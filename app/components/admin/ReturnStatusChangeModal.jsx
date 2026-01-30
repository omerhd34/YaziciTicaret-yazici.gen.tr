"use client";

import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function ReturnStatusChangeModal({
 show,
 currentStatus,
 newStatus,
 orderId,
 onConfirm,
 onCancel,
}) {
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);

 const handleCancel = () => {
  setMessage("");
  onCancel();
 };

 useEscapeKey(handleCancel, { enabled: show, skipWhen: loading });

 if (!show) return null;

 const isApproved = newStatus === "Onaylandı";
 const isRejected = newStatus === "Reddedildi";

 const handleConfirm = async () => {
  if (loading) return;

  setLoading(true);
  try {
   await onConfirm(newStatus, message.trim());
   setMessage("");
  } catch (error) {
  } finally {
   setLoading(false);
  }
 };

 return (
  <div
   className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
   onClick={handleCancel}
  >
   <div
    className="bg-white rounded-xl shadow-2xl w-full max-w-md"
    onClick={(e) => e.stopPropagation()}
   >
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
     <div>
      <h3 className="text-xl font-bold text-gray-900">
       {isApproved ? "İade Talebini Onayla" : isRejected ? "İade Talebini Reddet" : "İade Durumunu Değiştir"}
      </h3>
      {orderId ? (
       <p className="text-sm text-gray-500 mt-1">Sipariş No: {orderId}</p>
      ) : null}
     </div>
     <button
      onClick={handleCancel}
      className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
      disabled={loading}
     >
      <HiX size={22} />
     </button>
    </div>

    <div className="p-6">
     <div className="mb-4">
      <div className="text-sm text-gray-600 mb-2">
       <span className="font-semibold">Mevcut Durum:</span> {currentStatus || "-"}
      </div>
      <div className="text-sm text-gray-600">
       <span className="font-semibold">Yeni Durum:</span> {newStatus || "-"}
      </div>
     </div>

     <div className="mb-6">
      <label htmlFor="admin-message" className="block text-sm font-medium text-gray-700 mb-2">
       Müşteriye Gönderilecek Mesaj {isApproved || isRejected ? <span className="text-red-500">*</span> : ""}
      </label>
      <textarea
       id="admin-message"
       rows="5"
       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm resize-none"
       placeholder={
        isApproved
         ? "Müşteriye göndermek istediğiniz mesajı buraya yazın (ör: İade işleminiz onaylanmıştır. Ürünü kargoya verdiğinizde bize bildirin.)"
         : isRejected
          ? "Müşteriye göndermek istediğiniz mesajı buraya yazın (ör: İade talebiniz şartlarımıza uymadığı için reddedilmiştir.)"
          : "Müşteriye göndermek istediğiniz mesajı buraya yazın (opsiyonel)"
       }
       value={message}
       onChange={(e) => setMessage(e.target.value)}
       required={isApproved || isRejected}
       disabled={loading}
      ></textarea>
     </div>

     <div className="flex gap-3">
      <button
       onClick={handleCancel}
       disabled={loading}
       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
       İptal
      </button>
      <button
       onClick={handleConfirm}
       disabled={loading || (isApproved && !message.trim()) || (isRejected && !message.trim())}
       className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${isApproved
        ? "bg-green-600 hover:bg-green-700"
        : isRejected
         ? "bg-red-600 hover:bg-red-700"
         : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
       {loading ? "Güncelleniyor..." : "Onayla"}
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}

