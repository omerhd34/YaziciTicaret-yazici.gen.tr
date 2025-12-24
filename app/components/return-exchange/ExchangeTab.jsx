"use client";
import { HiCheckCircle, HiShoppingBag, HiRefresh, HiXCircle } from "react-icons/hi";
import { MdLocalShipping, MdInfo } from "react-icons/md";

export default function ExchangeTab() {
 return (
  <div className="max-w-5xl mx-auto space-y-8">
   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <HiShoppingBag className="text-indigo-600" size={28} />
     Değişim Koşulları
    </h2>
    <div className="space-y-4">
     <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">14 Gün Değişim Hakkı</h3>
       <p className="text-gray-700 text-sm">
        Ürünü teslim aldığınız tarihten itibaren 14 gün içinde renk değişimi yapabilirsiniz.
       </p>
      </div>
     </div>
     <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">Ücretsiz Değişim</h3>
       <p className="text-gray-700 text-sm">
        Tüm değişim işlemleri ücretsizdir. Kargo ücreti tarafımıza aittir.
       </p>
      </div>
     </div>
     <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <MdLocalShipping className="text-blue-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">Hızlı Değişim</h3>
       <p className="text-gray-700 text-sm">
        Değişim ürününüz stokta mevcutsa, aynı gün kargoya verilir.
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <MdInfo className="text-indigo-600" size={28} />
     Değişim Şartları
    </h2>
    <div className="space-y-4">
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Sadece renk değişimi yapılabilir. Farklı ürün değişimi yapılamaz.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Değişim yapmak istediğiniz ürün stokta mevcut olmalıdır.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Ürün orijinal ambalajında, etiketleriyle birlikte ve kullanılmamış olmalıdır.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Fiyat farkı varsa, fark ödenir veya iade edilir.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiXCircle className="text-red-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       İndirimli ürünlerde değişim yapılamaz.
      </p>
     </div>
    </div>
   </div>

   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <HiRefresh className="text-indigo-600" size={28} />
     Değişim Nasıl Yapılır?
    </h2>
    <div className="space-y-6">
     <div className="flex gap-6">
      <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
       1
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-2">Değişim Talebi Oluşturun</h3>
       <p className="text-gray-700 text-sm">
        Müşteri hizmetlerimizle iletişime geçerek değişim talebinizi oluşturun. Hangi renge değiştirmek istediğinizi belirtin.
       </p>
      </div>
     </div>
     <div className="flex gap-6">
      <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
       2
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-2">Ürünü Hazırlayın</h3>
       <p className="text-gray-700 text-sm">
        Mevcut ürünü orijinal ambalajında, etiketleriyle birlikte ve kullanılmamış halde hazırlayın.
       </p>
      </div>
     </div>
     <div className="flex gap-6">
      <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
       3
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-2">Kargo Etiketini Alın</h3>
       <p className="text-gray-700 text-sm">
        Onay sonrası size gönderilecek ücretsiz kargo etiketini pakete yapıştırın ve kargo firmasına teslim edin.
       </p>
      </div>
     </div>
     <div className="flex gap-6">
      <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
       4
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-2">Yeni Ürün Teslimatı</h3>
       <p className="text-gray-700 text-sm">
        Ürün kontrol edildikten sonra, yeni ürününüz 1-5 iş günü içinde adresinize teslim edilir.
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
