"use client";

import Link from "next/link";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";

const importantFAQs = [
 {
  question: "Kargo ve Montaj",
  answer:
   "Tüm Türkiye geneline kargo ve montaj hizmeti sunuyoruz. Siparişleriniz güvenilir kargo firmaları aracılığıyla adresinize teslim edilmekte ve montaj hizmeti sağlanmaktadır. Bursa iline kargo ücretsizdir. Teslimat süresi genellikle 1-5 iş günü arasında değişmektedir. Teslimat sırasında ürünü kontrol etmenizi öneriyoruz.",
 },
 {
  question: "Ödeme ve Fatura İşlemleri",
  answer:
   "Siparişlerinizde iyzico aracılığıyla Kart ile Ödeme (3D Secure) seçeneğini kullanabilirsiniz. Banka veya kredi kartınızla iyzico üzerinden 3D Secure ile ödeme yaparak kartınızın güvenliğini sağlayın. Ödeme işlemi bankanız tarafından doğrulanacak ve SMS kodu ile onaylanacaktır. iyzico güvenli ödeme altyapısı sayesinde tüm ödeme işlemleriniz güvenli bir şekilde gerçekleştirilmektedir. Faturalarınız siparişinizle birlikte gönderilmektedir; sipariş kargoya verildikten sonra Sipariş Detayları sayfasından da görüntüleyebilirsiniz.",
 },
 {
  question: "Garanti",
  answer:
   "Tüm ürünlerimiz üretici garantisi kapsamındadır. Garanti süreleri ürün kategorisine göre değişiklik göstermektedir. Beyaz eşya ürünlerinde genellikle 2 yıl, küçük ev aletlerinde 1-2 yıl garanti süresi bulunmaktadır. Garanti kapsamındaki arızalar için ücretsiz servis hizmeti sağlanmaktadır. Garanti belgelerinizi mutlaka saklamanızı öneriyoruz. Garanti kapsamı dışındaki durumlar için ücretli servis hizmeti sunulmaktadır. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz.",
 },
 {
  question: "İade işlemi nasıl yapılır?",
  answer:
   "Ürünü aldıktan sonra 7 gün içinde iade edebilirsiniz. İade işlemi için öncelikle müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. İade talebiniz onaylandıktan sonra, ürünü orijinal ambalajında, kullanılmamış ve hasarsız şekilde göndermeniz gerekmektedir. İade kargo ücreti müşteriye aittir. Ürün kontrol edildikten sonra, ödeme yaptığınız yönteme göre iade işleminiz gerçekleştirilecektir. İade süreci genellikle 3-5 iş günü içinde tamamlanmaktadır.",
 },
 {
  question: "Müşteri hizmetlerine nasıl ulaşabilirim?",
  answer:
   "Müşteri hizmetlerimize 'Destek' sayfasından, e-posta veya telefon ile ulaşabilirsiniz. Çalışma saatlerimiz hafta içi 09:00 - 19:00 arasındadır. Size en kısa sürede dönüş yapacağız.",
 },
];

export default function FAQSection() {
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

    <Accordion type="single" collapsible className="w-full">
     {importantFAQs.map((faq) => (
      <AccordionItem
       key={faq.question}
       value={faq.question}
       className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 mb-3 last:mb-0 overflow-hidden hover:shadow-md transition-shadow"
      >
       <AccordionTrigger className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg hover:no-underline hover:bg-gray-50/50 py-5 rounded-xl">
        {faq.question}
       </AccordionTrigger>
       <AccordionContent className="text-gray-600 leading-relaxed text-sm sm:text-base">
        {faq.answer}
       </AccordionContent>
      </AccordionItem>
     ))}
    </Accordion>

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
