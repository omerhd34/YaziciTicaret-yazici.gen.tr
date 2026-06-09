export const SITE_NAME = 'Yazıcı Ticaret';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr';

export const OG_IMAGE = {
 url: '/opengraph-image.png',
 width: 1921,
 height: 911,
 alt: SITE_NAME,
};

export function buildOpenGraph({ title, description, url }) {
 return {
  title,
  description,
  url,
  siteName: SITE_NAME,
  locale: 'tr_TR',
  type: 'website',
  images: [OG_IMAGE],
 };
}

export function buildTwitter({ title, description }) {
 return {
  card: 'summary_large_image',
  title,
  description,
  images: [OG_IMAGE.url],
 };
}
