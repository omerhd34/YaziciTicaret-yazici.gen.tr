import "./globals.css";
import ClientProviders from "./ClientProviders";
import { BASE_URL, buildOpenGraph, buildTwitter } from "@/lib/siteMetadata";

export const metadata = {
 metadataBase: new URL(BASE_URL),
 title: {
  default: 'Yazıcı Ticaret',
 },
 description: 'Yazıcı Ticaret\'e hoş geldiniz! Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Buzdolabı, çamaşır makinesi, bulaşık makinesi, klima ve daha fazlası. Tüm Türkiye\'ye nakliye ve montaj hizmeti.',
 icons: {
  icon: '/icon.svg',
  shortcut: '/icon.svg',
  apple: '/icon.svg',
 },
 keywords: [
  'profilo',
  'lg',
  'beyaz eşya',
  'elektronik',
  'buzdolabı',
  'çamaşır makinesi',
  'bulaşık makinesi',
  'klima',
  'ankastre',
  'e-ticaret',
  'yazıcı ticaret',
  'profilo satış',
  'beyaz eşya satış',
  'elektronik ürünler'
 ],
 authors: [{ name: 'Ömer Halis Demir' }],
 creator: 'Ömer Halis Demir',
 openGraph: buildOpenGraph({
  title: 'Yazıcı Ticaret',
  description: 'Yazıcı Ticaret\'e hoş geldiniz! Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Buzdolabı, çamaşır makinesi, bulaşık makinesi, klima ve daha fazlası. Tüm Türkiye\'ye nakliye ve montaj hizmeti.',
  url: BASE_URL,
 }),
 twitter: buildTwitter({
  title: 'Yazıcı Ticaret',
  description: 'Yazıcı Ticaret\'e hoş geldiniz! Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Buzdolabı, çamaşır makinesi, bulaşık makinesi, klima ve daha fazlası. Tüm Türkiye\'ye nakliye ve montaj hizmeti.',
 }),
 robots: {
  index: true,
  follow: true,
  googleBot: {
   index: true,
   follow: true,
   'max-video-preview': -1,
   'max-image-preview': 'large',
   'max-snippet': -1,
  },
  yandex: {
   index: true,
   follow: true,
  },
 },
 verification: {
  google: 'GszFc7yfzD4axitIFXz_tMDeVjWm7xmAl5TsEgWh7SU',
 },
};

export default function RootLayout({ children }) {
 return (
  <html lang="tr">
   <body className="antialiased min-h-screen flex flex-col font-sans">
    <ClientProviders>
     {children}
    </ClientProviders>
   </body>
  </html>
 );
}

