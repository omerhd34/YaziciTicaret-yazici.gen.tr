export const metadata = {
 title: "Yazıcı Ticaret - Sıkça Sorulan Sorular",
 description:
  "Yazıcı Ticaret sıkça sorulan sorular sayfası. Sıkça sorulan soruları görüntüleyin.",
 openGraph: {
  title: "Yazıcı Ticaret - Sıkça Sorulan Sorular",
  description:
   "Yazıcı Ticaret sıkça sorulan sorular sayfası. Sıkça sorulan soruları görüntüleyin.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sss",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Sıkça Sorulan Sorular",
  description:
   "Yazıcı Ticaret sıkça sorulan sorular sayfası. Sıkça sorulan soruları görüntüleyin.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/sss",
 },
};

export default function SSSLayout({ children }) {
 return children;
}

