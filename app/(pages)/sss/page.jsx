"use client";

import Link from "next/link";
import { HiQuestionMarkCircle } from "react-icons/hi";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
 {
  question: "Sipariş Bilgisi",
  answer:
   "Sipariş verebilmek için üye olmak şarttır. Üye olarak giriş yaptığınızda hesabınızdan siparişlerinizi görüntüleyebilir, sipariş durumunu takip edebilir, sipariş geçmişinize ve fatura bilgilerinize erişebilirsiniz.",
 },
 {
  question: "Garanti",
  answer:
   "Tüm ürünlerimiz üretici garantisi kapsamındadır. Garanti süreleri ürün kategorisine göre değişiklik göstermektedir. Beyaz eşya ürünlerinde genellikle 2 yıl, küçük ev aletlerinde 1-2 yıl garanti süresi bulunmaktadır. Garanti kapsamındaki arızalar için ücretsiz servis hizmeti sağlanmaktadır. Garanti belgelerinizi mutlaka saklamanızı öneriyoruz. Garanti kapsamı dışındaki durumlar için ücretli servis hizmeti sunulmaktadır. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.",
 },
 {
  question: "Ödeme ve Fatura İşlemleri",
  answer:
   "Siparişlerinizde iyzico aracılığıyla Kart ile Ödeme (3D Secure) seçeneğini kullanabilirsiniz. Banka veya kredi kartınızla iyzico üzerinden 3D Secure ile ödeme yaparak kartınızın güvenliğini sağlayın. Ödeme işlemi bankanız tarafından doğrulanacak ve SMS kodu ile onaylanacaktır. iyzico güvenli ödeme altyapısı sayesinde tüm ödeme işlemleriniz güvenli bir şekilde gerçekleştirilmektedir. Faturalarınız siparişinizle birlikte gönderilmektedir; sipariş kargoya verildikten sonra Sipariş Detayları sayfasından da görüntüleyebilirsiniz.",
 },
 {
  question: "İade işlemi nasıl yapılır?",
  answer:
   "Ürünü aldıktan sonra 7 gün içinde iade edebilirsiniz. İade işlemi için öncelikle müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. İade talebiniz onaylandıktan sonra, ürünü orijinal ambalajında, kullanılmamış ve hasarsız şekilde göndermeniz gerekmektedir. İade kargo ücreti müşteriye aittir. Ürün kontrol edildikten sonra, ödeme yaptığınız yönteme göre iade işleminiz gerçekleştirilecektir. İade süreci genellikle 3-5 iş günü içinde tamamlanmaktadır.",
 },
 {
  question: "Aldığım ürün paketten eksik veya hasarlı çıktı, ne yapmalıyım?",
  answer:
   "Ürününüz paketten eksik veya hasarlı çıktıysa, lütfen derhal müşteri hizmetlerimizle iletişime geçin. Hasarlı veya eksik ürün durumunda fotoğraf çekmenizi ve bize göndermenizi rica ediyoruz. Durumunuz incelendikten sonra, hasarlı ürün için ücretsiz değişim veya iade işlemi gerçekleştirilecektir. Eksik parçalar için eksik ürünler gönderilecektir. Bu durumlarda ek bir ücret talep edilmemektedir. Müşteri memnuniyeti bizim için önceliklidir.",
 },
 {
  question: "Sipariş ettiğim üründen farklı bir ürün geldi, ne yapmalıyım?",
  answer:
   "Yanlış ürün teslim edilmesi durumunda, lütfen ürünü kullanmadan müşteri hizmetlerimizle iletişime geçin. Yanlış gönderilen ürün için ücretsiz değişim işlemi gerçekleştirilecektir. Doğru ürün en kısa sürede adresinize gönderilecektir. Yanlış gönderilen ürünü iade etmeniz gerekmektedir ve iade kargo ücreti tarafımızca karşılanacaktır. Bu durumdan dolayı yaşadığınız mağduriyet için özür dileriz ve en hızlı şekilde çözüm sağlayacağız",
 },
 {
  question: "Yurt dışına sipariş verebilir miyim?",
  answer:
   "Sadece Türkiye içi teslimat yapıyoruz; yurt dışına sipariş kabul etmiyoruz. Türkiye'nin tüm şehir ve ilçelerine kargo ile teslimat yapmaktayız.",
 },
 {
  question: "Kargo ve Montaj",
  answer:
   "Tüm Türkiye geneline kargo ve montaj hizmeti sunuyoruz. Siparişleriniz güvenilir kargo firmaları aracılığıyla adresinize teslim edilmekte ve montaj hizmeti sağlanmaktadır. Bursa iline kargo ücretsizdir. Teslimat süresi genellikle 1-5 iş günü arasında değişmektedir. Teslimat sırasında ürünü kontrol etmenizi öneriyoruz.",
 },
 {
  question: "Siparişimi nasıl takip edebilirim?",
  answer:
   "Sipariş takibi için üst menüden 'Sipariş Takibi' bölümüne gidebilir veya hesabınızdan siparişlerinizi görüntüleyebilirsiniz. Sipariş numaranızı girerek anlık durumunu öğrenebilirsiniz.",
 },
 {
  question: "Ürün iade edebilir miyim?",
  answer:
   "Evet, ürünlerinizi 7 gün içinde iade edebilirsiniz. Ürünün kullanılmamış, etiketli ve orijinal ambalajında olması gerekmektedir. İade işlemleri için 'İade ve Değişim' sayfasından başvuru yapabilirsiniz.",
 },
 {
  question: "Ürün stokta yoksa ne yapabilirim?",
  answer:
   "Stokta olmayan ürünler için 'Stokta Yok' butonu görüntülenir. Bu ürünleri favorilerinize ekleyerek stok geldiğinde bildirim alabilirsiniz. Stok durumu hakkında bilgi almak için müşteri hizmetlerimizle iletişime geçebilirsiniz.",
 },
 {
  question: "Hesabımı nasıl oluşturabilirim?",
  answer:
   "Sağ üst köşedeki Hesabım ikonuna (kullanıcı simgesi) tıklayarak kayıt olabilirsiniz. E-posta adresiniz, telefon numaranız ve şifrenizle kolayca hesap oluşturabilir, siparişlerinizi takip edebilir ve favori ürünlerinizi kaydedebilirsiniz.",
 },
 {
  question: "Şifremi unuttum, ne yapmalıyım?",
  answer:
   "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. E-postanızı kontrol ederek yeni şifrenizi oluşturabilirsiniz.",
 },
 {
  question: "Müşteri hizmetlerine nasıl ulaşabilirim?",
  answer:
   "Müşteri hizmetlerimize 'Destek' sayfasından, e-posta veya telefon ile ulaşabilirsiniz. Çalışma saatlerimiz hafta içi 09:00 - 19:00 arasındadır. Size en kısa sürede dönüş yapacağız.",
 },
 {
  question: "Ürünü favorilere eklemek ve sepete eklemek için üye olmak şart mı?",
  answer:
   "Ürünü favorilere eklemek ve sepete eklemek için üye olmak şarttır. Giriş yapmadan favori veya sepet butonuna tıkladığınızda otomatik olarak giriş sayfasına yönlendirilirsiniz. Ücretsiz hesap oluşturarak giriş yapabilir, ardından ürünleri favorilerinize ekleyebilir ve sepete ekleyebilirsiniz.",
 },
];

