"use client";
import { HiX } from "react-icons/hi";

export default function AddressModal({ show, editingAddress, addressForm, setAddressForm, addressErrors, setAddressErrors, onSubmit, onClose }) {
 if (!show) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
     <h3 className="text-2xl font-bold">
      {editingAddress ? "Adres Düzenle" : "Yeni Adres Ekle"}
     </h3>
     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
      <HiX size={24} />
     </button>
    </div>

    <form onSubmit={onSubmit} className="p-6 space-y-4">
     <div className="grid md:grid-cols-2 gap-4">
      <div>
       <label className="block text-sm font-semibold mb-2">Adres Başlığı <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={addressForm.title}
        onChange={(e) => {
         setAddressForm({ ...addressForm, title: e.target.value });
         if (addressErrors.title) {
          setAddressErrors({ ...addressErrors, title: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.title ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="Ev, İş, Diğer"
        required
       />
       {addressErrors.title && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.title}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">Ad Soyad <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={addressForm.fullName}
        onChange={(e) => {
         const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ\s]/g, '');
         setAddressForm({ ...addressForm, fullName: value });
         if (addressErrors.fullName) {
          setAddressErrors({ ...addressErrors, fullName: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.fullName ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="Ad Soyad"
        required
       />
       {addressErrors.fullName && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.fullName}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">Telefon <span className="text-red-500">*</span></label>
       <input
        type="tel"
        value={addressForm.phone}
        onChange={(e) => {
         const value = e.target.value.replace(/[^\d]/g, '');
         setAddressForm({ ...addressForm, phone: value });
         if (addressErrors.phone) {
          setAddressErrors({ ...addressErrors, phone: '' });
         }
        }}
        maxLength={11}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.phone ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="05321234567"
        required
       />
       {addressErrors.phone && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.phone}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">Şehir <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={addressForm.city}
        onChange={(e) => {
         setAddressForm({ ...addressForm, city: e.target.value });
         if (addressErrors.city) {
          setAddressErrors({ ...addressErrors, city: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.city ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="Şehir"
        required
       />
       {addressErrors.city && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.city}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">İlçe <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={addressForm.district}
        onChange={(e) => {
         setAddressForm({ ...addressForm, district: e.target.value });
         if (addressErrors.district) {
          setAddressErrors({ ...addressErrors, district: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.district ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="İlçe"
        required
       />
       {addressErrors.district && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.district}</p>
       )}
      </div>

      <div className="md:col-span-2">
       <label className="block text-sm font-semibold mb-2">Adres <span className="text-red-500">*</span></label>
       <textarea
        value={addressForm.address}
        onChange={(e) => {
         setAddressForm({ ...addressForm, address: e.target.value });
         if (addressErrors.address) {
          setAddressErrors({ ...addressErrors, address: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${addressErrors.address ? 'border-red-500' : 'border-gray-300'
         }`}
        rows="3"
        placeholder="Mahalle, Sokak, Bina No, Daire No"
        required
       />
       {addressErrors.address && (
        <p className="text-xs text-red-500 mt-1">{addressErrors.address}</p>
       )}
      </div>

      <div className="md:col-span-2">
       <label className="flex items-center gap-2 cursor-pointer">
        <input
         type="checkbox"
         checked={addressForm.isDefault}
         onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
         className="w-4 h-4"
        />
        <span className="text-sm font-semibold">Varsayılan adres olarak kaydet</span>
       </label>
      </div>
     </div>

     <div className="flex gap-3 pt-4">
      <button
       type="submit"
       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold cursor-pointer"
      >
       {editingAddress ? "Güncelle" : "Kaydet"}
      </button>
      <button
       type="button"
       onClick={onClose}
       className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold cursor-pointer"
      >
       İptal
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}
