import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import ProductBundle from "@/models/ProductBundle";

/**
 * GET - Kullanıcının daha önce satın aldığı kampanya paketlerinin ID'lerini döner.
 * 1 üye 1 paket 1 kere kuralı için kullanılır.
 */
export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user-session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, purchasedBundleIds: [] },
        { status: 401 }
      );
    }

    let session;
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json(
        { success: false, purchasedBundleIds: [] },
        { status: 401 }
      );
    }

    if (!session?.id) {
      return NextResponse.json(
        { success: false, purchasedBundleIds: [] },
        { status: 401 }
      );
    }

    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({
        success: true,
        purchasedBundleIds: [],
      });
    }

    // Tamamlanmış siparişler (ödeme yapılmış)
    const completedOrders = (user.orders || []).filter((o) => {
      const hasPaidAt =
        o.payment && (o.payment.paidAt || o.payment.transactionId);
      return (
        o.status !== "Ödeme Bekleniyor" &&
        o.status !== "Ödeme Başarısız" &&
        (o.status !== "Beklemede" || hasPaidAt) &&
        hasPaidAt
      );
    });

    const allBundles = await ProductBundle.find({}).select("_id productIds").lean();
    const purchasedBundleIds = [];

    for (const bundle of allBundles) {
      const bundleProductIds = (bundle.productIds || []).map((id) =>
        String(id)
      );
      if (bundleProductIds.length === 0) continue;

      const wasPurchased = completedOrders.some((order) => {
        const orderItems = order.items || [];
        const orderProductMap = new Map();
        orderItems.forEach((item) => {
          const pid = String(item.productId || item._id || item.id || "");
          if (pid) {
            const qty = Number(item.quantity || 1);
            orderProductMap.set(pid, (orderProductMap.get(pid) || 0) + qty);
          }
        });

        // Sipariş tüm paket ürünlerini en az 1 adet içeriyor mu?
        const hasAllWithQuantity = bundleProductIds.every(
          (pid) => (orderProductMap.get(pid) || 0) >= 1
        );
        return hasAllWithQuantity;
      });

      if (wasPurchased) {
        purchasedBundleIds.push(String(bundle._id));
      }
    }

    return NextResponse.json({
      success: true,
      purchasedBundleIds,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, purchasedBundleIds: [], error: error?.message },
      { status: 500 }
    );
  }
}
