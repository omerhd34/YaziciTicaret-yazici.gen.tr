export const metadata = {
 title: "Yazıcı Ticaret - Ödeme Başarısız",
 description:
  "Yazıcı Ticaret ödeme başarısız sayfası. Ödeme başarısız oldu.",
 openGraph: {
  title: "Yazıcı Ticaret - Ödeme Başarısız",
  description:
   "Yazıcı Ticaret ödeme başarısız sayfası. Ödeme başarısız oldu.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-basarisiz",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ödeme Başarısız",
  description:
   "Yazıcı Ticaret ödeme başarısız sayfası. Ödeme başarısız oldu.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-basarisiz",
 },
};

export default function OdemeBasarisizLayout({ children }) {
 return children;
}

