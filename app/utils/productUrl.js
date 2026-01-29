import { MENU_ITEMS } from "@/app/utils/menuItems";

export const categoryToSlug = (categoryName) => {
 if (!categoryName) return "";
 return categoryName
  .toLowerCase()
  .replace(/ğ/g, 'g')
  .replace(/ü/g, 'u')
  .replace(/ş/g, 's')
  .replace(/ı/g, 'i')
  .replace(/ö/g, 'o')
  .replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
};

export const getProductUrl = (product, colorSerialNumber = null) => {
 if (!product) return "/";

 // İlk rengin seri numarasını kullan (eğer belirtilmemişse)
 const serialNumber = colorSerialNumber || (
  product.colors && product.colors.length > 0 && typeof product.colors[0] === 'object'
   ? product.colors[0].serialNumber
   : product.serialNumber
 );

 // MENU_ITEMS'den kategori ve alt kategori path'lerini bul
 let categoryPath = "";
 let subCategoryPath = "";

 // Ana kategoriyi bul
 const mainMenuItem = MENU_ITEMS.find(item => item.name === product.category);
 if (mainMenuItem) {
  categoryPath = mainMenuItem.path.replace('/kategori/', '');

  // Alt kategoriyi bul
  if (product.subCategory && product.subCategory.trim() && mainMenuItem.subCategories) {
   const subCat = mainMenuItem.subCategories.find(sub => sub.name === product.subCategory);
   if (subCat) {
    subCategoryPath = subCat.path.replace(`/kategori/${categoryPath}/`, '');
   }
  }
 }

 // Eğer MENU_ITEMS'de bulunamadıysa, slug oluştur
 if (!categoryPath) {
  categoryPath = categoryToSlug(product.category);
 }
 // Alt kategori path'i oluştur (sadece gerçekten alt kategori varsa ve kategori ile aynı değilse)
 if (!subCategoryPath && product.subCategory && product.subCategory.trim()) {
  const subCategorySlug = categoryToSlug(product.subCategory);
  // Alt kategori slug'ı kategori slug'ı ile aynı değilse ekle
  if (subCategorySlug && subCategorySlug !== categoryPath) {
   subCategoryPath = subCategorySlug;
  }
 }

 // SerialNumber varsa tam ürün URL'i oluştur (alt kategori segmenti kullanılmıyor - kısa URL)
 if (serialNumber && categoryPath) {
  return `/kategori/${categoryPath}/${serialNumber}`;
 }

 // SerialNumber yoksa ama kategori bilgileri varsa kategori sayfasına yönlendir
 if (categoryPath && subCategoryPath) {
  return `/kategori/${categoryPath}/${subCategoryPath}`;
 } else if (categoryPath) {
  return `/kategori/${categoryPath}`;
 }

 // Hiçbir şey yoksa ana sayfaya yönlendir
 return "/";
};
