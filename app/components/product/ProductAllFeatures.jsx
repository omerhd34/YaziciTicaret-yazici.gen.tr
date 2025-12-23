"use client";
import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

export default function ProductAllFeatures({ product, selectedColor = null }) {
 const [expandedCategories, setExpandedCategories] = useState({});

 const toggleCategory = (index) => {
  setExpandedCategories(prev => ({
   ...prev,
   [index]: !prev[index]
  }));
 };
 if (!product) return null;

 const hasDimensions = product.dimensions && (
  product.dimensions.height || product.dimensions.width || product.dimensions.depth
 );

 const dimensions = product.dimensions;

 let selectedColorObj = null;
 if (selectedColor && product.colors) {
  selectedColorObj = product.colors.find(c => {
   if (typeof c === 'object') {
    return c.name === selectedColor;
   }
   return c === selectedColor;
  });
 }
 if (!selectedColorObj && product.colors && product.colors.length > 0) {
  selectedColorObj = typeof product.colors[0] === 'object' ? product.colors[0] : null;
 }

 const displaySerialNumber = selectedColorObj?.serialNumber || product.serialNumber;
 const productSpecifications = product.specifications && Array.isArray(product.specifications) ? product.specifications : [];
 const colorSpecifications = selectedColorObj?.specifications || [];
 const displayManualLink = selectedColorObj?.manualLink || product.manualLink;

 // "Ürün Özellikleri" içeriğini hazırla
 const productFeaturesItems = [];
 if (product.brand) {
  productFeaturesItems.push({ key: "Marka", value: product.brand });
 }
 if (displaySerialNumber) {
  productFeaturesItems.push({ key: "Seri Numarası", value: displaySerialNumber });
 }
 if (product.material) {
  productFeaturesItems.push({ key: "Materyal", value: product.material });
 }
 if (product.colors && product.colors.length > 0) {
  const colorsText = product.colors.map((color) => {
   const colorName = typeof color === 'object' ? color.name : color;
   return colorName;
  }).join(", ");
  productFeaturesItems.push({ key: "Renkler", value: colorsText });
 }
 if (product.tags && product.tags.length > 0) {
  productFeaturesItems.push({ key: "Etiketler", value: product.tags.join(", ") });
 }

 // "Boyutlar" kategorisi için items hazırla
 const boyutlarItems = [];
 if (hasDimensions) {
  if (dimensions.height) {
   boyutlarItems.push({ key: "Yükseklik", value: `${dimensions.height} cm` });
  }
  if (dimensions.width) {
   boyutlarItems.push({ key: "Genişlik", value: `${dimensions.width} cm` });
  }
  if (dimensions.depth) {
   boyutlarItems.push({ key: "Derinlik", value: `${dimensions.depth} cm` });
  }
 }
 const hasNetWeight = product.netWeight !== null && product.netWeight !== undefined && product.netWeight > 0;
 if (hasNetWeight) {
  boyutlarItems.push({ key: "Net Ağırlık", value: `${product.netWeight} kg` });
 }

 // Önce ürün seviyesindeki özellikleri, sonra renk bazlı özellikleri birleştir
 let allSpecifications = [...productSpecifications, ...colorSpecifications];

 // "Genel Özellikler" kategorisini bul veya oluştur
 const genelOzelliklerIndex = allSpecifications.findIndex(
  spec => spec.category && spec.category.toLowerCase().trim() === "genel özellikler"
 );

 // "Boyutlar" kategorisini bul
 const boyutlarIndex = allSpecifications.findIndex(
  spec => spec.category && spec.category.toLowerCase().trim() === "boyutlar"
 );

 let processedSpecifications = [...allSpecifications];

 // "Genel Özellikler" kategorisini işle
 if (genelOzelliklerIndex !== -1) {
  // "Genel Özellikler" kategorisi varsa, ürün özelliklerini en üste ekle, Kullanım Kılavuzu'nu en alta ekle
  const existingItems = processedSpecifications[genelOzelliklerIndex].items || [];
  const finalItems = [...productFeaturesItems, ...existingItems];
  if (displayManualLink) {
   finalItems.push({
    key: "Kullanım Kılavuzu",
    value: displayManualLink,
    isLink: true
   });
  }
  processedSpecifications[genelOzelliklerIndex] = {
   ...processedSpecifications[genelOzelliklerIndex],
   items: finalItems
  };
 } else if (productFeaturesItems.length > 0) {
  // "Genel Özellikler" kategorisi yoksa, oluştur ve en başa ekle
  const finalItems = [...productFeaturesItems];
  if (displayManualLink) {
   finalItems.push({
    key: "Kullanım Kılavuzu",
    value: displayManualLink,
    isLink: true
   });
  }
  processedSpecifications = [
   { category: "Genel Özellikler", items: finalItems },
   ...processedSpecifications
  ];
 } else if (displayManualLink) {
  processedSpecifications = [
   {
    category: "Genel Özellikler",
    items: [{
     key: "Kullanım Kılavuzu",
     value: displayManualLink,
     isLink: true
    }]
   },
   ...processedSpecifications
  ];
 }

 if (boyutlarIndex !== -1) {
  const existingBoyutlarItems = processedSpecifications[boyutlarIndex].items || [];
  const existingKeys = existingBoyutlarItems.map(item => item.key);
  const newItems = boyutlarItems.filter(item => !existingKeys.includes(item.key));
  if (newItems.length > 0) {
   processedSpecifications[boyutlarIndex] = {
    ...processedSpecifications[boyutlarIndex],
    category: "Boyutlar ve Ağırlık",
    items: [...existingBoyutlarItems, ...newItems]
   };
  } else {
   // Başlığı güncelle
   processedSpecifications[boyutlarIndex] = {
    ...processedSpecifications[boyutlarIndex],
    category: "Boyutlar ve Ağırlık"
   };
  }
 } else if (boyutlarItems.length > 0) {
  const genelIndex = processedSpecifications.findIndex(
   spec => spec.category && spec.category.toLowerCase().trim() === "genel özellikler"
  );
  if (genelIndex !== -1) {
   processedSpecifications.splice(genelIndex + 1, 0, { category: "Boyutlar ve Ağırlık", items: boyutlarItems });
  } else {
   processedSpecifications = [
    { category: "Boyutlar ve Ağırlık", items: boyutlarItems },
    ...processedSpecifications
   ];
  }
 }

 // Debug log
 if (process.env.NODE_ENV === 'development') {
  console.log('ProductAllFeatures Debug:', {
   selectedColor,
   selectedColorObj: selectedColorObj ? {
    name: selectedColorObj.name,
    hasSpecs: !!selectedColorObj.specifications,
    specsCount: selectedColorObj.specifications?.length || 0,
   } : null,
   productSpecifications: productSpecifications.length,
   colorSpecifications: colorSpecifications.length,
   processedSpecifications: processedSpecifications.length,
  });
 }


 return (
  <div className="mt-12 pt-12 border-t">
   <h2 className="font-bold text-2xl mb-6 text-gray-900">Tüm Özellikler</h2>

   <div className="space-y-4">
    {processedSpecifications && processedSpecifications.length > 0 ? (
     processedSpecifications.map((spec, specIdx) => {
      const isExpanded = expandedCategories[specIdx] === true;
      const items = spec.items || [];

      return (
       <div key={specIdx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
         onClick={() => toggleCategory(specIdx)}
         className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
        >
         <h3 className="font-semibold text-lg text-gray-800">{spec.category}</h3>
         {isExpanded ? (
          <HiChevronUp className="text-orange-500" size={20} />
         ) : (
          <HiChevronDown className="text-orange-500" size={20} />
         )}
        </button>
        {isExpanded && items && items.length > 0 && (
         <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-100">
           {items.map((item, itemIdx) => (
            <div key={itemIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 hover:bg-gray-50 transition">
             <dt className="font-semibold text-gray-700">{item.key}</dt>
             <dd className="text-gray-800">
              {item.isLink ? (
               <a
                href={item.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
               >
                Kılavuzu İndir
               </a>
              ) : (
               item.value
              )}
             </dd>
            </div>
           ))}
          </dl>
         </div>
        )}
       </div>
      );
     })
    ) : (
     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-600 text-sm">
       {selectedColorObj ? (
        <>Bu renk için henüz özellik bilgisi eklenmemiş.</>
       ) : (
        <>Bu ürün için henüz özellik bilgisi eklenmemiş.</>
       )}
      </p>
     </div>
    )}
   </div>
  </div>
 );
}
