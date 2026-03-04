"use client";

export default function CookieManagementSection() {
 return (
  <section>
   <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Çerezleri Nasıl Yönetebilirsiniz?</h2>
   <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
    <p className="leading-relaxed">
     Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz:
    </p>
    <div className="bg-indigo-50 rounded-lg p-4 sm:p-6 border border-indigo-100">
     <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Tarayıcı Ayarları:</h3>
     <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
      <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf çerezleri (veya Site ayarları → Çerezler ve site verileri)</li>
      <li><strong>Firefox:</strong> Ayarlar / Seçenekler → Gizlilik ve Güvenlik → Çerezler ve site verileri</li>
      <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
      <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler ve site izinleri</li>
     </ul>
     <p className="text-xs text-gray-600 mt-2">Menü yolları tarayıcı sürümüne göre küçük farklılık gösterebilir.</p>
    </div>
    <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border border-yellow-200">
     <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
      <strong>Önemli:</strong> Çerezleri devre dışı bırakırsanız, web sitemizin bazı özellikleri düzgün çalışmayabilir.
      Örneğin, sepetinizdeki ürünler kaybolabilir veya giriş yapamayabilirsiniz.
     </p>
    </div>
   </div>
  </section>
 );
}