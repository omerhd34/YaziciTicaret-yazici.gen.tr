"use client";
import { HiShieldCheck } from "react-icons/hi";
import CookiePolicyHeader from "@/app/components/policy/CookiePolicyHeader";
import PolicySection from "@/app/components/policy/PolicySection";
import CookieTypesSection from "@/app/components/policy/CookieTypesSection";
import CookieManagementSection from "@/app/components/policy/CookieManagementSection";

export default function CerezPolitikasiPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <CookiePolicyHeader />

    <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">

     {/* GİRİŞ */}
     <PolicySection>
      <p className="text-gray-700 leading-relaxed">
       <strong>Yazıcı Ticaret</strong> olarak, web sitemizin güvenli, verimli ve kullanıcı dostu bir şekilde
       çalışmasını sağlamak amacıyla çerezler kullanmaktayız.
       Bu Çerez Politikası; hangi çerezlerin kullanıldığını, hangi amaçlarla işlendiğini
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

      <ul className="list-disc list-inside space-y-2 ml-4">
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

      <ul className="list-disc list-inside space-y-2 ml-4">
       <li><strong>Google Analytics:</strong> Ziyaretçi trafiği ve kullanım analizi</li>
       <li><strong>Ödeme Altyapıları:</strong> Güvenli ödeme işlemlerinin gerçekleştirilmesi</li>
       <li><strong>Sosyal Medya Platformları:</strong> Paylaşım ve sosyal medya entegrasyonları</li>
       <li><strong>Kargo & Lojistik Firmaları:</strong> Sipariş ve gönderi takibi</li>
      </ul>

      <p className="leading-relaxed mt-4">
       Üçüncü taraf çerezler üzerinde Yazıcı Ticaret’in doğrudan kontrolü bulunmamakta olup,
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

      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>
        <strong>Oturum Çerezleri:</strong> Tarayıcı kapatıldığında otomatik olarak silinir
       </li>
       <li>
        <strong>Kalıcı Çerezler:</strong> Belirli bir süre boyunca (genellikle 30 ila 365 gün)
        cihazınızda saklanır
       </li>
      </ul>
     </PolicySection>
    </div>
   </div>
  </div>
 );
}
