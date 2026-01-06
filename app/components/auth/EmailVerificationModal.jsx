"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { HiMail, HiX } from "react-icons/hi";
import AlertMessage from "./AlertMessage";

export default function EmailVerificationModal({ show, onClose, userId, userEmail, onSuccess }) {
 const [verificationCode, setVerificationCode] = useState("");
 const [verificationLoading, setVerificationLoading] = useState(false);
 const [resendLoading, setResendLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

 const handleVerifyEmail = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setVerificationLoading(true);

  try {
   const res = await axiosInstance.post("/api/user/verify-email", {
    userId: userId,
    code: String(verificationCode).trim(),
   });

   const data = res.data;

   if (data.success) {
    if (data.autoLogin) {
     // Otomatik giriş yapıldı, hesap sayfasına yönlendir
     window.location.href = "/hesabim";
    } else {
     setSuccess("Email başarıyla doğrulandı!");
     if (onSuccess) {
      setTimeout(() => {
       onSuccess();
      }, 2000);
     }
    }
   } else {
    setError(data.message || "Doğrulama başarısız");
   }
  } catch (error) {
   setError("Bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
   setVerificationLoading(false);
  }
 };

 const handleResendCode = async () => {
  if (!userId) return;

  setError("");
  setSuccess("");
  setResendLoading(true);

  try {
   const res = await axiosInstance.post("/api/user/resend-verification-code", {
    userId: userId,
   });

   const data = res.data;

   if (data.success) {
    setSuccess(data.message || "Yeni doğrulama kodu e-posta adresinize gönderildi.");
   } else {
    setError(data.message || "Kod gönderilemedi. Lütfen tekrar deneyin.");
   }
  } catch (error) {
   setError("Bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
   setResendLoading(false);
  }
 };

 if (!show) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
    <div className="flex justify-between items-center mb-6">
     <h2 className="text-2xl font-bold text-gray-900">Email Doğrulama</h2>
     <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
     >
      <HiX size={24} />
     </button>
    </div>

    {error && <AlertMessage message={error} type="error" />}
    {success && <AlertMessage message={success} type="success" />}

    <form onSubmit={handleVerifyEmail} className="space-y-6">
     <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
       Doğrulama Kodu
      </label>
      <div className="relative">
       <HiMail
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
       />
       <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition text-2xl font-bold tracking-widest text-left"
        placeholder="000000"
        maxLength={6}
        required
       />
      </div>
      <div className="mt-2">
       <p className="text-sm text-gray-500 mb-2">
        E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.
       </p>
       <button
        type="button"
        onClick={handleResendCode}
        disabled={resendLoading || !userId}
        className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
       >
        {resendLoading ? "Gönderiliyor..." : "Kodu bir daha gönder"}
       </button>
      </div>
     </div>

     <div className="flex gap-3">
      <button
       type="button"
       onClick={onClose}
       className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition cursor-pointer"
      >
       İptal
      </button>
      <button
       type="submit"
       disabled={verificationLoading || verificationCode.length !== 6}
       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
       {verificationLoading ? "Doğrulanıyor..." : "Doğrula"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );

}
