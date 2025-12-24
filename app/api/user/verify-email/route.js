import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// GET: Link ile doğrulama
export async function GET(request) {
 try {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const code = searchParams.get('code');

  if (!token || !code) {
   return NextResponse.redirect(new URL('/giris?error=gecersiz-link', request.url));
  }

  const user = await User.findById(token);
  if (!user) {
   return NextResponse.redirect(new URL('/giris?error=kullanici-bulunamadi', request.url));
  }

  // Kod kontrolü (trim ve string karşılaştırması)
  const storedCode = String(user.emailVerificationCode || '').trim();
  const providedCode = String(code || '').trim();

  if (!user.emailVerificationCode) {
   return NextResponse.redirect(new URL('/giris?error=kod-bulunamadi', request.url));
  }

  if (storedCode !== providedCode) {
   return NextResponse.redirect(new URL('/giris?error=gecersiz-kod', request.url));
  }

  // Süre kontrolü
  if (new Date() > new Date(user.emailVerificationCodeExpires)) {
   return NextResponse.redirect(new URL('/giris?error=kod-suresi-doldu', request.url));
  }

  // Email'i doğrula
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;
  await user.save();

  // Otomatik giriş yap - cookie oluştur
  const cookieStore = await cookies();
  cookieStore.set('user-session', JSON.stringify({
   id: user._id.toString(),
   email: user.email,
   name: user.name,
  }), {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict',
   maxAge: 60 * 60 * 24 * 30, // 30 gün
   path: '/',
  });

  return NextResponse.redirect(new URL('/hesabim', request.url));
 } catch (error) {
  return NextResponse.redirect(new URL('/giris?error=bir-hata-olustu', request.url));
 }
}

// POST: Kod ile doğrulama
export async function POST(request) {
 try {
  await dbConnect();
  const { userId, code } = await request.json();

  if (!userId || !code) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı ID ve doğrulama kodu gereklidir.' },
    { status: 400 }
   );
  }

  // Kullanıcıyı bul - tüm alanları getir
  const user = await User.findById(userId);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı.' },
    { status: 404 }
   );
  }

  // Kullanıcı bilgileri
  const userObj = user.toObject ? user.toObject() : user;

  // Zaten doğrulanmış mı?
  if (user.isEmailVerified) {
   return NextResponse.json(
    { success: true, message: 'Email zaten doğrulanmış.' },
    { status: 200 }
   );
  }

  // Önce kodun varlığını kontrol et
  if (!user.emailVerificationCode) {
   return NextResponse.json(
    { success: false, message: 'Doğrulama kodu bulunamadı. Lütfen yeni bir kod isteyin.' },
    { status: 400 }
   );
  }

  // Kod kontrolü (trim ve string karşılaştırması)
  const storedCode = String(user.emailVerificationCode || '').trim();
  const providedCode = String(code || '').trim();

  if (storedCode !== providedCode) {
   return NextResponse.json(
    { success: false, message: 'Geçersiz doğrulama kodu.' },
    { status: 400 }
   );
  }

  // Süre kontrolü
  if (new Date() > new Date(user.emailVerificationCodeExpires)) {
   return NextResponse.json(
    { success: false, message: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.' },
    { status: 400 }
   );
  }

  // Email'i doğrula
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;
  await user.save();

  // Otomatik giriş yap - cookie oluştur
  const cookieStore = await cookies();
  cookieStore.set('user-session', JSON.stringify({
   id: user._id.toString(),
   email: user.email,
   name: user.name,
  }), {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict',
   maxAge: 60 * 60 * 24 * 30, // 30 gün
   path: '/',
  });

  return NextResponse.json(
   { success: true, message: 'Email başarıyla doğrulandı!', autoLogin: true },
   { status: 200 }
  );
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Bir hata oluştu.' },
   { status: 500 }
  );
 }
}
