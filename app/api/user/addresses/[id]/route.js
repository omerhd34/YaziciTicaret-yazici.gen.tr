import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// PUT - Adres güncelle
export async function PUT(request, { params }) {
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

  // Next.js App Router'da params async olabilir
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const body = await request.json();

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // ID'yi string'e çevir
  const addressIdStr = String(id).trim();

  // Adresi bul - id() metodu ile veya find() ile
  let address = user.addresses.id(addressIdStr);

  // Eğer id() ile bulunamazsa, find() ile dene
  if (!address) {
   address = user.addresses.find(addr => {
    const addrIdStr = addr._id ? addr._id.toString() : String(addr._id);
    return addrIdStr === addressIdStr;
   });
  }

  if (!address) {
   return NextResponse.json(
    { success: false, message: 'Adres bulunamadı' },
    { status: 404 }
   );
  }

  // Eğer güncellenen adres varsayılan ise, diğerlerini varsayılan olmaktan çıkar
  if (body.isDefault) {
   user.addresses.forEach(addr => {
    const addrIdStr = addr._id ? addr._id.toString() : String(addr._id);
    if (addrIdStr !== addressIdStr) {
     addr.isDefault = false;
    }
   });
  }

  // Sadece gerekli alanları güncelle (MongoDB özel alanlarını hariç tut)
  if (body.title !== undefined) address.title = body.title;
  if (body.firstName !== undefined) address.firstName = body.firstName;
  if (body.lastName !== undefined) address.lastName = body.lastName;
  if (body.firstName !== undefined || body.lastName !== undefined) {
   // firstName veya lastName güncellenirse fullName'i de güncelle
   const firstName = body.firstName !== undefined ? body.firstName : address.firstName || '';
   const lastName = body.lastName !== undefined ? body.lastName : address.lastName || '';
   address.fullName = `${firstName} ${lastName}`.trim();
  }
  // Geriye dönük uyumluluk için fullName de kontrol edilir
  if (body.fullName !== undefined && body.firstName === undefined && body.lastName === undefined) {
   address.fullName = body.fullName;
   // fullName'den firstName ve lastName'i ayır
   const parts = body.fullName.trim().split(' ');
   address.firstName = parts[0] || '';
   address.lastName = parts.slice(1).join(' ') || '';
  }
  if (body.phone !== undefined) address.phone = body.phone;
  if (body.address !== undefined) address.address = body.address;
  if (body.city !== undefined) address.city = body.city;
  if (body.district !== undefined) address.district = body.district;
  if (body.isDefault !== undefined) address.isDefault = body.isDefault;

  await user.save();

  return NextResponse.json({
   success: true,
   message: 'Adres güncellendi',
   address: address,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Adres güncellenemedi', error: error.message },
   { status: 500 }
  );
 }
}

// DELETE - Adres sil
export async function DELETE(request, { params }) {
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

  // Next.js App Router'da params async olabilir
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // ID'yi string'e çevir
  const addressIdStr = String(id).trim();

  // Adresi bul - id() metodu ile veya find() ile
  let address = user.addresses.id(addressIdStr);

  // Eğer id() ile bulunamazsa, find() ile dene
  if (!address) {
   address = user.addresses.find(addr => {
    const addrIdStr = addr._id ? addr._id.toString() : String(addr._id);
    return addrIdStr === addressIdStr;
   });
  }

  if (!address) {
   return NextResponse.json(
    { success: false, message: 'Adres bulunamadı' },
    { status: 404 }
   );
  }

  // Eğer silinen adres varsayılan ise ve başka adres varsa, ilk adresi varsayılan yap
  if (address.isDefault && user.addresses.length > 1) {
   const remainingAddresses = user.addresses.filter(addr => {
    const addrIdStr = addr._id ? addr._id.toString() : String(addr._id);
    return addrIdStr !== addressIdStr;
   });

   if (remainingAddresses.length > 0) {
    remainingAddresses[0].isDefault = true;
   }
  }

  // Adresi sil
  address.deleteOne();
  await user.save();
  return NextResponse.json({
   success: true,
   message: 'Adres silindi',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Adres silinemedi', error: error.message },
   { status: 500 }
  );
 }
}

