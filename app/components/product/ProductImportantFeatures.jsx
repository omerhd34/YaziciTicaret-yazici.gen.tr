"use client";

export default function ProductImportantFeatures({ product, selectedColor = null }) {
 if (!product) return null;

 // Türk Kahve Makineleri için Önemli Özellikler gösterilmesin
 if (product.category === "Türk Kahve Makineleri" || 
     product.category?.toLowerCase().includes("türk kahve") ||
     product.category?.toLowerCase().includes("turk kahve")) {
  return null;
 }

 // Seçili renk objesini bul
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

 // Tüm özellikleri birleştir
 let allSpecifications = [...productSpecifications, ...colorSpecifications];

 // Buzdolabı kontrolü
 const isRefrigerator = product.subCategory === "Buzdolabı" ||
  product.subCategory?.toLowerCase().includes("buzdolabı") ||
  product.category?.toLowerCase().includes("buzdolabı");

 // Derin Dondurucu kontrolü
 const isFreezer = product.subCategory === "Derin Dondurucu" ||
  product.subCategory?.toLowerCase().includes("derin dondurucu") ||
  product.category?.toLowerCase().includes("derin dondurucu");

 // Çamaşır Makinesi kontrolü
 const isWashingMachine = product.subCategory === "Çamaşır Makinesi" ||
  product.subCategory?.toLowerCase().includes("çamaşır makinesi") ||
  product.subCategory?.toLowerCase().includes("camasir makinesi") ||
  product.category?.toLowerCase().includes("çamaşır makinesi") ||
  product.category?.toLowerCase().includes("camasir makinesi");

 // Kurutma Makinesi kontrolü
 const isDryer = product.subCategory === "Kurutma Makinesi" ||
  product.subCategory?.toLowerCase().includes("kurutma makinesi") ||
  product.subCategory?.toLowerCase().includes("kurutma") ||
  product.category?.toLowerCase().includes("kurutma makinesi") ||
  product.category?.toLowerCase().includes("kurutma");

 // Bulaşık Makinesi kontrolü
 const isDishwasher = product.subCategory === "Bulaşık Makinesi" ||
  product.subCategory?.toLowerCase().includes("bulaşık makinesi") ||
  product.subCategory?.toLowerCase().includes("bulasik makinesi") ||
  product.category?.toLowerCase().includes("bulaşık makinesi") ||
  product.category?.toLowerCase().includes("bulasik makinesi");

 // Fırın kontrolü
 const isOven = product.subCategory === "Fırın" ||
  product.subCategory?.toLowerCase().includes("fırın") ||
  product.subCategory?.toLowerCase().includes("firin") ||
  product.category?.toLowerCase().includes("fırın") ||
  product.category?.toLowerCase().includes("firin");

 // Mikrodalga Fırın kontrolü
 const isMicrowave = product.subCategory === "Mikrodalga Fırın" ||
  product.subCategory?.toLowerCase().includes("mikrodalga fırın") ||
  product.subCategory?.toLowerCase().includes("mikrodalga firin") ||
  product.subCategory?.toLowerCase().includes("mikrodalga") ||
  product.category?.toLowerCase().includes("mikrodalga fırın") ||
  product.category?.toLowerCase().includes("mikrodalga firin") ||
  product.category?.toLowerCase().includes("mikrodalga");

 // Set Üstü Ocak kontrolü
 const isCooktop = product.subCategory === "Set Üstü Ocak" ||
  product.subCategory?.toLowerCase().includes("set üstü ocak") ||
  product.subCategory?.toLowerCase().includes("set ustu ocak") ||
  product.subCategory?.toLowerCase().includes("setüstü ocak") ||
  product.category?.toLowerCase().includes("set üstü ocak") ||
  product.category?.toLowerCase().includes("set ustu ocak") ||
  product.category?.toLowerCase().includes("setüstü ocak");

 // Specifications'tan özellik bulma fonksiyonu
 const findSpecValue = (keyName) => {
  for (const spec of allSpecifications) {
   if (spec.items) {
    const item = spec.items.find(item =>
     item.key && item.key.toLowerCase().includes(keyName.toLowerCase())
    );
    if (item) return item.value;
   }
  }
  return null;
 };

 // Specifications'tan birden fazla anahtar kelime ile arama yapan fonksiyon
 const findSpecValueMultiple = (keyNames) => {
  for (const keyName of keyNames) {
   const result = findSpecValue(keyName);
   if (result) return result;
  }
  return null;
 };

 // Ürün ölçülerini bulma fonksiyonu (hem dimensions hem specifications'tan)
 const getUrunOlculeri = () => {
  let urunOlculeri = null;

  // Önce product.dimensions'tan kontrol et
  if (product.dimensions) {
   const dims = [];
   if (product.dimensions.height) dims.push(`Yükseklik: ${product.dimensions.height} cm`);
   if (product.dimensions.width) dims.push(`Genişlik: ${product.dimensions.width} cm`);
   if (product.dimensions.depth) dims.push(`Derinlik: ${product.dimensions.depth} cm`);
   if (dims.length > 0) {
    urunOlculeri = dims.join(", ");
   }
  }

  // Eğer dimensions yoksa, specifications'tan "Boyutlar" veya "Ürün Ölçüleri" kategorisinden ara
  if (!urunOlculeri) {
   const boyutlarSpec = allSpecifications.find(spec =>
    spec.category && (
     spec.category.toLowerCase().includes('boyutlar') ||
     spec.category.toLowerCase().includes('ölçüler') ||
     spec.category.toLowerCase().includes('ölçü')
    )
   );

   if (boyutlarSpec && boyutlarSpec.items) {
    const boyutItems = [];
    boyutlarSpec.items.forEach(item => {
     if (item.key && item.value) {
      // Yükseklik, Genişlik, Derinlik gibi özellikleri birleştir
      if (item.key.toLowerCase().includes('yükseklik') ||
       item.key.toLowerCase().includes('genişlik') ||
       item.key.toLowerCase().includes('derinlik')) {
       boyutItems.push(`${item.key}: ${item.value}`);
      }
     }
    });
    if (boyutItems.length > 0) {
     urunOlculeri = boyutItems.join(", ");
    } else {
     // Eğer spesifik boyutlar yoksa, tüm öğeleri göster
     const allItems = boyutlarSpec.items.map(item => `${item.key}: ${item.value}`).join(", ");
     if (allItems) {
      urunOlculeri = allItems;
     }
    }
   }
  }

  return urunOlculeri;
 };

 // Önemli özellikleri topla
 const importantFeatures = [];

 if (isRefrigerator) {
  // Buzdolapları için sadece 3 özellik: Ürün ölçüleri, Tazelik sistemi, Home Connect

  // 1. Ürün Ölçüleri
  const urunOlculeri = getUrunOlculeri();
  if (urunOlculeri) {
   importantFeatures.push({ key: "Ürün Ölçüleri", value: urunOlculeri });
  }

  // 2. Tazelik sistemi
  const tazelikSistemi = findSpecValue("tazelik sistemi") || findSpecValue("tazelik");
  if (tazelikSistemi) {
   importantFeatures.push({ key: "Tazelik Sistemi", value: tazelikSistemi });
  }

  // 3. Home Connect
  const homeConnect = findSpecValue("home connect") || findSpecValue("homeconnect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }
 } else if (isFreezer) {
  // Derin Dondurucular için 4 özellik: Ürün ölçüleri, Home Connect, Kapı kolu tipi, Kapı yönü

  // 1. Ürün Ölçüleri
  const urunOlculeri = getUrunOlculeri();
  if (urunOlculeri) {
   importantFeatures.push({ key: "Ürün Ölçüleri", value: urunOlculeri });
  }

  // 2. Home Connect
  const homeConnect = findSpecValue("home connect") || findSpecValue("homeconnect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }

  // 3. Kapı kolu tipi
  const kapiKoluTipi = findSpecValue("kapı kolu") || findSpecValue("kolu tipi") || findSpecValue("kolu");
  if (kapiKoluTipi) {
   importantFeatures.push({ key: "Kapı Kolu Tipi", value: kapiKoluTipi });
  }

  // 4. Kapı yönü
  const kapiYonu = findSpecValue("kapı yönü") || findSpecValue("kapı yön") || findSpecValue("yönü");
  if (kapiYonu) {
   importantFeatures.push({ key: "Kapı Yönü", value: kapiYonu });
  }
 } else if (isWashingMachine) {
  // Çamaşır Makineleri için 7 özellik: Ürün ölçüleri, Enerji verimlilik sınıfı, Home Connect, Ses seviyesi, Kapasite, i-DOS, En yüksek sıkma sayısı

  // 1. Ürün Ölçüleri
  const urunOlculeri = getUrunOlculeri();
  if (urunOlculeri) {
   importantFeatures.push({ key: "Ürün Ölçüleri", value: urunOlculeri });
  }

  // 2. Enerji verimlilik sınıfı
  const enerjiVerimlilik = findSpecValue("enerji verimlilik") ||
   findSpecValue("enerji sınıfı") ||
   findSpecValue("verimlilik sınıfı") ||
   findSpecValue("enerji");
  if (enerjiVerimlilik) {
   importantFeatures.push({ key: "Enerji Verimlilik Sınıfı", value: enerjiVerimlilik });
  }

  // 3. Home Connect
  const homeConnect = findSpecValue("home connect") || findSpecValue("homeconnect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }

  // 4. Ses seviyesi
  const sesSeviyesi = findSpecValue("ses seviyesi") ||
   findSpecValue("ses") ||
   findSpecValue("gürültü") ||
   findSpecValue("desibel");
  if (sesSeviyesi) {
   importantFeatures.push({ key: "Ses Seviyesi", value: sesSeviyesi });
  }

  // 5. Kapasite
  const kapasite = findSpecValue("kapasite") ||
   findSpecValue("yükleme kapasitesi") ||
   findSpecValue("yıkama kapasitesi");
  if (kapasite) {
   importantFeatures.push({ key: "Kapasite", value: kapasite });
  }

  // 6. i-DOS
  const iDOS = findSpecValue("i-dos") ||
   findSpecValue("idos") ||
   findSpecValue("i dos");
  if (iDOS) {
   importantFeatures.push({ key: "i-DOS", value: iDOS });
  }

  // 7. En yüksek sıkma sayısı
  const sikmaSayisi = findSpecValue("sıkma sayısı") ||
   findSpecValue("sıkma") ||
   findSpecValue("devir") ||
   findSpecValue("rpm");
  if (sikmaSayisi) {
   importantFeatures.push({ key: "En Yüksek Sıkma Sayısı", value: sikmaSayisi });
  }
 } else if (isDryer) {
  // Kurutma Makineleri için 4 özellik: Home Connect, Iron Assist, Isı pompası, Kendi kendini temizleyen kondenser

  // 1. Home Connect
  const homeConnect = findSpecValue("home connect") || findSpecValue("homeconnect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }

  // 2. Iron Assist
  const ironAssist = findSpecValue("iron assist") ||
   findSpecValue("ironassist") ||
   findSpecValue("iron-assist");
  if (ironAssist) {
   importantFeatures.push({ key: "Iron Assist", value: ironAssist });
  }

  // 3. Isı pompası
  const isiPompasi = findSpecValue("ısı pompası") ||
   findSpecValue("isi pompasi") ||
   findSpecValue("heat pump") ||
   findSpecValue("heatpump");
  if (isiPompasi) {
   importantFeatures.push({ key: "Isı Pompası", value: isiPompasi });
  }

  // 4. Kendi kendini temizleyen kondenser
  const temizleyenKondenser = findSpecValue("kendi kendini temizleyen kondenser") ||
   findSpecValue("kendi kendini temizleyen") ||
   findSpecValue("self cleaning condenser") ||
   findSpecValue("self-cleaning condenser") ||
   findSpecValue("otomatik temizleme");
  if (temizleyenKondenser) {
   importantFeatures.push({ key: "Kendi Kendini Temizleyen Kondenser", value: temizleyenKondenser });
  }
 } else if (isDishwasher) {
  // Bulaşık Makineleri için 3 özellik: Home Connect, Kurutma sistemi, AquaStop

  // 1. Home Connect
  const homeConnect = findSpecValue("home connect") || findSpecValue("homeconnect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }

  // 2. Kurutma sistemi
  const kurutmaSistemi = findSpecValue("kurutma sistemi") ||
   findSpecValue("kurutma") ||
   findSpecValue("drying system") ||
   findSpecValue("drying");
  if (kurutmaSistemi) {
   importantFeatures.push({ key: "Kurutma Sistemi", value: kurutmaSistemi });
  }

  // 3. AquaStop
  const aquaStop = findSpecValue("aquastop") ||
   findSpecValue("aqua stop") ||
   findSpecValue("aqua-stop");
  if (aquaStop) {
   importantFeatures.push({ key: "AquaStop", value: aquaStop });
  }
 } else if (isOven) {
  // Fırınlar için 4 özellik: Temizlik, Ekran türü, Teleskopik Raf, Isıtma ve kombinasyon modlarının sayısı

  // 1. Temizlik
  const temizlik = findSpecValue("temizlik");
  if (temizlik) {
   importantFeatures.push({ key: "Temizlik", value: temizlik });
  }

  // 2. Ekran türü
  const ekranTuru = findSpecValue("ekran türü");
  if (ekranTuru) {
   importantFeatures.push({ key: "Ekran Türü", value: ekranTuru });
  }

  // 3. Teleskopik Raf
  const teleskopikRaf = findSpecValue("teleskopik raf");
  if (teleskopikRaf) {
   importantFeatures.push({ key: "Teleskopik Raf", value: teleskopikRaf });
  }

  // 4. Isıtma ve kombinasyon modlarının sayısı
  const modSayisi = findSpecValue("ısıtma ve kombinasyon modlarının sayısı");
  if (modSayisi) {
   importantFeatures.push({ key: "Isıtma ve Kombinasyon Modlarının Sayısı", value: modSayisi });
  }
 } else if (isMicrowave) {
  // Mikrodalga Fırınlar için 2 özellik: Temizlik, Isıtma ve kombinasyon modlarının sayısı

  // 1. Temizlik
  const temizlik = findSpecValue("temizlik") ||
   findSpecValue("self cleaning") ||
   findSpecValue("self-cleaning") ||
   findSpecValue("pyroliz") ||
   findSpecValue("katalitik");
  if (temizlik) {
   importantFeatures.push({ key: "Temizlik", value: temizlik });
  }

  // 2. Isıtma ve kombinasyon modlarının sayısı
  const modSayisi = findSpecValue("ısıtma ve kombinasyon modlarının sayısı") ||
   findSpecValue("mod sayısı") ||
   findSpecValue("heating modes") ||
   findSpecValue("combination modes") ||
   findSpecValue("program sayısı");
  if (modSayisi) {
   importantFeatures.push({ key: "Isıtma ve Kombinasyon Modlarının Sayısı", value: modSayisi });
  }
 } else if (isCooktop) {
  // Set Üstü Ocak için 8 özellik: Kullanma şekli, Çerçeve türü, Ocak gözü sayısı (gazlı), Ocak gözü sayısı (elektrik), Ocak ızgarası malzemesi, Kademeli Alev, Home Connect, Ürün ismi/aile

  // 1. Kullanma şekli
  const kullanmaSekli = findSpecValue("kullanma şekli");
  if (kullanmaSekli) {
   importantFeatures.push({ key: "Kullanma Şekli", value: kullanmaSekli });
  }

  // 2. Çerçeve türü
  const cerceveTuru = findSpecValue("çerçeve türü");
  if (cerceveTuru) {
   importantFeatures.push({ key: "Çerçeve Türü", value: cerceveTuru });
  }

  // 3. Ocak gözü sayısı (gazlı)
  const ocakGozuSayisiGazli = findSpecValue("ocak gözü sayısı (gazlı)");
  if (ocakGozuSayisiGazli) {
   importantFeatures.push({ key: "Ocak Gözü Sayısı (Gazlı)", value: ocakGozuSayisiGazli });
  }

  // 4. Ocak gözü sayısı (elektrik)
  const ocakGozuSayisiElektrik = findSpecValue("ocak gözü sayısı (elektrik)");
  if (ocakGozuSayisiElektrik) {
   importantFeatures.push({ key: "Ocak Gözü Sayısı (Elektrik)", value: ocakGozuSayisiElektrik });
  }

  // 5. Ocak ızgarası malzemesi
  const ocakIzgarasiMalzemesi = findSpecValue("ocak ızgarası malzemesi");
  if (ocakIzgarasiMalzemesi) {
   importantFeatures.push({ key: "Ocak Izgarası Malzemesi", value: ocakIzgarasiMalzemesi });
  }

  // 6. Kademeli Alev
  const kademeliAlev = findSpecValue("kademeli alev");
  if (kademeliAlev) {
   importantFeatures.push({ key: "Kademeli Alev", value: kademeliAlev });
  }

  // 7. Home Connect
  const homeConnect = findSpecValue("home connect");
  if (homeConnect) {
   importantFeatures.push({ key: "Home Connect", value: homeConnect });
  }

  // 8. Ürün ismi/aile
  const urunIsmiAile = findSpecValue("ürün ismi/aile");
  if (urunIsmiAile) {
   importantFeatures.push({ key: "Ürün İsmi/Aile", value: urunIsmiAile });
  }
 } else {
  // Diğer ürünler için genel özellikler
  // Marka
  if (product.brand) {
   importantFeatures.push({ key: "Marka", value: product.brand });
  }

  // Seri Numarası
  if (displaySerialNumber) {
   importantFeatures.push({ key: "Seri Numarası", value: displaySerialNumber });
  }

  // Kategori bilgileri
  if (product.category) {
   importantFeatures.push({ key: "Kategori", value: product.category });
  }

  // Boyutlar (eğer varsa)
  if (product.dimensions) {
   const dims = [];
   if (product.dimensions.height) dims.push(`Yükseklik: ${product.dimensions.height} cm`);
   if (product.dimensions.width) dims.push(`Genişlik: ${product.dimensions.width} cm`);
   if (product.dimensions.depth) dims.push(`Derinlik: ${product.dimensions.depth} cm`);
   if (dims.length > 0) {
    importantFeatures.push({ key: "Boyutlar", value: dims.join(", ") });
   }
  }

  // Net Ağırlık
  if (product.netWeight && product.netWeight > 0) {
   importantFeatures.push({ key: "Net Ağırlık", value: `${product.netWeight} kg` });
  }

  // Specifications'tan ilk birkaç önemli özelliği al
  const technicalSpecs = allSpecifications.find(spec =>
   spec.category && (
    spec.category.toLowerCase().includes('teknik') ||
    spec.category.toLowerCase().includes('performans') ||
    spec.category.toLowerCase().includes('özellik')
   )
  );

  if (technicalSpecs && technicalSpecs.items) {
   const topFeatures = technicalSpecs.items.slice(0, 4);
   topFeatures.forEach(item => {
    if (!importantFeatures.find(f => f.key === item.key)) {
     importantFeatures.push({ key: item.key, value: item.value });
    }
   });
  }
 }

 // Eğer önemli özellik yoksa, hiçbir şey gösterme
 if (importantFeatures.length === 0) {
  return null;
 }

 return (
  <div className="mt-12 pt-12 border-t">
   <h2 className="font-bold text-2xl mb-6 text-gray-900">Önemli Özellikler</h2>

   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
     {importantFeatures.map((feature, index) => (
      <div key={index} className="flex flex-col">
       <dt className="font-semibold text-gray-700 text-sm mb-1">{feature.key}</dt>
       <dd className="text-gray-800 font-medium">{feature.value}</dd>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}

