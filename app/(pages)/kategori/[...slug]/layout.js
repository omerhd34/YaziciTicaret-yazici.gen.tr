import { MENU_ITEMS } from "@/app/utils/menuItems";

function getCategoryNameFromSlug(slugParts) {
 if (!slugParts || slugParts.length === 0) return "Tüm Ürünler";

 const decodedSlug = decodeURIComponent(slugParts[0] || "");
 let mainCat = "";
 let subCat = "";

 const specialNames = {
  yeni: "Yeniler",
  yeniler: "Yeniler",
  indirim: "İndirimler",
 };

 let mainMenuItem =
  MENU_ITEMS.find((item) => {
   const itemPath = item.path.replace("/kategori/", "");
   return itemPath === decodedSlug;
  }) || null;

 if (mainMenuItem) {
  mainCat = mainMenuItem.name;
 } else {
  for (const menuItem of MENU_ITEMS) {
   if (menuItem.subCategories) {
    const subCatItem = menuItem.subCategories.find((sub) => {
     const subPath = sub.path.replace("/kategori/", "");
     return subPath === decodedSlug || subPath.endsWith("/" + decodedSlug);
    });
    if (subCatItem) {
     subCat = subCatItem.name;
     mainCat = menuItem.name;
     mainMenuItem = menuItem;
     break;
    }
   }
  }

  if (!mainCat) {
   mainCat = specialNames[decodedSlug] || decodedSlug;
  }
 }

 if (slugParts.length > 1) {
  const decodedSubSlug = decodeURIComponent(slugParts[1] || "");

  if (!mainMenuItem) {
   mainMenuItem = MENU_ITEMS.find((item) => {
    const itemPath = item.path.replace("/kategori/", "");
    return itemPath === decodedSlug;
   });
  }

  if (mainMenuItem && mainMenuItem.subCategories) {
   const subCatItem = mainMenuItem.subCategories.find((sub) => {
    const subPath = sub.path
     .replace(`/kategori/${decodedSlug}/`, "")
     .replace(/-/g, "");
    return subPath === decodedSubSlug.replace(/-/g, "");
   });
   if (subCatItem) {
    subCat = subCatItem.name;
   } else {
    subCat = decodedSubSlug
     .replace(/-/g, " ")
     .replace(/\b\w/g, (l) => l.toUpperCase());
   }
  } else {
   subCat = decodedSubSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return subCat || mainCat;
 }

 return subCat || mainCat;
}

function getDisplayCategoryName(categoryName) {
 if (!categoryName) return "Yazıcı Ticaret";

 // Kullanıcının isteğine göre özel çoğul isimler
 if (categoryName === "Süpürge") return "Süpürgeler";

 return categoryName;
}

export async function generateMetadata(props) {
 const resolvedParams = await props.params;
 const slugParam = resolvedParams?.slug || [];
 const slugParts = Array.isArray(slugParam) ? slugParam : [slugParam];

 const categoryName = getCategoryNameFromSlug(slugParts);
 const displayCategoryName = getDisplayCategoryName(categoryName);

 const isProductDetailPage =
  slugParts.length === 3 ||
  (slugParts.length === 2 && /^[A-Z0-9]+$/.test(slugParts[1] || ""));

 const title = isProductDetailPage
  ? `Yazıcı Ticaret - ${displayCategoryName} Ürün Detayı`
  : `Yazıcı Ticaret - ${displayCategoryName}`;

 const description = isProductDetailPage
  ? `${displayCategoryName} ürünlerinin detaylarını, özelliklerini ve güncel fiyatlarını Yazıcı Ticaret güvencesiyle inceleyin. Uygun fiyat, hızlı teslimat ve montaj fırsatlarıyla hemen sipariş verin.`
  : `${displayCategoryName} modelleri ve fiyatlarını karşılaştırın. Profilo ve LG başta olmak üzere güvenilir markalarda uygun fiyat, hızlı kargo ve montaj avantajlarıyla Yazıcı Ticaret yanınızda.`;

 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr";
 const path = `/kategori/${slugParts.map((p) => decodeURIComponent(p)).join("/")}`;
 const fullUrl = `${baseUrl}${path}`;

 return {
  title,
  description,
  openGraph: {
   title,
   description,
   url: fullUrl,
   siteName: "Yazıcı Ticaret",
   locale: "tr_TR",
   type: "website",
  },
  twitter: {
   card: "summary_large_image",
   title,
   description,
  },
  alternates: {
   canonical: fullUrl,
  },
 };
}

export default function CategoryLayout({ children }) {
 return children;
}

