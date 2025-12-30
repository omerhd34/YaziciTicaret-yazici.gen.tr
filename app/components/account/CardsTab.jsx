"use client";
import axiosInstance from "@/lib/axios";
import { HiPlus } from "react-icons/hi";
import { MdCreditCard } from "react-icons/md";
import CardCard from "./CardCard";

export default function CardsTab({ cards, onAddNew, onEdit, onDelete, showToast, fetchCards }) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Kredi / Banka Kartlarım</h2>
    <button
     onClick={onAddNew}
     className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
    >
     <HiPlus size={20} />
     Yeni Kart Ekle
    </button>
   </div>

   {cards.length === 0 ? (
    <div className="text-center py-12">
     <MdCreditCard size={64} className="mx-auto text-gray-300 mb-4" />
     <p className="text-gray-500 text-lg">Henüz kayıtlı kartınız yok.</p>
     <p className="text-sm text-gray-400 mt-2">
      Hızlı ödeme için kredi kartınızı kaydedebilirsiniz.
     </p>
    </div>
   ) : (
    <div className="grid md:grid-cols-2 gap-4">
     {cards.map((card) => (
      <CardCard
       key={card._id}
       card={card}
       onDelete={onDelete}
       onEdit={onEdit}
       onSetDefault={async () => {
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
       showToast={showToast}
       fetchCards={fetchCards}
      />
     ))}
    </div>
   )}
  </div>
 );
}
