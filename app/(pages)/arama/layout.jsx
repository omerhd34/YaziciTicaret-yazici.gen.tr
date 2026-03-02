export const metadata = {
 title: "Yazıcı Ticaret - Arama Sonuçları",
 description:
  "Yazıcı Ticaret arama sonuçları sayfası. Arama sonuçlarını görüntüleyin.",
 openGraph: {
  title: "Yazıcı Ticaret - Arama Sonuçları",
  description:
   "Yazıcı Ticaret arama sonuçları sayfası. Arama sonuçlarını görüntüleyin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/arama",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Arama Sonuçları",
  description:
   "Yazıcı Ticaret arama sonuçları sayfası. Arama sonuçlarını görüntüleyin.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/arama",
 },
};

export default function AramaLayout({ children }) {
 return children;
}

