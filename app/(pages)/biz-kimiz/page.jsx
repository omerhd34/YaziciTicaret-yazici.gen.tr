"use client";
import { HiLightBulb, HiHeart, HiTrendingUp, HiUsers } from "react-icons/hi";
import AboutSection from "@/app/components/about/AboutSection";
import ValuesGrid from "@/app/components/about/ValuesGrid";
import WhyChooseUs from "@/app/components/about/WhyChooseUs";

export default function BizKimizPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <div className="text-center mb-12">
     <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
      <HiUsers className="text-indigo-600" size={40} />
     </div>
     <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
      Biz Kimiz ?
     </h1>
    </div>
    <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">
     <AboutSection icon={HiLightBulb} title="Hikayemiz">
      <p>
       Yazıcı Ticaret, 1997 yılında Bursa&apos;nın İnegöl ilçesinde, müşterilerimize kaliteli beyaz eşya ve
       elektronik ürünleri ulaştırma hayaliyle kuruldu. Başlangıçta küçük bir ekip ve tek bir mağaza ile
       yola çıktık, ancak müşteri memnuniyetini her şeyin üzerinde tutan anlayışımız sayesinde hızla büyüdük.
      </p>
      <p>
       Profilo markasının yetkili bayisi olma sürecimiz, müşterilerimize daha kaliteli ve güvenilir hizmet
       sunma isteğimizden doğdu. 2023 yılında İnegöl&apos;de ikinci mağazamızı açarak hizmet ağımızı genişlettik.
       Yıllar içinde binlerce mutlu müşteriye hizmet vererek, bölgenin güvenilir beyaz eşya satış noktası
       haline geldik.
      </p>
      <p>
       Teknolojinin gelişmesiyle birlikte, 2026 yılında online e-ticaret platformumuzu hayata geçirdik.
       Bu adım, sadece İnegöl&apos;de değil, Türkiye&apos;nin dört bir yanındaki müşterilerimize de ulaşmamızı
       sağladı. Geleneksel perakende deneyimimizi dijital dünyaya taşıyarak, müşterilerimize her iki kanaldan
       da hizmet vermeye başladık.
      </p>
      <p>
       Bugün, 27 yıllık tecrübemizle, hem fiziksel mağazalarımız hem de online platformumuz aracılığıyla
       müşterilerimize hizmet vermeye devam ediyoruz. Geçmişten gelen değerlerimizi koruyarak, modern
       teknolojilerle harmanladığımız hizmet anlayışımızla yolumuza devam ediyoruz.
      </p>
     </AboutSection>

     <AboutSection icon={HiHeart} title="Misyonumuz">
      <p>
       Misyonumuz, beyaz eşya ve elektronik ürünler dünyasında en kaliteli ürünleri, en uygun fiyatlarla
       müşterilerimize sunmak ve onlara unutulmaz bir alışveriş deneyimi yaşatmaktır. Profilo markasının
       yetkili bayisi olarak, müşterilerimize sadece ürün satmakla kalmıyor, ev ihtiyaçlarını en iyi şekilde
       karşılayacak çözümler sunmak için danışmanlık hizmeti de veriyoruz.
      </p>
      <p>
       Şeffaflık ve dürüstlük, hizmet anlayışımızın temelini oluşturur. Müşterilerimizle kurduğumuz ilişkide
       her zaman açık ve net olmayı, doğru bilgi vermeyi ve beklentileri gerçekçi şekilde yönetmeyi
       önemsiyoruz. Bu yaklaşım, müşterilerimizin güvenini kazanmamızın en önemli nedenidir.
      </p>
      <p>
       Her müşterimizin evine giren ürünlerin, onların hayatını kolaylaştırmasını ve mutluluk getirmesini
       hedefliyoruz. Bu nedenle sadece satış yapmakla yetinmiyor, satış sonrası hizmetlerimizle de
       müşterilerimizin yanında olmaya devam ediyoruz. Ürün kurulumu, teknik destek ve bakım konularında
       müşterilerimize yardımcı oluyoruz.
      </p>
      <p>
       Müşteri memnuniyeti bizim için bir sonuç değil, sürekli bir süreçtir. Her gün kendimizi geliştirerek,
       müşterilerimizin ihtiyaçlarını daha iyi anlamak ve karşılamak için çalışıyoruz. Bu yaklaşımımız,
       işletmemizin temel değerlerinden biridir.
      </p>
     </AboutSection>

     <AboutSection icon={HiTrendingUp} title="Vizyonumuz">
      <p>
       Vizyonumuz, Türkiye&apos;nin en güvenilir ve tercih edilen beyaz eşya ve elektronik ürün
       satış platformu olmak ve sektörde öncü bir konuma gelmektir. Profilo markasının gücünü arkasına alarak,
       müşterilerimize hem geleneksel perakende deneyimini hem de modern dijital alışveriş imkanlarını
       bir arada sunan, sektörde fark yaratan bir işletme olmayı hedefliyoruz.
      </p>
      <p>
       Gelecekte, daha geniş bir ürün yelpazesi sunarak müşterilerimizin tüm ev ihtiyaçlarını tek bir
       yerden karşılayabilmelerini sağlamayı planlıyoruz. Gelişmiş teknoloji altyapısı ile online
       platformumuzu sürekli iyileştirerek, müşterilerimize daha hızlı, daha kolay ve daha güvenli bir
       alışveriş deneyimi sunmayı hedefliyoruz. Fiziksel mağazalarımızı da modern teknolojilerle donatarak,
       online ve offline kanalları entegre eden bir hizmet modeli oluşturmayı planlıyoruz.
      </p>
      <p>
       Sektörde öncü bir konuma gelmek için, müşterilerimize değer katan bir ekosistem oluşturmayı
       hedefliyoruz. Bu ekosistem içinde, ürün danışmanlığından satış sonrası hizmetlere, teknik destekten
       bakım ve onarım hizmetlerine kadar her aşamada mükemmelliği yakalamayı amaçlıyoruz. Müşterilerimizin
       hayatlarını kolaylaştıran, onlara zaman kazandıran ve evlerine değer katan çözümler sunmak
       vizyonumuzun temelini oluşturuyor.
      </p>
      <p>
       Uzun vadede, bölgesel bir güç olmaktan çıkıp, Türkiye genelinde tanınan ve güvenilen bir marka
       haline gelmeyi hedefliyoruz. Bu hedefe ulaşmak için, kaliteli hizmet anlayışımızdan asla ödün
       vermeyeceğiz. Gelecek nesillere, güvenilir ve müşteri odaklı bir işletme mirası bırakmak en
       büyük hedefimizdir.
      </p>
     </AboutSection>

     <ValuesGrid />
     <WhyChooseUs />
    </div>
   </div>
  </div>
 );
}

