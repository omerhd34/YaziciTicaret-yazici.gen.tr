"use client";
import axiosInstance from "@/lib/axios";

export default function AddressCard({ address, onEdit, onDelete, onSetDefault, showToast, fetchAddresses }) {
 return (
  <div
   className={`border-2 rounded-xl p-6 relative ${address.isDefault ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
    }`}
  >
   {address.isDefault && (
    <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
     Varsayılan
    </span>
   )}
   <div className="mb-4">
    <p className="text-sm text-gray-500 mb-1">Adres Başlığı:</p>
    <p className="font-semibold text-gray-800">{address.title}</p>
   </div>
   <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
     <p className="text-sm text-gray-500 mb-1">Ad:</p>
     <p className="font-semibold text-gray-800">{address.firstName || (address.fullName?.split(' ')[0] || '')}</p>
    </div>
    <div>
     <p className="text-sm text-gray-500 mb-1">Soyad:</p>
     <p className="font-semibold text-gray-800">{address.lastName || (address.fullName?.split(' ').slice(1).join(' ') || '')}</p>
    </div>
   </div>
   <div className="mb-4">
    <p className="text-sm text-gray-500 mb-1">Adres:</p>
    <p className="font-semibold text-gray-800 h-12 overflow-hidden line-clamp-3">{address.address}</p>
   </div>
   <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
     <p className="text-sm text-gray-500 mb-1">İlçe:</p>
     <p className="font-semibold text-gray-800">{address.district}</p>
    </div>
    <div>
     <p className="text-sm text-gray-500 mb-1">Şehir:</p>
     <p className="font-semibold text-gray-800">{address.city}</p>
    </div>
   </div>
   <div className="mb-4">
    <p className="text-sm text-gray-500 mb-1">Telefon:</p>
    <p className="font-semibold text-gray-800">{address.phone}</p>
   </div>
   <div className="flex justify-between items-center gap-2 pt-4 border-t">
    {!address.isDefault && (
     <button
      onClick={async () => {
       try {
        const addressId = address._id?.toString ? address._id.toString() : address._id;
        const res = await axiosInstance.put(`/api/user/addresses/${addressId}`, {
         title: address.title,
         firstName: address.firstName || (address.fullName?.split(' ')[0] || ''),
         lastName: address.lastName || (address.fullName?.split(' ').slice(1).join(' ') || ''),
         phone: address.phone,
         address: address.address,
         city: address.city,
         district: address.district,
         isDefault: true,
        });
        const data = res.data;
        if (data.success) {
         showToast("Varsayılan adres güncellendi!", "success");
         await fetchAddresses();
        } else {
         showToast(data.message || "İşlem başarısız!", "error");
        }
       } catch (error) {
        showToast("Bir hata oluştu!", "error");
       }
      }}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
     >
      Varsayılan Yap
     </button>
    )}
    <div className="flex gap-2 ml-auto">
     <button
      onClick={() => onEdit(address)}
      className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
     >
      Düzenle
     </button>
     <button
      onClick={() => onDelete(address._id)}
      className="px-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
     >
      Sil
     </button>
    </div>
   </div>
  </div>
 );
}
