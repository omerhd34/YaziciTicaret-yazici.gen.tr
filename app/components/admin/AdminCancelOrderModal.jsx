"use client";
import { useState } from "react";
import { HiX, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function AdminCancelOrderModal({ show, orderId, onConfirm, onCancel }) {
 const [loading, setLoading] = useState(false);
 const [password, setPassword] = useState("");
 const [message, setMessage] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [verificationError, setVerificationError] = useState("");
 const [messageError, setMessageError] = useState("");

 const handleCancel = () => {
  setPassword("");
  setMessage("");
  setVerificationError("");
  setMessageError("");
  onCancel();
 };

 useEscapeKey(handleCancel, { enabled: show, skipWhen: loading });

 const handleConfirm = async () => {
  if (loading) return;

  if (!password.trim()) {
   setVerificationError("Lütfen şifrenizi giriniz.");
   return;
  }
  if (!message.trim()) {
   setMessageError("Müşteriye ileteceğiniz iptal mesajını yazınız.");
   return;
  }

  setVerificationError("");
  setMessageError("");
  setLoading(true);

  try {
   // Admin şifresini doğrula
   const res = await axiosInstance.post("/api/auth/verify-password", {
    password: password.trim(),
   });

   if (!res.data?.success) {
    setVerificationError(res.data?.message || "Şifre hatalı. Lütfen tekrar deneyin.");
    setLoading(false);
    return;
   }

   // Şifre doğrulandı, siparişi iptal et (mesaj ile)
   await onConfirm(orderId, message.trim());
   setPassword("");
   setMessage("");
  } catch (error) {
   setVerificationError("Bir hata oluştu. Lütfen tekrar deneyin.");
   setLoading(false);
  }
 };

 if (!show) return null;

 return (
  <div
   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
   onClick={handleCancel}
  >
   <div
    className="bg-white rounded-xl shadow-2xl max-w-md w-full relative"
    onClick={(e) => e.stopPropagation()}
   >
    <button
     onClick={handleCancel}
     disabled={loading}
     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
     aria-label="Kapat"
    >
     <HiX size={24} />
    </button>
    <div className="p-6">
     <h3 className="text-lg font-bold text-gray-900 mb-2 pr-8">Siparişi İptal Et</h3>
     <p className="text-sm text-gray-600 mb-4">
      Siparişi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
     </p>

     {/* Admin Şifre Doğrulama */}
     <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
       Admin Şifresi
      </label>
      <div className="relative">
       <HiLockClosed
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
       />
       <input
        id="admin-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
         setPassword(e.target.value);
         setVerificationError("");
        }}
        placeholder="Şifrenizi giriniz"
        disabled={loading}
        className={`w-full pl-11 pr-11 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${verificationError ? "border-red-500" : "border-gray-300"
         } disabled:opacity-50 disabled:cursor-not-allowed`}
        onKeyDown={(e) => {
         if (e.key === "Enter" && !loading && password.trim()) {
          handleConfirm();
         }
        }}
       />
       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        tabIndex={-1}
       >
        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
       </button>
      </div>
      {verificationError && (
       <p className="text-xs text-red-600 mt-1">{verificationError}</p>
      )}
     </div>

     {/* Müşteriye iletilen iptal mesajı */}
     <div className="mb-4">
      <label htmlFor="admin-cancel-message" className="block text-sm font-semibold text-gray-700 mb-2">
       Müşteriye iletilen mesaj <span className="text-red-500">*</span>
      </label>
      <textarea
       id="admin-cancel-message"
       value={message}
       onChange={(e) => {
        setMessage(e.target.value);
        setMessageError("");
       }}
       placeholder="İptal nedenini veya müşteriye iletmek istediğiniz mesajı yazınız. Bu mesaj sipariş detayında ve e-postada görünecektir."
       disabled={loading}
       rows={3}
       className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${messageError ? "border-red-500" : "border-gray-300"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {messageError && (
       <p className="text-xs text-red-600 mt-1">{messageError}</p>
      )}
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
       disabled={loading || !password.trim() || !message.trim()}
       className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
       {loading ? (
        <>
         <span className="opacity-0">Evet, İptal Et</span>
         <span className="absolute inset-0 flex items-center justify-center">
          <FaSpinner className="animate-spin h-5 w-5 text-white" />
         </span>
        </>
       ) : (
        "Evet, İptal Et"
       )}
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}

