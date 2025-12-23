import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import normalizeText from "@/lib/normalizeText";
import { sendAdminOrderCancelledEmail } from "@/lib/notifications";

function isCancellableStatus(status) {
 const s = String(status || "").toLowerCase();
 // Admin kargoya verdi / kargoda / teslim edildi ise iptal yok
 if (s.includes("kargo") || s.includes("shipped") || s.includes("shipping")) return false;
 if (s.includes("teslim") || s.includes("delivered") || s.includes("completed")) return false;
 if (s.includes("iptal")) return false;
 return true;
}

export async function PATCH(request, { params }) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session");
  if (!sessionCookie?.value) {
   return NextResponse.json({ success: false, message: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  let session;
  try {
   session = JSON.parse(sessionCookie.value);
  } catch {
   return NextResponse.json({ success: false, message: "Oturum hatası. Lütfen tekrar giriş yapın." }, { status: 401 });
  }

  if (!session?.id) {
   return NextResponse.json({ success: false, message: "Kullanıcı bilgisi bulunamadı" }, { status: 401 });
  }

  const resolvedParams = await params;
  const { orderId } = resolvedParams;
  if (!orderId) {
   return NextResponse.json({ success: false, message: "Sipariş bulunamadı" }, { status: 400 });
  }

  const user = await User.findById(session.id);
  if (!user) {
   return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  const idx = (user.orders || []).findIndex((o) => o.orderId === String(orderId));
  if (idx === -1) {
   return NextResponse.json({ success: false, message: "Sipariş bulunamadı" }, { status: 404 });
  }

  const currentStatus = user.orders[idx].status;
  if (!isCancellableStatus(currentStatus)) {
   const s = normalizeText(currentStatus);
   const isShipped = s.includes("kargo") || s.includes("shipped") || s.includes("shipping");
   const isDelivered = s.includes("teslim") || s.includes("delivered") || s.includes("completed");
   return NextResponse.json(
    {
     success: false,
     message: isDelivered
      ? "Teslim edilen sipariş iptal edilemez."
      : isShipped
       ? "Sipariş kargoya verildiği için iptal edilemez."
       : "Sipariş iptal edilemez.",
    },
    { status: 403 }
   );
  }

  user.orders[idx].status = "İptal Edildi";
  user.orders[idx].updatedAt = new Date();
  await user.save();

  // Admin'e e-posta bildirimi (best-effort)
  try {
   const adminEmail = process.env.EMAIL_USER;
   const order = user.orders[idx];
   
   await sendAdminOrderCancelledEmail({
    adminEmail,
    orderId: String(orderId),
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    total: order?.total || 0,
    orderDate: order?.date || order?.createdAt,
    items: order?.items || [],
    addressSummary: order?.addressSummary || "",
   });
  } catch (e) {
   console.error('[ORDER CANCEL] Admin email exception:', e);
   // mail hatası sipariş iptalini bozmasın
  }

  return NextResponse.json({ success: true, message: "Sipariş iptal edildi" });
 } catch (error) {
  console.error("Order cancel error:", error);
  return NextResponse.json(
   { success: false, message: "Sipariş iptal edilemedi", error: error.message },
   { status: 500 }
  );
 }
}

