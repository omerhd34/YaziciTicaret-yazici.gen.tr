"use client";
import { HiUsers, HiCurrencyDollar, HiShoppingBag, HiCube, HiPhone, HiEye } from "react-icons/hi";

export default function WhyChooseUsSection() {
 const features = [
  {
   icon: HiUsers,
   title: "Uzman Kadro",
   description: "Alanında uzman ekibimizle size en iyi hizmeti sunuyoruz. Yılların verdiği deneyim ve bilgi birikimiyle, her zaman yanınızdayız ve ihtiyaçlarınıza en uygun çözümleri sunuyoruz.",
   gradient: "from-blue-500 to-blue-700",
  },
  {
   icon: HiCurrencyDollar,
   title: "Uygun Fiyat",
   description: "Kaliteli ürünleri en uygun fiyatlarla temin ediyoruz. Doğrudan üretici ve distribütörlerle çalışarak, size en iyi fiyat avantajını sağlıyoruz. Bütçenize uygun seçeneklerle hayalinizdeki ürünlere sahip olun.",
   gradient: "from-green-500 to-green-700",
  },
  {
   icon: HiShoppingBag,
   title: "Geniş Ürün Yelpazesi",
   description: "Beyaz eşyadan elektroniğe, ankastreden klimalara kadar her ihtiyaca uygun ürün çeşitleri. Binlerce ürün seçeneği ile evinizin her köşesi için doğru çözümü bulabilirsiniz.",
   gradient: "from-purple-500 to-purple-700",
  },
  {
   icon: HiCube,
   title: "Güvenli Paketleme",
   description: "Ürünleriniz özenle paketlenir ve korunur. Özel ambalaj malzemeleri kullanarak, ürünlerinizin hasar görmeden kapınıza kadar güvenle ulaşmasını sağlıyoruz.",
   gradient: "from-pink-500 to-pink-700",
  },
  {
   icon: HiPhone,
   title: "Hızlı Geri Dönüş",
   description: "Ürün isteği bulunduktan sonra kısa sürede geri dönüş yapılır. Müşteri memnuniyeti odaklı hizmet anlayışımızla, sorularınıza ve taleplerinize en hızlı şekilde yanıt veriyoruz.",
   gradient: "from-yellow-500 to-yellow-700",
  },
  {
   icon: HiEye,
   title: "Canlı Takip",
   description: "Ürün isteği durumu anlık takip edilebilir. Siparişinizin her aşamasını takip edebilir, ürününüzün nerede olduğunu ve ne zaman elinize ulaşacağını anlık olarak görebilirsiniz.",
   gradient: "from-red-500 to-red-700",
  },
 ];

 return (
  <section className="bg-gray-50 py-16">
   <div className="container mx-auto px-4">
    <h2 className="text-4xl font-black text-gray-900 text-center mb-12">
     Neden Yazıcı Ticaret?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
     {features.map((feature, idx) => {
      const Icon = feature.icon;
      return (
       <div
        key={idx}
        className={`bg-linear-to-b ${feature.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
       >
        <div className="flex items-start gap-4">
         <div className="bg-white rounded-full p-3 shrink-0">
          <Icon size={24} className="text-gray-900" />
         </div>
         <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>
         </div>
        </div>
       </div>
      );
     })}
    </div>

    <div className="bg-linear-to-r from-indigo-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
     <h3 className="text-3xl md:text-4xl font-black mb-4">
      Yıllardır Güvenle Hizmetinizdeyiz
     </h3>
     <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
      1997 yılından bu yana İnegöl ve çevresinde, kaliteli beyaz eşya ürünleri ve güvenilir hizmet anlayışıyla sizlere hizmet veriyoruz.
     </p>
    </div>
   </div>
  </section>
 );
}

