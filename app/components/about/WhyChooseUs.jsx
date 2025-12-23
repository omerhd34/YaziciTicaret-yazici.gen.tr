"use client";
import { HiGlobe, HiCheck } from "react-icons/hi";

export default function WhyChooseUs() {
 const features = [
  {
   title: "Geniş Ürün Yelpazesi",
   description: "Beyaz eşya, ankastre, elektronik ve daha fazlası kategorilerinde geniş ürün yelpazesi. Profilo markasının kaliteli ürünleri."
  },
  {
   title: "Hızlı ve Güvenli Teslimat",
   description: "Türkiye'nin her yerine hızlı ve güvenli kargo hizmeti. 2500 TL ve üzeri siparişlerde ücretsiz kargo."
  },
  {
   title: "Kolay İade ve Değişim",
   description: "14 gün içinde iade ve değişim garantisi. Müşteri memnuniyeti bizim önceliğimiz."
  },
  {
   title: "Güvenli Ödeme",
   description: "256-bit SSL şifreleme ile güvenli ödeme. Tüm kredi kartlarına taksit imkanı."
  },
  {
   title: "7/24 Müşteri Desteği",
   description: "Her zaman yanınızdayız. Sorularınız ve talepleriniz için profesyonel müşteri hizmetleri ekibimiz."
  }
 ];

 return (
  <section>
   <div className="flex items-center gap-3 mb-6">
    <HiGlobe className="text-indigo-600" size={28} />
    <h2 className="text-2xl font-bold text-gray-900">Neden Bizi Seçmelisiniz?</h2>
   </div>
   <div className="space-y-4">
    {features.map((feature, idx) => (
     <div key={idx} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
       <HiCheck size={18} />
      </div>
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
       <p className="text-gray-700 text-sm">{feature.description}</p>
      </div>
     </div>
    ))}
   </div>
  </section>
 );
}
