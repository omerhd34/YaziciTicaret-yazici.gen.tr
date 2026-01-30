"use client";
import Link from "next/link";
import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiQuestionMarkCircle } from "react-icons/hi";

export default function FAQSection() {
 const [openIndex, setOpenIndex] = useState(null);

 const importantFAQs = [
  {
   question: "Kargo ve Montaj",
   answer: "Tüm Türkiye geneline kargo ve montaj hizmeti sunuyoruz. Siparişleriniz güvenilir kargo firmaları aracılığıyla adresinize teslim edilmekte ve montaj hizmeti sağlanmaktadır. Bursa iline kargo ücretsizdir. Teslimat süresi genellikle 1-5 iş günü arasında değişmektedir. Teslimat sırasında ürünü kontrol etmenizi öneriyoruz."
  },
  {
   question: "Ödeme ve Fatura İşlemleri",
   answer: "Siparişlerinizde iyzico aracılığıyla Kart ile Ödeme (3D Secure) seçeneğini kullanabilirsiniz. Banka veya kredi kartınızla iyzico üzerinden 3D Secure ile ödeme yaparak kartınızın güvenliğini sağlayın. Ödeme işlemi bankanız tarafından doğrulanacak ve SMS kodu ile onaylanacaktır. iyzico güvenli ödeme altyapısı sayesinde tüm ödeme işlemleriniz güvenli bir şekilde gerçekleştirilmektedir. Faturalarınız siparişinizle birlikte gönderilmektedir; sipariş kargoya verildikten sonra Sipariş Detayları sayfasından da görüntüleyebilirsiniz."
  },
  {
   question: "Garanti",
   answer: "Tüm ürünlerimiz üretici garantisi kapsamındadır. Garanti süreleri ürün kategorisine göre değişiklik göstermektedir. Beyaz eşya ürünlerinde genellikle 2 yıl, küçük ev aletlerinde 1-2 yıl garanti süresi bulunmaktadır. Garanti kapsamındaki arızalar için ücretsiz servis hizmeti sağlanmaktadır. Garanti belgelerinizi mutlaka saklamanızı öneriyoruz. Garanti kapsamı dışındaki durumlar için ücretli servis hizmeti sunulmaktadır. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz."
  },
  {
   question: "İade işlemi nasıl yapılır?",
   answer: "Ürünü aldıktan sonra 7 gün içinde iade edebilirsiniz. İade işlemi için öncelikle müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. İade talebiniz onaylandıktan sonra, ürünü orijinal ambalajında, kullanılmamış ve hasarsız şekilde göndermeniz gerekmektedir. İade kargo ücreti müşteriye aittir. Ürün kontrol edildikten sonra, ödeme yaptığınız yönteme göre iade işleminiz gerçekleştirilecektir. İade süreci genellikle 3-5 iş günü içinde tamamlanmaktadır."
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
  <section className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
   <div className="max-w-5xl mx-auto">

    <div className="text-center mb-8 sm:mb-10 md:mb-12">
     <div className="flex items-center justify-center gap-3 mb-4">
      <HiQuestionMarkCircle className="text-indigo-600" size={32} />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
       Sık Sorulan Sorular
      </h2>
     </div>
     <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
      Merak ettiğiniz soruların yanıtlarını burada bulabilirsiniz.
     </p>
    </div>

    <div className="space-y-3 sm:space-y-4">
     {importantFAQs.map((faq, index) => (
      <div
       key={faq.question}
       className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
      >
       <button
        onClick={() => toggleFAQ(index)}
        className="w-full px-6 py-5 flex items-center justify-between text-left rounded-xl focus:bg-blue-200 hover:bg-blue-200 transition-colors duration-500 ease-in-out cursor-pointer"
       >
        <span className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg pr-4 flex-1">
         {faq.question}
        </span>
        {openIndex === index ? (
         <HiChevronUp size={24} className="text-indigo-600 shrink-0" />
        ) : (
         <HiChevronDown size={24} className="text-gray-400 shrink-0" />
        )}
       </button>
       {openIndex === index && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
         <div className="pt-4 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
           {faq.answer}
          </p>
         </div>
        </div>
       )}
      </div>
     ))}
    </div>

    <div className="text-center mt-8 sm:mt-10">
     <Link
      href="/sss"
      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base transition-colors"
     >
      Tüm Soruları Görüntüle
      <HiChevronDown size={18} className="-rotate-90" />
     </Link>
    </div>
   </div>
  </section>
 );
}

