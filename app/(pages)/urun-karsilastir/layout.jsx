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
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ürün Karşılaştırma",
  description:
   "Yazıcı Ticaret ürün karşılaştırma sayfası. Ürünleri karşılaştırın.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/urun-karsilastir",
 },
};

export default function UrunKarsilastirLayout({ children }) {
 return children;
}