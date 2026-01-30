"use client";
import Link from "next/link";
import { HiShieldCheck, HiInformationCircle, HiLockClosed } from "react-icons/hi";
import CookiePolicyHeader from "@/app/components/policy/CookiePolicyHeader";
import PolicySection from "@/app/components/policy/PolicySection";
import CookieTypesSection from "@/app/components/policy/CookieTypesSection";
import CookieManagementSection from "@/app/components/policy/CookieManagementSection";

export default function CerezPolitikasiPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <CookiePolicyHeader />

    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">

     {/* GİRİŞ */}
     <PolicySection>
      <p className="text-gray-700 leading-relaxed">
       <strong>Yazıcı Ticaret</strong> olarak, web sitemizin güvenli, verimli ve kullanıcı dostu bir şekilde
       çalışmasını sağlamak amacıyla çerezler kullanmaktayız.
       Bu <strong>Çerez Politikası</strong>; hangi çerezlerin kullanıldığını, hangi amaçlarla işlendiğini
       ve çerez tercihlerinizi nasıl yönetebileceğinizi açıklamaktadır.
      </p>
     </PolicySection>

     {/* ÇEREZ NEDİR */}
     <PolicySection
      icon={<HiShieldCheck className="text-indigo-600" size={24} />}
      title="Çerez Nedir?"
     >
      <p className="leading-relaxed">
       Çerezler; bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza
       (bilgisayar, tablet veya mobil cihaz) kaydedilen küçük metin dosyalarıdır.
       Bu dosyalar sayesinde site, tercihlerinizi hatırlayabilir ve size daha iyi bir deneyim sunabilir.
      </p>

      <p className="leading-relaxed">
       Çerezler aracılığıyla aşağıdaki bilgiler toplanabilir:
      </p>

      <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
       <li>Dil ve görüntüleme tercihleri</li>
       <li>Oturum ve giriş bilgileri</li>
       <li>Sepet ve sipariş işlemleri</li>
       <li>Site kullanım ve trafik istatistikleri</li>
       <li>Performans ve hata analizleri</li>
      </ul>
     </PolicySection>

     {/* ÇEREZ TÜRLERİ */}
     <CookieTypesSection />

     {/* ÜÇÜNCÜ TARAF */}
     <PolicySection title="Üçüncü Taraf Çerezler">
      <p className="leading-relaxed">
       Web sitemizde, hizmet kalitesini artırmak amacıyla bazı üçüncü taraf hizmet sağlayıcıların
       çerezleri kullanılabilir.
      </p>

      <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
       <li><strong>Google Analytics:</strong> Ziyaretçi trafiği ve kullanım analizi</li>
       <li><strong>Ödeme Altyapıları:</strong> Güvenli ödeme işlemlerinin gerçekleştirilmesi</li>
       <li><strong>Sosyal Medya Platformları:</strong> Paylaşım ve sosyal medya entegrasyonları</li>
       <li><strong>Kargo & Lojistik Firmaları:</strong> Sipariş ve gönderi takibi</li>
      </ul>

      <p className="leading-relaxed mt-4">
       Üçüncü taraf çerezler üzerinde <strong>Yazıcı Ticaret</strong>&apos;in doğrudan kontrolü bulunmamakta olup,
       bu çerezlerin kullanımı ilgili üçüncü tarafların kendi gizlilik ve çerez politikalarına tabidir.
      </p>
     </PolicySection>

     {/* ÇEREZ YÖNETİMİ */}
     <CookieManagementSection />

     {/* SÜRELER */}
     <PolicySection title="Çerezlerin Saklanma Süresi">
      <p className="leading-relaxed">
       Web sitemizde kullanılan çerezler, saklanma sürelerine göre iki gruba ayrılmaktadır:
      </p>

      <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
       <li>
        <strong>Oturum Çerezleri:</strong> Tarayıcı kapatıldığında otomatik olarak silinir
       </li>
       <li>
        <strong>Kalıcı Çerezler:</strong> Belirli bir süre boyunca (genellikle 30 ila 365 gün)
        cihazınızda saklanır
       </li>
      </ul>
      <p className="leading-relaxed mt-4">
       Çerezlerin saklanma süreleri, çerez türüne ve kullanım amacına göre değişiklik gösterebilir.
       Detaylı bilgi için çerez ayarlarınızı kontrol edebilirsiniz.
      </p>
     </PolicySection>

     {/* YASAL DAYANAK */}
     <PolicySection icon={<HiLockClosed className="text-indigo-600" size={24} />} title="Yasal Dayanak">
      <p className="leading-relaxed">
       Çerez kullanımımız, <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> ve{" "}
       <strong>6502 sayılı Tüketicinin Korunması Hakkında Kanun</strong> hükümlerine uygun olarak gerçekleştirilmektedir.
      </p>
      <p className="leading-relaxed mt-3">
       Zorunlu çerezler, web sitemizin çalışması için gereklidir ve bu çerezler için açık rıza alınmaz.
       Diğer çerez türleri için rıza gerekmekte olup, çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
      </p>
     </PolicySection>

     {/* GİZLİLİK POLİTİKASI */}
     <PolicySection icon={<HiInformationCircle className="text-indigo-600" size={24} />} title="Gizlilik ve Veri Koruması">
      <p className="leading-relaxed">
       Çerezler aracılığıyla toplanan kişisel verilerin işlenmesi, saklanması ve korunması hakkında
       detaylı bilgi için{" "}
       <Link href="/gizlilik-politikasi" className="text-indigo-600 hover:text-indigo-700 font-semibold">
        <strong>Gizlilik Politikası</strong>
       </Link>{" "}
       sayfamızı inceleyebilirsiniz.
      </p>
      <p className="leading-relaxed mt-3">
       Kişisel verilerinizin işlenmesi, paylaşılması ve haklarınız hakkında bilgi almak için
       gizlilik politikamızı mutlaka okuyunuz.
      </p>
     </PolicySection>

     {/* İLETİŞİM */}
     <PolicySection title="İletişim ve Sorularınız">
      <p className="leading-relaxed">
       Çerez politikamız hakkında sorularınız veya görüşleriniz varsa, bizimle iletişime geçebilirsiniz:
      </p>
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
       <p className="font-semibold text-gray-900"><strong>Yazıcı Ticaret</strong></p>
       <p className="text-gray-700">
        <strong>E-posta:</strong>{" "}
        <a href="mailto:info@yazici.gen.tr" className="text-indigo-600 hover:text-indigo-700">
         info@yazici.gen.tr
        </a>
       </p>
       <p className="text-gray-700">
        <strong>Telefon:</strong>{" "}
        <a href="tel:+905447967770" className="text-indigo-600 hover:text-indigo-700">0544 796 77 70</a>
        {" "}ve{" "}
        <a href="tel:+905013496991" className="text-indigo-600 hover:text-indigo-700">0501 349 69 91</a>
       </p>
      </div>
     </PolicySection>

     {/* GÜNCELLEMELER */}
     <PolicySection title="Çerez Politikası Güncellemeleri">
      <p className="leading-relaxed">
       Bu <strong>Çerez Politikası</strong>, yasal düzenlemelerdeki değişiklikler veya işletme politikalarımızdaki
       güncellemeler nedeniyle zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında,
       sitemiz üzerinden veya e-posta yoluyla sizleri bilgilendiririz.
      </p>
      <p className="leading-relaxed mt-3">
       Bu sayfayı düzenli olarak kontrol etmenizi öneririz. Politikadaki değişiklikler,
       yayınlandığı tarihten itibaren geçerlidir.
      </p>
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
       <p className="text-sm text-gray-600">
        <strong>Son Güncelleme Tarihi:</strong> {new Date().toLocaleDateString('tr-TR', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
        })}
       </p>
      </div>
     </PolicySection>
    </div>
   </div>
  </div>
 );
}