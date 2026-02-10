import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import ProductRequest from '@/models/ProductRequest';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { sendProductRequestApprovedEmail, sendProductRequestRejectedEmail } from '@/lib/email';
import { isAdminAuthenticated } from '@/lib/adminSession';

async function requireAdmin() {
 const cookieStore = await cookies();
 return isAdminAuthenticated(cookieStore);
}

export async function GET(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit')) || 50;
  const page = parseInt(searchParams.get('page')) || 1;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) {
   filter.status = status;
  }

  const allRequests = await ProductRequest.find(filter)
   .populate('userId', 'name email _id')
   .populate('respondedBy', 'username')
   .sort({ createdAt: -1 })
   .lean();

  const validUserIds = new Set();
  const userIdsToCheck = allRequests
   .map(req => req.userId)
   .filter(id => id !== null && id !== undefined)
   .map(id => typeof id === 'object' ? (id._id || id) : id);

  if (userIdsToCheck.length > 0) {
   const validUsers = await User.find({ _id: { $in: userIdsToCheck } }).select('_id').lean();
   validUsers.forEach(user => validUserIds.add(user._id.toString()));
  }

  const validRequests = allRequests.filter(req => {
   if (!req.userId) return true;
   const userIdStr = typeof req.userId === 'object' ? (req.userId._id?.toString() || req.userId.toString()) : req.userId.toString();
   return validUserIds.has(userIdStr);
  });

  const requests = validRequests.slice(skip, skip + limit);

  const total = validRequests.length;

  const [pendingCount, approvedCount, rejectedCount, cancelledCount] = [
   validRequests.filter(r => r.status === 'Beklemede').length,
   validRequests.filter(r => r.status === 'Onaylandı').length,
   validRequests.filter(r => r.status === 'Reddedildi').length,
   validRequests.filter(r => r.status === 'İptal Edildi').length,
  ];

  return NextResponse.json({
   success: true,
   requests,
   pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
   },
   stats: {
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    cancelled: cancelledCount,
    total: total,
   },
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'İstekler getirilemedi' },
   { status: 500 }
  );
 }
}

// PATCH - İsteğe cevap ver
export async function PATCH(request) {
 try {
  if (!(await requireAdmin())) {
   return NextResponse.json(
    { success: false, message: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const body = await request.json();
  const { id, status, adminResponse } = body;

  if (!id) {
   return NextResponse.json(
    { success: false, message: 'İstek ID gereklidir' },
    { status: 400 }
   );
  }

  if (!status) {
   return NextResponse.json(
    { success: false, message: 'Durum gereklidir' },
    { status: 400 }
   );
  }

  const validStatuses = ['Beklemede', 'Onaylandı', 'Reddedildi', 'İptal Edildi'];
  if (!validStatuses.includes(status)) {
   return NextResponse.json(
    { success: false, message: 'Geçersiz durum' },
    { status: 400 }
   );
  }

  await dbConnect();

  // Admin bilgisini al
  const cookieStore = await cookies();
  let adminId = null;

  if (isAdminAuthenticated(cookieStore)) {
   const admin = await Admin.findOne();
   if (admin) {
    adminId = admin._id;
   }
  }

  // İsteği güncelle
  const updateData = {
   status,
   respondedAt: new Date(),
   respondedBy: adminId,
  };

  if (adminResponse) {
   updateData.adminResponse = adminResponse.trim();
  }

  const productRequest = await ProductRequest.findByIdAndUpdate(
   id,
   updateData,
   { new: true }
  )
   .populate('userId', 'name email')
   .populate('respondedBy', 'username')
   .lean();

  if (!productRequest) {
   return NextResponse.json(
    { success: false, message: 'İstek bulunamadı' },
    { status: 404 }
   );
  }

  // Durum değişikliğine göre müşteriye e-posta gönder
  try {
   if (status === 'Onaylandı') {
    await sendProductRequestApprovedEmail({
     name: productRequest.name,
     email: productRequest.email,
     productName: productRequest.productName,
     brand: productRequest.brand || '',
     model: productRequest.model || '',
    });
   } else if (status === 'Reddedildi') {
    await sendProductRequestRejectedEmail({
     name: productRequest.name,
     email: productRequest.email,
     productName: productRequest.productName,
     brand: productRequest.brand || '',
     model: productRequest.model || '',
    });
   }
  } catch (emailError) {
   // E-posta hatası olsa bile istek güncellendi
  }

  return NextResponse.json({
   success: true,
   message: 'İstek güncellendi',
   request: productRequest,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'İstek güncellenemedi' },
   { status: 500 }
  );
 }
}

