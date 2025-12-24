"use client";
import { HiUser, HiEye, HiLockClosed, HiShieldCheck, HiScale, HiOutlineChip, } from "react-icons/hi";
import PrivacyPolicyHeader from "@/app/components/policy/PrivacyPolicyHeader";
import PolicySection from "@/app/components/policy/PolicySection";

export default function GizlilikPolitikasiPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <PrivacyPolicyHeader />

    <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">

     {/* GİRİŞ */}
     <PolicySection>
      <p className="text-gray-700 leading-relaxed">
       <strong>Yazıcı Ticaret</strong> olarak, kişisel verilerinizin gizliliğine ve güvenliğine büyük önem veriyoruz.
       Bu Gizlilik Politikası; web sitemizi ziyaret eden kullanıcıların kişisel verilerinin hangi amaçlarla toplandığını,
       nasıl işlendiğini, korunduğunu ve hangi haklara sahip olduklarını açıklamaktadır.
      </p>
     </PolicySection>

     {/* TOPLANAN VERİLER */}
     <PolicySection icon={<HiUser className="text-indigo-600" size={24} />} title="Toplanan Kişisel Veriler">
      <p className="leading-relaxed">
       Web sitemizi kullandığınızda aşağıdaki kişisel verileriniz toplanabilir:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li><strong>Kimlik Bilgileri:</strong> Ad, soyad</li>
       <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres</li>
       <li><strong>Ödeme Bilgileri:</strong> Ödeme işlemlerine ilişkin bilgiler (kart bilgileri sistemlerimizde saklanmaz)</li>
       <li><strong>Hesap Bilgileri:</strong> Kullanıcı adı ve şifre (şifrelenmiş olarak)</li>
       <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, cihaz bilgileri, çerezler</li>
       <li><strong>Kullanım Verileri:</strong> Sipariş geçmişi, site üzerindeki işlemler</li>
      </ul>
     </PolicySection>

     {/* KULLANIM AMAÇLARI */}
     <PolicySection icon={<HiEye className="text-indigo-600" size={24} />} title="Kişisel Verilerin İşlenme Amaçları">
      <p className="leading-relaxed">
       Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Sipariş ve satış süreçlerinin yürütülmesi</li>
       <li>Müşteri hizmetleri ve destek sağlanması</li>
       <li>Ürün ve hizmetlerin geliştirilmesi</li>
       <li>Kampanya, bilgilendirme ve pazarlama faaliyetleri</li>
       <li>Yasal yükümlülüklerin yerine getirilmesi</li>
       <li>Güvenlik ve dolandırıcılığın önlenmesi</li>
      </ul>
     </PolicySection>

     {/* PAYLAŞIM */}
     <PolicySection icon={<HiLockClosed className="text-indigo-600" size={24} />} title="Kişisel Verilerin Paylaşılması">
      <p className="leading-relaxed">
       Kişisel verileriniz, aşağıdaki durumlar haricinde üçüncü kişilerle paylaşılmamaktadır:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li><strong>Hizmet Sağlayıcılar:</strong> Kargo, ödeme ve altyapı hizmetleri</li>
       <li><strong>Yasal Yükümlülükler:</strong> Yetkili kamu kurum ve kuruluşları</li>
       <li><strong>İzin Verilen Durumlar:</strong> Açık rızanızın bulunduğu haller</li>
      </ul>
     </PolicySection>

     {/* ÇEREZLER */}
     <PolicySection icon={<HiOutlineChip className="text-indigo-600" size={24} />} title="Çerezler">
      <p className="leading-relaxed">
       Web sitemizde kullanıcı deneyimini geliştirmek amacıyla çerezler kullanılmaktadır.
       Çerezler, tarayıcınız aracılığıyla cihazınıza kaydedilen küçük veri dosyalarıdır.
       Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.
      </p>
     </PolicySection>

     {/* GÜVENLİK */}
     <PolicySection icon={<HiShieldCheck className="text-indigo-600" size={24} />} title="Veri Güvenliği">
      <p className="leading-relaxed">
       Yazıcı Ticaret, kişisel verilerinizin güvenliğini sağlamak için gerekli teknik ve idari tedbirleri almaktadır:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>SSL (HTTPS) ile güvenli veri iletimi</li>
       <li>Şifrelenmiş veri saklama</li>
       <li>Erişim yetkilendirme kontrolleri</li>
       <li>Güvenli sunucu altyapısı</li>
      </ul>
     </PolicySection>

     {/* KVKK HAKLARI */}
     <PolicySection icon={<HiScale className="text-indigo-600" size={24} />} title="KVKK Kapsamındaki Haklarınız">
      <p className="leading-relaxed">
       6698 sayılı KVKK kapsamında kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-4">
       <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
       <li>Bilgi talep etme</li>
       <li>Düzeltme, silme veya yok edilmesini isteme</li>
       <li>İşlemeye itiraz etme</li>
      </ul>
     </PolicySection>
    </div>
   </div>
  </div>
 );
}
