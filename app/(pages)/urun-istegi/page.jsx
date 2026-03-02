"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { HiShoppingBag, HiInformationCircle, HiMail, HiPhone } from "react-icons/hi";

export default function ProductRequestPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  productName: "",
  productDescription: "",
  brand: "",
  model: "",
 });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 useEffect(() => {
  const init = async () => {
   setForm({
    name: "",
    email: "",
    phone: "",
    productName: "",
    productDescription: "",
    brand: "",
    model: "",
   });
   setErrors({});
   setSuccess(false);

   try {
    const res = await axiosInstance.get("/api/user/check");
    const data = res.data;
    setIsAuthenticated(data.authenticated || false);

    if (data.authenticated && data.user) {
     setForm((prev) => ({
      ...prev,
      name: data.user.name || "",
      email: data.user.email || "",
      phone: data.user.phone || "",
     }));
    }
   } catch (error) {
    setIsAuthenticated(false);
   }
  };

  init();
 }, []);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
   ...prev,
   [name]: value,
  }));
  if (errors[name]) {
   setErrors((prev) => ({
    ...prev,
    [name]: "",
   }));
  }
 };

 const validate = () => {
  const newErrors = {};

  if (!isAuthenticated) {
   if (!form.name.trim()) {
    newErrors.name = "İsim gereklidir";
   }

   if (!form.email.trim()) {
    newErrors.email = "E-posta gereklidir";
   } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
     newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }
   }
  }

  if (!form.productName.trim()) {
   newErrors.productName = "Ürün adı gereklidir.";
  }

  return newErrors;
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSuccess(false);

  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
   setErrors(validationErrors);
   return;
  }

  setLoading(true);

  try {
   const res = await axiosInstance.post("/api/product-requests", form);
   const data = res.data;

   if (!data.success) {
    setErrors({
     submit: data.message || "İstek gönderilemedi. Lütfen tekrar deneyin.",
    });
    setLoading(false);
    return;
   }

   setSuccess(true);
   setForm({
    name: "",
    email: "",
    phone: "",
    productName: "",
    productDescription: "",
    brand: "",
    model: "",
   });
  } catch (error) {
   setErrors({ submit: "Bir hata oluştu. Lütfen tekrar deneyin." });
  } finally {
   setLoading(false);
  }
 };

 const handleGoToRequests = () => {
  router.push("/hesabim?tab=urun-istekleri");
 };

 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4">
    <div className="text-center mb-12">
     <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
      Ürün İsteği
     </h1>
     <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Stokta olmayan veya sitede görmediğiniz bir ürünü bizden talep edebilirsiniz.
     </p>
    </div>

    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
     {success ? (
      <div className="text-center py-8">
       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HiInformationCircle size={32} className="text-green-600" />
       </div>
       <h2 className="text-2xl font-bold text-gray-900 mb-2">
        İsteğiniz Gönderildi!
       </h2>
       <p className="text-gray-600 max-w-xl mx-auto">
        Ürün isteğiniz başarıyla alındı. Talebiniz değerlendirildikten sonra stok durumu
        hakkında sizinle iletişime geçeceğiz.
       </p>
       <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {isAuthenticated && (
         <button
          type="button"
          onClick={handleGoToRequests}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer"
         >
          Ürün İsteklerimi Görüntüle
         </button>
        )}
        <button
         type="button"
         onClick={() => setSuccess(false)}
         className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition cursor-pointer"
        >
         Yeni İstek Oluştur
        </button>
       </div>
      </div>
     ) : (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-none">
       {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
         <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
        </div>
       )}

       <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
         <HiInformationCircle
          className="text-blue-600 shrink-0 mt-0.5"
          size={18}
         />
         <p className="text-sm text-blue-800 leading-relaxed">
          <span className="font-semibold">Bilgilendirme:</span> Ürün isteğiniz
          gönderildikten sonra ekibimiz tarafından değerlendirilecektir. İsteğiniz
          onaylandığında, talep ettiğiniz ürün yakın zamanda şubelerimize gelecektir ve
          stok durumu hakkında size e-posta veya telefon ile bilgi verilecektir. İsteğiniz
          iptal edilirse, bu ürün şu anda tedarik edilememektedir veya stokta
          bulunmamaktadır. Her durumda size en kısa sürede geri dönüş yapılacaktır.
         </p>
        </div>
       </div>

       {!isAuthenticated && (
        <div>
         <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HiMail size={20} className="text-indigo-600" />
          İletişim Bilgileri
         </h2>
         <div className="space-y-4">
          <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
            İsim ve Soyisim <span className="text-red-500">*</span>
           </label>
           <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${errors.name ? "border-red-300" : "border-gray-200"
             }`}
            placeholder="Adınız ve soyadınız"
           />
           {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
           )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
             E-posta <span className="text-red-500">*</span>
            </label>
            <input
             type="email"
             name="email"
             value={form.email || ""}
             onChange={handleChange}
             className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${errors.email ? "border-red-300" : "border-gray-200"
              }`}
             placeholder="ornek@email.com"
            />
            {errors.email && (
             <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
           </div>

           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
             <span className="flex items-center gap-2">
              <HiPhone size={16} />
              Telefon
             </span>
            </label>
            <input
             type="tel"
             name="phone"
             value={form.phone || ""}
             onChange={handleChange}
             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
             placeholder="0XXX XXX XX XX"
            />
           </div>
          </div>
         </div>
        </div>
       )}

       <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
         <HiShoppingBag size={20} className="text-indigo-600" />
         Ürün Bilgileri
        </h2>
        <div className="space-y-4">
         <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
           Ürün Adı <span className="text-red-500">*</span>
          </label>
          <input
           type="text"
           name="productName"
           value={form.productName || ""}
           onChange={handleChange}
           className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${errors.productName ? "border-red-300" : "border-gray-200"
            }`}
           placeholder="Örn: Buzdolabı, Çamaşır Makinesi"
          />
          {errors.productName && (
           <p className="mt-1 text-sm text-red-600">
            {errors.productName}
           </p>
          )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
            Marka
           </label>
           <input
            type="text"
            name="brand"
            value={form.brand || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Örn: Profilo, LG, ..."
           />
          </div>

          <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
            Model
           </label>
           <input
            type="text"
            name="model"
            value={form.model || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Model numarası"
           />
          </div>
         </div>

         <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
           Açıklama
          </label>
          <textarea
           name="productDescription"
           value={form.productDescription || ""}
           onChange={handleChange}
           rows={4}
           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
           placeholder="Ürün hakkında ek bilgiler, özellikler veya özel istekleriniz..."
          />
         </div>
        </div>
       </div>

       <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
         type="button"
         onClick={() => router.back()}
         className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
         disabled={loading}
        >
         Geri Dön
        </button>
        <button
         type="submit"
         disabled={loading}
         className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
         {loading ? "Gönderiliyor..." : "İsteği Gönder"}
        </button>
       </div>
      </form>
     )}
    </div>
   </div>
  </div>
 );
}