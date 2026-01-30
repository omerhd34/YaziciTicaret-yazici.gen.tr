"use client";
import { HiCog } from "react-icons/hi";
import CookieTypeCard from "./CookieTypeCard";

export default function CookieTypesSection() {
 const cookieTypes = [
  {
   title: "Zorunlu Çerezler",
   description: "Bu çerezler web sitemizin çalışması için gereklidir ve devre dışı bırakılamaz.",
   items: [
    <><strong>Oturum Çerezleri:</strong> Giriş yaptığınızda oturumunuzu korur.</>,
    <><strong>Güvenlik Çerezleri:</strong> Güvenli bağlantı sağlar.</>,
    <><strong>Sepet Çerezleri:</strong> Sepetinizdeki ürünleri hatırlar.</>,
    <><strong>Tercih Çerezleri:</strong> Dil ve bölge tercihlerinizi saklar.</>
   ],
   bgColor: "bg-green-50",
   borderColor: "border-green-200",
   iconColor: "text-green-600"
  },
  {
   title: "Performans Çerezleri",
   description: "Bu çerezler, web sitemizin nasıl kullanıldığını anlamamıza yardımcı olur ve performansı iyileştirmemizi sağlar.",
   items: [
    <><strong>Analitik Çerezler:</strong> Ziyaretçi sayısı, sayfa görüntülemeleri, kullanıcı davranışları</>,
    <><strong>Hata Takip Çerezleri:</strong> Teknik hataları tespit etmek için</>,
    <><strong>Yükleme Süresi Çerezleri:</strong> Sayfa yükleme performansını ölçmek için</>
   ],
   note: "Bu çerezler devre dışı bırakılabilir, ancak web sitesi deneyiminiz etkilenebilir.",
   bgColor: "bg-blue-50",
   borderColor: "border-blue-200",
   iconColor: "text-blue-600"
  },
  {
   title: "İşlevsellik Çerezleri",
   description: "Bu çerezler, web sitemizin gelişmiş özelliklerini ve kişiselleştirmeyi sağlar.",
   items: [
    <><strong>Tercih Çerezleri:</strong> Dil, tema, görüntüleme tercihleriniz</>,
    <><strong>Favori Çerezleri:</strong> Favori ürünlerinizi hatırlar</>,
    <><strong>Form Çerezleri:</strong> Form verilerinizi geçici olarak saklar</>
   ],
   note: "Bu çerezler devre dışı bırakılabilir, ancak bazı özellikler çalışmayabilir.",
   bgColor: "bg-purple-50",
   borderColor: "border-purple-200",
   iconColor: "text-purple-600"
  },
  {
   title: "Hedefleme/İzleme Çerezleri",
   description: "Bu çerezler, size daha ilgili reklamlar ve içerikler sunmak için kullanılır.",
   items: [
    <><strong>Reklam Çerezleri:</strong> Size özel reklamlar göstermek için</>,
    <><strong>İzleme Çerezleri:</strong> Web sitemizdeki hareketlerinizi takip eder</>,
    <><strong>Sosyal Medya Çerezleri:</strong> Sosyal medya entegrasyonları için</>
   ],
   note: "Bu çerezler devre dışı bırakılabilir.",
   bgColor: "bg-orange-50",
   borderColor: "border-orange-200",
   iconColor: "text-orange-600"
  }
 ];

 return (
  <section>
   <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
    <HiCog className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Kullandığımız Çerez Türleri</h2>
   </div>
   <div className="space-y-4 sm:space-y-6">
    {cookieTypes.map((type, idx) => (
     <CookieTypeCard
      key={idx}
      title={type.title}
      description={type.description}
      items={type.items}
      note={type.note}
      bgColor={type.bgColor}
      borderColor={type.borderColor}
      iconColor={type.iconColor}
     />
    ))}
   </div>
  </section>
 );
}
