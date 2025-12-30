"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { HiLockClosed, HiMail, HiArrowLeft, HiEye, HiEyeOff } from "react-icons/hi";
import { MdError, MdCheckCircle } from "react-icons/md";

export default function SifreSifirlaPage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const token = searchParams.get('token');

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [formData, setFormData] = useState({
  password: "",
  confirmPassword: "",
 });

 useEffect(() => {
  if (!token) {
   setError("Geçersiz veya eksik token!");
  }
 }, [token]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!token) {
   setError("Geçersiz veya eksik token!");
   return;
  }

  if (formData.password !== formData.confirmPassword) {
   setError("Şifreler eşleşmiyor");
   return;
  }

  if (formData.password.length < 6) {
   setError("Şifre en az 6 karakter olmalıdır");
   return;
  }

  setLoading(true);

  try {
   const res = await axiosInstance.post("/api/user/reset-password", {
    token,
    password: formData.password,
   });

   const data = res.data;

   if (data.success) {
    setSuccess("Şifreniz başarıyla sıfırlandı! Giriş yapabilirsiniz.");
    setTimeout(() => {
     router.push("/giris");
    }, 2000);
   } else {
    setError(data.message || "Şifre sıfırlama başarısız");
   }
  } catch (error) {
   setError("Bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12">
   <div className="container mx-auto px-4">
    <div className="max-w-md mx-auto">
     {/* Logo/Header */}
     <div className="text-center mb-8">
      <Link href="/" className="inline-block">
       <h1 className="text-4xl font-black text-gray-900 mb-2">
        YAZICI TİCARET
       </h1>
      </Link>
      <p className="text-gray-600">Yeni şifrenizi belirleyiniz.</p>
     </div>

     <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Error/Success Messages */}
      {error && (
       <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <MdError className="text-red-600 shrink-0 mt-0.5" size={20} />
        <p className="text-red-800 text-sm">{error}</p>
       </div>
      )}

      {success && (
       <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <MdCheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
        <p className="text-green-800 text-sm">{success}</p>
       </div>
      )}

      {!token && (
       <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800 text-sm">
         Geçersiz veya eksik token. Lütfen e-posta adresinizdeki linke tıklayın.
        </p>
       </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
       <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
         Yeni Şifre *
        </label>
        <div className="relative">
         <HiLockClosed
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
         />
         <input
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) =>
           setFormData({ ...formData, password: e.target.value })
          }
          className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          placeholder="••••••••••"
          required
          minLength={6}
          disabled={!token}
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

       <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
         Yeni Şifre Tekrar *
        </label>
        <div className="relative">
         <HiLockClosed
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
         />
         <input
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={(e) =>
           setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          placeholder="••••••••••"
          required
          minLength={6}
          disabled={!token}
         />
         <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
         >
          {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
         </button>
        </div>
       </div>

       <button
        type="submit"
        disabled={loading || !token}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
       >
        {loading ? "Şifre Sıfırlanıyor..." : "Şifreyi Sıfırla"}
       </button>
      </form>

      <div className="mt-6 text-center">
       <Link
        href="/giris"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors duration-200 cursor-pointer"
       >
        <HiArrowLeft size={18} />
        Giriş Sayfasına Dön
       </Link>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}