import { NextResponse } from 'next/server';

function getCorsHeaders(request) {
 const requestOrigin = request.headers.get('origin');
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr';

 const allowedOrigins = [
  'https://yazici.gen.tr',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
 ];

 let origin = baseUrl;
 if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
  origin = requestOrigin;
 }

 return {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
 };
}

export function middleware(request) {
 if (request.method !== 'OPTIONS') {
  const response = NextResponse.next();
  const corsHeaders = getCorsHeaders(request);
  Object.entries(corsHeaders).forEach(([key, value]) => {
   response.headers.set(key, value);
  });
  return response;
 }

 return new NextResponse(null, {
  status: 200,
  headers: getCorsHeaders(request),
 });
}

export const config = {
 matcher: [
  {
   source: '/api/:path*',
   has: [
    { type: 'header', key: 'access-control-request-method' },
   ],
  },
 ],
};
