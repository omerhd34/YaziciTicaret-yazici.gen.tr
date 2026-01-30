import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

async function requireAdmin() {
 const cookieStore = await cookies();
 const session = cookieStore.get("admin-session");
 return session && session.value === "authenticated";
}

export async function GET(request, { params }) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json({ success: false, message: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();

  const resolvedParams = await params;
  const { id } = resolvedParams || {};
  if (!id) {
   return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 400 });
  }

  const user = await User.findById(id).lean();
  if (!user) {
   return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // Hassas alanları döndürme
  const safe = {
   id: user._id,
   name: user.name,
   email: user.email,
   phone: user.phone || "",
   addresses: Array.isArray(user.addresses) ? user.addresses : [],
   orders: Array.isArray(user.orders)
    ? user.orders.map((o) => ({
     orderId: o.orderId,
     status: o.status,
     total: o.total,
     date: o.date,
    }))
    : [],
   favoritesCount: Array.isArray(user.favorites) ? user.favorites.length : 0,
   createdAt: user.createdAt,
  };

  return NextResponse.json({ success: true, user: safe });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: "Kullanıcı getirilemedi", error: error.message },
   { status: 500 }
  );
 }
}

