export const metadata = {
 title: 'Yazıcı Ticaret',
 description: 'Yazıcı Ticaret\'e hoş geldiniz! Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Buzdolabı, çamaşır makinesi, bulaşık makinesi, klima ve daha fazlası. Tüm Türkiye\'ye nakliye ve montaj hizmeti.',
 openGraph: {
  title: 'Yazıcı Ticaret',
  description: 'Profilo ve LG markası beyaz eşya ve elektronik ürünlerinde en uygun fiyatlar. Tüm Türkiye\'ye nakliye ve montaj hizmeti.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  siteName: 'Yazıcı Ticaret',
  locale: 'tr_TR',
  type: 'website',
 },
 alternates: {
  canonical: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
 },
};

export default function AnaSayfaLayout({ children }) {
 return children;
}

