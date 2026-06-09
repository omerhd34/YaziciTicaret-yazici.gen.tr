export const metadata = {
 title: "Yazıcı Ticaret - Ödeme",
 description:
  "Yazıcı Ticaret ödeme sayfası. Ödeme yapın.",
 openGraph: {
  title: "Yazıcı Ticaret - Ödeme",
  description:
   "Yazıcı Ticaret ödeme sayfası. Ödeme yapın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ödeme",
  description:
   "Yazıcı Ticaret ödeme sayfası. Ödeme yapın.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/odeme",
 },
};

export default function OdemeLayout({ children }) {
 return children;
}

