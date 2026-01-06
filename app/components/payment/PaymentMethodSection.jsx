"use client";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdWarning, MdPayment } from "react-icons/md";

export default function PaymentMethodSection({
 paymentMethod,
 onPaymentMethodChange,
}) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
    <MdPayment className="text-indigo-600" size={22} />
    Ödeme Seçenekleri
   </h2>

   <div className="space-y-4">
    <div className={`border rounded-xl p-4 ${paymentMethod.type === "havale" ? "border-indigo-300 bg-indigo-50" : "border-gray-200"}`}>
     <label className="flex items-center gap-2 font-semibold text-gray-900 cursor-pointer">
      <input
       type="radio"
       name="payment"
       checked={paymentMethod.type === "havale"}
       onChange={() => onPaymentMethodChange({ type: "havale" })}
      />
      <FaMoneyBillTransfer className="text-indigo-600" size={20} />
      Havale ve EFT ile Ödeme
     </label>

     {paymentMethod.type === "havale" && (
      <div className="mt-4 space-y-2">
       <p className="text-sm text-gray-600">
        IBAN&apos;a para transferi yaparak ödeme yapabilirsiniz.
       </p>
       <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 mt-3">
        <div className="text-sm">
         <span className="font-semibold text-gray-700">IBAN: </span>
         <span className="text-gray-900 font-mono">TR33 0006 1005 0000 0006 6123 45</span>
        </div>
        <div className="text-sm">
         <span className="font-semibold text-gray-700">Alıcı Adı ve Soyadı: </span>
         <span className="text-gray-900">İlhan Yazıcı</span>
        </div>
       </div>
       <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <MdWarning className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-700 font-medium leading-relaxed">
         Sipariş verdiğinde 1 saat içersinde ödeme yapılmazsa sipariş otomatik olarak iptal edilecektir. Ödeme işleminizi tamamladıktan sonra lütfen ödeme dekontunuzu saklayınız.
         Ödeme onayı için dekontunuzu müşteri hizmetlerimizle paylaşmanız gerekebilir.
        </p>
       </div>
      </div>
     )}
    </div>

    <div className={`border rounded-xl p-4 ${paymentMethod.type === "mailorder" ? "border-indigo-300 bg-indigo-50" : "border-gray-200"}`}>
     <label className="flex items-center gap-2 font-semibold text-gray-900 cursor-pointer">
      <input
       type="radio"
       name="payment"
       checked={paymentMethod.type === "mailorder"}
       onChange={() => onPaymentMethodChange({ type: "mailorder" })}
      />
      <FaMoneyBillTransfer className="text-indigo-600" size={20} />
      Kapıda Ödeme
     </label>

     {paymentMethod.type === "mailorder" && (
      <div className="mt-4 space-y-2">
       <p className="text-sm text-gray-600">
        Siparişiniz teslim edilirken kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz.
       </p>
       <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <MdWarning className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-700 font-medium leading-relaxed">
         Kapıda ödeme ile sipariş verdiğinizde, kargo teslimatı sırasında ürün bedelini kargo görevlisine ödeyebilirsiniz.
         Kapıda ödeme siparişlerinde ekstra bir ücret talep edilmez.
        </p>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
