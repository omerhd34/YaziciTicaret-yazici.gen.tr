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
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ödeme Başarısız",
  description:
   "Yazıcı Ticaret ödeme başarısız sayfası. Ödeme başarısız oldu.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme-basarisiz",
 },
};

export default function OdemeBasarisizLayout({ children }) {
 return children;
}

