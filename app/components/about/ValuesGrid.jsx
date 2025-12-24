"use client";
import { HiStar } from "react-icons/hi";

export default function ValuesGrid() {
 const values = [
  {
   title: "Kalite",
   description: "Tüm ürünlerimizde en yüksek kalite standartlarını uygular, müşterilerimize sadece güvenilir ve dayanıklı ürünler sunarız."
  },
  {
   title: "Müşteri Odaklılık",
   description: "Müşterilerimizin memnuniyeti bizim için her şeyden önemlidir. Her kararımızı müşteri deneyimini iyileştirmek için alırız."
  },
  {
   title: "Güvenilirlik",
   description: "Şeffaf iletişim, güvenli ödeme sistemleri ve zamanında teslimat ile müşterilerimizin güvenini kazanıyoruz."
  },
  {
   title: "Yenilikçilik",
   description: "Teknolojik gelişmeleri takip eder, sürekli kendimizi geliştirir ve müşterilerimize en iyi deneyimi sunmak için çalışırız."
  },
  {
   title: "Şeffaflık ve Dürüstlük",
   description: "Müşterilerimizle kurduğumuz ilişkide her zaman açık ve net olmayı, doğru bilgi vermeyi ve beklentileri gerçekçi şekilde yönetmeyi önemsiyoruz."
  },
  {
   title: "Tecrübe ve Uzmanlık",
   description: "27 yıllık sektör tecrübemiz ve Profilo markasının yetkili bayisi olarak, müşterilerimize uzman danışmanlık hizmeti sunuyoruz."
  }
 ];

 return (
  <section>
   <div className="flex items-center gap-3 mb-6">
    <HiStar className="text-indigo-600" size={28} />
    <h2 className="text-2xl font-bold text-gray-900">Değerlerimiz</h2>
   </div>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {values.map((value, idx) => (
     <div key={idx} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
      <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
      <p className="text-sm text-gray-700">{value.description}</p>
     </div>
    ))}
   </div>
  </section>
 );
}
