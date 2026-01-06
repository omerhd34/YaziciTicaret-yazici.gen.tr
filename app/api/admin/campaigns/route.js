import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';

// Admin kontrolü
async function checkAdmin() {
 try {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  return session && session.value === 'authenticated';
 } catch (error) {
  return false;
 }
}

// GET - Tüm kampanyaları getir
export async function GET(request) {
 try {
  if (!(await checkAdmin())) {
   return NextResponse.json(
    { success: false, error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  await dbConnect();
  const campaigns = await Campaign.find({}).sort({ order: 1, createdAt: -1 });

  return NextResponse.json({
   success: true,
   data: campaigns,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, error: 'Kampanyalar getirilemedi', details: error.message },
   { status: 500 }
  );
 }
}

// POST - Yeni kampanya oluştur
export async function POST(request) {
 try {
  if (!(await checkAdmin())) {
   return NextResponse.json(
    { success: false, error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const body = await request.json();
  const { title, description, image, link, isActive, order, endDate, productCodes, campaignPrice } = body;

  if (!title || !image) {
   return NextResponse.json(
    { success: false, error: 'Başlık ve görsel gereklidir' },
    { status: 400 }
   );
  }

  await dbConnect();

  const campaign = new Campaign({
   title,
   description: description || '',
   image,
   link: link || '/kategori/indirim',
   isActive: isActive !== undefined ? isActive : true,
   order: order || 0,
   endDate: endDate || null,
   productCodes: productCodes && Array.isArray(productCodes) ? productCodes : [],
   campaignPrice: campaignPrice !== undefined && campaignPrice !== null && campaignPrice !== '' ? parseFloat(campaignPrice) : null,
  });

  await campaign.save();

  return NextResponse.json({
   success: true,
   data: campaign,
   message: 'Kampanya oluşturuldu',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, error: 'Kampanya oluşturulamadı', details: error.message },
   { status: 500 }
  );
 }
}

