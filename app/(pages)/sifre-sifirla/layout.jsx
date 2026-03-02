export const metadata = {
 title: "Yazıcı Ticaret - Şifre Değiştirme",
 description:
  "Yazıcı Ticaret şifre değiştirme sayfası. Şifrenizi nasıl değiştiririz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Şifre Değiştirme",
  description:
   "Yazıcı Ticaret şifre değiştirme sayfası. Şifrenizi nasıl değiştiririz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sifre-sifirla",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Şifre Değiştirme",
  description:
   "Yazıcı Ticaret şifre değiştirme sayfası. Şifrenizi nasıl değiştiririz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sifre-sifirla",
 },
};

export default function SifreSifirlaLayout({ children }) {
 return children;
}

