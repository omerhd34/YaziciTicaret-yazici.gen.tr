"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff } from "react-icons/hi";
import { FaAsterisk } from "react-icons/fa";
import Link from "next/link";
import AlertMessage from "./AlertMessage";

export default function RegisterForm({ onRegister, onVerificationRequired }) {
 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const hasSequentialRun = (value, runLen = 3) => {
  const s = String(value || "").toLowerCase();
  const cleaned = s.replace(/[^a-z0-9]/g, "");
  if (cleaned.length < runLen) return false;
  for (let i = 0; i <= cleaned.length - runLen; i++) {
   let inc = true;
   for (let j = 0; j < runLen - 1; j++) {
    const a = cleaned.charCodeAt(i + j);
    const b = cleaned.charCodeAt(i + j + 1);
    if (b !== a + 1) {
     inc = false;
     break;
    }
   }
   if (inc) return true;
  }
  return false;
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (form.password !== form.confirmPassword) {
   setError("Şifreler eşleşmiyor");
   return;
  }

  if (form.password.length < 10) {
   setError("Şifre en az 10 karakter olmalıdır");
   return;
  }

  const hasUpperCase = /[A-Z]/.test(form.password);
  if (!hasUpperCase) {
   setError("Şifre en az 1 büyük harf içermelidir.");
   return;
  }

  const hasSymbol = /[^a-zA-Z0-9]/.test(form.password);
  if (!hasSymbol) {
   setError("Şifre en az 1 özel karakter içermelidir (örn: !, @, #).");
   return;
  }

  if (hasSequentialRun(form.password, 3)) {
   setError("Şifre sıralı harf/rakam içeremez (örn: abc, 123).");
   return;
  }

  setLoading(true);

  if (!form.firstName || !form.firstName.trim()) {
   setError("Ad alanı zorunludur");
   setLoading(false);
   return;
  }

  if (!form.lastName || !form.lastName.trim()) {
   setError("Soyad alanı zorunludur");
   setLoading(false);
   return;
  }

  if (!form.phone || !form.phone.trim()) {
   setError("Telefon numarası alanı zorunludur");
   setLoading(false);
   return;
  }

  try {
   const res = await axiosInstance.post("/api/user/register", {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email,
    phone: form.phone,
    password: form.password,
   });

   const data = res.data;

   if (data.success) {
    if (data.requiresVerification) {
     if (onVerificationRequired) {
      onVerificationRequired(data.userId, form.email);
     }
     setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
     });
    } else {
     if (onRegister) {
      onRegister(data, form.email);
     }
    }
   } else {
    setError(data.message || "Kayıt başarısız");
   }
  } catch (error) {
   if (error.response?.data?.message) {
    setError(error.response.data.message);
   } else {
    setError("Bir hata oluştu. Lütfen tekrar deneyin.");
   }
  } finally {
   setLoading(false);
  }
 };

 return (
  <form onSubmit={handleSubmit} className="space-y-6">
   {error && <AlertMessage message={error} type="error" />}

   <div className="grid md:grid-cols-2 gap-4">
    <div>
     <label className="block text-sm font-bold text-gray-700 mb-2">
      Ad <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
     </label>
     <div className="relative">
      <HiUser
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       size={20}
      />
      <input
       type="text"
       value={form.firstName}
       onChange={(e) => {
        const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ\s]/g, '');
        setForm({ ...form, firstName: value });
       }}
       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="Adınız"
       required
      />
     </div>
    </div>

    <div>
     <label className="block text-sm font-bold text-gray-700 mb-2">
      Soyad <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
     </label>
     <div className="relative">
      <HiUser
       className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       size={20}
      />
      <input
       type="text"
       value={form.lastName}
       onChange={(e) => {
        const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ]/g, '').split(' ')[0];
        setForm({ ...form, lastName: value });
       }}
       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
       placeholder="Soyadınız"
       required
      />
     </div>
    </div>
   </div>

   <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
     E-posta <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
    </label>
    <div className="relative">
     <HiMail
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={20}
     />
     <input
      type="email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="ornek@email.com"
      required
     />
    </div>
   </div>

   <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
     Telefon <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
    </label>
    <div className="relative">
     <HiPhone
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={20}
     />
     <input
      type="tel"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="0XXXXXXXXXX"
      required
     />
    </div>
   </div>

   <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
     Şifre <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
    </label>
    <div className="relative">
     <HiLockClosed
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={20}
     />
     <input
      type={showPassword ? "text" : "password"}
      value={form.password}
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="••••••••••"
      required
     />
     <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
     >
      {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
     </button>
    </div>
   </div>

   <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
     Şifre Tekrar <FaAsterisk className="inline text-red-500 align-baseline" size={10} />
    </label>
    <div className="relative">
     <HiLockClosed
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={20}
     />
     <input
      type={showConfirmPassword ? "text" : "password"}
      value={form.confirmPassword}
      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      placeholder="••••••••••"
      required
     />
     <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
     >
      {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
     </button>
    </div>
   </div>

   <div className="flex items-start gap-2 ">
    <input type="checkbox" className="w-4 h-4 mt-1 cursor-pointer" required />
    <span className="text-sm text-gray-600">
     <Link href="/kullanim-kosullari" className="text-indigo-600 hover:text-indigo-800 font-semibold">
      Kullanım Koşulları
     </Link>
     {" ve "}
     <Link href="/gizlilik-politikasi" className="text-indigo-600 hover:text-indigo-800 font-semibold">
      Gizlilik Politikası
     </Link>
     &apos;nı okudum ve kabul ediyorum.
    </span>
   </div>

   <button
    type="submit"
    disabled={loading}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
   >
    {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
   </button>
  </form>
 );

}
