export const metadata = {
 title: "Yazıcı Ticaret - Favoriler",
 description:
  "Yazıcı Ticaret favoriler sayfası. Favorilerinizi nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Favoriler",
  description:
   "Yazıcı Ticaret favoriler sayfası. Favorilerinizi nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/favoriler",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Favoriler",
  description:
   "Yazıcı Ticaret favoriler sayfası. Favorilerinizi nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/favoriler",
 },
};

export default function FavorilerLayout({ children }) {
 return children;
}

