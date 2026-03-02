export const metadata = {
 title: "Yazıcı Ticaret - Hakkımızda",
 description:
  "Yazıcı Ticaret biz kimiz sayfası. Biz kimiz ve ne yapıyoruz hakkında bilgi alın.",
 openGraph: {
  title: "Yazıcı Ticaret - Hakkımızda",
  description:
   "Yazıcı Ticaret biz kimiz sayfası. Biz kimiz ve ne yapıyoruz hakkında bilgi alın.",
  url:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/biz-kimiz",
  siteName: "Yazıcı Ticaret",
  locale: "tr_TR",
  type: "website",
 },
 twitter: {
  card: "summary_large_image",
  title: "Yazıcı Ticaret - Hakkımızda",
  description:
   "Yazıcı Ticaret biz kimiz sayfası. Biz kimiz ve ne yapıyoruz hakkında bilgi alın.",
 },
 alternates: {
  canonical:
   (process.env.NEXT_PUBLIC_BASE_URL || "https://yazici.gen.tr") + "/biz-kimiz",
 },
};

export default function BizKimizLayout({ children }) {
 return children;
}

