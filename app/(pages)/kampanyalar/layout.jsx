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
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Kampanyalar",
  description:
   "Yazıcı Ticaret kampanyalar sayfası. Kampanyaları nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/kampanyalar",
 },
};

export default function KampanyalarLayout({ children }) {
 return children;
}

