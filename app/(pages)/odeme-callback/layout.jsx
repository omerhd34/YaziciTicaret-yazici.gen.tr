export const metadata = {
 title: "Yazıcı Ticaret - Ödeme Bekleniyor...",
 description:
  "Yazıcı Ticaret ödeme bekleniyor sayfası. Ödeme bekleniyor...",
 openGraph: {
  title: "Yazıcı Ticaret - Ödeme Bekleniyor...",
  description:
   "Yazıcı Ticaret ödeme bekleniyor sayfası. Ödeme bekleniyor...",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-callback",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ödeme Bekleniyor...",
  description:
   "Yazıcı Ticaret ödeme bekleniyor sayfası. Ödeme bekleniyor...",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-callback",
 },
};

export default function OdemeCallbackLayout({ children }) {
 return children;
}