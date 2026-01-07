"use client";
import { FaCreditCard } from "react-icons/fa";
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
         <span className="text-gray-900 font-mono">TR53 0006 7010 0000 0049 8897 36</span>
        </div>
        <div className="text-sm">
         <span className="font-semibold text-gray-700">Alıcı Adı ve Soyadı: </span>
         <span className="text-gray-900">İlhan Yazıcı</span>
        </div>
       </div>
       <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <MdWarning className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-700 font-medium leading-relaxed">
         Sipariş verdiğinde 1 saat içerisinde ödeme yapılmazsa sipariş otomatik olarak iptal edilecektir. Ödeme işleminizi tamamladıktan sonra lütfen ödeme dekontunuzu saklayınız.
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
      <FaCreditCard className="text-indigo-600" size={20} />
      Kart ile Ödeme
     </label>
     {paymentMethod.type === "mailorder" && (
      <div className="mt-4 space-y-2">
       <p className="text-sm text-gray-600">
        Siparişiniz alındıktan sonra müşteri temsilcimiz sizinle iletişime geçerek <b>Mail Order</b> yöntemiyle ödeme işlemini gerçekleştirecektir. <b>Mail Order</b> yönteminde kredi kartı bilgileriniz, bankanın yetkilendirdiği POS sistemi üzerinden manuel olarak çekim yapılması için alınır.
       </p>
       <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <MdWarning className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-700 font-medium leading-relaxed">
         Kart ile ödeme seçeneğini tercih ettiğinizde, müşteri temsilcimiz sizinle iletişime geçerek kredi kartı bilgilerinizi <b>Mail Order</b> kapsamında alacaktır. Ödeme işlemi tamamlandıktan sonra siparişiniz hazırlık sürecine alınacaktır.
         <b> Mail Order</b> işlemlerinde 3D Secure doğrulaması bulunmamaktadır.
        </p>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
