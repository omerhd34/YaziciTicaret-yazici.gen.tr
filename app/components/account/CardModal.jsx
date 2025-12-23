"use client";
import { HiX } from "react-icons/hi";

export default function CardModal({
 show,
 editingCard,
 cardForm,
 setCardForm,
 cardErrors,
 setCardErrors,
 onSubmit,
 onClose,
}) {
 if (!show) return null;

 const rawNumber = (cardForm.cardNumber || "").replace(/\s/g, "");
 const paddedNumber = (rawNumber + "################").slice(0, 16);
 const previewNumber = paddedNumber
  ? paddedNumber
   .match(/.{1,4}/g)
   ?.join(" ")
  : "#### #### #### ####";

 const previewName = cardForm.cardHolderName
  ? cardForm.cardHolderName.toUpperCase()
  : "NAME ON CARD";

 const previewExpiry = cardForm.expiryDate || "MM/YY";

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
     <h3 className="text-2xl font-bold">
      {editingCard ? "Kart Düzenle" : "Yeni Kart Ekle"}
     </h3>
     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
      <HiX size={24} />
     </button>
    </div>

    <form onSubmit={onSubmit} className="p-6 space-y-6">
     {/* Kart Önizleme */}
     <div className="flex justify-center">
      <div className="relative w-full max-w-md rounded-2xl bg-linear-to-br from-slate-900 via-purple-700 to-indigo-600 text-white p-5 shadow-xl">
       <div className="flex items-center justify-between text-xs font-semibold tracking-wide uppercase text-slate-200">
        <span>Kredi Kartı</span>
        <span className="flex items-center gap-1">
         <span className="w-2 h-2 rounded-full bg-red-500" />
         <span className="w-2 h-2 rounded-full bg-yellow-400" />
        </span>
       </div>

       <div className="mt-6 mb-4">
        <div className="text-[11px] uppercase tracking-[0.25em] text-slate-300 mb-2">
         Card Number
        </div>
        <div className="text-lg md:text-xl font-mono tracking-[0.18em] bg-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
         <span>{previewNumber}</span>
        </div>
       </div>

       <div className="flex items-end justify-between text-[11px] md:text-xs mt-4">
        <div>
         <div className="uppercase tracking-widest text-slate-300 mb-1">
          Card Holder
         </div>
         <div className="text-sm md:text-base font-semibold">
          {previewName}
         </div>
        </div>
        <div className="text-right">
         <div className="uppercase tracking-widest text-slate-300 mb-1">
          Expires
         </div>
         <div className="text-sm md:text-base font-semibold">
          {previewExpiry}
         </div>
        </div>
       </div>
      </div>
     </div>

     {/* Form Alanları */}
     <div className="grid md:grid-cols-2 gap-4">
      <div>
       <label className="block text-sm font-semibold mb-2">Kart Adı <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={cardForm.cardName}
        onChange={(e) => {
         setCardForm({ ...cardForm, cardName: e.target.value });
         if (cardErrors.cardName) {
          setCardErrors({ ...cardErrors, cardName: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${cardErrors.cardName ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="Örn: Ana Kartım"
        required
       />
       {cardErrors.cardName && (
        <p className="text-xs text-red-500 mt-1">{cardErrors.cardName}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">Kart Numarası <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={cardForm.cardNumber}
        onChange={(e) => {
         const value = e.target.value.replace(/\D/g, '').slice(0, 16);
         const formatted = value.replace(/(.{4})/g, '$1 ').trim();
         setCardForm({ ...cardForm, cardNumber: formatted });
         if (cardErrors.cardNumber) {
          setCardErrors({ ...cardErrors, cardNumber: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${cardErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
         } ${cardForm.cardNumber.startsWith('****') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        readOnly={cardForm.cardNumber.startsWith('****')}
        required={!cardForm.cardNumber.startsWith('****')}
       />
       {cardForm.cardNumber.startsWith('****') && (
        <p className="text-xs text-gray-500 mt-1">
         Güvenlik nedeniyle tam kart numarası saklanmıyor. Kart numarasını değiştirmek için yeni bir kart ekleyin.
        </p>
       )}
       {cardErrors.cardNumber && (
        <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>
       )}
      </div>

      <div>
       <label className="block text-sm font-semibold mb-2">Kart Sahibi Adı <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={cardForm.cardHolderName}
        onChange={(e) => {
         const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ\s]/g, '');
         setCardForm({ ...cardForm, cardHolderName: value });
         if (cardErrors.cardHolderName) {
          setCardErrors({ ...cardErrors, cardHolderName: '' });
         }
        }}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${cardErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'
         }`}
        placeholder="Ad Soyad"
        required
       />
       {cardErrors.cardHolderName && (
        <p className="text-xs text-red-500 mt-1">{cardErrors.cardHolderName}</p>
       )}
      </div>

      <div className="grid grid-cols-3 gap-4">
       <div className="col-span-2">
        <label className="block text-sm font-semibold mb-2">Son Kullanma Tarihi <span className="text-red-500">*</span></label>
        <input
         type="text"
         value={cardForm.expiryDate}
         onChange={(e) => {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length >= 2) {
           value = value.slice(0, 2) + '/' + value.slice(2, 4);
          }
          setCardForm({ ...cardForm, expiryDate: value });
          if (cardErrors.expiryDate) {
           setCardErrors({ ...cardErrors, expiryDate: '' });
          }
         }}
         className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${cardErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
          }`}
         placeholder="AA/YY"
         maxLength={5}
         required
        />
        {cardErrors.expiryDate && (
         <p className="text-xs text-red-500 mt-1">{cardErrors.expiryDate}</p>
        )}
       </div>

       <div className="col-span-1">
        <label className="block text-sm font-semibold mb-2">CVV <span className="text-red-500">*</span></label>
        <input
         type="text"
         value={cardForm.cvv}
         onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
          setCardForm({ ...cardForm, cvv: value });
          if (cardErrors.cvv) {
           setCardErrors({ ...cardErrors, cvv: '' });
          }
         }}
         className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${cardErrors.cvv ? 'border-red-500' : 'border-gray-300'
          }`}
         placeholder="123"
         maxLength={3}
         required
        />
        {cardErrors.cvv && (
         <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>
        )}
       </div>
      </div>

      <div className="md:col-span-2">
       <label className="flex items-center gap-2 cursor-pointer">
        <input
         type="checkbox"
         checked={cardForm.isDefault}
         onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
         className="w-4 h-4"
        />
        <span className="text-sm font-semibold">Varsayılan kart olarak kaydet</span>
       </label>
      </div>
     </div>

     <div className="flex gap-3 pt-4">
      <button
       type="submit"
       className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold cursor-pointer"
      >
       {editingCard ? "Güncelle" : "Kaydet"}
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
