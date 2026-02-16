"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { HiLockClosed, HiUser, HiLogin, HiEye, HiEyeOff } from "react-icons/hi";
import AlertMessage from "@/app/components/auth/AlertMessage";

export default function AdminLoginForm({ onSuccess }) {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
   const res = await axiosInstance.post("/api/auth/login", {
    username,
    password,
   });

   const data = res.data;

   if (data.success) {
    if (process.env.NODE_ENV === 'development') {
     await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (onSuccess) {
     onSuccess();
    }
   } else {
    setError(data.message || "Giriş başarısız");
    setLoading(false);
   }
  } catch (error) {
   // Sunucudan gelen hata mesajını göster (çoklu cihaz desteği için)
   const serverMessage = error.response?.data?.message;
   const status = error.response?.status;
   let message = "Bir hata oluştu. Lütfen tekrar deneyin.";
   if (serverMessage) message = serverMessage;
   else if (status === 401) message = "Hesap adı veya şifre hatalı.";
   else if (status === 500) message = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
   setError(message);
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="p-8">
   {error && <AlertMessage message={error} type="error" />}

   <div className="space-y-6">
    {/* Hesap Adı */}
    <div>
     <label htmlFor="admin-login-username" className="block text-sm font-bold text-gray-700 mb-2">
      Hesap Adı
     </label>
     <div className="relative">
      <HiUser
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       size={20}
      />
      <input
       id="admin-login-username"
       name="username"
       type="text"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="Hesap Adınızı Giriniz"
       required
       autoComplete="username"
       suppressHydrationWarning
      />
     </div>
    </div>

    {/* Şifre */}
    <div>
     <label htmlFor="admin-login-password" className="block text-sm font-bold text-gray-700 mb-2">
      Şifre
     </label>
     <div className="relative">
      <HiLockClosed
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       size={20}
      />
      <input
       id="admin-login-password"
       name="password"
       type={showPassword ? "text" : "password"}
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="••••••••••"
       required
       autoComplete="current-password"
       suppressHydrationWarning
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

    {/* Submit Button */}
    <button
     type="submit"
     disabled={loading}
     className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
    >
     {loading ? (
      <>
       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
       Giriş Yapılıyor...
      </>
     ) : (
      <>
       <HiLogin size={20} />
       Giriş Yap
      </>
     )}
    </button>
   </div>
  </form>
 );
}
