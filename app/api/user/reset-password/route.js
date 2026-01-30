import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request) {
 try {
  await dbConnect();

  const { token, password } = await request.json();

  if (!token || !password) {
   return NextResponse.json(
    { success: false, message: 'Token ve şifre gereklidir' },
    { status: 400 }
   );
  }

  const pw = String(password || "");
  if (pw.length < 10) {
   return NextResponse.json(
    { success: false, message: 'Şifre en az 10 karakter olmalıdır.' },
    { status: 400 }
   );
  }
  if (!/[A-Z]/.test(pw)) {
   return NextResponse.json(
    { success: false, message: 'Şifre en az 1 büyük harf içermelidir.' },
    { status: 400 }
   );
  }
  if (!/[^a-zA-Z0-9]/.test(pw)) {
   return NextResponse.json(
    { success: false, message: 'Şifre en az 1 özel karakter içermelidir (örn: !, @, #).' },
    { status: 400 }
   );
  }
  const hasSequentialRun = (value, runLen = 3) => {
   const s = String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
   if (s.length < runLen) return false;
   for (let i = 0; i <= s.length - runLen; i++) {
    let inc = true;
    for (let j = 0; j < runLen - 1; j++) {
     const a = s.charCodeAt(i + j);
     const b = s.charCodeAt(i + j + 1);
     if (b !== a + 1) {
      inc = false;
      break;
     }
    }
    if (inc) return true;
   }
   return false;
  };
  if (hasSequentialRun(pw, 3)) {
   return NextResponse.json(
    { success: false, message: 'Şifre sıralı harf/rakam içeremez (örn: abc, 123).' },
    { status: 400 }
   );
  }

  // Token'ı hash'le
  const resetPasswordToken = crypto
   .createHash('sha256')
   .update(token)
   .digest('hex');

  // Kullanıcıyı bul ve token kontrolü yap
  const user = await User.findOne({
   resetPasswordToken,
   resetPasswordExpires: { $gt: Date.now() }, // Süresi dolmamış
  });

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Geçersiz veya süresi dolmuş token' },
    { status: 400 }
   );
  }

  // Şifreyi güncelle
  const hashedPassword = Buffer.from(pw).toString('base64');
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({
   success: true,
   message: 'Şifre başarıyla sıfırlandı',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
   { status: 500 }
  );
 }
}

