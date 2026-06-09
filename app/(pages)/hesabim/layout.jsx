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
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Hesabım",
  description:
   "Yazıcı Ticaret hesabım sayfası. Hesabınızı nasıl kullanıyoruz hakkında bilgi alın.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/hesabim",
 },
};

export default function HesabimLayout({ children }) {
 return children;
}

