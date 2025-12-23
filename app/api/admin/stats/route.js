import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import Contact from "@/models/Contact";

async function requireAdmin() {
 const cookieStore = await cookies();
 const session = cookieStore.get("admin-session");
 return session && session.value === "authenticated";
}

// GET - Admin: kullanıcı sayısı, sipariş sayısı, ürün sayısı
export async function GET() {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();

  const [userCount, productCount, inStockProductCount, totalContacts, unreadContacts] = await Promise.all([
   User.countDocuments(),
   Product.countDocuments(),
   Product.countDocuments({ stock: { $gt: 0 } }),
   Contact.countDocuments(),
   Contact.countDocuments({ read: false }),
  ]);

  const agg = await User.aggregate([
   { $unwind: { path: "$orders", preserveNullAndEmptyArrays: true } },
   {
    $project: {
     status: { $ifNull: ["$orders.status", ""] },
     hasOrder: { $cond: [{ $ifNull: ["$orders.orderId", false] }, 1, 0] },
    },
   },
   {
    $group: {
     _id: null,
     totalOrders: { $sum: "$hasOrder" },
     pendingOrders: {
      $sum: {
       $cond: [
        { $regexMatch: { input: "$status", regex: /Beklemede/ } },
        1,
        0,
       ],
      },
     },
     shippedOrders: {
      $sum: {
       $cond: [
        { $regexMatch: { input: "$status", regex: /Kargoya/ } },
        1,
        0,
       ],
      },
     },
     deliveredOrders: {
      $sum: {
       $cond: [
        { $regexMatch: { input: "$status", regex: /Teslim/ } },
        1,
        0,
       ],
      },
     },
     cancelledOrders: {
      $sum: {
       $cond: [
        { $regexMatch: { input: "$status", regex: /(İptal|iptal)/ } },
        1,
        0,
       ],
      },
     },
    },
   },
  ]);
  const totalOrders = agg?.[0]?.totalOrders || 0;
  const pendingOrders = agg?.[0]?.pendingOrders || 0;
  const shippedOrders = agg?.[0]?.shippedOrders || 0;
  const deliveredOrders = agg?.[0]?.deliveredOrders || 0;
  const cancelledOrders = agg?.[0]?.cancelledOrders || 0;

  return NextResponse.json({
   success: true,
   stats: {
    userCount,
    productCount,
    inStockProductCount,
    totalOrders,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalContacts,
    unreadContacts,
   },
  });
 } catch (error) {
  console.error("Admin stats error:", error);
  return NextResponse.json(
   { success: false, message: "İstatistikler getirilemedi", error: error.message },
   { status: 500 }
  );
 }
}

