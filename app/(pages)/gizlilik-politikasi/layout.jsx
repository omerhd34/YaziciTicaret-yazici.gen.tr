export const metadata = {
 title: "Yazıcı Ticaret - Gizlilik Politikası",
 description:
  "Yazıcı Ticaret gizlilik politikası sayfası. Gizlilik politikasını nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Gizlilik Politikası",
  description:
   "Yazıcı Ticaret gizlilik politikası sayfası. Gizlilik politikasını nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/gizlilik-politikasi",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Gizlilik Politikası",
  description:
   "Yazıcı Ticaret gizlilik politikası sayfası. Gizlilik politikasını nasıl kullanıyoruz hakkında bilgi alın.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/gizlilik-politikasi",
 },
};

export default function GizlilikPolitikasiLayout({ children }) {
 return children;
}

