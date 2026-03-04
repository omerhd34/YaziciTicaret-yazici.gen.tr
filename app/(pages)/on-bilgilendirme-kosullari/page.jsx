"use client";
import Link from "next/link";
import { HiInformationCircle, HiDocumentText } from "react-icons/hi";
import PolicySection from "@/app/components/policy/PolicySection";

export default function OnBilgilendirmeKosullariPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <div className="text-center mb-8 md:mb-12">
     <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-indigo-100 rounded-full mb-4 sm:mb-6">
      <HiDocumentText className="text-indigo-600 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
     </div>
     <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
      Ön Bilgilendirme Koşulları
     </h1>
     <p className="text-gray-600 max-w-2xl mx-auto">
      6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca,
      sipariş vermeden önce size sunmakla yükümlü olduğumuz bilgiler aşağıdadır.
     </p>
    </div>

    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
     <PolicySection
      icon={<HiInformationCircle className="text-indigo-600" size={24} />}
      title="Satıcı / Hizmet Sağlayıcı Bilgileri"
     >
      <>
       <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-1.5 text-gray-700">
        <p className="font-semibold text-gray-900">Yazıcı Ticaret</p>
        <p><strong>Adres 1:</strong> Kemalpaşa mahallesi, Atatürk bulvarı, No:54/E, İnegöl/Bursa</p>
        <p><strong>Adres 2:</strong> Cuma mahallesi, Atatürk bulvarı, No:51, İnegöl/Bursa</p>
        <p><strong>E-posta:</strong>{" "}
         <a href="mailto:info@yazici.gen.tr" className="text-indigo-600 hover:text-indigo-700">info@yazici.gen.tr</a>
        </p>
        <p><strong>Telefon:</strong> 0544 796 77 70 ve 0501 349 69 91</p>
       </div>
      </>
     </PolicySection>

     <PolicySection title="Ürünün Temel Nitelikleri">
      <>
       <p className="leading-relaxed text-gray-700">
        Sipariş ekranında seçtiğiniz her ürün için; ürün adı, marka, model, temel özellikler, renk/beden gibi varyant bilgileri,
        birim fiyat ve toplam tutar (KDV dahil) açıkça gösterilir. Ürün sayfalarında ve sepet/ödeme sayfalarında güncel bilgiler yer alır.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Fiyat ve Ödeme Bilgileri">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4 text-gray-700">
        <li>Tüm fiyatlar <strong>Türk Lirası (₺)</strong> cinsindendir ve <strong>KDV dahildir</strong>.</li>
        <li>Ödeme sayfasında ürün bedeli, kargo bedeli (varsa) ve toplam ödenecek tutar ayrı ayrı gösterilir.</li>
        <li>Ödemeler güvenli ödeme altyapısı (kredi kartı, banka kartı vb.) ile alınır.</li>
        <li>Fiyatlar sipariş anındaki geçerli fiyatlardır; stok veya fiyat değişikliği halinde bilgilendirilirsiniz.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Teslimat ve İfa">
      <>
       <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4 text-gray-700">
        <li><strong>Bursa</strong> iline ücretsiz teslimat yapılmaktadır.</li>
        <li>Diğer illere teslimat ücreti, ödeme aşamasında size gösterilir ve sipariş toplamına eklenir.</li>
        <li>Türkiye geneline nakliye ve montaj hizmeti sunulmaktadır.</li>
        <li>Tahmini teslimat süresi, ürün ve bölgeye göre sipariş/ödeme ekranında veya satıcı tarafından bildirilir.</li>
        <li>Teslimat, siparişte belirttiğiniz adrese yapılır; teslimatta imza alınır.</li>
       </ul>
      </>
     </PolicySection>

     <PolicySection title="Cayma Hakkı Koşulları">
      <>
       <p className="leading-relaxed text-gray-700 mb-2">
        Mesafeli sözleşmelerde, ürünü teslim aldığınız tarihten itibaren <strong>7 gün</strong> içinde hiçbir gerekçe göstermeksizin cayma hakkınız vardır. Cayma bildirimi
        yazılı olarak (e-posta, mektup, faks) yapılmalıdır. Cayma hakkı kullanıldığında ürün orijinal ambalajında ve
        kullanılmamış olmalıdır; özel siparişle üretilen veya kişiselleştirilen ürünlerde cayma hakkı yasada belirtilen
        istisnalar kapsamında uygulanmayabilir.
       </p>
       <p className="text-gray-600 text-sm">
        Detaylı koşullar için <Link href="/mesafeli-satis-sozlesmesi" className="text-indigo-600 hover:underline">Mesafeli Satış Sözleşmesi</Link> ve{" "}
        <Link href="/iade-degisim" className="text-indigo-600 hover:underline">İade &amp; Değişim</Link> sayfalarına bakınız.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Şikayet ve İtiraz Hakkı">
      <>
       <p className="leading-relaxed text-gray-700">
        Şikayet ve itirazlarınızı yukarıdaki iletişim bilgilerimiz (e-posta, telefon, adres) üzerinden iletebilirsiniz.
        Tüketici hakları kapsamında Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvuru hakkınız saklıdır.
        Tüketici bilgilendirme:{" "}
        <a href="https://tuketici.ticaret.gov.tr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
         tuketici.ticaret.gov.tr
        </a>
       </p>
      </>
     </PolicySection>

     <PolicySection title="Garanti Koşulları">
      <>
       <p className="leading-relaxed text-gray-700">
        Satılan ürünler, yasal ve üretici garanti koşullarına tabidir. Garanti süresi ve kapsamı ürün kategorisine göre
        değişir; garanti belgesi ürün teslimi sırasında tarafınıza verilir. Detaylı bilgi için{" "}
        <Link href="/mesafeli-satis-sozlesmesi" className="text-indigo-600 hover:underline">Mesafeli Satış Sözleşmesi</Link> sayfasındaki
        Garanti ve Servis bölümüne bakınız.
       </p>
      </>
     </PolicySection>

     <PolicySection title="Sözleşmenin Kurulması">
      <>
       <p className="leading-relaxed text-gray-700">
        Siparişinizi tamamlayıp ödemeyi onayladığınızda, mesafeli satış sözleşmesi teklifi vermiş olursunuz. Siparişin
        onaylanması ve size e-posta ile bildirilmesiyle sözleşme kurulmuş sayılır. Ön bilgilendirme koşulları ve
        mesafeli satış sözleşmesi metni sipariş öncesi size sunulmuş kabul edilir.
       </p>
       <p className="mt-3 text-gray-600 text-sm">
        6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında tam metin:{" "}
        <Link href="/mesafeli-satis-sozlesmesi" className="text-indigo-600 hover:underline">Mesafeli Satış Sözleşmesi</Link>.
       </p>
      </>
     </PolicySection>

     <div className="bg-gray-50 rounded-lg p-3 sm:p-4 pt-4">
      <p className="text-sm text-gray-600">
       <strong>Son Güncelleme:</strong>{" "}
       {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
      </p>
     </div>
    </div>
   </div>
  </div>
 );
}
