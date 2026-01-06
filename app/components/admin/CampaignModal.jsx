"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { HiX, HiCloudUpload } from "react-icons/hi";

export default function CampaignModal({ campaign, onClose, onSuccess, onError }) {
 const [loading, setLoading] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [formData, setFormData] = useState({
  title: "",
  description: "",
  image: "",
  isActive: true,
  order: 0,
  endDate: "",
  productCodes: "",
  campaignPrice: "",
 });

 useEffect(() => {
  if (campaign) {
   setFormData({
    title: campaign.title || "",
    description: campaign.description || "",
    image: campaign.image || "",
    isActive: campaign.isActive !== undefined ? campaign.isActive : true,
    order: campaign.order || 0,
    endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
    productCodes: campaign.productCodes && Array.isArray(campaign.productCodes) ? campaign.productCodes.join(', ') : "",
    campaignPrice: campaign.campaignPrice || "",
   });
  }
 }, [campaign]);

 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
   onError("Lütfen bir resim dosyası seçin");
   return;
  }

  if (file.size > 5 * 1024 * 1024) {
   onError("Resim boyutu 5MB'dan küçük olmalıdır");
   return;
  }

  setUploading(true);
  try {
   const uploadFormData = new FormData();
   uploadFormData.append("file", file);

   const res = await axiosInstance.post("/api/upload", uploadFormData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });

   if (res.data?.success) {
    setFormData({ ...formData, image: res.data.url });
   } else {
    onError("Resim yüklenemedi");
   }
  } catch (error) {
   onError("Resim yüklenirken bir hata oluştu");
  } finally {
   setUploading(false);
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) {
   onError("Başlık gereklidir");
   return;
  }
  if (!formData.image) {
   onError("Kampanya görseli gereklidir");
   return;
  }

  setLoading(true);
  try {
   const productCodesArray = formData.productCodes
    ? formData.productCodes.split(',').map(code => code.trim()).filter(code => code !== '')
    : [];

   const submitData = {
    ...formData,
    endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    productCodes: productCodesArray,
    campaignPrice: formData.campaignPrice ? parseFloat(formData.campaignPrice) : null,
   };

   if (campaign) {
    // Güncelle
    const res = await axiosInstance.put(`/api/admin/campaigns/${campaign._id}`, submitData);
    if (res.data?.success) {
     onSuccess();
    } else {
     onError(res.data?.error || res.data?.details || "Kampanya güncellenemedi");
    }
   } else {
    // Yeni oluştur
    const res = await axiosInstance.post("/api/admin/campaigns", submitData);
    if (res.data?.success) {
     onSuccess();
    } else {
     const errorMessage = res.data?.error || res.data?.details || "Kampanya oluşturulamadı";
     onError(errorMessage);
    }
   }
  } catch (error) {
   console.error("Kampanya hatası:", error);
   const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message ||
    (campaign ? "Kampanya güncellenirken bir hata oluştu" : "Kampanya oluşturulurken bir hata oluştu");
   onError(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
     <h2 className="text-2xl font-black text-gray-900">
      {campaign ? "Kampanya Düzenle" : "Yeni Kampanya Ekle"}
     </h2>
     <button
      onClick={onClose}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
     >
      <HiX size={24} />
     </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-6">
     {/* Başlık */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Kampanya Başlığı <span className="text-red-500">*</span>
      </label>
      <input
       type="text"
       value={formData.title}
       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
       placeholder="Örn: Yılbaşı Çekilişi"
       required
      />
     </div>

     {/* Açıklama */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Açıklama
      </label>
      <textarea
       value={formData.description}
       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
       placeholder="Kampanya açıklaması"
       rows={3}
      />
     </div>

     {/* Görsel */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Kampanya Görseli <span className="text-red-500">*</span>
      </label>
      {formData.image ? (
       <div className="relative mb-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
         <Image
          src={formData.image}
          alt="Kampanya görseli"
          fill
          className="object-cover"
         />
        </div>
        <button
         type="button"
         onClick={() => setFormData({ ...formData, image: "" })}
         className="mt-2 text-red-600 text-sm font-semibold hover:text-red-700 cursor-pointer"
        >
         Görseli Kaldır
        </button>
       </div>
      ) : null}
      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
       <div className="text-center">
        <HiCloudUpload size={32} className="mx-auto text-gray-400 mb-2" />
        <span className="text-sm text-gray-600">
         {uploading ? "Yükleniyor..." : "Görsel Yükle"}
        </span>
       </div>
       <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={uploading}
       />
      </label>
     </div>

     {/* Son Gün Tarihi */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Kampanya Son Günü
      </label>
      <input
       type="date"
       value={formData.endDate}
       onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <p className="mt-1 text-xs text-gray-500">Boş bırakılırsa kampanya son günü gösterilmez</p>
     </div>

     {/* Ürün Kodları */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Ürün Kodları
      </label>
      <textarea
       value={formData.productCodes}
       onChange={(e) => setFormData({ ...formData, productCodes: e.target.value.toUpperCase() })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
       placeholder="Ürün kodlarını virgülle ayırarak girin (örn: ABC123, XYZ456, DEF789)"
       rows={3}
      />
      <p className="mt-1 text-xs text-gray-500">Ürün kodlarını virgülle ayırarak girin. Bu kodlara sahip ürünler kampanya sayfasında görüntülenecektir.</p>
     </div>

     {/* Kampanya Fiyatı */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Kampanya Özel Fiyatı (Opsiyonel)
      </label>
      <input
       type="number"
       value={formData.campaignPrice}
       onChange={(e) => setFormData({ ...formData, campaignPrice: e.target.value })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
       placeholder="Kampanyadaki tüm ürünler için geçerli özel fiyat (TL)"
       min="0"
       step="0.01"
      />
      <p className="mt-1 text-xs text-gray-500">Bu fiyat, kampanyadaki tüm ürünler için geçerli olacaktır. Boş bırakılırsa ürünlerin normal fiyatları kullanılır.</p>
     </div>

     {/* Sıra */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Sıra
      </label>
      <input
       type="number"
       value={formData.order}
       onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
       min="0"
      />
     </div>

     {/* Aktif/Pasif */}
     <div className="flex items-center">
      <input
       type="checkbox"
       id="isActive"
       checked={formData.isActive}
       onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
       className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
      />
      <label htmlFor="isActive" className="ml-2 text-sm font-semibold text-gray-700 cursor-pointer">
       Kampanyayı aktif et
      </label>
     </div>

     {/* Butonlar */}
     <div className="flex items-center justify-end gap-3 pt-4 border-t">
      <button
       type="button"
       onClick={onClose}
       className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
       İptal
      </button>
      <button
       type="submit"
       disabled={loading || uploading}
       className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
       {loading ? "Kaydediliyor..." : campaign ? "Güncelle" : "Ekle"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}

