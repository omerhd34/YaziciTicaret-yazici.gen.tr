import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';
import { cookies } from 'next/headers';

// Admin kontrolü
async function requireAdmin() {
 const cookieStore = await cookies();
 const session = cookieStore.get("admin-session");
 return session && session.value === "authenticated";
}

// GET - Tüm mesajları getir
export async function GET(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const read = searchParams.get('read'); // 'true', 'false', veya null
  const limit = parseInt(searchParams.get('limit')) || 50;
  const page = parseInt(searchParams.get('page')) || 1;
  const skip = (page - 1) * limit;

  // Filtre oluştur
  const filter = {};
  if (read === 'true') {
   filter.read = true;
  } else if (read === 'false') {
   filter.read = false;
  }

  // Mesajları getir (yeni olanlar önce)
  const contacts = await Contact.find(filter)
   .sort({ createdAt: -1 })
   .skip(skip)
   .limit(limit)
   .lean();

  // Toplam sayı
  const total = await Contact.countDocuments(filter);
  const unreadCount = await Contact.countDocuments({ read: false });

  return NextResponse.json({
   success: true,
   contacts,
   pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
   },
   unreadCount,
  });
 } catch (error) {
  console.error('[ADMIN CONTACTS] Hata:', error);
  return NextResponse.json(
   { success: false, message: 'Mesajlar getirilemedi' },
   { status: 500 }
  );
 }
}

// PATCH - Mesajı okundu olarak işaretle
export async function PATCH(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const { id, read } = await request.json();

  if (!id || typeof read !== 'boolean') {
   return NextResponse.json(
    { success: false, message: 'Geçersiz parametreler' },
    { status: 400 }
   );
  }

  await dbConnect();

  const contact = await Contact.findByIdAndUpdate(
   id,
   { read },
   { new: true }
  );

  if (!contact) {
   return NextResponse.json(
    { success: false, message: 'Mesaj bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   contact,
  });
 } catch (error) {
  console.error('[ADMIN CONTACTS] Güncelleme hatası:', error);
  return NextResponse.json(
   { success: false, message: 'Mesaj güncellenemedi' },
   { status: 500 }
  );
 }
}

// DELETE - Mesajı sil
export async function DELETE(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
   return NextResponse.json(
    { success: false, message: 'Mesaj ID gereklidir' },
    { status: 400 }
   );
  }

  await dbConnect();

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
   return NextResponse.json(
    { success: false, message: 'Mesaj bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Mesaj silindi',
  });
 } catch (error) {
  console.error('[ADMIN CONTACTS] Silme hatası:', error);
  return NextResponse.json(
   { success: false, message: 'Mesaj silinemedi' },
   { status: 500 }
  );
 }
}

