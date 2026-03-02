export const metadata = {
 title: "Yazıcı Ticaret - Kullanım Koşulları",
 description:
  "Yazıcı Ticaret kullanım koşulları sayfası. Kullanım koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Kullanım Koşulları",
  description:
   "Yazıcı Ticaret kullanım koşulları sayfası. Kullanım koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/kullanim-kosullari",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Kullanım Koşulları",
  description:
   "Yazıcı Ticaret kullanım koşulları sayfası. Kullanım koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/kullanim-kosullari",
 },
};

export default function KullanimKosullariLayout({ children }) {
 return children;
}

