export const metadata = {
 title: "Yazıcı Ticaret - İade ve Değişim",
 description:
  "Yazıcı Ticaret iade ve değişim sayfası. İade ve değişim nasıl yapılır hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - İade ve Değişim",
  description:
   "Yazıcı Ticaret iade ve değişim sayfası. İade ve değişim nasıl yapılır hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/iade-degisim",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - İade ve Değişim",
  description:
   "Yazıcı Ticaret iade ve değişim sayfası. İade ve değişim nasıl yapılır hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/iade-degisim",
 },
};

export default function IadeDegisimLayout({ children }) {
 return children;
}

