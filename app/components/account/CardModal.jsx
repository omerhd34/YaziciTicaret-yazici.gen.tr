"use client";
import { useState } from "react";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { getCardTypeByValue, getCardTypeByType } from "@/lib/cardTypes";
import { getBankNameFromBin } from "@/lib/binToBank";

export default function CardModal({ show, editingCard, cardForm, setCardForm, cardErrors, setCardErrors, onSubmit, onClose }) {
 useEscapeKey(onClose, { enabled: show });
 const [cardFocus, setCardFocus] = useState("");

 if (!show) return null;

 const cardTypeInfo = editingCard
  ? getCardTypeByType((editingCard.cardType || "").toLowerCase())
  : getCardTypeByValue(cardForm.cardNumber || "");
 const isAmex = cardTypeInfo?.type === "amex";

 const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const typeForValue = getCardTypeByValue(cleaned);
  const amexForValue = typeForValue?.type === "amex";

  if (amexForValue) {
   if (cleaned.length > 4) {
    const part1 = cleaned.substring(0, 4);
    const part2 = cleaned.substring(4, 10);
    const part3 = cleaned.substring(10, 15);
    if (part3) return `${part1} ${part2} ${part3}`.trim();
    if (part2) return `${part1} ${part2}`.trim();
    return part1;
   }
   return cleaned.slice(0, 15);
  }
  const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  return formatted.slice(0, 19);
 };

 const handleCardNumberChange = (e) => {
  const formatted = formatCardNumber(e.target.value);
  setCardForm({ ...cardForm, cardNumber: formatted });
  if (cardErrors.cardNumber) setCardErrors({ ...cardErrors, cardNumber: "" });
 };

 const cardExpiry = `${(cardForm.month || "").toString().padStart(2, "0")}/${cardForm.year || ""}`;
 const cvcFocused = cardFocus === "cvc";

 const inputClass = (err) =>
  `w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${err ? "border-red-500" : "border-gray-300"}`;

 const renderCardLogo = () => {
  if (cardTypeInfo?.icon) {
   return (
    <Image
     src={cardTypeInfo.icon}
     alt={cardTypeInfo.displayName}
     width={80}
     height={40}
     className="h-10 w-auto object-contain min-h-10"
    />
   );
  }
  return <span className="text-white/70 text-sm">Kart</span>;
 };

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
     <h3 className="text-2xl font-bold">{editingCard ? "Kart Düzenle" : "Yeni Kart Ekle"}</h3>
     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
      <HiX size={24} />
     </button>
    </div>

    {/* Kart önizlemesi */}
    <div className="p-6 pb-0">
     <div className="w-full max-w-[400px] mx-auto aspect-[1.586/1]" style={{ perspective: "1000px" }}>
      <div
       className="relative w-full h-full transition-transform duration-500 ease-in-out"
       style={{ transformStyle: "preserve-3d", transform: cvcFocused ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
       {/* Ön yüz */}
       <div
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
        style={{
         backfaceVisibility: "hidden",
         WebkitBackfaceVisibility: "hidden",
         background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.45) 50%, rgba(236,72,153,0.25) 100%)",
         boxShadow: "0 8px 32px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
       >
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
        <div className="relative h-full p-5 flex flex-col justify-between text-white">
         <div className="flex justify-between items-start">
          <span className="text-white font-semibold text-sm uppercase tracking-wide">
           {getBankNameFromBin(cardForm.cardNumber || "") || ""}
          </span>
          <div className="h-8 flex items-center">{renderCardLogo()}</div>
         </div>
         <div>
          <p className="text-white/70 text-[10px] uppercase tracking-widest mb-1">Kart Numarası</p>
          <p className="text-xl font-mono tracking-widest font-medium">
           {cardForm.cardNumber || "•••• •••• •••• ••••"}
          </p>
         </div>
         <div className="flex justify-between items-end">
          <div>
           <p className="text-white/70 text-[10px] uppercase tracking-widest mb-0.5">Kart Sahibi</p>
           <p className="text-sm font-medium uppercase tracking-wide">{cardForm.cardHolder || "Kart Sahibi"}</p>
          </div>
          <div className="text-right">
           <p className="text-white/70 text-[10px] uppercase tracking-widest mb-0.5">Geçerlilik</p>
           <p className="text-sm font-mono font-medium">{cardExpiry || "••/••"}</p>
          </div>
         </div>
        </div>
       </div>

       {/* Arka yüz – CVC */}
       <div
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
        style={{
         backfaceVisibility: "hidden",
         WebkitBackfaceVisibility: "hidden",
         transform: "rotateY(180deg)",
         background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.45) 50%, rgba(236,72,153,0.25) 100%)",
         boxShadow: "0 8px 32px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
       >
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
        <div className="absolute top-4 left-0 right-0 h-10 bg-gray-900/80" />
        <div className="absolute top-24 left-0 right-0 px-5">
         <div className="bg-white/95 rounded px-3 py-2 mb-3">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-0.5">Güvenlik kodu (CVC / CVV)</p>
          <p className="text-gray-900 font-mono text-right text-lg font-semibold tracking-widest">{cardForm.cvc || "•••"}</p>
         </div>
         <p className="text-white/60 text-[10px]">Kartın arkasındaki 3 veya 4 haneli kodu girin.</p>
        </div>
       </div>
      </div>
     </div>
    </div>

    <form onSubmit={onSubmit} className="p-6 space-y-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
       <label className="block text-sm font-semibold mb-2">Kart Başlığı <span className="text-red-500">*</span></label>
       <input
        type="text"
        value={cardForm.title}
        onFocus={() => setCardFocus("")}
        onChange={(e) => {
         setCardForm({ ...cardForm, title: e.target.value });
         if (cardErrors.title) setCardErrors({ ...cardErrors, title: "" });
        }}
        className={inputClass(cardErrors.title)}
        placeholder="Ana Kart, İş Kartı, vb."
        required
       />
       {cardErrors.title && <p className="text-xs text-red-500 mt-1">{cardErrors.title}</p>}
      </div>
      <div>
       <label className="block text-sm font-semibold mb-2">Kart Numarası <span className="text-red-500">*</span></label>
       <input
        type="text"
        inputMode="numeric"
        value={cardForm.cardNumber}
        onFocus={() => setCardFocus("number")}
        onChange={handleCardNumberChange}
        maxLength={isAmex ? 17 : 19}
        className={inputClass(cardErrors.cardNumber)}
        placeholder={isAmex ? "1234 567890 12345" : "1234 5678 9012 3456"}
        required
        disabled={!!editingCard}
       />
       {cardErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>}
      </div>
     </div>

     <div>
      <label className="block text-sm font-semibold mb-2">Kart Sahibi <span className="text-red-500">*</span></label>
      <input
       type="text"
       value={cardForm.cardHolder}
       onFocus={() => setCardFocus("name")}
       onChange={(e) => {
        let value = e.target.value.replace(/[^\p{L}\s]/gu, "");
        value = value
         .split(/\s+/)
         .map((word) => (word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
         .join(" ");
        setCardForm({ ...cardForm, cardHolder: value });
        if (cardErrors.cardHolder) setCardErrors({ ...cardErrors, cardHolder: "" });
       }}
       className={inputClass(cardErrors.cardHolder)}
       placeholder="Ad ve Soyad"
       required
      />
      {cardErrors.cardHolder && <p className="text-xs text-red-500 mt-1">{cardErrors.cardHolder}</p>}
     </div>

     <div className="grid md:grid-cols-3 gap-4">
      <div>
       <label className="block text-sm font-semibold mb-2">Son Kullanma Ayı <span className="text-red-500">*</span></label>
       <input
        type="number"
        inputMode="numeric"
        value={cardForm.month}
        onFocus={() => setCardFocus("expiry")}
        onChange={(e) => {
         const value = e.target.value;
         if (value === "" || (value >= 1 && value <= 12)) {
          setCardForm({ ...cardForm, month: value });
          if (cardErrors.month) setCardErrors({ ...cardErrors, month: "" });
         }
        }}
        className={inputClass(cardErrors.month)}
        placeholder="MM"
        min="1"
        max="12"
        required
       />
       {cardErrors.month && <p className="text-xs text-red-500 mt-1">{cardErrors.month}</p>}
      </div>
      <div>
       <label className="block text-sm font-semibold mb-2">Son Kullanma Yılı <span className="text-red-500">*</span></label>
       <input
        type="text"
        inputMode="numeric"
        value={cardForm.year}
        onFocus={() => setCardFocus("expiry")}
        onChange={(e) => {
         const value = e.target.value.replace(/\D/g, "").slice(0, 2);
         setCardForm({ ...cardForm, year: value });
         if (cardErrors.year) setCardErrors({ ...cardErrors, year: "" });
        }}
        className={inputClass(cardErrors.year)}
        placeholder="YY"
        maxLength="2"
        required
       />
       {cardErrors.year && <p className="text-xs text-red-500 mt-1">{cardErrors.year}</p>}
      </div>
      <div>
       <label className="block text-sm font-semibold mb-2">Güvenlik kodu (CVC / CVV) <span className="text-red-500">*</span></label>
       <input
        type="text"
        inputMode="numeric"
        value={cardForm.cvc || ""}
        onFocus={() => setCardFocus("cvc")}
        onBlur={() => setCardFocus("")}
        onChange={(e) => {
         const maxLen = isAmex ? 4 : 3;
         const value = e.target.value.replace(/\D/g, "").slice(0, maxLen);
         setCardForm({ ...cardForm, cvc: value });
         if (cardErrors.cvc) setCardErrors({ ...cardErrors, cvc: "" });
        }}
        className={inputClass(cardErrors.cvc)}
        placeholder={isAmex ? "1234" : "123"}
        maxLength={isAmex ? 4 : 3}
        required
       />
       {cardErrors.cvc && <p className="text-xs text-red-500 mt-1">{cardErrors.cvc}</p>}
      </div>
     </div>

     <div className="flex items-center gap-2">
      <input
       type="checkbox"
       id="isDefault"
       checked={Boolean(cardForm.isDefault)}
       onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
      />
      <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
       Varsayılan kart olarak kaydet
      </label>
     </div>

     <div className="flex gap-3 pt-4">
      <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer">
       İptal
      </button>
      <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition cursor-pointer">
       {editingCard ? "Güncelle" : "Kaydet"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}
