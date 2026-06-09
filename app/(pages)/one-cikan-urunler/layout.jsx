export const metadata = {
 title: "Yazıcı Ticaret - Öne Çıkan Ürünler",
 description:
  "Yazıcı Ticaret öne çıkan ürünler sayfası. En çok satılan ürünleri görüntüleyin.",
 openGraph: {
  title: "Yazıcı Ticaret - Öne Çıkan Ürünler",
  description:
   "Yazıcı Ticaret öne çıkan ürünler sayfası. En çok satılan ürünleri görüntüleyin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/one-cikan-urunler",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Öne Çıkan Ürünler",
  description:
   "Yazıcı Ticaret öne çıkan ürünler sayfası. En çok satılan ürünleri görüntüleyin.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/one-cikan-urunler",
 },
};

export default function OneCikanUrunlerLayout({ children }) {
 return children;
}

