export const metadata = {
 title: "Yazıcı Ticaret - Giriş/Kayıt",
 description:
  "Yazıcı Ticaret giriş sayfası. Hesabınıza giriş yapın veya yeni hesap oluşturun, siparişlerinizi ve favorilerinizi yönetin.",
 openGraph: {
  title: "Yazıcı Ticaret - Giriş/Kayıt",
  description:
   "Yazıcı Ticaret giriş sayfası. Hesabınıza giriş yapın veya yeni hesap oluşturun, siparişlerinizi ve favorilerinizi yönetin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/giris",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
  images: [{ url: "/opengraph-image.png", width: 1921, height: 911, alt: "Yazıcı Ticaret" }],
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Giriş/Kayıt",
  description:
   "Yazıcı Ticaret giriş sayfası. Hesabınıza giriş yapın veya yeni hesap oluşturun, siparişlerinizi ve favorilerinizi yönetin.",
  images: ["/opengraph-image.png"],
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/giris",
 },
};

export default function GirisLayout({ children }) {
 return children;
}

