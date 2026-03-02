export const metadata = {
 title: "Yazıcı Ticaret - Hesabım",
 description:
  "Yazıcı Ticaret hesabım sayfası. Hesabınızı nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Hesabım",
  description:
   "Yazıcı Ticaret hesabım sayfası. Hesabınızı nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/hesabim",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Hesabım",
  description:
   "Yazıcı Ticaret hesabım sayfası. Hesabınızı nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/hesabim",
 },
};

export default function HesabimLayout({ children }) {
 return children;
}

