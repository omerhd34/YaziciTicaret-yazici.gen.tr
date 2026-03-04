export const metadata = {
 title: "Yazıcı Ticaret - Ön Bilgilendirme Koşulları",
 description:
  "Yazıcı Ticaret ön bilgilendirme koşulları sayfası. Ön bilgilendirme koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Ön Bilgilendirme Koşulları",
  description:
   "Yazıcı Ticaret ön bilgilendirme koşulları sayfası. Ön bilgilendirme koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/on-bilgilendirme-kosullari",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Ön Bilgilendirme Koşulları",
  description:
   "Yazıcı Ticaret ön bilgilendirme koşulları sayfası. Ön bilgilendirme koşullarını nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/on-bilgilendirme-kosullari",
 },
};

export default function OnBilgilendirmeKosullariLayout({ children }) {
 return children;
}

