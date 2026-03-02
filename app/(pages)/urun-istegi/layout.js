export const metadata = {
 title: "Yazıcı Ticaret - Ürün İsteği",
 description:
  "Yazıcı Ticaret ürün isteği sayfası. Ürün isteği oluşturun.",
 openGraph: {
  title: "Yazıcı Ticaret - Ürün İsteği",
  description:
   "Yazıcı Ticaret ürün isteği sayfası. Ürün isteği oluşturun.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/urun-istegi",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ürün İsteği",
  description:
   "Yazıcı Ticaret ürün isteği sayfası. Ürün isteği oluşturun.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/urun-istegi",
 },
};

export default function UrunIstegiLayout({ children }) {
 return children;
}

