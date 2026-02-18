import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import Contact from "@/models/Contact";
import ProductRequest from "@/models/ProductRequest";
import ProductBundle from "@/models/ProductBundle";
import { isAdminAuthenticated } from "@/lib/adminSession";

async function requireAdmin() {
 const cookieStore = await cookies();
 return isAdminAuthenticated(cookieStore);
}

// GET - Admin: kullanıcı sayısı, sipariş sayısı, ürün sayısı
export async function GET() {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();

  const [userCount, productVariantResult, inStockProductCount, totalContacts, unreadContacts, totalProductRequests, bundleCount] = await Promise.all([
   User.countDocuments(),
   Product.aggregate([
    {
     $addFields: {
      validColors: {
       $filter: {
        input: { $ifNull: ["$colors", []] },
        as: "c",
        cond: {
         $and: [
          { $eq: [{ $type: "$$c" }, "object"] },
          { $ne: ["$$c.serialNumber", null] },
          { $gt: [{ $strLenCP: { $toString: { $ifNull: ["$$c.serialNumber", ""] } } }, 0] },
         ],
        },
       },
      },
     },
    },
    {
     $addFields: {
      variantCount: {
       $cond: {
        if: { $gt: [{ $size: "$validColors" }, 0] },
        then: { $size: "$validColors" },
        else: 1,
       },
      },
     },
    },
    { $group: { _id: null, total: { $sum: "$variantCount" } } },
   ]),
   Product.countDocuments({ stock: { $gt: 0 } }),
   Contact.countDocuments(),
   Contact.countDocuments({ read: false }),
   ProductRequest.countDocuments(),
   ProductBundle.countDocuments(),
  ]);

  const productCount = productVariantResult[0]?.total ?? 0;

  // Tüm kullanıcıları ve siparişlerini al
  const users = await User.find({}, 'orders').lean();

  // Tüm siparişleri topla ve filtrele
  let totalOrders = 0;
  let pendingOrders = 0;
  let preparingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;
  let returnTalepEdildi = 0;
  let returnOnaylandi = 0;
  let returnIptalEdildi = 0;
  let returnTamamlandi = 0;

  users.forEach(user => {
   if (!user.orders || !Array.isArray(user.orders)) return;

   user.orders.forEach(order => {
    if (!order || !order.orderId) return;

    const status = order.status || '';
    const hasPaidAt = order.payment && (order.payment.paidAt || order.payment.transactionId);

    // Geçersiz siparişleri atla
    if (status === 'Ödeme Bekleniyor' || status === 'Ödeme Başarısız') {
     return;
    }

    // Beklemede ama ödeme bilgisi yoksa atla
    if (status === 'Beklemede' && !hasPaidAt) {
     return;
    }

    // Geçerli sipariş - say
    totalOrders++;

    // Durum bazlı sayım
    if (status === 'Beklemede') pendingOrders++;
    else if (status.includes('Hazırlanıyor')) preparingOrders++;
    else if (status.includes('Kargoya')) shippedOrders++;
    else if (status.includes('Teslim')) deliveredOrders++;
    else if (status.includes('İptal') || status.includes('iptal')) cancelledOrders++;

    // İade talebi durumları
    const rrStatus = (order.returnRequest?.status || '').trim();
    if (rrStatus === 'Talep Edildi') returnTalepEdildi++;
    else if (rrStatus === 'Onaylandı') returnOnaylandi++;
    else if (rrStatus === 'İptal Edildi') returnIptalEdildi++;
    else if (rrStatus === 'Tamamlandı') returnTamamlandi++;
   });
  });

  return NextResponse.json({
   success: true,
   stats: {
    userCount,
    productCount,
    inStockProductCount,
    totalOrders,
    pendingOrders,
    preparingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    returnTalepEdildi,
    returnOnaylandi,
    returnIptalEdildi,
    returnTamamlandi,
    totalContacts,
    unreadContacts,
    totalProductRequests,
    bundleCount,
   },
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: "İstatistikler getirilemedi", error: error.message },
   { status: 500 }
  );
 }
}

