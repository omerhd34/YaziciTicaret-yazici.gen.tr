"use client";

export default function ContactSection() {
 return (
  <section>
   <h2 className="text-2xl font-bold text-gray-900 mb-4">Bize Ulaşın</h2>
   <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
    <p className="text-gray-700 mb-4">
     Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz:
    </p>
    <div className="space-y-2 text-gray-700">
     <p className="font-semibold text-gray-900">YAZICI TİCARET</p>
     <p>
      <strong>E-posta:</strong> info@yazici.gen.tr
     </p>
     <p>
      <strong>Telefon:</strong> 0507 849 29 03
     </p>
     <p>
      <strong>Adres:</strong> Mimar Sinan Mahallesi, Orhangazi Caddesi No: 10-12 Kat 1 Daire 5, İnegöl, Bursa
     </p>
    </div>
   </div>
  </section>
 );
}
