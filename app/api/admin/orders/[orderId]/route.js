import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import normalizeText from "@/lib/normalizeText";
import { sendUserReturnApprovedEmail, sendUserReturnRejectedEmail, sendUserOrderStatusUpdateEmail } from "@/lib/notifications";

async function requireAdmin() {
 const cookieStore = await cookies();
 const session = cookieStore.get("admin-session");
 return session && session.value === "authenticated";
}

export async function PATCH(request, { params }) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();

  const resolvedParams = await params;
  const { orderId } = resolvedParams;
  const body = await request.json();
  const { status, returnRequestStatus, adminMessage } = body || {};

  if (!orderId) {
   return NextResponse.json({ success: false, message: "Sipariş bulunamadı" }, { status: 400 });
  }
  const hasStatusUpdate = Boolean(status && String(status).trim());
  const hasReturnUpdate = Boolean(returnRequestStatus && String(returnRequestStatus).trim());
  if (!hasStatusUpdate && !hasReturnUpdate) {
   return NextResponse.json(
    { success: false, message: "Güncellenecek alan yok" },
    { status: 400 }
   );
  }

  // Status güncellenecekse validasyon
  let nextStatus = null;
  let statusNorm = "";
  if (hasStatusUpdate) {
   nextStatus = String(status).trim();
   statusNorm = normalizeText(nextStatus);
  }

  // Order embedded olduğu için user içinde ara
  const user = await User.findOne({ "orders.orderId": String(orderId) });
  if (!user) {
   return NextResponse.json({ success: false, message: "Sipariş bulunamadı" }, { status: 404 });
  }

  const idx = (user.orders || []).findIndex((o) => o.orderId === String(orderId));
  if (idx === -1) {
   return NextResponse.json({ success: false, message: "Sipariş bulunamadı" }, { status: 404 });
  }

  // Eski durumu kaydet (mail için)
  const oldStatus = hasStatusUpdate ? (user.orders[idx]?.status || "") : "";

  // Teslim edildiyse admin bir daha status değiştiremesin (iptal ve iade talebi güncellemesi hariç)
  const currentStatusNorm = normalizeText(user.orders[idx]?.status);
  const isCancelling = hasStatusUpdate && statusNorm.includes("iptal");
  if (hasStatusUpdate && currentStatusNorm.includes("teslim") && !isCancelling) {
   return NextResponse.json(
    { success: false, message: "Teslim edilen siparişin durumu değiştirilemez" },
    { status: 403 }
   );
  }

  const now = new Date();
  const update = { "orders.$.updatedAt": now };

  if (hasStatusUpdate) {
   update["orders.$.status"] = nextStatus;
   // Teslim edildi olarak işaretlenirse teslim tarihini sabitle
   if (statusNorm.includes("teslim") && !user.orders[idx].deliveredAt) {
    update["orders.$.deliveredAt"] = now;
   }
  }

  if (hasReturnUpdate) {
   const nextReturn = String(returnRequestStatus).trim();
   const norm = normalizeText(nextReturn);
   if (norm === normalizeText("İptal Edildi")) {
    return NextResponse.json(
     { success: false, message: "Admin iade talebini iptal edemez." },
     { status: 403 }
    );
   }
   const allowed = new Set([
    normalizeText("Talep Edildi"),
    normalizeText("Onaylandı"),
    normalizeText("Reddedildi"),
    normalizeText("İptal Edildi"),
    normalizeText("Tamamlandı"),
   ]);
   if (!allowed.has(norm)) {
    return NextResponse.json(
     { success: false, message: "Geçersiz iade durumu" },
     { status: 400 }
    );
   }
   update["orders.$.returnRequest.status"] = nextReturn;
   if (adminMessage && String(adminMessage).trim()) {
    update["orders.$.returnRequest.adminExplanation"] = String(adminMessage).trim().slice(0, 2000);
   }
   // İade onaylandıysa 5 gün sayacı için zaman damgası
   if (norm === normalizeText("Onaylandı")) {
    update["orders.$.returnRequest.approvedAt"] = now;
    update["orders.$.returnRequest.completedAt"] = null;
    update["orders.$.returnRequest.cancelledAt"] = null;
    update["orders.$.returnRequest.cancelReason"] = "";
   }
   // Admin "iade tamamlandı" işaretlerse ürünün geri ulaştığını kabul et
   if (norm === normalizeText("Tamamlandı")) {
    update["orders.$.returnRequest.completedAt"] = now;
    update["orders.$.returnRequest.cancelledAt"] = null;
    update["orders.$.returnRequest.cancelReason"] = "";
   }
   if (!user.orders[idx].returnRequest?.requestedAt) {
    update["orders.$.returnRequest.requestedAt"] = now;
   }
   if (user.orders[idx].returnRequest == null) {
    update["orders.$.returnRequest.note"] = "";
   }
  }

  const upd = await User.updateOne(
   { _id: user._id, "orders.orderId": String(orderId) },
   { $set: update }
  );
  if ((upd?.matchedCount ?? 0) === 0) {
   return NextResponse.json(
    { success: false, message: "Sipariş bulunamadı (güncelleme yapılamadı)" },
    { status: 404 }
   );
  }

  // Sipariş iptal edildiğinde veya iade tamamlandığında stokları geri ekle
  const order = user.orders[idx];
  const shouldRestoreStock =
   (hasStatusUpdate && statusNorm.includes("iptal")) ||
   (hasReturnUpdate && normalizeText(String(returnRequestStatus).trim()) === normalizeText("Tamamlandı"));

  if (shouldRestoreStock) {
   try {
    const items = order?.items || [];
    for (const item of items) {
     const productId = item.productId;
     const quantity = item.quantity || 1;

     if (productId) {
      // Önce ürünü getir
      const product = await Product.findById(productId);
      if (!product) continue;

      // Ana ürünün stokunu geri ekle
      await Product.findByIdAndUpdate(
       productId,
       {
        $inc: {
         stock: quantity,
         soldCount: -quantity
        }
       },
       { new: true }
      );

      // Eğer renk seçilmişse, o rengin stokunu da geri ekle
      if (item.color && product.colors && Array.isArray(product.colors)) {
       const colorName = String(item.color).trim();
       await Product.updateOne(
        {
         _id: productId,
         'colors.name': colorName
        },
        {
         $inc: { 'colors.$.stock': quantity }
        }
       );
      }
     }
    }
   } catch (_) { }
  }

  // Müşteriye e-posta: iade onayı/reddi (best-effort)
  if (hasReturnUpdate) {
   const nextReturn = String(returnRequestStatus).trim();
   const norm = normalizeText(nextReturn);

   const emailNotificationsEnabled = user.notificationPreferences?.emailNotifications !== false;

   if (emailNotificationsEnabled && user.email) {
    try {
     const order = user.orders?.[idx] || {};

     if (norm === normalizeText("Onaylandı")) {
      const explanation = adminMessage && String(adminMessage).trim()
       ? String(adminMessage).trim()
       : order?.returnRequest?.note || process.env.RETURN_APPROVED_EXPLANATION || "";
      await sendUserReturnApprovedEmail({
       userEmail: user.email,
       userName: user.name,
       orderId: String(orderId),
       explanation,
      });
     } else if (norm === normalizeText("Reddedildi")) {
      const reason = adminMessage && String(adminMessage).trim()
       ? String(adminMessage).trim()
       : order?.returnRequest?.rejectionReason || process.env.RETURN_REJECTED_REASON || "İade talebiniz şartlarımıza uymadığı için reddedilmiştir.";
      await sendUserReturnRejectedEmail({
       userEmail: user.email,
       userName: user.name,
       orderId: String(orderId),
       reason,
      });
     }
    } catch (e) {
     // Email error - silently fail
    }
   }
  }

  // Müşteriye e-posta: sipariş durumu güncellemesi (e-posta bildirimleri açıksa)
  if (hasStatusUpdate && oldStatus) {
   try {
    const emailNotificationsEnabled = user.notificationPreferences?.emailNotifications !== false; // default true

    if (emailNotificationsEnabled && user.email) {
     // Güncellenmiş siparişi tekrar oku
     const updatedUser = await User.findById(user._id);
     const updatedOrder = updatedUser?.orders?.find((o) => o.orderId === String(orderId));

     await sendUserOrderStatusUpdateEmail({
      userEmail: user.email,
      userName: user.name,
      orderId: String(orderId),
      oldStatus,
      newStatus: nextStatus,
      orderDate: updatedOrder?.date || updatedOrder?.createdAt,
      total: updatedOrder?.total || 0,
      items: updatedOrder?.items || [],
      addressSummary: updatedOrder?.addressSummary || "",
     });
    }
   } catch (e) {
    // mail hatası sipariş güncellemesini bozmasın
   }
  }

  return NextResponse.json({
   success: true,
   message: hasReturnUpdate && !hasStatusUpdate
    ? "İade durumu güncellendi."
    : hasReturnUpdate && hasStatusUpdate
     ? "Sipariş ve iade durumu güncellendi."
     : "Sipariş durumu güncellendi.",
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: "Durum güncellenemedi.", error: error.message },
   { status: 500 }
  );
 }
}

