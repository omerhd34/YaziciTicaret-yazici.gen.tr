"use client";
import axiosInstance from "@/lib/axios";

export default function CardCard({ card, onDelete, onSetDefault, onEdit, showToast, fetchCards }) {
 return (
  <div
   className={`border-2 rounded-xl p-6 relative ${card.isDefault ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
    }`}
  >
   <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
    {card.isDefault && (
     <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
      Varsayılan
     </span>
    )}
    {onEdit && (
     <button
      onClick={() => onEdit(card)}
      className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
     >
      Değiştir
     </button>
    )}
   </div>
   <div className="mb-4">
    <p className="text-sm text-gray-500 mb-1">Kart Adı:</p>
    <p className="font-semibold text-gray-800">{card.cardName}</p>
   </div>
   <div className="mb-4">
    <p className="text-sm text-gray-500 mb-1">Kart Numarası:</p>
    <p className="font-mono text-lg font-bold text-gray-800">{card.cardNumber}</p>
   </div>
   <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
     <p className="text-sm text-gray-500 mb-1">Kart Sahibi:</p>
     <p className="font-semibold text-gray-800">{card.cardHolderName}</p>
    </div>
    <div>
     <p className="text-sm text-gray-500 mb-1">Son Kullanma Tarihi:</p>
     <p className="font-semibold text-gray-800">{card.expiryDate}</p>
    </div>
   </div>
   <div className="flex justify-between items-center gap-2 pt-4 border-t">
    {!card.isDefault && (
     <button
      onClick={async () => {
       try {
        const cardId = card._id?.toString ? card._id.toString() : card._id;
        const res = await axiosInstance.put(`/api/user/cards/${cardId}`, {
         cardName: card.cardName,
         cardHolderName: card.cardHolderName,
         expiryDate: card.expiryDate,
         cvv: card.cvv,
         isDefault: true,
        });
        const data = res.data;
        if (data.success) {
         showToast("Varsayılan kart güncellendi!", "success");
         await fetchCards();
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
    <button
     onClick={() => onDelete(card._id)}
     className="px-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer ml-auto"
    >
     Sil
    </button>
   </div>
  </div>
 );
}
