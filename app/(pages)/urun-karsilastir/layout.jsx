export const metadata = {
 title: "Yazıcı Ticaret - Ürün Karşılaştırma ",
 description:
  "Yazıcı Ticaret ürün karşılaştırma sayfası. Ürünleri karşılaştırın.",
 openGraph: {
  title: "Yazıcı Ticaret - Ürün Karşılaştırma",
  description:
   "Yazıcı Ticaret ürün karşılaştırma sayfası. Ürünleri karşılaştırın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/urun-karsilastir",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ürün Karşılaştırma",
  description:
   "Yazıcı Ticaret ürün karşılaştırma sayfası. Ürünleri karşılaştırın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/urun-karsilastir",
 },
};

export default function UrunKarsilastirLayout({ children }) {
 return children;
}