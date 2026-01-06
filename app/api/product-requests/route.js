import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import ProductRequest from '@/models/ProductRequest';
import User from '@/models/User';
import { sendProductRequestEmail } from '@/lib/email';

// POST - Yeni ürün isteği oluştur
export async function POST(request) {
 try {
  await dbConnect();

  const body = await request.json();
  const { name, email, phone, productName, productDescription, brand, model } = body;

  // Validasyon
  if (!productName || !productName.trim()) {
   return NextResponse.json(
    { success: false, message: 'Ürün adı gereklidir' },
    { status: 400 }
   );
  }

  // Kullanıcı oturumu kontrolü
  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');
  let userId = null;
  let userName = '';
  let userEmail = '';
  let userPhone = '';

  if (session && session.value) {
   try {
    const userData = JSON.parse(session.value);
    if (userData && userData.id) {
     const user = await User.findById(userData.id);
     if (user) {
      userId = user._id;
      userName = user.name || '';
      userEmail = user.email || '';
      userPhone = user.phone || '';
     }
    }
   } catch (error) {
    // Session parse hatası
   }
  }

  // Kullanıcı giriş yapmamışsa formdan gelen bilgileri kullan
  if (!userId || !userEmail) {
   // Giriş yapmamış kullanıcılar için validasyon
   if (!name || !name.trim()) {
    return NextResponse.json(
     { success: false, message: 'İsim gereklidir' },
     { status: 400 }
    );
   }

   if (!email || !email.trim()) {
    return NextResponse.json(
     { success: false, message: 'E-posta gereklidir' },
     { status: 400 }
    );
   }

   // Email format kontrolü
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email.trim())) {
    return NextResponse.json(
     { success: false, message: 'Geçerli bir e-posta adresi giriniz' },
     { status: 400 }
    );
   }

   userName = name.trim();
   userEmail = email.trim().toLowerCase();
   userPhone = phone ? phone.trim() : '';
  }

  // Ürün isteği oluştur
  const productRequest = await ProductRequest.create({
   userId: userId,
   name: userName,
   email: userEmail.toLowerCase(),
   phone: userPhone,
   productName: productName.trim(),
   productDescription: productDescription ? productDescription.trim() : '',
   brand: brand ? brand.trim() : '',
   model: model ? model.trim() : '',
   status: 'Beklemede',
  });

  // Admin'e email gönder
  try {
   await sendProductRequestEmail({
    productName: productRequest.productName,
    brand: productRequest.brand,
    model: productRequest.model,
    productDescription: productRequest.productDescription,
    name: productRequest.name,
    email: productRequest.email,
    phone: productRequest.phone,
   });
  } catch (emailError) {
   // Email error - silently fail
  }

  return NextResponse.json({
   success: true,
   message: 'Ürün isteğiniz başarıyla gönderildi',
   request: {
    id: productRequest._id,
    status: productRequest.status,
   },
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Ürün isteği oluşturulamadı' },
   { status: 500 }
  );
 }
}

// GET - Kullanıcının kendi isteklerini getir
export async function GET() {
 try {
  await dbConnect();

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

  // Kullanıcının isteklerini getir (email ile eşleştir)
  const user = await User.findById(userData.id);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  // Sadece userId ile eşleşen istekleri getir (kullanıcı silindiğinde eski istekler görünmesin)
  const requests = await ProductRequest.find({
   userId: user._id,
  })
   .sort({ createdAt: -1 })
   .lean();

  return NextResponse.json({
   success: true,
   requests,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'İstekler getirilemedi' },
   { status: 500 }
  );
 }
}

