export const metadata = {
 title: "Yazıcı Ticaret - Ödeme Başarılı",
 description:
  "Yazıcı Ticaret ödeme başarılı sayfası. Ödeme başarılı oldu.",
 openGraph: {
  title: "Yazıcı Ticaret - Ödeme Başarılı",
  description:
   "Yazıcı Ticaret ödeme başarılı sayfası. Ödeme başarılı oldu.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-basarili",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ödeme Başarılı",
  description:
   "Yazıcı Ticaret ödeme başarılı sayfası. Ödeme başarılı oldu.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-basarili",
 },
};

export default function OdemeBasariliLayout({ children }) {
 return children;
}