export default function SSSPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
   <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
     <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
      <HiQuestionMarkCircle className="text-indigo-600 shrink-0" size={32} />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
       Sık Sorulan Sorular
      </h1>
     </div>
     <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
      Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz. Aradığınızı
      bulamazsanız, müşteri hizmetlerimizle iletişime geçebilirsiniz.
     </p>
    </div>

    {/* FAQ List - Accordion */}
    <div className="max-w-5xl mx-auto">
     <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
      {faqs.map((faq) => (
       <AccordionItem
        key={faq.question}
        value={faq.question}
        className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 overflow-hidden hover:shadow-md transition-shadow"
       >
        <AccordionTrigger className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg hover:no-underline hover:bg-gray-50/50 py-4 sm:py-5 rounded-xl">
         {faq.question}
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed">
         {faq.answer}
        </AccordionContent>
       </AccordionItem>
      ))}
     </Accordion>

     {/* Contact Section */}
     <div className="mt-8 md:mt-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl p-5 sm:p-6 md:p-8 text-white text-center">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">
       Sorunuz mu var?
      </h2>
      <p className="text-indigo-100 text-sm sm:text-base mb-4 md:mb-6">
       Aradığınızı bulamadınız mı? Müşteri hizmetlerimizle iletişime geçin,
       size yardımcı olalım.
      </p>
      <Link
       href="/destek"
       className="inline-block bg-white text-indigo-600 text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-indigo-50 transition"
      >
       Destek Sayfasına Git
      </Link>
     </div>
    </div>
   </div>
  </div>
 );
}
