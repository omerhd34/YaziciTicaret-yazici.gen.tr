import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';
import { isAdminAuthenticated } from '@/lib/adminSession';

async function requireAdmin() {
 const cookieStore = await cookies();
 return isAdminAuthenticated(cookieStore);
}

export async function POST(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz' },
    { status: 401 }
   );
  }

  await dbConnect();

  const { password } = await request.json();

  if (!password) {
   return NextResponse.json(
    { success: false, message: 'Şifre gereklidir' },
    { status: 400 }
   );
  }

  // Şifreyi hash'le
  const hashedPassword = Buffer.from(password).toString('base64');

  // Tüm adminler arasında şifreyi kontrol et
  // Not: Zaten admin oturumu açık olduğu için, doğru şifre girildiğinde herhangi bir admin hesabıyla eşleşirse başarılı kabul edilir
  const admin = await Admin.findOne({ password: hashedPassword });

  if (!admin) {
   return NextResponse.json(
    { success: false, message: 'Şifre hatalı' },
    { status: 401 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Şifre doğrulandı',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Bir hata oluştu' },
   { status: 500 }
  );
 }
}

