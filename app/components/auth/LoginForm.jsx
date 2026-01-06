"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import AlertMessage from "./AlertMessage";

export default function LoginForm({ onLogin, onForgotPassword, onVerificationRequired }) {
 const [form, setForm] = useState({ email: "", password: "" });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [rememberMe, setRememberMe] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
   const res = await axiosInstance.post("/api/user/login", {
    ...form,
    rememberMe,
   });

   const data = res.data;

   if (data.success) {
    if (typeof window !== 'undefined') {
     localStorage.removeItem('just_logged_out');
    }
    if (onLogin) {
     onLogin(data);
    } else {
     window.location.href = "/hesabim";
    }
   } else {
    if (data.requiresVerification) {
     if (onVerificationRequired) {
      onVerificationRequired(data.userId, form.email);
     }
    } else {
     setError(data.message || "Giriş başarısız");
     setLoading(false);
    }
   }
  } catch (error) {
   // API'den dönen hata mesajını kontrol et
   if (error.response?.data?.message) {
    setError(error.response.data.message);
   } else {
    setError("Bir hata oluştu. Lütfen tekrar deneyin.");
   }
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="space-y-6">
   {error && <AlertMessage message={error} type="error" />}

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
      value={form.email || ""}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="ornek@email.com"
      required
     />
    </div>
   </div>

   <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
     Şifre
    </label>
    <div className="relative">
     <HiLockClosed
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={20}
     />
     <input
      type={showPassword ? "text" : "password"}
      value={form.password || ""}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="••••••••••"
      required
     />
     <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
     >
      {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
     </button>
    </div>
   </div>

   <div className="flex items-center justify-between text-sm">
    <label className="flex items-center gap-2 cursor-pointer">
     <input
      type="checkbox"
      className="w-4 h-4 cursor-pointer"
      checked={rememberMe || false}
      onChange={(e) => setRememberMe(e.target.checked)}
     />
     <span className="text-gray-600">Beni Hatırla</span>
    </label>
    <button
     type="button"
     onClick={onForgotPassword}
     className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
    >
     Şifremi Unuttum
    </button>
   </div>

   <button
    type="submit"
    disabled={loading}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
   >
    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
   </button>
  </form>
 );

}
