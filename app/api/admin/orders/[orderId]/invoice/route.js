import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { buildInvoiceHtml, canShowInvoice } from '@/lib/invoice';

async function requireAdmin() {
 const cookieStore = await cookies();
 const session = cookieStore.get('admin-session');
 return session && session.value === 'authenticated';
}

export async function GET(request, { params }) {
 try {
  if (!(await requireAdmin())) {
   return new NextResponse('<html><body><p>Yetkisiz. Lütfen admin olarak giriş yapın.</p></body></html>', {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  await dbConnect();

  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;
  if (!orderId) {
   return new NextResponse('<html><body><p>Sipariş bulunamadı.</p></body></html>', {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const user = await User.findOne({ 'orders.orderId': String(orderId) }).select('name orders').lean();
  if (!user) {
   return new NextResponse('<html><body><p>Sipariş bulunamadı.</p></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const order = (user.orders || []).find((o) => o.orderId === String(orderId));
  if (!order) {
   return new NextResponse('<html><body><p>Sipariş bulunamadı.</p></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  if (!canShowInvoice(order.status)) {
   return new NextResponse('<html><body><p>Bu sipariş için fatura henüz görüntülenemez. Sipariş durumu Kargoya Verildi veya Teslim Edildi olduğunda fatura açılır.</p></body></html>', {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const html = buildInvoiceHtml({ order, userName: user.name });
  return new NextResponse(html, {
   status: 200,
   headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
 } catch (error) {
  return new NextResponse('<html><body><p>Fatura yüklenirken hata oluştu.</p></body></html>', {
   status: 500,
   headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
 }
}
