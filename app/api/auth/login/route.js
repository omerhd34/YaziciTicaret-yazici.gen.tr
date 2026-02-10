import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';
import { createSignedToken, COOKIE_NAME } from '@/lib/adminSession';

export async function POST(request) {
 try {
  await dbConnect();

  const { username, password } = await request.json();

  if (!username || !password) {
   return NextResponse.json(
    { success: false, message: 'Hesap adı ve şifre gereklidir' },
    { status: 400 }
   );
  }

  // Admin kullanıcısını veritabanından bul (username ile)
  const admin = await Admin.findOne({ username: username.trim() });

  if (!admin) {
   return NextResponse.json(
    { success: false, message: 'Hesap adı veya şifre hatalı' },
    { status: 401 }
   );
  }

  // Şifre kontrolü (base64 hash ile)
  const hashedPassword = Buffer.from(password).toString('base64');
  if (admin.password !== hashedPassword) {
   return NextResponse.json(
    { success: false, message: 'Hesap adı veya şifre hatalı' },
    { status: 401 }
   );
  }

  const cookieStore = await cookies();
  const signedToken = createSignedToken();
  cookieStore.set(COOKIE_NAME, signedToken, {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict',
   maxAge: 60 * 60 * 24 * 7, // 7 gün
   path: '/',
  });

  return NextResponse.json({
   success: true,
   message: 'Giriş başarılı',
   admin: {
    id: admin._id,
    username: admin.username,
   }
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Bir hata oluştu' },
   { status: 500 }
  );
 }
}

