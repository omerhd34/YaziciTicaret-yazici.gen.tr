export default function robots() {
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

 return {
  rules: [
   {
    userAgent: '*',
    allow: '/',
    disallow: [
     '/admin/',
     '/admin-giris/',
     '/api/',
     '/hesabim/',
     '/sepet/',
     '/odeme/',
     '/favoriler/',
     '/giris/',
     '/sifre-sifirla/',
    ],
   },
   {
    userAgent: 'Googlebot',
    allow: '/',
    disallow: [
     '/admin/',
     '/admin-giris/',
     '/api/',
     '/hesabim/',
     '/sepet/',
     '/odeme/',
     '/favoriler/',
     '/giris/',
     '/sifre-sifirla/',
    ],
   },
  ],
  sitemap: `${baseUrl}/sitemap.xml`,
 };
}

