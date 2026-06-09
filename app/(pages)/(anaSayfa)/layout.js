import { BASE_URL, buildOpenGraph, buildTwitter } from "@/lib/siteMetadata";

const description =
 'Yazıcı Ticaret\'e hoş geldiniz! Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Buzdolabı, çamaşır makinesi, bulaşık makinesi, klima ve daha fazlası. Tüm Türkiye\'ye nakliye ve montaj hizmeti.';

export const metadata = {
 title: 'Yazıcı Ticaret',
 description,
 openGraph: buildOpenGraph({
  title: 'Yazıcı Ticaret',
  description,
  url: BASE_URL,
 }),
 twitter: buildTwitter({
  title: 'Yazıcı Ticaret',
  description,
 }),
 alternates: {
  canonical: BASE_URL,
 },
};

export default function AnaSayfaLayout({ children }) {
 return children;
}
