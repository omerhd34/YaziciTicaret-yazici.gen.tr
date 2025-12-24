"use client";
import { HiCheckCircle, HiClock, HiShoppingBag, HiRefresh, HiXCircle } from "react-icons/hi";
import { MdInfo } from "react-icons/md";

export default function ReturnTab() {
 return (
  <div className="max-w-5xl mx-auto space-y-8">
   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <HiShoppingBag className="text-indigo-600" size={28} />
     İade Koşulları
    </h2>
    <div className="space-y-4">
     <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">14 Gün İade Hakkı</h3>
       <p className="text-gray-700 text-sm">
        Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.
       </p>
      </div>
     </div>
     <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">Ücretsiz İade</h3>
       <p className="text-gray-700 text-sm">
        Tüm iade işlemleri ücretsizdir. Kargo ücreti tarafımıza aittir.
       </p>
      </div>
     </div>
     <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <HiClock className="text-yellow-600 shrink-0 mt-1" size={24} />
      <div>
       <h3 className="font-semibold text-gray-900 mb-1">İade Süreci</h3>
       <p className="text-gray-700 text-sm">
        İade talebiniz onaylandıktan sonra 3-5 iş günü içinde ödeme iadeniz yapılır.
       </p>
      </div>
     </div>
    </div>
   </div>

   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <MdInfo className="text-indigo-600" size={28} />
     İade Şartları
    </h2>
    <div className="space-y-4">
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Ürün orijinal ambalajında ve etiketleriyle birlikte olmalıdır.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Ürün kullanılmamış, yıkanmamış ve hasar görmemiş olmalıdır.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       İç çamaşırı, mayo, çorap gibi kişisel ürünlerde sağlık nedeniyle iade kabul edilmez.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiCheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Fatura veya sipariş numaranızı iade paketine eklemelisiniz.
      </p>
     </div>
     <div className="flex items-start gap-4">
      <HiXCircle className="text-red-600 shrink-0 mt-1" size={20} />
      <p className="text-gray-700">
       Özel indirimli ürünlerde iade kabul edilmez.
      </p>
     </div>
    </div>
   </div>

   <div className="bg-white rounded-xl shadow-md p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
     <HiRefresh className="text-indigo-600" size={28} />
     İade Nasıl Yapılır?
    </h2>
    <div className="space-y-6">
     <div className="flex gap-6">
      <div className="shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
       1
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-2">İade Talebi Oluşturun</h3>
       <p className="text-gray-700 text-sm">
        Müşteri hizmetlerimizle iletişime geçerek iade talebinizi oluşturun. Sipariş numaranızı ve iade etmek istediğiniz ürün bilgilerini belirtin.
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
        Ürünü orijinal ambalajında, etiketleriyle birlikte ve kullanılmamış halde hazırlayın. Fatura veya sipariş numaranızı pakete ekleyin.
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
       <h3 className="font-semibold text-gray-900 mb-2">Ödeme İadesi</h3>
       <p className="text-gray-700 text-sm">
        Ürün kontrol edildikten sonra 3-5 iş günü içinde ödeme iadeniz yapılır. Ödeme, siparişte kullandığınız yöntemle geri yüklenir.
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
