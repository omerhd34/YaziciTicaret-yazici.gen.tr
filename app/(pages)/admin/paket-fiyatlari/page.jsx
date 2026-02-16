"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import AdminOrdersHeader from "@/app/components/admin/AdminOrdersHeader";
import { HiTicket, HiTag, HiTrash, HiPlus } from "react-icons/hi";
import { FaTurkishLiraSign } from "react-icons/fa6";

export default function AdminKampanyaFiyatlariPage() {
 const router = useRouter();
 const [authLoading, setAuthLoading] = useState(true);
 const [bundles, setBundles] = useState([]);
 const [loading, setLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [form, setForm] = useState({ name: "", productCodes: "", bundlePrice: "" });
 const [submitting, setSubmitting] = useState(false);
 const [deletingId, setDeletingId] = useState(null);
 const [selectedBundle, setSelectedBundle] = useState(null);
 const [editingBundle, setEditingBundle] = useState(null);

 useEffect(() => {
  const check = async () => {
   try {
    const res = await axiosInstance.get("/api/auth/check");
    if (!res.data?.authenticated) {
     router.replace("/admin-giris");
     return;
    }
    setAuthLoading(false);
   } catch {
    router.replace("/admin-giris");
   }
  };
  check();
 }, [router]);

 useEffect(() => {
  if (authLoading) return;
  fetchBundles();
 }, [authLoading]);

 const fetchBundles = async () => {
  try {
   setLoading(true);
   const res = await axiosInstance.get("/api/admin/bundles");
   if (res.data?.success && Array.isArray(res.data.bundles)) {
    setBundles(res.data.bundles);
   } else {
    setBundles([]);
   }
  } catch {
   setBundles([]);
  } finally {
   setLoading(false);
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const codes = form.productCodes
   .split(",")
   .map((c) => c.trim())
   .filter(Boolean);
  const price = parseFloat(String(form.bundlePrice).replace(",", "."));
  if (codes.length === 0 || Number.isNaN(price) || price < 0) {
   setToast({ show: true, message: "Ürün kodları ve geçerli paket fiyatı giriniz.", type: "error" });
   return;
  }
  setSubmitting(true);
  const bundleToUpdate = editingBundle || selectedBundle;
  try {
   if (bundleToUpdate) {
    const res = await axiosInstance.put(`/api/admin/bundles/${bundleToUpdate._id}`, {
     name: form.name.trim() || undefined,
     productCodes: codes,
     bundlePrice: price,
    });
    if (res.data?.success) {
     setToast({ show: true, message: "Kampanya güncellendi.", type: "success" });
     setForm({ name: "", productCodes: "", bundlePrice: "" });
     setEditingBundle(null);
     setSelectedBundle(null);
     fetchBundles();
    } else {
     setToast({ show: true, message: res.data?.message || "Güncellenemedi", type: "error" });
    }
   } else {
    const res = await axiosInstance.post("/api/admin/bundles", {
     name: form.name.trim() || undefined,
     productCodes: codes,
     bundlePrice: price,
    });
    if (res.data?.success) {
     setToast({ show: true, message: "Kampanya eklendi.", type: "success" });
     setForm({ name: "", productCodes: "", bundlePrice: "" });
     fetchBundles();
    } else {
     setToast({ show: true, message: res.data?.message || "Eklenemedi", type: "error" });
    }
   }
  } catch (err) {
   const data = err.response?.data;
   const msg = data?.message || data?.error || err.message || (bundleToUpdate ? "Kampanya güncellenemedi." : "Kampanya eklenemedi.");
   setToast({ show: true, message: msg, type: "error" });
  } finally {
   setSubmitting(false);
  }
 };

 const handleEdit = (b) => {
  setSelectedBundle(b);
  setEditingBundle(b);
  setForm({
   name: b.name || "",
   productCodes: (b.productCodes && b.productCodes.length) ? b.productCodes.join(", ") : "",
   bundlePrice: String(b.bundlePrice ?? ""),
  });
 };

 const handleCancelEdit = () => {
  setEditingBundle(null);
  setForm({ name: "", productCodes: "", bundlePrice: "" });
  if (selectedBundle) setSelectedBundle(null);
 };

 const handleSelectBundle = (b) => {
  setSelectedBundle(b);
  setEditingBundle(null);
  setForm({
   name: b.name || "",
   productCodes: (b.productCodes && b.productCodes.length) ? b.productCodes.join(", ") : "",
   bundlePrice: String(b.bundlePrice ?? ""),
  });
 };

 const handleNewCampaign = () => {
  setSelectedBundle(null);
  setEditingBundle(null);
  setForm({ name: "", productCodes: "", bundlePrice: "" });
 };

 const handleDelete = async (id) => {
  if (!id) return;
  setDeletingId(id);
  try {
   const res = await axiosInstance.delete(`/api/admin/bundles/${encodeURIComponent(id)}`);
   if (res.data?.success) {
    setToast({ show: true, message: "Kampanya silindi.", type: "success" });
    if (editingBundle?._id === id || selectedBundle?._id === id) {
     setEditingBundle(null);
     setSelectedBundle(null);
     setForm({ name: "", productCodes: "", bundlePrice: "" });
    }
    fetchBundles();
   } else {
    setToast({ show: true, message: res.data?.message || "Silinemedi", type: "error" });
   }
  } catch (err) {
   const msg = err.response?.data?.message || err.response?.data?.error || "Silinemedi";
   setToast({ show: true, message: msg, type: "error" });
  } finally {
   setDeletingId(null);
  }
 };

 if (authLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
     <p className="mt-4 text-gray-600">Yükleniyor...</p>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gray-50 pb-12">
   <Toast toast={toast} setToast={setToast} />
   <AdminOrdersHeader title="Kampanya Fiyatları" />

   <div className="container mx-auto px-4 py-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
     <div className="p-6">
      <p className="text-gray-600 mb-6">
       Belirli ürünleri birlikte sepete ekleyen müşterilere tek bir kampanya fiyatı uygulayın. Ürün kodlarını girin; hepsi sepette olduğunda toplam bu paket fiyatına düşer.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Sol: Kampanya listesi */}
       <div className="lg:col-span-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
         <h2 className="text-lg font-bold text-gray-900">Kampanyalar</h2>
         <button
          type="button"
          onClick={handleNewCampaign}
          className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md text-sm cursor-pointer flex items-center gap-2"
         >
          <HiPlus size={18} />
          Yeni kampanya
         </button>
        </div>
        <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar pr-2 pb-8">
         {loading ? (
          <div className="text-center py-12">
           <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
           <p className="text-sm text-gray-500">Yükleniyor...</p>
          </div>
         ) : bundles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
           <HiTicket size={56} className="mx-auto mb-3 text-gray-300" />
           <p className="font-medium">Henüz kampanya yok</p>
          </div>
         ) : (
          bundles.map((b) => (
           <div
            key={b._id}
            onClick={() => handleSelectBundle(b)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedBundle?._id === b._id
             ? "border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 shadow-lg"
             : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
             }`}
           >
            <div className="flex items-start justify-between gap-2 mb-2">
             <p className="font-bold text-gray-900 text-base truncate flex-1">
              {b.name || "Kampanya"}
             </p>
             <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleDelete(b._id); }}
              disabled={deletingId === b._id}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
              title="Kampanyayı sil"
             >
              <HiTrash size={18} />
             </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
             <FaTurkishLiraSign size={16} className="text-indigo-500 shrink-0" />
             <span className="font-semibold text-indigo-600">
              {Number(b.bundlePrice).toLocaleString("tr-TR")}
             </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
             {(b.productCodes && b.productCodes.length) ? b.productCodes.length + " ürün" : "—"}
            </p>
           </div>
          ))
         )}
        </div>
       </div>

       {/* Sağ: Form / detay */}
       <div className="lg:col-span-2">
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 max-h-[calc(100vh-320px)] flex flex-col">
         <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-5 shrink-0">
          <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <HiTicket size={24} className="text-white" />
           </div>
           <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-lg">
             {editingBundle ? "Kampanyayı düzenle" : selectedBundle ? "Kampanya detayı" : "Yeni kampanya"}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
             {selectedBundle
              ? (selectedBundle.name || "Kampanya") + " · " + Number(selectedBundle.bundlePrice).toLocaleString("tr-TR") + " ₺"
              : "Ürün kodlarını girin, kampanya fiyatını belirleyin"}
            </p>
           </div>
          </div>
         </div>

         <div className="px-6 py-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
           <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
             <HiTag className="text-indigo-600" size={20} />
             Kampanya bilgileri
            </h3>
            <div className="space-y-4">
             <div>
              <label className="block font-bold text-gray-700 text-sm mb-1">Kampanya adı</label>
              <input
               type="text"
               value={form.name}
               onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
               className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               placeholder="Örn: Çamaşır + Kurutma Paketi"
              />
             </div>
             <div>
              <label className="block font-bold text-gray-700 text-sm mb-1">Ürün kodları (virgül ile ayırın)</label>
              <textarea
               value={form.productCodes}
               onChange={(e) => setForm((f) => ({ ...f, productCodes: e.target.value }))}
               className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-24 resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               placeholder="PRF001, PRF002, PRF003"
               required
              />
             </div>
             <div>
              <label className="block font-bold text-gray-700 text-sm mb-1">Kampanya fiyatı (₺)</label>
              <input
               type="text"
               value={form.bundlePrice}
               onChange={(e) => setForm((f) => ({ ...f, bundlePrice: e.target.value }))}
               className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
               placeholder="150000"
               required
              />
             </div>
            </div>
           </div>

           <div className="flex flex-wrap gap-3 justify-center">
            <button
             type="submit"
             disabled={submitting}
             className="px-6 py-3 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
            >
             {submitting ? ((editingBundle || selectedBundle) ? "Kaydediliyor..." : "Ekleniyor...") : ((editingBundle || selectedBundle) ? "Kaydet" : "Kampanyayı Ekle")}
            </button>
            {editingBundle && (
             <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
             >
              İptal
             </button>
            )}
           </div>
          </form>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>

   <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
  </div>
 );
}
