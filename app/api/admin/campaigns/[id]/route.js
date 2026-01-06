import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
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

// PUT - Kampanya güncelle
export async function PUT(request, { params }) {
 try {
  if (!(await checkAdmin())) {
   return NextResponse.json(
    { success: false, error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
   return NextResponse.json(
    { success: false, error: 'Geçersiz kampanya ID' },
    { status: 400 }
   );
  }

  const body = await request.json();
  const { title, description, image, link, isActive, order, endDate, productCodes, campaignPrice } = body;

  await dbConnect();

  const campaign = await Campaign.findById(id);
  if (!campaign) {
   return NextResponse.json(
    { success: false, error: 'Kampanya bulunamadı' },
    { status: 404 }
   );
  }

  if (title !== undefined) campaign.title = title;
  if (description !== undefined) campaign.description = description || '';
  if (image !== undefined) campaign.image = image;
  if (link !== undefined) campaign.link = link;
  if (isActive !== undefined) campaign.isActive = isActive;
  if (order !== undefined) campaign.order = order;
  if (endDate !== undefined) campaign.endDate = endDate || null;
  if (productCodes !== undefined) campaign.productCodes = Array.isArray(productCodes) ? productCodes : [];
  if (campaignPrice !== undefined) campaign.campaignPrice = campaignPrice !== null && campaignPrice !== '' ? parseFloat(campaignPrice) : null;

  await campaign.save();

  return NextResponse.json({
   success: true,
   data: campaign,
   message: 'Kampanya güncellendi',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, error: 'Kampanya güncellenemedi', details: error.message },
   { status: 500 }
  );
 }
}

// DELETE - Kampanya sil
export async function DELETE(request, { params }) {
 try {
  if (!(await checkAdmin())) {
   return NextResponse.json(
    { success: false, error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!mongoose.Types.ObjectId.isValid(id)) {
   return NextResponse.json(
    { success: false, error: 'Geçersiz kampanya ID' },
    { status: 400 }
   );
  }

  await dbConnect();

  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) {
   return NextResponse.json(
    { success: false, error: 'Kampanya bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Kampanya silindi',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, error: 'Kampanya silinemedi', details: error.message },
   { status: 500 }
  );
 }
}

