import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { MENU_ITEMS } from '@/app/utils/menuItems';
import { getProductUrl } from '@/app/utils/productUrl';

export const revalidate = 3600;

export default async function sitemap() {
 const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr').replace(/\/$/, '');

 const now = new Date();

 const toEntry = (path, options = {}) => ({
  url: path.startsWith('http') ? path : `${baseUrl}${path}`,
  lastModified: options.lastModified || now,
  changeFrequency: options.changeFrequency || 'weekly',
  priority: options.priority ?? 0.7,
 });

 const staticPages = [
  toEntry('/', { changeFrequency: 'daily', priority: 1 }),
  toEntry('/biz-kimiz', { changeFrequency: 'monthly', priority: 0.8 }),
  toEntry('/destek', { changeFrequency: 'monthly', priority: 0.8 }),
  toEntry('/sss', { changeFrequency: 'monthly', priority: 0.7 }),
  toEntry('/iade-degisim', { changeFrequency: 'monthly', priority: 0.6 }),
  toEntry('/gizlilik-politikasi', { changeFrequency: 'yearly', priority: 0.3 }),
  toEntry('/kullanim-kosullari', { changeFrequency: 'yearly', priority: 0.3 }),
  toEntry('/cerez-politikasi', { changeFrequency: 'yearly', priority: 0.3 }),
  toEntry('/one-cikan-urunler', { changeFrequency: 'weekly', priority: 0.9 }),
 ];

 const categoryPages = MENU_ITEMS.flatMap((item) => {
  const list = [
   toEntry(item.path, {
    changeFrequency: 'daily',
    priority: item.isSpecial ? 0.9 : 0.8,
   }),
  ];
  if (item.subCategories) {
   item.subCategories.forEach((sub) => {
    list.push(toEntry(sub.path, { changeFrequency: 'daily', priority: 0.8 }));
   });
  }
  return list;
 });

 let productPages = [];
 try {
  await dbConnect();
  const products = await Product.find({})
   .select('_id category subCategory colors serialNumber updatedAt')
   .lean();

  const seenUrls = new Set([...staticPages, ...categoryPages].map((e) => e.url));

  productPages = products.flatMap((product) => {
   const entries = [];
   const lastMod = product.updatedAt ? new Date(product.updatedAt) : now;

   if (product.colors?.length) {
    product.colors.forEach((color) => {
     if (color?.serialNumber) {
      const path = getProductUrl(
       { ...product, serialNumber: color.serialNumber },
       color.serialNumber
      );
      if (path && path !== '/') {
       const url = `${baseUrl}${path}`;
       if (!seenUrls.has(url)) {
        seenUrls.add(url);
        entries.push(toEntry(path, { lastModified: lastMod, changeFrequency: 'weekly', priority: 0.7 }));
       }
      }
     }
    });
   } else if (product.serialNumber) {
    const path = getProductUrl(product);
    if (path && path !== '/') {
     const url = `${baseUrl}${path}`;
     if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push(toEntry(path, { lastModified: lastMod, changeFrequency: 'weekly', priority: 0.7 }));
     }
    }
   }
   return entries;
  });
 } catch (_) {
 }

 const all = [...staticPages, ...categoryPages, ...productPages];
 return all.filter((e) => e.url && typeof e.url === 'string');
}