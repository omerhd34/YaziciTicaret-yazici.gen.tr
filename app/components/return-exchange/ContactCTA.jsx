"use client";
import Link from "next/link";
import { HiMail } from "react-icons/hi";

export default function ContactCTA() {
 return (
  <div className="max-w-5xl mx-auto mt-12">
   <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl p-8 text-white text-center">
    <HiMail className="mx-auto mb-4" size={48} />
    <h2 className="text-2xl font-bold mb-4">İade veya Değişim İçin Bize Ulaşın</h2>
    <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
     İade veya değişim işleminizi başlatmak için müşteri hizmetlerimizle iletişime geçin.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
     <Link
      href="/destek"
      className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition"
     >
      Destek Sayfasına Git
     </Link>
     <Link
      href="tel:+905078492903"
      className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold border-2 border-white transition"
     >
      0544 796 77 70
     </Link>
    </div>
   </div>
  </div>
 );
}
