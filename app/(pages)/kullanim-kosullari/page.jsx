"use client";
import Link from "next/link";
import { HiCheckCircle, HiXCircle, HiShieldCheck } from "react-icons/hi";
import TermsHeader from "@/app/components/policy/TermsHeader";
import TermsIntroduction from "@/app/components/policy/TermsIntroduction";
import PolicySection from "@/app/components/policy/PolicySection";

export default function KullanimKosullariPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <TermsHeader />

    <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">
     <TermsIntroduction />

     <PolicySection
      icon={<HiCheckCircle className="text-indigo-600" size={24} />}
      title="Genel Koşullar"
     >
      <>
       <p className="leading-relaxed">
        Bu web sitesi <strong>Yazıcı Ticaret</strong> (Profilo markasının yetkili bayisi, 2 şube) tarafından işletilmektedir. Web sitemizi kullanarak:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>18 yaşında veya daha büyük olduğunuzu onaylarsınız.</li>
        <li>Verdiğiniz tüm bilgilerin doğru ve güncel olduğunu garanti edersiniz.</li>
        <li>Hesabınızın güvenliğinden sorumlu olduğunuzu kabul edersiniz.</li>
        <li>Web sitemizi yasalara uygun şekilde kullanacağınızı taahhüt edersiniz.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection
      icon={<HiShieldCheck className="text-indigo-600" size={24} />}
      title="Hesap Kullanımı"
     >
      <>
       <p className="leading-relaxed">
        Hesabınızı oluştururken ve kullanırken:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Şifrenizi gizli tutmanız ve başkalarıyla paylaşmamanız gerekmektedir.</li>
        <li>Hesabınızdaki tüm aktivitelerden sorumlusunuz.</li>
        <li>Hesabınızın yetkisiz kullanımından şüphelenirseniz derhal bize bildirmelisiniz.</li>
        <li>Sahte veya yanıltıcı bilgi vermek yasaktır.</li>
        <li>Başka birinin hesabını kullanmak yasaktır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Ürün ve Hizmetler">
      <>
       <p className="leading-relaxed">
        Ürünlerimiz ve hizmetlerimizle ilgili:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Ürün fiyatları ve stok durumu değişiklik gösterebilir.</li>
        <li>Ürün görselleri temsilidir, gerçek ürünlerde küçük farklılıklar olabilir.</li>
        <li>Ürün açıklamalarını doğru tutmaya çalışırız ancak hatalar olabilir.</li>
        <li>Stokta olmayan ürünler için önceden haber vermeden sipariş iptal edebiliriz.</li>
        <li>Fiyat hatalarından kaynaklanan siparişleri iptal etme hakkımız saklıdır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Sipariş ve Ödeme">
      <>
       <p className="leading-relaxed">
        Sipariş verme ve ödeme işlemleri:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Sipariş vermek, ürünü satın alma teklifi yapmak anlamına gelir.</li>
        <li>Sipariş onayı e-posta ile gönderilir.</li>
        <li>Ödeme işlemleri güvenli ödeme sağlayıcıları aracılığıyla yapılır.</li>
        <li>Ödeme bilgileriniz güvenli şekilde işlenir ve saklanmaz.</li>
        <li>Fiyatlar Türk Lirası (₺) cinsindendir.</li>
        <li>Tüm Türkiye geneline nakliye ve montaj hizmeti sunulmaktadır.</li>
        <li>Bursa iline ücretsiz teslimat yapılmaktadır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="İade ve Değişim">
      <>
       <p className="leading-relaxed">
        İade ve değişim koşulları:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Ürünleri teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.</li>
        <li>Ürün orijinal ambalajında, etiketleriyle ve kullanılmamış olmalıdır.</li>
        <li>İade işlemleri ücretsizdir.</li>
        <li>Özel ürünlerde iade kabul edilmez.</li>
        <li>Detaylı bilgi için <Link href="/iade-degisim" className="text-indigo-600 hover:underline">İade &amp; Değişim</Link> sayfasını ziyaret edin.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Fikri Mülkiyet">
      <>
       <p className="leading-relaxed">
        Web sitemizdeki içerikler:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Telif hakkı ve diğer fikri mülkiyet haklarıyla korunmaktadır.</li>
        <li>İçerikleri izinsiz kopyalamak, dağıtmak veya kullanmak yasaktır.</li>
        <li>Profilo markası, logo ve tasarımlar Profilo&apos;ya aittir.</li>
        <li>Web sitesi içeriği ve tasarımı Yazıcı Ticaret&apos;e aittir.</li>
        <li>Ürün görselleri ve açıklamaları ticari amaçla kullanılamaz.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection
      icon={<HiXCircle className="text-red-600" size={24} />}
      title="Yasaklanan Kullanımlar"
     >
      <>
       <p className="leading-relaxed">
        Web sitemizi kullanırken aşağıdakiler yasaktır:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Yasa dışı amaçlarla kullanmak</li>
        <li>Virüs, zararlı yazılım veya kötü amaçlı kod yüklemek</li>
        <li>Sistemi bozmaya veya erişimi engellemeye çalışmak</li>
        <li>Başkalarının kişisel bilgilerini toplamak</li>
        <li>Sahte sipariş vermek veya dolandırıcılık yapmak</li>
        <li>Otomatik botlar veya scriptler kullanmak</li>
        <li>Web sitesinin işleyişini bozmaya çalışmak</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Sorumluluk Reddi">
      <>
       <p className="leading-relaxed">
        Yazıcı Ticaret olarak:
       </p>
       <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Web sitesinin kesintisiz çalışmasını garanti edemeyiz.</li>
        <li>Hatalar veya eksiklikler için sorumluluk kabul etmeyiz.</li>
        <li>Üçüncü taraf bağlantılarının içeriğinden sorumlu değiliz.</li>
        <li>Kullanıcıların web sitesini kullanımından kaynaklanan zararlardan sorumlu değiliz.</li>
        <li>Ürünlerin kullanımından kaynaklanan hasarlardan sorumlu değiliz.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Koşul Değişiklikleri">
      <p className="text-gray-700 leading-relaxed">
       Bu Kullanım Koşulları zaman zaman güncellenebilir. Önemli değişikliklerde size bildirim yapacağız.
       Güncel koşulları bu sayfadan takip edebilirsiniz. Değişikliklerden sonra web sitemizi kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
      </p>
     </PolicySection>
    </div>
   </div>
  </div>
 );
}
