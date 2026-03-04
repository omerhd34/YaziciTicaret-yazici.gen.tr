"use client";
import Link from "next/link";
import { HiDocumentText, HiInformationCircle, HiTruck, HiCube, HiScale } from "react-icons/hi";
import PolicySection from "@/app/components/policy/PolicySection";

export default function MesafeliSatisSozlesmesiPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <div className="text-center mb-8 md:mb-12">
     <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-indigo-100 rounded-full mb-4 sm:mb-6">
      <HiDocumentText className="text-indigo-600 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
     </div>
     <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
      Mesafeli Satış Sözleşmesi
     </h1>
    </div>

    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
     <PolicySection
      icon={<HiInformationCircle className="text-indigo-600" size={24} />}
      title="Taraflar ve Satıcı Bilgileri"
     >
      <>
       <p className="leading-relaxed mb-3">
        Bu sözleşme, <strong>6502 sayılı Tüketicinin Korunması Hakkında Kanun</strong> ve{" "}
        <strong>Mesafeli Sözleşmeler Yönetmeliği</strong> hükümlerine uygun olarak düzenlenmiştir.
        Web sitemiz üzerinden yapılan tüm satış işlemlerinin koşullarını kapsar. Sipariş vererek bu sözleşmeyi kabul etmiş sayılırsınız.
       </p>
       <p className="font-semibold text-gray-900 mt-4 mb-2">SATICI (Üye İşyeri)</p>
       <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1.5 text-gray-700">
        <p className="font-semibold text-gray-900">Yazıcı Ticaret</p>
        <p><strong>Adres 1:</strong> Kemalpaşa mahallesi, Atatürk bulvarı, No:54/E, İnegöl/Bursa</p>
        <p><strong>Adres 2:</strong> Cuma mahallesi, Atatürk bulvarı, No:51, İnegöl/Bursa</p>
        <p><strong>E-posta:</strong>{" "}
         <a href="mailto:info@yazici.gen.tr" className="text-indigo-600 hover:text-indigo-700">info@yazici.gen.tr</a>
        </p>
        <p><strong>Telefon:</strong> 0544 796 77 70 ve 0501 349 69 91</p>
       </div>
       <p className="font-semibold text-gray-900 mt-4 mb-2">ALICI (Tüketici)</p>
       <p className="leading-relaxed text-gray-700">
        Siparişi veren ve web sitesi üzerinden satın alma işlemini gerçekleştiren gerçek veya tüzel kişi. Sipariş sırasında bildirdiği adres ve iletişim bilgileri geçerlidir.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Yasal Mevzuat">
      <>
       <p className="leading-relaxed">
        Bu sözleşme; 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve ilgili tüketici mevzuatına tabidir. Cayma hakkı, ön bilgilendirme ve tüketici hakları bu mevzuat çerçevesinde uygulanır.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Ön Bilgilendirme">
      <>
       <p className="leading-relaxed">
        Sipariş vermeden önce aşağıdaki bilgileri size sunuyoruz:
       </p>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4 mt-2">
        <li>Satıcı bilgileri (yukarıda belirtilmiştir)</li>
        <li>Ürünün temel özellikleri, fiyatı ve vergiler dahil toplam tutarı</li>
        <li>Ödeme, teslimat ve ifa bilgileri</li>
        <li>Cayma hakkı koşulları</li>
        <li>Şikayet ve itiraz hakkı</li>
        <li>Garanti koşulları</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Sipariş ve Ödeme">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>Sipariş vermek, ürünü satın alma teklifi yapmak anlamına gelir.</li>
        <li>Siparişiniz onaylandığında sözleşme kurulmuş sayılır ve size e-posta ile bildirilir.</li>
        <li>Ödeme işlemleri güvenli ödeme sağlayıcıları aracılığıyla yapılır.</li>
        <li>Fiyatlar Türk Lirası (₺) cinsindendir ve KDV dahildir.</li>
        <li>Fiyatlar sipariş anındaki fiyatlardır; fiyat hatalarından kaynaklanan siparişleri iptal etme hakkımız saklıdır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection icon={<HiTruck className="text-indigo-600" size={24} />} title="Teslimat Koşulları">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>Türkiye geneline nakliye ve montaj hizmeti sunulmaktadır.</li>
        <li>Bursa iline ücretsiz teslimat yapılmaktadır.</li>
        <li>Diğer illere teslimat ücreti kargo firması tarafından belirlenir.</li>
        <li>Teslimat süresi stok durumuna göre değişiklik gösterebilir.</li>
        <li>Teslimat adresiniz sipariş sırasında belirttiğiniz adrestir.</li>
        <li>Ürün teslim edildiğinde teslimat tutanağında imza alınır.</li>
        <li>Ürün teslim alındığında, teslim aldığınız tarih cayma hakkı süresinin başlangıcıdır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Teslimat ve İade Bilgileri">
      <>
       <ul className="list-disc list-inside space-y-1.5 ml-3">
        <li><strong>Teslimat:</strong> Türkiye geneline nakliye ve montaj; Bursa iline ücretsiz teslimat. Diğer illere teslimat ücreti kargo firması tarafından belirlenir.</li>
        <li><strong>Cayma hakkı:</strong> Ürünü teslim aldığınız tarihten itibaren 7 gün içinde, yazılı bildirimle (e-posta, mektup, faks) hiçbir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır.</li>
        <li><strong>İade:</strong> Cayma veya iade taleplerinizi e-posta veya iletişim kanallarımız üzerinden iletebilirsiniz. İade sonrası ödeme 7 gün içinde iade edilir. Detaylı bilgi için <Link href="/iade-degisim" className="text-indigo-600 hover:underline">İade &amp; Değişim</Link> sayfasına bakınız.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Cayma Hakkı">
      <>
       <p className="leading-relaxed mb-2">
        6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, mesafeli satışlarda cayma hakkınız bulunmaktadır:
       </p>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>Ürünleri teslim aldığınız tarihten itibaren <strong>7 gün içinde</strong> hiçbir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.</li>
        <li>Cayma bildirimi yazılı olarak (e-posta, mektup, faks) yapılmalıdır.</li>
        <li>Cayma hakkını kullandığınızda, ürünün orijinal ambalajında, etiketleriyle ve kullanılmamış olması gerekir.</li>
        <li>Cayma hakkınızın kullanılması halinde, ödediğiniz tutar 7 gün içinde iade edilir.</li>
        <li>Cayma nedeniyle yapılan iade masrafları tarafınıza aittir; ürünün bozuk veya hatalı teslim edilmesi durumunda iade masrafları satıcıya aittir.</li>
        <li>Özel sipariş üzerine üretilen veya kişiselleştirilen ürünlerde cayma hakkı bulunmaz.</li>
        <li>Detaylı bilgi için <Link href="/iade-degisim" className="text-indigo-600 hover:underline">İade &amp; Değişim</Link> sayfasını ziyaret edin.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="İade ve Değişim">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>İade talebinizi e-posta veya iletişim kanallarımız üzerinden iletebilirsiniz.</li>
        <li>Ürün orijinal ambalajında, etiketleriyle ve kullanılmamış olmalıdır.</li>
        <li>Ürünün iade edilmesinden sonra, ödeme yönteminize göre iade işlemi gerçekleştirilir.</li>
        <li>İade edilen ürünler kontrol edildikten sonra iade işlemi tamamlanır.</li>
        <li>Detaylı bilgi için <Link href="/iade-degisim" className="text-indigo-600 hover:underline">İade &amp; Değişim</Link> sayfasını ziyaret edin.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection icon={<HiCube className="text-indigo-600" size={24} />} title="Garanti ve Servis">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>Satılan tüm ürünler, üretici firma tarafından belirlenen garanti koşullarına tabidir.</li>
        <li>Garanti süresi ve koşulları ürün kategorisine göre değişir.</li>
        <li>Garanti belgeleri ürün teslimi sırasında size verilir.</li>
        <li>Garanti kapsamındaki ürünler için yetkili servis merkezlerine yönlendirme yapılır.</li>
        <li>Garanti süresi, ürünün teslim alındığı tarihten itibaren başlar.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection icon={<HiScale className="text-indigo-600" size={24} />} title="Tüketici Hakları ve Şikayetler">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
        <li>Herhangi bir sorunuz, şikayetiniz veya talebiniz için bizimle iletişime geçebilirsiniz.</li>
        <li>Şikayetleriniz en geç 30 gün içinde yanıtlanır.</li>
        <li>Şikayetlerinizi e-posta, telefon veya mağazalarımıza başvurarak iletebilirsiniz.</li>
        <li>Çözülemeyen anlaşmazlıklar için <strong>Tüketici Hakem Heyetleri</strong> ve <strong>Tüketici Mahkemeleri</strong>&apos;ne başvurabilirsiniz.</li>
        <li>Tüketici hakları konusunda{" "}
         <a href="https://tuketici.ticaret.gov.tr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
          tuketici.ticaret.gov.tr
         </a>{" "}
         adresini ziyaret edebilirsiniz.
        </li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Uygulanacak Hukuk ve Yetkili Mahkeme">
      <>
       <p className="leading-relaxed">
        Bu sözleşme <strong>Türkiye Cumhuriyeti</strong> yasalarına tabidir. Bu sözleşmeden doğan uyuşmazlıkların çözümünde
        öncelikle <strong>Tüketici Hakem Heyetleri</strong>&apos;ne başvurulur. Tüketici Hakem Heyetleri&apos;nin görevli
        olmadığı veya yetkisinin aşıldığı durumlarda, <strong>Bursa</strong> mahkemeleri ve icra daireleri yetkilidir.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Sözleşme Güncellemeleri">
      <>
       <p className="text-gray-700 leading-relaxed">
        Bu Mesafeli Satış Sözleşmesi zaman zaman güncellenebilir. Önemli değişikliklerde bildirim yapılacaktır.
        Değişikliklerden sonra sipariş vermeye devam etmeniz, güncellenmiş sözleşmeyi kabul ettiğiniz anlamına gelir.
       </p>
       <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
        <p className="text-sm text-gray-600">
         <strong>Son Güncelleme Tarihi:</strong>{" "}
         01.02.2026
        </p>
       </div>
      </>
     </PolicySection>
    </div>
   </div>
  </div>
 );
}