export const metadata = {
 title: "Yazıcı Ticaret - Sepetim",
 description:
  "Yazıcı Ticaret sepetim sayfası. Sepetinizi görüntüleyin.",
 openGraph: {
  title: "Yazıcı Ticaret - Sepetim",
  description:
   "Yazıcı Ticaret sepetim sayfası. Sepetinizi görüntüleyin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sepet",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Sepetim",
  description:
   "Yazıcı Ticaret sepetim sayfası. Sepetinizi görüntüleyin.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sepet",
 },
};

export default function SepetLayout({ children }) {
 return children;
}

