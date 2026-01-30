"use client";
import { HiPencil, HiTrash, HiStar } from "react-icons/hi";
import { FaCcVisa, FaCreditCard } from "react-icons/fa";
import { GrAmex } from "react-icons/gr";
import Image from "next/image";

export default function CardCard({ card, onEdit, onDelete, onSetDefault }) {
 const getCardType = (card) => {
  if (card.cardType && card.cardType.trim() !== "" && card.cardType !== "Kart") {
   return card.cardType;
  }
  return "Kart";
 };

 const getCardTypeStyle = (cardType) => {
  switch (cardType) {
   case "Visa":
    return "bg-blue-100 text-blue-700 border-blue-200";
   case "Mastercard":
    return "bg-orange-100 text-orange-700 border-orange-200";
   case "Troy":
    return "bg-gray-400 text-gray-700 border-gray-200";
   case "Amex":
    return "bg-cyan-100 text-cyan-700 border-cyan-200";
   default:
    return "bg-indigo-100 text-indigo-700 border-indigo-200";
  }
 };

 const getCardIconBg = (cardType) => {
  switch (cardType) {
   case "Troy":
    return "bg-gray-600";
   case "Visa":
    return "bg-blue-600";
   case "Mastercard":
    return "bg-orange-500";
   case "Amex":
    return "bg-cyan-600";
   default:
    return "bg-indigo-600";
  }
 };

 const renderCardIcon = (cardType) => {
  const iconSize = 28;
  const iconClass = "text-white";

  switch (cardType) {
   case "Visa":
    return <FaCcVisa className={iconClass} size={iconSize} />;
   case "Mastercard":
    return (
     <Image
      src="/mastercard.webp"
      alt="Mastercard"
      width={iconSize}
      height={iconSize}
      className="object-contain"
     />
    );
   case "Amex":
    return <GrAmex className={iconClass} size={iconSize} />;
   case "Troy":
    return (
     <Image
      src="/troy.png"
      alt="Troy"
      width={iconSize}
      height={iconSize}
      className="object-contain"
      style={{ filter: "brightness(0) invert(1)" }}
     />
    );
   default:
    return <FaCreditCard className={iconClass} size={iconSize} />;
  }
 };

 const cardType = getCardType(card);
 const last4 = card.cardNumberLast4 || "";
 const maskedNumber = cardType === "Amex" ? `•••• •••••• ${last4}` : `•••• ${last4}`;

 return (
  <div
   className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out
${card.isDefault ? "bg-linear-to-br from-indigo-50 via-white to-violet-50/50 border-2 border-indigo-200 shadow-md shadow-indigo-100/50" : "bg-white border border-gray-200/80 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50"}
`}
  >
   {/* Varsayılan badge */}
   {card.isDefault && (
    <div className="absolute top-0 right-0">
     <div className="flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold pl-3 pr-2.5 py-1 rounded-bl-xl shadow-sm">
      <HiStar size={12} className="shrink-0" />
      Varsayılan
     </div>
    </div>
   )}

   <div className="p-4 pt-5">
    {/* Kart başlığı */}
    <div className="flex items-center gap-3 mb-3">
     <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${getCardIconBg(cardType)}`}>
      {renderCardIcon(cardType)}
     </div>
     <div>
      <p className="text-base font-bold text-gray-900">{card.title}</p>
      <div className="flex items-center gap-2 mt-0.5">
       <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${getCardTypeStyle(cardType)}`}>
        {cardType}
       </span>
       <span className="text-sm text-gray-600 tabular-nums">{maskedNumber}</span>
      </div>
     </div>
    </div>

    {/* Kart detayları */}
    <div className="space-y-1.5 text-sm">
     <p className="text-gray-700">
      <span className="text-gray-500 font-medium">Kart Sahibi:</span>{" "}
      <span className="font-semibold text-gray-800">{card.cardHolder}</span>
     </p>
     <p className="text-gray-700">
      <span className="text-gray-500 font-medium">Son Kullanma Tarihi:</span>{" "}
      <span className="font-semibold text-gray-800 tabular-nums">{card.month}/{card.year}</span>
     </p>
     <p className="text-gray-700">
      <span className="text-gray-500 font-medium">Güvenlik kodu (CVC/CVV):</span>{" "}
      <span className="font-semibold text-gray-800 tabular-nums">
       {card.cvc && card.cvc.trim() !== "" ? card.cvc : "Yok"}
      </span>
     </p>
    </div>
   </div>

   {/* Aksiyonlar */}
   <div className="flex flex-wrap justify-between items-center gap-2 px-4 py-3 bg-gray-50/70 border-t border-gray-100">
    {!card.isDefault && (
     <button
      onClick={onSetDefault}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all hover:shadow-md hover:shadow-indigo-200 cursor-pointer"
     >
      <HiStar size={14} />
      Varsayılan Yap
     </button>
    )}
    <div className={`flex gap-2 ${card.isDefault ? "ml-auto" : ""}`}>
     <button
      onClick={() => onEdit(card)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all hover:shadow-md hover:shadow-indigo-200 cursor-pointer"
     >
      <HiPencil size={14} />
      Düzenle
     </button>
     <button
      onClick={() => {
       const cardId = card._id?.toString ? card._id.toString() : String(card._id || "");
       onDelete(cardId);
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer"
     >
      <HiTrash size={14} />
      Sil
     </button>
    </div>
   </div>
  </div>
 );
}
