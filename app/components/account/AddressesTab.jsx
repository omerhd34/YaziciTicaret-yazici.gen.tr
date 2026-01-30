"use client";
import axiosInstance from "@/lib/axios";
import { HiPlus, HiLocationMarker } from "react-icons/hi";
import AddressCard from "./AddressCard";

export default function AddressesTab({ addresses, onAddNew, onEdit, onDelete, showToast, fetchAddresses }) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Adreslerim</h2>
    <button
     onClick={onAddNew}
     className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
    >
     <HiPlus size={20} />
     Yeni Adres Ekle
    </button>
   </div>

   {addresses.length === 0 ? (
    <div className="text-center py-12">
     <HiLocationMarker size={64} className="mx-auto text-gray-300 mb-4" />
     <p className="text-gray-500 text-lg mb-4">Henüz kayıtlı adresiniz yok</p>
     <button
      onClick={onAddNew}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
     >
      İlk Adresinizi Ekleyin
     </button>
    </div>
   ) : (
    <div className="grid md:grid-cols-2 gap-4">
     {addresses.map((address) => (
      <AddressCard
       key={address._id}
       address={address}
       onEdit={onEdit}
       onDelete={onDelete}
       onSetDefault={async () => {
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
      />
     ))}
    </div>
   )}
  </div>
 );
}
