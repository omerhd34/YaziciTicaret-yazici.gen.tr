"use client";
import Link from "next/link";
import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function SSSPage() {
 const [openIndex, setOpenIndex] = useState(null);

 const faqs = [
  {
   question: "Sipariş Bilgisi",
   answer: "Sipariş verebilmek için üye olmak şarttır. Üye olarak giriş yaptığınızda hesabınızdan siparişlerinizi görüntüleyebilir, sipariş durumunu takip edebilir, sipariş geçmişinize ve fatura bilgilerinize erişebilirsiniz."
  },
  {
   question: "Garanti",
   answer: "Tüm ürünlerimiz üretici garantisi kapsamındadır. Garanti süreleri ürün kategorisine göre değişiklik göstermektedir. Beyaz eşya ürünlerinde genellikle 2 yıl, küçük ev aletlerinde 1-2 yıl garanti süresi bulunmaktadır. Garanti kapsamındaki arızalar için ücretsiz servis hizmeti sağlanmaktadır. Garanti belgelerinizi mutlaka saklamanızı öneriyoruz. Garanti kapsamı dışındaki durumlar için ücretli servis hizmeti sunulmaktadır. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz."
  },
  {
   question: "Ödeme ve Fatura İşlemleri",
   answer: "Siparişlerinizde iyzico aracılığıyla Kart ile Ödeme (3D Secure) seçeneğini kullanabilirsiniz. Banka veya kredi kartınızla iyzico üzerinden 3D Secure ile ödeme yaparak kartınızın güvenliğini sağlayın. Ödeme işlemi bankanız tarafından doğrulanacak ve SMS kodu ile onaylanacaktır. iyzico güvenli ödeme altyapısı sayesinde tüm ödeme işlemleriniz güvenli bir şekilde gerçekleştirilmektedir. Faturalarınız siparişinizle birlikte gönderilmektedir; sipariş kargoya verildikten sonra Sipariş Detayları sayfasından da görüntüleyebilirsiniz."
  },
  {
   question: "İade işlemi nasıl yapılır?",
   answer: "Ürünü aldıktan sonra 7 gün içinde iade edebilirsiniz. İade işlemi için öncelikle müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. İade talebiniz onaylandıktan sonra, ürünü orijinal ambalajında, kullanılmamış ve hasarsız şekilde göndermeniz gerekmektedir. İade kargo ücreti müşteriye aittir. Ürün kontrol edildikten sonra, ödeme yaptığınız yönteme göre iade işleminiz gerçekleştirilecektir. İade süreci genellikle 3-5 iş günü içinde tamamlanmaktadır."
  },
  {
   question: "Aldığım ürün paketten eksik veya hasarlı çıktı, ne yapmalıyım?",
   answer: "Ürününüz paketten eksik veya hasarlı çıktıysa, lütfen derhal müşteri hizmetlerimizle iletişime geçin. Hasarlı veya eksik ürün durumunda fotoğraf çekmenizi ve bize göndermenizi rica ediyoruz. Durumunuz incelendikten sonra, hasarlı ürün için ücretsiz değişim veya iade işlemi gerçekleştirilecektir. Eksik parçalar için eksik ürünler gönderilecektir. Bu durumlarda ek bir ücret talep edilmemektedir. Müşteri memnuniyeti bizim için önceliklidir."
  },
  {
   question: "Sipariş ettiğim üründen farklı bir ürün geldi, ne yapmalıyım?",
   answer: "Yanlış ürün teslim edilmesi durumunda, lütfen ürünü kullanmadan müşteri hizmetlerimizle iletişime geçin. Yanlış gönderilen ürün için ücretsiz değişim işlemi gerçekleştirilecektir. Doğru ürün en kısa sürede adresinize gönderilecektir. Yanlış gönderilen ürünü iade etmeniz gerekmektedir ve iade kargo ücreti tarafımızca karşılanacaktır. Bu durumdan dolayı yaşadığınız mağduriyet için özür dileriz ve en hızlı şekilde çözüm sağlayacağız"
  },
  {
   question: "Yurt dışına sipariş verebilir miyim?",
   answer: "Sadece Türkiye içi teslimat yapıyoruz; yurt dışına sipariş kabul etmiyoruz. Türkiye'nin tüm şehir ve ilçelerine kargo ile teslimat yapmaktayız."
  },
  {
   question: "Kargo ve Montaj",
   answer: "Tüm Türkiye geneline kargo ve montaj hizmeti sunuyoruz. Siparişleriniz güvenilir kargo firmaları aracılığıyla adresinize teslim edilmekte ve montaj hizmeti sağlanmaktadır. Bursa iline kargo ücretsizdir. Teslimat süresi genellikle 1-5 iş günü arasında değişmektedir. Teslimat sırasında ürünü kontrol etmenizi öneriyoruz."
  },
  {
   question: "Siparişimi nasıl takip edebilirim?",
   answer: "Sipariş takibi için üst menüden 'Sipariş Takibi' bölümüne gidebilir veya hesabınızdan siparişlerinizi görüntüleyebilirsiniz. Sipariş numaranızı girerek anlık durumunu öğrenebilirsiniz."
  },
  {
   question: "Ürün iade edebilir miyim?",
   answer: "Evet, ürünlerinizi 7 gün içinde iade edebilirsiniz. Ürünün kullanılmamış, etiketli ve orijinal ambalajında olması gerekmektedir. İade işlemleri için 'İade ve Değişim' sayfasından başvuru yapabilirsiniz."
  },
  {
   question: "Ürün stokta yoksa ne yapabilirim?",
   answer: "Stokta olmayan ürünler için 'Stokta Yok' butonu görüntülenir. Bu ürünleri favorilerinize ekleyerek stok geldiğinde bildirim alabilirsiniz. Stok durumu hakkında bilgi almak için müşteri hizmetlerimizle iletişime geçebilirsiniz."
  },
  {
   question: "Hesabımı nasıl oluşturabilirim?",
   answer: "Sağ üst köşedeki Hesabım ikonuna (kullanıcı simgesi) tıklayarak kayıt olabilirsiniz. E-posta adresiniz, telefon numaranız ve şifrenizle kolayca hesap oluşturabilir, siparişlerinizi takip edebilir ve favori ürünlerinizi kaydedebilirsiniz."
  },
  {
   question: "Şifremi unuttum, ne yapmalıyım?",
   answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. E-postanızı kontrol ederek yeni şifrenizi oluşturabilirsiniz."
  },
  {
   question: "Müşteri hizmetlerine nasıl ulaşabilirim?",
   answer: "Müşteri hizmetlerimize 'Destek' sayfasından, e-posta veya telefon ile ulaşabilirsiniz. Çalışma saatlerimiz hafta içi 09:00 - 19:00 arasındadır. Size en kısa sürede dönüş yapacağız."
  }
 ];

 const toggleFAQ = (index) => {
  setOpenIndex(openIndex === index ? null : index);
 };

 return (
  <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
   <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
     <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4">
      Sık Sorulan Sorular
     </h1>
     <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
      Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz. Aradığınızı bulamazsanız, müşteri hizmetlerimizle iletişime geçebilirsiniz.
     </p>
    </div>

    {/* FAQ List */}
    <div className="max-w-5xl mx-auto">
     <div className="space-y-3 sm:space-y-4">
      {faqs.map((faq, index) => (
       <div
        key={index}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
       >
        <button
         onClick={() => toggleFAQ(index)}
         className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left rounded-xl focus:bg-blue-200 hover:bg-blue-200 transition-colors duration-500 ease-in-out cursor-pointer"
        >
         <span className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg pr-3 sm:pr-4 cursor-pointer">
          {faq.question}
         </span>
         {openIndex === index ? (
          <HiChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 shrink-0 cursor-pointer" />
         ) : (
          <HiChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0 cursor-pointer" />
         )}
        </button>
        {openIndex === index && (
         <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
          <div className="pt-3 sm:pt-4 border-t border-gray-100">
           <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {faq.answer}
           </p>
          </div>
         </div>
        )}
       </div>
      ))}
     </div>

     {/* Contact Section */}
     <div className="mt-8 md:mt-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl p-5 sm:p-6 md:p-8 text-white text-center">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">
       Sorunuz mu var?
      </h2>
      <p className="text-indigo-100 text-sm sm:text-base mb-4 md:mb-6">
       Aradığınızı bulamadınız mı? Müşteri hizmetlerimizle iletişime geçin, size yardımcı olalım.
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
