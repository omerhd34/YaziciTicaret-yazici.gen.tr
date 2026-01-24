import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Iyzipay from 'iyzipay';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user-session');

  if (!sessionCookie || !sessionCookie.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı' },
    { status: 401 }
   );
  }

  let session;
  try {
   session = JSON.parse(sessionCookie.value);
  } catch {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!session?.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  const body = await request.json();
  const { paymentId, conversationId, conversationData, orderId } = body || {};

  if (!paymentId || !orderId) {
   return NextResponse.json(
    { success: false, message: 'Eksik bilgi (paymentId ve orderId gerekli)' },
    { status: 400 }
   );
  }

  const iyzicoApiKey = process.env.IYZICO_API_KEY;
  const iyzicoSecretKey = process.env.IYZICO_SECRET_KEY;
  const iyzicoUri = process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com';

  if (!iyzicoApiKey || !iyzicoSecretKey || iyzicoApiKey === 'your_api_key_here' || iyzicoSecretKey === 'your_secret_key_here') {
   return NextResponse.json(
    { success: false, message: 'Ödeme sistemi yapılandırılmamış' },
    { status: 500 }
   );
  }

  // iyzico client'ı oluştur
  const iyzipay = new Iyzipay({
   apiKey: iyzicoApiKey,
   secretKey: iyzicoSecretKey,
   uri: iyzicoUri
  });

  // Kullanıcıyı bul ve siparişi güncelle
  const user = await User.findById(session.id);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  // Siparişi bul
  const order = user.orders?.find(o => o.orderId === orderId);
  if (!order) {
   return NextResponse.json(
    { success: false, message: 'Sipariş bulunamadı' },
    { status: 404 }
   );
  }

  // iyzico Auth 3DS request
  const iyzicoRequest = {
   locale: 'tr',
   paymentId: paymentId,
   conversationId: conversationId || orderId,
   conversationData: conversationData || ''
  };

  // iyzico Auth 3DS API çağrısı (Promise wrapper)
  return new Promise((resolve) => {
   iyzipay.threedsPayment.create(iyzicoRequest, async (err, result) => {
    if (err) {
     console.error('iyzico 3D Secure auth hatası:', err);
     
     // Kullanıcıyı bul ve siparişi güncelle
     const user = await User.findById(session.id);
     if (user) {
      const updateData = {
       $set: {
        'orders.$.status': 'Ödeme Başarısız',
        'orders.$.payment': {
         type: '3dsecure',
         error: err.message || 'Ödeme işlemi başarısız',
         failedAt: new Date(),
        },
        'orders.$.updatedAt': new Date(),
       },
      };
      await User.updateOne(
       { _id: user._id, 'orders.orderId': orderId },
       updateData
      );
     }

     resolve(NextResponse.json(
      {
       success: false,
       message: err.message || 'Ödeme işlemi başarısız',
       error: err
      },
      { status: 400 }
     ));
     return;
    }

    // Kullanıcıyı bul ve siparişi güncelle
    const user = await User.findById(session.id);
    if (!user) {
     resolve(NextResponse.json(
      { success: false, message: 'Kullanıcı bulunamadı' },
      { status: 404 }
     ));
     return;
    }

    // Siparişi bul
    const order = user.orders?.find(o => o.orderId === orderId);
    if (!order) {
     resolve(NextResponse.json(
      { success: false, message: 'Sipariş bulunamadı' },
      { status: 404 }
     ));
     return;
    }

    if (result.status === 'success') {
     // Ödeme başarılı
     const updateData = {
      $set: {
       'orders.$.status': 'Ödeme Alındı',
       'orders.$.payment': {
        type: '3dsecure',
        transactionId: result.paymentId,
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        cardType: result.cardType,
        cardAssociation: result.cardAssociation,
        cardFamily: result.cardFamily,
        binNumber: result.binNumber,
        lastFourDigits: result.lastFourDigits,
        paidAt: new Date(),
       },
       'orders.$.updatedAt': new Date(),
      },
     };

     await User.updateOne(
      { _id: user._id, 'orders.orderId': orderId },
      updateData
     );

     resolve(NextResponse.json({
      success: true,
      message: 'Ödeme başarıyla tamamlandı',
      transactionId: result.paymentId,
      orderId: orderId,
     }));
    } else {
     // Ödeme başarısız
     const updateData = {
      $set: {
       'orders.$.status': 'Ödeme Başarısız',
       'orders.$.payment': {
        type: '3dsecure',
        error: result.errorMessage || 'Ödeme işlemi başarısız',
        errorCode: result.errorCode,
        failedAt: new Date(),
       },
       'orders.$.updatedAt': new Date(),
      },
     };

     await User.updateOne(
      { _id: user._id, 'orders.orderId': orderId },
      updateData
     );

     resolve(NextResponse.json(
      {
       success: false,
       message: result.errorMessage || 'Ödeme işlemi başarısız',
       errorCode: result.errorCode
      },
      { status: 400 }
     ));
    }
   });
  });
 } catch (error) {
  console.error('3D Secure charge hatası:', error);
  return NextResponse.json(
   {
    success: false,
    message: error.response?.data?.message || 'Ödeme işlemi tamamlanamadı',
    error: error.message
   },
   { status: 500 }
  );
 }
}
