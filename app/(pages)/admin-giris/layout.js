export const metadata = {
 title: "Yazıcı Ticaret - Admin Giriş",
 description:
  "Yazıcı Ticaret admin giriş sayfası. Admin paneline giriş yapın.",
 robots: {
  index: false,
  follow: false,
 },
 openGraph: {
  title: "Yazıcı Ticaret - Admin Giriş",
  description:
   "Yazıcı Ticaret admin giriş sayfası. Admin paneline giriş yapın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/admin-giris",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Admin Giriş",
  description:
   "Yazıcı Ticaret admin giriş sayfası. Admin paneline giriş yapın.",
  images: ["/opengraph-image.png"],
 },
};

export default function AdminGirisLayout({ children }) {
 return children;
}