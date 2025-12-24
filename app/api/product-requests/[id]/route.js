import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import ProductRequest from '@/models/ProductRequest';
import User from '@/models/User';

// DELETE - Ürün isteğini iptal et
export async function DELETE(request, { params }) {
 try {
  await dbConnect();

  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Kullanıcı oturumu kontrolü
  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen giriş yapın.' },
    { status: 401 }
   );
  }

  let userData;
  try {
   userData = JSON.parse(session.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!userData || !userData.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  // İsteği bul
  let productRequest;
  try {
   productRequest = await ProductRequest.findById(id);
  } catch (error) {
   return NextResponse.json(
    { success: false, message: 'Geçersiz istek ID' },
    { status: 400 }
   );
  }

  if (!productRequest) {
   return NextResponse.json(
    { success: false, message: 'İstek bulunamadı' },
    { status: 404 }
   );
  }

  // Kullanıcının kendi isteği olduğunu kontrol et
  const user = await User.findById(userData.id);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  // Kullanıcının kendi isteği olduğunu kontrol et
  const isOwner = productRequest.userId && productRequest.userId.toString() === user._id.toString();
  const isEmailMatch = productRequest.email && productRequest.email.toLowerCase() === user.email.toLowerCase();

  if (!isOwner && !isEmailMatch) {
   return NextResponse.json(
    { success: false, message: 'Bu isteği iptal etme yetkiniz yok' },
    { status: 403 }
   );
  }

  // Sadece "Beklemede" durumundaki istekler iptal edilebilir
  if (productRequest.status !== 'Beklemede') {
   return NextResponse.json(
    { success: false, message: `Sadece beklemede olan istekler iptal edilebilir. Mevcut durum: ${productRequest.status}` },
    { status: 400 }
   );
  }

  // İsteği iptal et
  productRequest.status = 'İptal Edildi';
  await productRequest.save();

  return NextResponse.json({
   success: true,
   message: 'Ürün isteği başarıyla iptal edildi',
   request: productRequest,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: `İstek iptal edilemedi: ${error.message}` },
   { status: 500 }
  );
 }
}

