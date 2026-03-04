export const metadata = {
 title: "Yazıcı Ticaret - Mesafeli Satış Sözleşmesi",
 description:
  "Yazıcı Ticaret mesafeli satış sözleşmesi sayfası. Mesafeli satış sözleşmesini nasıl kullanıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Mesafeli Satış Sözleşmesi",
  description:
   "Yazıcı Ticaret mesafeli satış sözleşmesi sayfası. Mesafeli satış sözleşmesini nasıl kullanıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/mesafeli-satis-sozlesmesi",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Mesafeli Satış Sözleşmesi",
  description:
   "Yazıcı Ticaret mesafeli satış sözleşmesi sayfası. Mesafeli satış sözleşmesini nasıl kullanıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/mesafeli-satis-sozlesmesi",
 },
};

export default function MesafeliSatisSozlesmesiLayout({ children }) {
 return children;
}

