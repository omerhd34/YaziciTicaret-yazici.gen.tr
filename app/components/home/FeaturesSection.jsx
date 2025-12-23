"use client";
import { HiLightningBolt, HiTrendingUp } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

export default function FeaturesSection() {
 return (
  <section className="container mx-auto px-4 py-12">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-start gap-4">
     <div className="bg-green-100 p-3 rounded-lg">
      <HiLightningBolt className="text-green-600" size={28} />
     </div>
     <div>
      <h3 className="font-bold text-lg mb-1">Hızlı Kargo</h3>
      <p className="text-gray-600 text-sm">2500 TL ve üzeri siparişlerde ücretsiz kargo</p>
     </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-start gap-4">
     <div className="bg-blue-100 p-3 rounded-lg">
      <FaStar className="text-blue-600" size={28} />
     </div>
     <div>
      <h3 className="font-bold text-lg mb-1">Kaliteli Ürünler</h3>
      <p className="text-gray-600 text-sm">%100 orijinal ve garantili ürünler</p>
     </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-start gap-4">
     <div className="bg-purple-100 p-3 rounded-lg">
      <HiTrendingUp className="text-purple-600" size={28} />
     </div>
     <div>
      <h3 className="font-bold text-lg mb-1">Kolay İade ve Değişim</h3>
      <p className="text-gray-600 text-sm">14 gün içinde iade ve değişim garantisi</p>
     </div>
    </div>
   </div>
  </section>
 );
}
