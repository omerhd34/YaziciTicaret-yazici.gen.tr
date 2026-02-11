import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductBundle from '@/models/ProductBundle';

/** Herkese açık: Sepette paket fiyatı hesaplamak için kampanya listesi */
export async function GET() {
 try {
  await dbConnect();
  const bundles = await ProductBundle.find({})
   .select('productIds bundlePrice name productCodes')
   .lean();
  const list = (bundles || []).map((b) => ({
   _id: b._id?.toString(),
   productIds: (b.productIds || []).map((id) => id?.toString()).filter(Boolean),
   bundlePrice: b.bundlePrice,
   name: b.name || '',
   productCodes: b.productCodes || [],
  }));
  return NextResponse.json({ success: true, bundles: list });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Kampanyalar alınamadı', error: error.message },
   { status: 500 }
  );
 }
}
