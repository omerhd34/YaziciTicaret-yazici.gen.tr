import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

function addCorsHeaders(response) {
 const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr';
 response.headers.set('Access-Control-Allow-Origin', origin);
 response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
 response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 response.headers.set('Access-Control-Allow-Credentials', 'true');
 return response;
}

function addCacheHeaders(response, { sMaxAge = 120, swr = 600 } = {}) {
 response.headers.set(
  'Cache-Control',
  `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`
 );
 return response;
}

export async function OPTIONS() {
 const response = new NextResponse(null, { status: 200 });
 return addCorsHeaders(response);
}

function normalizeProduct(p) {
 const ratingsArr = Array.isArray(p?.ratings) ? p.ratings : [];
 const reviewCount = ratingsArr.length;
 const avgRaw = reviewCount > 0
  ? ratingsArr.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / reviewCount
  : 0;
 const rating = Math.round(avgRaw * 10) / 10;
 return { ...p, rating, reviewCount };
}

export async function GET(request) {
 try {
  const { searchParams } = new URL(request.url);
  const single = (searchParams.get('serial') || '').trim();
  const multi = (searchParams.get('serials') || '').trim();

  if (multi) {
   const serials = multi
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

   if (serials.length === 0) {
    const response = NextResponse.json({ success: true, data: [] });
    addCacheHeaders(response, { sMaxAge: 120, swr: 600 });
    return addCorsHeaders(response);
   }

   await dbConnect();
   const products = await Product.find({
    $or: [
     { 'colors.serialNumber': { $in: serials } },
     { serialNumber: { $in: serials } },
    ],
   }).lean();

   const data = products.map(normalizeProduct);
   const response = NextResponse.json({ success: true, data });
   addCacheHeaders(response, { sMaxAge: 120, swr: 600 });
   return addCorsHeaders(response);
  }

  if (!single) {
   const response = NextResponse.json(
    { success: false, error: "'serial' veya 'serials' parametresi gereklidir" },
    { status: 400 }
   );
   return addCorsHeaders(response);
  }

  await dbConnect();
  const product = await Product.findOne({
   $or: [
    { 'colors.serialNumber': single },
    { serialNumber: single },
   ],
  }).lean();

  if (!product) {
   const response = NextResponse.json(
    { success: false, error: 'Ürün bulunamadı' },
    { status: 404 }
   );
   return addCorsHeaders(response);
  }

  const response = NextResponse.json({ success: true, data: normalizeProduct(product) });
  addCacheHeaders(response, { sMaxAge: 120, swr: 600 });
  return addCorsHeaders(response);
 } catch (error) {
  const response = NextResponse.json(
   { success: false, error: 'Ürün getirilemedi' },
   { status: 500 }
  );
  return addCorsHeaders(response);
 }
}
