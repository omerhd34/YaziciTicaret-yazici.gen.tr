import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import User from '@/models/User';

const normalizeText = (value) => {
 return String(value || '')
  .replace(/İ/g, 'i')
  .replace(/I/g, 'i')
  .replace(/ı/g, 'i')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '');
};

// Sadece sipariş teslim edildiğinde puan verilebilir
const isDeliveredStatus = (status) => {
 const s = normalizeText(status);
 return s.includes('teslim');
};

// POST - Ürün puanı ver
export async function POST(request, { params }) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user-session');

  if (!sessionCookie || !sessionCookie.value) {
   return NextResponse.json(
    { success: false, message: 'Giriş yapmanız gerekiyor' },
    { status: 401 }
   );
  }

  let session;
  try {
   session = JSON.parse(sessionCookie.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!session || !session.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı' },
    { status: 401 }
   );
  }

  const userId = session.id;
  const { id } = await params;
  const { rating } = await request.json();

  // Rating değeri kontrolü
  if (!rating || rating < 1 || rating > 5) {
   return NextResponse.json(
    { success: false, message: 'Puan 1 ile 5 arasında olmalıdır' },
    { status: 400 }
   );
  }

  // Kullanıcıyı bul
  const user = await User.findById(userId);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  // Ürünü bul
  const product = await Product.findById(id);
  if (!product) {
   return NextResponse.json(
    { success: false, message: 'Ürün bulunamadı' },
    { status: 404 }
   );
  }

  // Kullanıcının bu ürünü satın alıp almadığını ve siparişin "Teslim Edildi" olup olmadığını kontrol et
  const hasDeliveredPurchase = Array.isArray(user.orders) && user.orders.some(order => {
   if (!isDeliveredStatus(order?.status)) return false;
   if (!order.items || !Array.isArray(order.items)) return false;
   return order.items.some(item => {
    const itemId = item._id?.toString() || item.productId?.toString() || item.id?.toString();
    const productId = product._id.toString();
    return itemId === productId || item.slug === product.slug;
   });
  });

  if (!hasDeliveredPurchase) {
   return NextResponse.json(
    { success: false, message: 'Puan verebilmek için ürünü satın almış olmalı ve siparişiniz "Teslim Edildi" olmalıdır.' },
    { status: 403 }
   );
  }

  // Kullanıcının daha önce bu ürüne puan verip vermediğini kontrol et
  const existingRating = Array.isArray(product.ratings)
   ? product.ratings.find(r => r.userId?.toString() === userId.toString())
   : null;

  if (existingRating) {
   return NextResponse.json(
    { success: false, message: 'Bu ürünü daha önce puanladınız. Her ürün sadece 1 kez puanlanabilir.' },
    { status: 403 }
   );
  }

  const now = Date.now();
  if (!Array.isArray(product.ratings)) product.ratings = [];

  // Ortalama + sayacı güncelle (tek seferlik)
  const currentRating = product.rating || 0;
  const currentReviewCount = product.reviewCount || 0;
  const newReviewCount = currentReviewCount + 1;
  const newAvg = ((currentRating * currentReviewCount) + rating) / newReviewCount;

  product.rating = Math.round(newAvg * 10) / 10;
  product.reviewCount = newReviewCount;
  product.ratings.push({
   userId,
   rating,
   createdAt: new Date(now),
   updatedAt: new Date(now),
  });

  await product.save();

  return NextResponse.json({
   success: true,
   message: 'Puanınız başarıyla kaydedildi',
   data: {
    rating: product.rating,
    reviewCount: product.reviewCount,
    userRating: rating,
    canUpdateUntil: null,
   },
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Puan verilemedi' },
   { status: 500 }
  );
 }
}

// GET - Kullanıcının bu ürüne puan verip veremediğini kontrol et
export async function GET(request, { params }) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user-session');

  if (!sessionCookie || !sessionCookie.value) {
   return NextResponse.json({
    success: true,
    canRate: false,
    message: 'Giriş yapmanız gerekiyor',
   });
  }

  let session;
  try {
   session = JSON.parse(sessionCookie.value);
  } catch (parseError) {
   return NextResponse.json({
    success: true,
    canRate: false,
    message: 'Oturum hatası',
   });
  }

  if (!session || !session.id) {
   return NextResponse.json({
    success: true,
    canRate: false,
    message: 'Kullanıcı bilgisi bulunamadı',
   });
  }

  const userId = session.id;
  const { id } = await params;

  // Kullanıcıyı bul
  const user = await User.findById(userId);
  if (!user) {
   return NextResponse.json({
    success: true,
    canRate: false,
    message: 'Kullanıcı bulunamadı',
   });
  }

  // Ürünü bul
  const product = await Product.findById(id);
  if (!product) {
   return NextResponse.json({
    success: true,
    canRate: false,
    message: 'Ürün bulunamadı',
   });
  }

  // Kullanıcının bu ürünü satın alıp almadığını ve siparişin teslim edildiğini kontrol et
  const hasDeliveredPurchase = Array.isArray(user.orders) && user.orders.some(order => {
   if (!isDeliveredStatus(order?.status)) return false;
   if (!order.items || !Array.isArray(order.items)) return false;
   return order.items.some(item => {
    const itemId = item._id?.toString() || item.productId?.toString() || item.id?.toString();
    const productId = product._id.toString();
    return itemId === productId || item.slug === product.slug;
   });
  });

  const existingRating = Array.isArray(product.ratings)
   ? product.ratings.find(r => r.userId?.toString() === userId.toString())
   : null;

  return NextResponse.json({
   success: true,
   canRate: hasDeliveredPurchase && !existingRating,
   canUpdate: false,
   userRating: existingRating ? existingRating.rating : null,
   canUpdateUntil: null,
  });
 } catch (error) {
  return NextResponse.json({
   success: true,
   canRate: false,
  });
 }
}