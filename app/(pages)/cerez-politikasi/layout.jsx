export const metadata = {
 title: "Yazıcı Ticaret - Çerez Politikası",
 description:
  "Yazıcı Ticaret çerez politikası sayfası. Çerezleri nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Çerez Politikası",
  description:
   "Yazıcı Ticaret çerez politikası sayfası. Çerezleri nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/cerez-politikasi",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Çerez Politikası",
  description:
   "Yazıcı Ticaret çerez politikası sayfası. Çerezleri nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/cerez-politikasi",
 },
};

export default function CerezPolitikasiLayout({ children }) {
 return children;
}

