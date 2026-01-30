/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiPhotograph, HiX } from "react-icons/hi";
import { useEscapeKey } from "@/hooks/useEscapeKey";

async function uploadReturnImage(file) {
 const formData = new FormData();
 formData.append("file", file);
 formData.append("folder", "returns");
 const res = await fetch("/api/upload", {
  method: "POST",
  body: formData,
  credentials: "include",
 });
 const data = await res.json();
 if (!data.success) throw new Error(data.message || "Yükleme başarısız");
 return data.url;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_IMAGES = 5;

export default function ReturnOrderModal({ show, orderId, onConfirm, onCancel }) {
 const [loading, setLoading] = useState(false);
 const [reason, setReason] = useState("");
 const [imageFiles, setImageFiles] = useState([]);
 const [imagePreviews, setImagePreviews] = useState([]);
 const [uploadError, setUploadError] = useState("");
 const fileInputRef = useRef(null);

 useEscapeKey(onCancel, { enabled: show, skipWhen: loading });

 if (!show) return null;

 const handleFileChange = (e) => {
  const files = Array.from(e.target.files || []);
  setUploadError("");
  if (!files.length) return;

  const newFiles = [];
  for (const file of files) {
   if (imageFiles.length + newFiles.length >= MAX_IMAGES) break;
   if (!ACCEPTED_TYPES.includes(file.type)) {
    setUploadError("Sadece JPG, PNG veya WebP formatları kabul edilir.");
    continue;
   }
   if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    setUploadError(`Dosya boyutu en fazla ${MAX_SIZE_MB} MB olabilir.`);
    continue;
   }
   newFiles.push(file);
  }
  if (newFiles.length === 0) {
   if (fileInputRef.current) fileInputRef.current.value = "";
   return;
  }

  let loaded = 0;
  const newPreviews = new Array(newFiles.length).fill(null);
  newFiles.forEach((file, i) => {
   const reader = new FileReader();
   reader.onloadend = () => {
    newPreviews[i] = reader.result;
    loaded += 1;
    if (loaded === newFiles.length) {
     setImageFiles((prev) => [...prev, ...newFiles].slice(0, MAX_IMAGES));
     setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, MAX_IMAGES));
    }
   };
   reader.readAsDataURL(file);
  });
  if (fileInputRef.current) fileInputRef.current.value = "";
 };

 const removeImage = (index) => {
  setImageFiles((prev) => prev.filter((_, i) => i !== index));
  setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  setUploadError("");
 };

 const clearAllImages = () => {
  setImageFiles([]);
  setImagePreviews([]);
  setUploadError("");
  if (fileInputRef.current) fileInputRef.current.value = "";
 };

 const handleConfirm = async () => {
  if (loading) return;
  if (!reason.trim()) {
   alert("Lütfen iade nedeninizi belirtin.");
   return;
  }
  setLoading(true);
  setUploadError("");
  try {
   const imageUrls = [];
   for (const file of imageFiles) {
    try {
     const url = await uploadReturnImage(file);
     imageUrls.push(url);
    } catch (err) {
     setUploadError(err?.message || "Resim yüklenemedi.");
     setLoading(false);
     return;
    }
   }
   await onConfirm(orderId, reason.trim(), imageUrls.length > 0 ? imageUrls : null);
   setReason("");
   clearAllImages();
  } catch (err) {
   setUploadError(err?.response?.data?.message || "Resim yüklenirken hata oluştu.");
  } finally {
   setLoading(false);
  }
 };

 const handleCancel = () => {
  setReason("");
  clearAllImages();
  setUploadError("");
  onCancel();
 };

 const canAddMore = imageFiles.length < MAX_IMAGES;

 return (
  <div
   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
   onClick={handleCancel}
  >
   <div
    className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
   >
    <div className="p-6">
     <h3 className="text-lg font-bold text-gray-900 mb-2">İade Talebi Oluştur</h3>
     <p className="text-sm text-gray-600 mb-4">
      Bu sipariş için iade talebi oluşturmak istediğinize emin misiniz?
     </p>

     <div className="mb-4">
      <label htmlFor="return-reason" className="block text-sm font-semibold text-gray-700 mb-2">
       İade Nedeni <span className="text-red-500">*</span>
      </label>
      <textarea
       id="return-reason"
       value={reason}
       onChange={(e) => setReason(e.target.value)}
       placeholder="İade nedeninizi açıklayın (örn: Ürün beklentilerimi karşılamadı, Yanlış ürün geldi, vb.)"
       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
       rows={4}
       maxLength={500}
       disabled={loading}
      />
      <p className="text-xs text-gray-500 mt-1">
       {reason.length}/500 karakter
      </p>
     </div>

     <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Resim ekle (opsiyonel)
      </label>
      <p className="text-xs text-gray-500 mb-2">
       En fazla {MAX_IMAGES} resim. JPG, PNG veya WebP, her biri maksimum {MAX_SIZE_MB} MB.
      </p>
      <div className="flex flex-wrap gap-3">
       {imagePreviews.map((preview, index) => (
        <div key={index} className="relative">
         <img
          src={preview}
          alt={`Önizleme ${index + 1}`}
          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
         />
         <button
          type="button"
          onClick={() => removeImage(index)}
          disabled={loading}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50 cursor-pointer"
         >
          <HiX size={12} />
         </button>
        </div>
       ))}
       {canAddMore && (
        <label
         htmlFor="return-image-upload"
         className={`flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
         <HiPhotograph size={24} />
         <span className="text-xs mt-1">+ Ekle</span>
         <input
          ref={fileInputRef}
          id="return-image-upload"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleFileChange}
          className="sr-only"
         />
        </label>
       )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{imageFiles.length}/{MAX_IMAGES} resim</p>
      {uploadError && (
       <p className="text-xs text-red-600 mt-1">{uploadError}</p>
      )}
     </div>

     <div className="flex justify-end gap-3">
      <button
       onClick={handleCancel}
       disabled={loading}
       className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Vazgeç
      </button>
      <button
       onClick={handleConfirm}
       disabled={loading || !reason.trim()}
       className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
       {loading ? (
        <>
         <span className="opacity-0">İade Et</span>
         <span className="absolute inset-0 flex items-center justify-center">
          <FaSpinner className="animate-spin h-5 w-5 text-white" />
         </span>
        </>
       ) : (
        "İade Et"
       )}
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
