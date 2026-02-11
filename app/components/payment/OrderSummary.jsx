"use client";
import Link from "next/link";

export default function OrderSummary({
 cartTotal,
 normalCartTotal,
 shippingCost,
 grandTotal,
 acceptedTerms,
 onTermsChange,
 error,
 canPay,
 onPay,
 paymentMethodType,
 isSubmitting = false,
}) {
 const hasBundleDiscount = normalCartTotal != null && normalCartTotal > cartTotal && normalCartTotal > 0;
 const discountAmount = hasBundleDiscount ? normalCartTotal - cartTotal : 0;

 return (
  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
   <h3 className="font-bold text-lg mb-4">Sipariş Özeti</h3>

   <div className="space-y-3 mb-4 pb-4 border-b">
    {hasBundleDiscount && (
     <>
      <div className="flex justify-between text-sm">
       <span className="text-gray-600">Ürünler toplamı</span>
       <span className="text-gray-500 line-through">{normalCartTotal.toFixed(2)} ₺</span>
      </div>
      <div className="flex justify-between text-sm">
       <span className="text-gray-600">Kampanya paket indirimi</span>
       <span className="font-semibold text-green-600">-{discountAmount.toFixed(2)} ₺</span>
      </div>
     </>
    )}
    <div className="flex justify-between text-sm">
     <span className="text-gray-600">Ürünler Toplamı</span>
     <span className="font-semibold">{cartTotal.toFixed(2)} ₺</span>
    </div>
    <div className="flex justify-between text-sm">
     <span className="text-gray-600">Kargo</span>
     <span className="font-semibold">
      {shippingCost === 0 ? <span className="text-green-600">Ücretsiz</span> : `${shippingCost.toFixed(2)} ₺`}
     </span>
    </div>
   </div>

   <div className="flex justify-between mb-4">
    <span className="font-bold text-lg">Toplam</span>
    <span className="font-black text-xl text-indigo-600">
     {grandTotal.toFixed(2)} ₺
    </span>
   </div>

   <label className="flex items-start gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
    <input
     type="checkbox"
     checked={acceptedTerms}
     onChange={(e) => onTermsChange(e.target.checked)}
     className="mt-1 cursor-pointer"
    />
    <span>
     <Link href="/kullanim-kosullari" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
      Ön Bilgilendirme Koşulları
     </Link>
     {" "}ve{" "}
     <Link href="/kullanim-kosullari" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
      Mesafeli Satış Sözleşmesi
     </Link>
     {"'"}ni okudum, onaylıyorum.
    </span>
   </label>

   {error && (
    <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
     {error}
    </div>
   )}

   <button
    type="button"
    disabled={!canPay || isSubmitting}
    onClick={onPay}
    className={`w-full py-4 rounded-lg font-bold text-lg transition ${canPay && !isSubmitting
     ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
     : "bg-gray-300 text-gray-600 cursor-not-allowed"
     }`}
   >
    {isSubmitting ? "Sipariş oluşturuluyor..." : paymentMethodType === "cash" ? "Satın Al" : "Ödemeye Geç"}
   </button>

   <Link
    href="/sepet"
    className="block text-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm mt-3"
   >
    Sepete Geri Dön
   </Link>
  </div>
 );
}
