import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// GET - Kullanıcının adreslerini getir
export async function GET() {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
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

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   addresses: user.addresses || [],
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Adresler getirilemedi', error: error.message },
   { status: 500 }
  );
 }
}

// POST - Yeni adres ekle
export async function POST(request) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
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

  const body = await request.json();

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // Eğer yeni adres varsayılan ise, diğerlerini varsayılan olmaktan çıkar
  if (body.isDefault && user.addresses && user.addresses.length > 0) {
   user.addresses.forEach(addr => {
    addr.isDefault = false;
   });
  }

  // Adresleri ekle
  if (!user.addresses) {
   user.addresses = [];
  }

  // Yeni adres oluştur
  // Geriye dönük uyumluluk için: eğer firstName/lastName yoksa fullName'den ayır
  let firstName = body.firstName || '';
  let lastName = body.lastName || '';
  let fullName = '';
  
  if (firstName && lastName) {
   fullName = `${firstName} ${lastName}`.trim();
  } else if (body.fullName) {
   // Eski veriler için fullName'den ayır
   const parts = body.fullName.trim().split(' ');
   firstName = parts[0] || '';
   lastName = parts.slice(1).join(' ') || '';
   fullName = body.fullName;
  }
  
  user.addresses.push({
   title: body.title,
   firstName: firstName,
   lastName: lastName,
   fullName: fullName,
   phone: body.phone,
   address: body.address,
   city: body.city,
   district: body.district,
   isDefault: body.isDefault || false,
  });

  await user.save();

  const newAddress = user.addresses[user.addresses.length - 1];

  return NextResponse.json({
   success: true,
   message: 'Adres eklendi',
   address: newAddress,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Adres eklenemedi', error: error.message },
   { status: 500 }
  );
 }
}

