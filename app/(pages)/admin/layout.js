import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
 title: "Yazıcı Ticaret - Admin Paneli",
 description:
  "Yazıcı Ticaret admin paneli. Ürünleri, siparişleri, kullanıcıları ve kampanyaları yönetin.",
 robots: {
  index: false,
  follow: false,
 },
 openGraph: {
  title: "Yazıcı Ticaret - Admin Paneli",
  description:
   "Yazıcı Ticaret admin paneli. Ürünleri, siparişleri ve kullanıcıları yönetin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/admin",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Admin Paneli",
  description:
   "Yazıcı Ticaret admin paneli. Ürünleri, siparişleri ve kullanıcıları yönetin.",
 },
};

export default function AdminLayout({ children }) {
 return <AdminLayoutClient>{children}</AdminLayoutClient>;
}