"use client";

export default function PolicyContactSection({ description, email = "info@yazici.gen.tr" }) {
 return (
  <section>
   <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
   <div className="space-y-4 text-gray-700">
    <p className="leading-relaxed">
     {description || "Sorularınız için bizimle iletişime geçebilirsiniz:"}
    </p>
    <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
     <p className="font-semibold text-gray-900 mb-2">Yazıcı Ticaret</p>
     <p className="text-gray-700 mb-1">
      <strong>E-posta:</strong> {email}
     </p>
     <p className="text-gray-700 mb-1">
      <strong>Telefon:</strong> 0507 849 29 03
     </p>
     <p className="text-gray-700">
      <strong>Adres:</strong> Mimar Sinan Mahallesi, Orhangazi Caddesi No: 10-12 Kat 1 Daire 5, İnegöl, Bursa
     </p>
    </div>
   </div>
  </section>
 );
}
