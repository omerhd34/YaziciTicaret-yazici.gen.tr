"use client";
import { useState } from "react";
import { HiLockClosed, HiUser, HiLogin } from "react-icons/hi";
import AlertMessage from "@/app/components/auth/AlertMessage";

export default function AdminLoginForm({ onSuccess }) {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
   const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Cookie'lerin gönderilmesi için gerekli
    body: JSON.stringify({ username, password }),
   });

   const data = await res.json();

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
   setError("Bir hata oluştu. Lütfen tekrar deneyin.");
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="p-8">
   {error && <AlertMessage message={error} type="error" />}

   <div className="space-y-6">
    {/* Hesap Adı */}
    <div>
     <label className="block text-sm font-bold text-gray-700 mb-2">
      Hesap Adı
     </label>
     <div className="relative">
      <HiUser
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       size={20}
      />
      <input
       type="text"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="Hesap Adınızı Giriniz"
       required
      />
     </div>
    </div>

    {/* Password */}
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
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="••••••••••"
       required
      />
     </div>
    </div>

    {/* Submit Button */}
    <button
     type="submit"
     disabled={loading}
     className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
