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
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Gizlilik Politikası",
  description:
   "Yazıcı Ticaret gizlilik politikası sayfası. Gizlilik politikasını nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/gizlilik-politikasi",
 },
};

export default function GizlilikPolitikasiLayout({ children }) {
 return children;
}

