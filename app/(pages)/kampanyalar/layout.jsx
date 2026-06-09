export const metadata = {
 title: "Yazıcı Ticaret - Kampanyalar",
 description:
  "Yazıcı Ticaret kampanyalar sayfası. Kampanyaları nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Kampanyalar",
  description:
   "Yazıcı Ticaret kampanyalar sayfası. Kampanyaları nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/kampanyalar",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Kampanyalar",
  description:
   "Yazıcı Ticaret kampanyalar sayfası. Kampanyaları nasıl kullanıyoruz hakkında bilgi alın.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/kampanyalar",
 },
};

export default function KampanyalarLayout({ children }) {
 return children;
}

