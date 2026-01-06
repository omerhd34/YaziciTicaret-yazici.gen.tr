"use client";
import Link from "next/link";

export default function PaymentEmptyCart() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
     <h1 className="text-2xl font-bold mb-2">Ödeme</h1>
     <p className="text-gray-600 mb-6">Sepetiniz boş görünüyor.</p>
     <Link
      href="/"
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
     >
      Alışverişe Devam Et
     </Link>
    </div>
   </div>
  </div>
 );
}
