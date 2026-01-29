"use client";
import Link from "next/link";
import { HiReceiptTax } from "react-icons/hi";
import PaymentAddressCard from "./PaymentAddressCard";

export default function BillingAddressSection({
 addresses,
 addressesLoading,
 selectedAddressId,
 selectedBillingAddressId,
 onBillingAddressSelect,
 useSameAsShipping,
 onUseSameAsShippingChange,
}) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
     <HiReceiptTax className="text-indigo-600" size={22} />
     Fatura Adresi
    </h2>
    <Link
     href="/hesabim?tab=adresler"
     className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
    >
     Adres Ekle / Düzenle →
    </Link>
   </div>

   <div className="mb-4">
    <label className="flex items-center gap-2 cursor-pointer">
     <input
      type="checkbox"
      checked={useSameAsShipping}
      onChange={(e) => onUseSameAsShippingChange(e.target.checked)}
      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
     />
     <span className="text-sm text-gray-700">
      Teslimat adresi ile aynı olsun
     </span>
    </label>
   </div>

   {useSameAsShipping ? (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 bg-gray-50">
     Fatura adresi teslimat adresi ile aynı olacak.
    </div>
   ) : addressesLoading ? (
    <div className="text-gray-500 text-sm">Adresler yükleniyor...</div>
   ) : addresses.length === 0 ? (
    <div className="border border-dashed rounded-lg p-4 text-sm text-gray-600">
     Kayıtlı adresiniz yok. Devam etmek için lütfen bir adres ekleyin.
    </div>
   ) : (
    <div className="grid md:grid-cols-2 gap-4">
     {addresses.map((addr) => {
      const id = addr?._id?.toString ? addr._id.toString() : addr?._id;
      const selected = String(selectedBillingAddressId) === String(id);
      return (
       <PaymentAddressCard
        key={id}
        address={addr}
        selected={selected}
        onSelect={onBillingAddressSelect}
       />
      );
     })}
    </div>
   )}
  </div>
 );
}
