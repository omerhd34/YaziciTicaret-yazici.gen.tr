const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
 const content = fs.readFileSync(envPath, 'utf8');
 content.split('\n').forEach((line) => {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (m) {
   const key = m[1];
   let val = (m[2] || '').trim();
   if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
   }
   if (!process.env[key]) process.env[key] = val;
  }
 });
}

const axios = require('axios');
const BASE_URL = (process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr").replace(/\/+$/, "");

function describeApiFailure(status, data) {
 if (data == null) return `HTTP ${status} (yanıt gövdesi yok)`;
 if (typeof data === 'string') {
  const s = data.replace(/\s+/g, ' ').trim();
  return s.length > 240 ? `${s.slice(0, 240)}…` : s || `HTTP ${status}`;
 }
 if (typeof data === 'object') {
  if (data.error != null) return String(data.error);
  if (data.message != null) return String(data.message);
  try {
   return JSON.stringify(data);
  } catch {
   return `HTTP ${status}`;
  }
 }
 return `HTTP ${status}`;
}

async function ensureApiReachable() {
 try {
  const res = await axios.get(`${BASE_URL}/api/products`, {
   params: { limit: 1 },
   timeout: 10000,
   validateStatus: () => true,
  });
  if (res.status >= 400) {
   const hint =
    typeof res.data === 'object' && res.data && (res.data.error || res.data.message)
     ? String(res.data.error || res.data.message)
     : typeof res.data === 'string' && res.data.includes('<!DOCTYPE')
      ? 'HTML yanıt (.env.local MONGODB_URI/DATABASE_URL, ardından next dev yeniden başlatın)'
      : `HTTP ${res.status}`;
   console.error('API hazır değil:', hint);
   process.exit(1);
  }
 } catch (err) {
  const code = err.code || '';
  if (code === 'ECONNREFUSED' || code === 'ECONNRESET' || code === 'EHOSTUNREACH' || code === 'ETIMEDOUT') {
   console.error(`Sunucuya bağlanılamadı (${code || err.message}): ${BASE_URL}`);
   process.exit(1);
  }
  throw err;
 }
}

const normalizeColorName = (v) =>
 String(v || "")
  .trim()
  .toLowerCase()
  .replace(/İ/g, "i")
  .replace(/I/g, "i")
  .replace(/ı/g, "i")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "");

const COLOR_HEX_MAP = {
 siyah: "#000000",
 beyaz: "#ffffff",
 kirmizi: "#ef4444",
 mavi: "#3b82f6",
 yesil: "#22c55e",
 sari: "#facc15",
 turuncu: "#f97316",
 mor: "#a855f7",
 pembe: "#ec4899",
 gri: "#9ca3af",
 lacivert: "#1e3a8a",
 kahverengi: "#92400e",
 bej: "#e5d3b3",
};

const inferHexCode = (name) => {
 const raw = String(name || "").trim();
 if (!raw) return "";
 if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return raw;
 const key = normalizeColorName(raw);
 return COLOR_HEX_MAP[key] || "";
};

const normalizeColors = (colors) => {
 const arr = Array.isArray(colors) ? colors : [];
 return arr
  .map((c) => {
   if (typeof c === "string") {
    const name = c.trim();
    if (!name) return null;
    return {
     name,
     hexCode: inferHexCode(name) || undefined,
     price: 0,
     discountPrice: null,
     serialNumber: "",
     images: [],
     stock: 0,
     manualLink: "",
    };
   }
   if (c && typeof c === "object") {
    const name = String(c.name || "").trim();
    if (!name) return null;
    const hexCode = c.hexCode ? String(c.hexCode).trim() : "";
    return {
     name,
     hexCode: (hexCode || inferHexCode(name) || undefined),
     price: c.price !== undefined ? Number(c.price) : 0,
     discountPrice: c.discountPrice !== undefined && c.discountPrice !== null ? Number(c.discountPrice) : null,
     serialNumber: c.serialNumber ? String(c.serialNumber).trim() : "",
     images: Array.isArray(c.images) ? c.images : [],
     stock: c.stock !== undefined ? Number(c.stock) : 0,
     specifications: Array.isArray(c.specifications) ? c.specifications : [],
     manualLink: c.manualLink ? String(c.manualLink).trim() : "",
     productsInside: Array.isArray(c.productsInside) ? c.productsInside : [],
    };
   }
   return null;
  })
  .filter(Boolean);
};

