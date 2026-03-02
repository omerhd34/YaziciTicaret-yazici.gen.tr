export const metadata = {
 title: "Yazıcı Ticaret - Destek",
 description:
  "Yazıcı Ticaret destek sayfası. Destek almak için lütfen bizimle iletişime geçin.",
 openGraph: {
  title: "Yazıcı Ticaret - Destek",
  description:
   "Yazıcı Ticaret destek sayfası. Destek almak için lütfen bizimle iletişime geçin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/destek",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Destek",
  description:
   "Yazıcı Ticaret destek sayfası. Destek almak için lütfen bizimle iletişime geçin.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/destek",
 },
};

export default function DestekLayout({ children }) {
 return children;
}

