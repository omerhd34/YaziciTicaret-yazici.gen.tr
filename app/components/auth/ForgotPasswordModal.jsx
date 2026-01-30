"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { HiMail, HiX } from "react-icons/hi";
import AlertMessage from "./AlertMessage";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function ForgotPasswordModal({ show, onClose }) {
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

 const handleClose = () => {
  onClose?.();
  setEmail("");
  setError("");
  setSuccess("");
 };

 useEscapeKey(handleClose, { enabled: show, skipWhen: loading });

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setError("");
  setSuccess("");
  setLoading(true);

  try {
   const res = await axiosInstance.post("/api/user/forgot-password", {
    email,
   });

   const data = res.data;

   if (data.success) {
    setSuccess(data.message || "Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.");
    setTimeout(() => {
     setLoading(false);
     onClose();
     setEmail("");
     setSuccess("");
    }, 5000);
   } else {
    setError(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    setLoading(false);
   }
  } catch (error) {
   setError("Bir hata oluştu. Lütfen tekrar deneyin.");
   setLoading(false);
  }
 };

 if (!show) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
    <div className="flex justify-between items-center mb-6">
     <h2 className="text-2xl font-bold text-gray-900">Şifremi Unuttum</h2>
     <button
      onClick={handleClose}
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
     >
      <HiX size={24} />
     </button>
    </div>

    {error && <AlertMessage message={error} type="error" />}
    {success && <AlertMessage message={success} type="success" />}

    <form onSubmit={handleSubmit} className="space-y-6">
     <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
       E-posta Adresi
      </label>
      <div className="relative">
       <HiMail
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
       />
       <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        placeholder="ornek@email.com"
        required
       />
      </div>
      <p className="text-sm text-gray-500 mt-2">
       E-posta adresinize şifre sıfırlama linki gönderilecektir.
      </p>
     </div>

     <div className="flex gap-3">
      <button
       type="button"
       onClick={() => {
        onClose();
        setEmail("");
        setError("");
        setSuccess("");
       }}
       className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition cursor-pointer"
      >
       İptal
      </button>
      <button
       type="submit"
       disabled={loading}
       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
       {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );

}