async function addProduct(product) {
 try {
  const normalizedColors = normalizeColors(product.colors);

  if (normalizedColors.length === 0) {
   return { success: false, error: "En az bir renk eklemelisiniz!" };
  }

  const defaultPrice = normalizedColors[0].price || 0;
  const defaultDiscountPrice = normalizedColors[0].discountPrice !== null ? normalizedColors[0].discountPrice : null;
  const defaultImages = normalizedColors[0].images.length > 0 ? normalizedColors[0].images : [];
  const defaultSerialNumber = normalizedColors[0].serialNumber || "";

  const payload = {
   ...product,
   price: defaultPrice,
   discountPrice: defaultDiscountPrice,
   images: defaultImages,
   serialNumber: defaultSerialNumber,
   colors: normalizedColors,
  };

  const response = await axios.post(`${BASE_URL}/api/products`, payload, {
   headers: {
    "Content-Type": "application/json",
    "x-admin-script-secret": process.env.ADMIN_SCRIPT_SECRET || "",
   },
   validateStatus: () => true,
   timeout: 120000,
  });

  const status = response.status;
  const data = response.data;

  if (status >= 200 && status < 300 && data && data.success) {
   return { success: true, data: data.data };
  }

  const msg = describeApiFailure(status, data);
  return { success: false, error: msg };
 } catch (error) {
  const code = error.code ? ` (${error.code})` : '';
  const net = !error.response
   ? `${error.message || 'Ağ hatası'}${code} — ${BASE_URL} erişilebilir mi? (next dev / next start açık mı?)`
   : (error.response?.data?.error || error.response?.data?.message || error.message);
  return { success: false, error: String(net) };
 }
}

async function addMultipleProducts(productsArray) {
 const results = [];
 let successCount = 0;
 let errorCount = 0;


 for (let i = 0; i < productsArray.length; i++) {
  const product = productsArray[i];

  if (!product.name || !product.description) {
   continue;
  }

  process.stdout.write(`\r[${i + 1}/${productsArray.length}] ${product.name.slice(0, 60)}${product.name.length > 60 ? '…' : ''}          `);

  const result = await addProduct(product);
  results.push({ product: product.name, ...result });

  if (result.success) {
   successCount++;
  } else {
   errorCount++;
  }

  if (i < productsArray.length - 1) {
   await new Promise(resolve => setTimeout(resolve, 500));
  }
 }
 return results;
}

if (typeof require !== 'undefined' && require.main === module) {
 (async () => {
  let products;
  try {
   console.log('products.js yükleniyor (büyük dosyalar birkaç saniye sürebilir)...');
   const productsModule = await import('./products.js');
   products = productsModule.products;
  } catch (e) {
   console.error('products.js yüklenemedi:', e.message || e);
   process.exit(1);
  }

  if (!Array.isArray(products) || products.length === 0) {
   console.error('Ürün listesi boş veya geçersiz.');
   process.exit(1);
  }

  console.log(`${products.length} ürün bulundu. API: ${BASE_URL}`);
  const secret = (process.env.ADMIN_SCRIPT_SECRET || '').trim();
  if (!secret) {
   console.warn(
    '! UYARI: ADMIN_SCRIPT_SECRET boş. .env.local içinde tanımlayın; Next sunucusu da aynı değeri görmeli (kaydettikten sonra next dev / next start yeniden başlatın).\n'
   );
  }
  console.log('Not: Her ürün arasında 500 ms bekleme var; tamamlanması uzun sürebilir.\n');

  try {
   await ensureApiReachable();
  } catch (e) {
   console.error('API kontrolü başarısız:', e.message || e);
   process.exit(1);
  }

  addMultipleProducts(products)
   .then(results => {
    console.log('');
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;
    console.log(`\nSonuçlar:`);
    console.log(`Başarılı: ${successCount}`);
    console.log(`Hatalı: ${errorCount}`);
    console.log(`Toplam: ${results.length}`);

    results.forEach((result, index) => {
     if (result.success) {
      console.log(`✓ ${index + 1}. ${result.product}`);
     } else {
      console.error(`✗ ${index + 1}. ${result.product}: ${result.error || 'Bilinmeyen hata'}`);
     }
    });

    setTimeout(() => {
     process.exit(errorCount > 0 ? 1 : 0);
    }, 200);
   })
   .catch(error => {
    console.error('Çalıştırma hatası:', error.message || error);
    setTimeout(() => {
     process.exit(1);
    }, 200);
   });
 })();
} else {
 if (typeof window !== 'undefined') {
  window.addProduct = addProduct;
  window.addMultipleProducts = addMultipleProducts;
 }
}