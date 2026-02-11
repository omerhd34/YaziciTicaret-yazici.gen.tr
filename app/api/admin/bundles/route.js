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

/** Ürün kodu (serialNumber) veya ID ile ürün _id bul */
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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/** GET - Tüm paket kampanyalarını listele */
export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Yetkisiz' }, { status: 401 });
    }
    await dbConnect();
    const bundles = await ProductBundle.find({}).sort({ createdAt: -1 }).lean();
    const list = (bundles || []).map((b) => ({
      _id: b._id?.toString(),
      name: b.name || '',
      productIds: (b.productIds || []).map((id) => id?.toString()).filter(Boolean),
      productCodes: b.productCodes || [],
      bundlePrice: b.bundlePrice,
      createdAt: b.createdAt,
    }));
    return NextResponse.json({ success: true, bundles: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Kampanyalar alınamadı', error: error.message },
      { status: 500 }
    );
  }
}

/** POST - Yeni paket kampanyası ekle. Body: { name?, productCodes: string[], bundlePrice: number | string } */
export async function POST(request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Yetkisiz' }, { status: 401 });
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
        { success: false, message: 'Girilen ürün kodlarına ait ürün bulunamadı. Ürün kodu olarak ürünün "Ürün kodu" (serial number) alanını kullanın.' },
        { status: 400 }
      );
    }
    const productIds = productIdStrings
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const bundle = await ProductBundle.create({
      name: String(name).trim() || undefined,
      productIds,
      bundlePrice,
      productCodes: productCodes.map((c) => String(c).trim()).filter(Boolean),
    });

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
      { success: false, message: 'Kampanya eklenemedi', error: error.message },
      { status: 500 }
    );
  }
}
