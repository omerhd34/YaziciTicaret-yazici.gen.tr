import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ProductBundle from '@/models/ProductBundle';
import Product from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/adminSession';

async function requireAdmin() {
 const cookieStore = await cookies();
 return isAdminAuthenticated(cookieStore);
}

function escapeRegex(s) {
 return s.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

async function resolveProductIds(productCodes) {
 if (!Array.isArray(productCodes) || productCodes.length === 0) return [];
 const codes = productCodes.map((c) => String(c).trim()).filter(Boolean);
 if (codes.length === 0) return [];
 const productIds = [];
 for (const code of codes) {
  const p = await Product.findOne({
   $or: [
    { serialNumber: { $regex: new RegExp(`^${escapeRegex(code)}$`, 'i') } },
    { 'colors.serialNumber': { $regex: new RegExp(`^${escapeRegex(code)}$`, 'i') } },
   ],
  }).select('_id').lean();
  if (p?._id) productIds.push(p._id);
 }
 return [...new Set(productIds.map((id) => id.toString()))];
}

/** PUT - Kampanya güncelle. Body: { name?, productCodes: string[], bundlePrice: number | string } */
export async function PUT(request, { params }) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: 'Yetkisiz' }, { status: 401 });
  }
  const resolvedParams = typeof params?.then === 'function' ? await params : params;
  const id = resolvedParams?.id;
  if (!id) {
   return NextResponse.json({ success: false, message: 'Kampanya ID gerekli' }, { status: 400 });
  }
  await dbConnect();
  const body = await request.json();
  const { name = '', productCodes = [], bundlePrice: rawPrice } = body;

  if (!Array.isArray(productCodes) || productCodes.length === 0) {
   return NextResponse.json(
    { success: false, message: 'En az bir ürün kodu giriniz.' },
    { status: 400 }
   );
  }
  const bundlePrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(',', '.'));
  if (Number.isNaN(bundlePrice) || bundlePrice < 0) {
   return NextResponse.json(
    { success: false, message: 'Geçerli bir paket fiyatı giriniz.' },
    { status: 400 }
   );
  }

  const productIdStrings = await resolveProductIds(productCodes);
  if (productIdStrings.length === 0) {
   return NextResponse.json(
    { success: false, message: 'Girilen ürün kodlarına ait ürün bulunamadı.' },
    { status: 400 }
   );
  }
  const productIds = productIdStrings
   .filter((oid) => mongoose.Types.ObjectId.isValid(oid))
   .map((oid) => new mongoose.Types.ObjectId(oid));

  const bundle = await ProductBundle.findByIdAndUpdate(
   id,
   {
    name: String(name).trim() || '',
    productIds,
    bundlePrice,
    productCodes: productCodes.map((c) => String(c).trim()).filter(Boolean),
   },
   { new: true }
  );
  if (!bundle) {
   return NextResponse.json({ success: false, message: 'Kampanya bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({
   success: true,
   bundle: {
    _id: bundle._id.toString(),
    name: bundle.name,
    productIds: bundle.productIds.map((id) => id.toString()),
    productCodes: bundle.productCodes,
    bundlePrice: bundle.bundlePrice,
   },
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Kampanya güncellenemedi', error: error.message },
   { status: 500 }
  );
 }
}

/** DELETE - Kampanya sil */
export async function DELETE(request, { params }) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: 'Yetkisiz' }, { status: 401 });
  }
  const resolvedParams = typeof params?.then === 'function' ? await params : params;
  const id = resolvedParams?.id;
  if (!id) {
   return NextResponse.json({ success: false, message: 'Kampanya ID gerekli' }, { status: 400 });
  }
  await dbConnect();
  const deleted = await ProductBundle.findByIdAndDelete(id);
  if (!deleted) {
   return NextResponse.json({ success: false, message: 'Kampanya bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Kampanya silindi' });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Silinemedi', error: error.message },
   { status: 500 }
  );
 }
}
