import { NextResponse } from 'next/server';
import { createIyzicoClient } from '@/lib/iyzico';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';

// Route handler'ın çalışıp çalışmadığını kontrol et
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Iyzico callback handler - POST ve GET request'leri handle eder
 * Iyzico callback'i genellikle GET ile gelir ama bazı durumlarda POST da gönderebilir
 */
export async function GET(request) {
 try {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');
  const conversationId = searchParams.get('conversationId');
  const conversationData = searchParams.get('conversationData');
  const orderId = searchParams.get('orderId');

  // Parametreleri callback sayfasına yönlendir
  const params = new URLSearchParams();
  if (paymentId) params.set('paymentId', paymentId);
  if (conversationId) params.set('conversationId', conversationId);
  if (conversationData) params.set('conversationData', conversationData);
  if (orderId) params.set('orderId', orderId);

  // Absolute URL oluştur
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
  const redirectUrl = `${baseUrl}/odeme-callback?${params.toString()}`;

  // HTML ile redirect (daha güvenilir)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Yönlendiriliyor...</title>
      <meta http-equiv="refresh" content="0;url=${redirectUrl}">
      <script>
        window.location.href = "${redirectUrl}";
      </script>
    </head>
    <body>
      <p>Yönlendiriliyor... Eğer yönlendirilmediyseniz <a href="${redirectUrl}">buraya tıklayın</a>.</p>
    </body>
    </html>
  `;

  return new NextResponse(html, {
   status: 200,
   headers: {
    'Content-Type': 'text/html; charset=utf-8',
   },
  });
 } catch (error) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
  return NextResponse.redirect(`${baseUrl}/odeme-callback`);
 }
}

export async function POST(request) {
 try {
  const { searchParams } = new URL(request.url);
  let paymentId = searchParams.get('paymentId');
  let conversationId = searchParams.get('conversationId');
  let conversationData = searchParams.get('conversationData');
  let orderId = searchParams.get('orderId');

  // Content-Type kontrolü
  const contentType = request.headers.get('content-type') || '';

  // Önce form data kontrolü (Iyzico genellikle form-urlencoded gönderir)
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data') || !contentType.includes('application/json')) {
   try {
    const formData = await request.formData();

    // Form data'dan parametreleri al
    paymentId = formData.get('paymentId') || formData.get('payment_id') || paymentId;
    conversationId = formData.get('conversationId') || formData.get('conversation_id') || conversationId;
    conversationData = formData.get('conversationData') || formData.get('conversation_data') || conversationData;
    orderId = formData.get('orderId') || formData.get('order_id') || orderId;
   } catch (e) {
    // Form data parse edilemezse, raw body'yi oku
    try {
     const text = await request.text();
     // URL encoded string'i parse et
     const params = new URLSearchParams(text);
     paymentId = params.get('paymentId') || params.get('payment_id') || paymentId;
     conversationId = params.get('conversationId') || params.get('conversation_id') || conversationId;
     conversationData = params.get('conversationData') || params.get('conversation_data') || conversationData;
     orderId = params.get('orderId') || params.get('order_id') || orderId;
    } catch (_) { }
   }
  }
  // JSON body kontrolü
  else if (contentType.includes('application/json')) {
   try {
    const body = await request.json();
    paymentId = body.paymentId || body.payment_id || paymentId;
    conversationId = body.conversationId || body.conversation_id || conversationId;
    conversationData = body.conversationData || body.conversation_data || conversationData;
    orderId = body.orderId || body.order_id || orderId;
   } catch (_) { }
  }

  // Eğer orderId yoksa, callback sayfasına yönlendir
  if (!orderId) {
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
   const redirectUrl = `${baseUrl}/odeme-callback?paymentId=${paymentId || ''}&conversationId=${conversationId || ''}&conversationData=${conversationData || ''}`;
   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Yönlendiriliyor...</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Yönlendiriliyor...</p></body></html>`;
   return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  // Siparişi direkt olarak işle (callback sayfasına yönlendirme yapmadan)
  await dbConnect();

  // orderId'den kullanıcıyı bul
  const user = await User.findOne({ 'orders.orderId': orderId });
  if (!user) {
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
   const redirectUrl = `${baseUrl}/odeme-callback?paymentId=${paymentId || ''}&conversationId=${conversationId || ''}&orderId=${orderId}`;
   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Yönlendiriliyor...</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Yönlendiriliyor...</p></body></html>`;
   return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  // Iyzico client'ı oluştur
  const iyzico = createIyzicoClient();

  // Iyzico Auth 3DS request
  const iyzicoRequest = {
   locale: 'tr',
   paymentId: paymentId,
   conversationId: conversationId || orderId,
   conversationData: conversationData || ''
  };

  // Iyzico Auth 3DS API çağrısı
  const result = await iyzico.threedsAuth(iyzicoRequest);

  // Kullanıcıyı tekrar bul ve siparişi güncelle
  const userRefresh = await User.findById(user._id);
  if (!userRefresh) {
   throw new Error('Kullanıcı bulunamadı');
  }

  const orderRefresh = userRefresh.orders?.find(o => o.orderId === orderId);
  if (!orderRefresh) {
   throw new Error('Sipariş bulunamadı');
  }

  // Çift ödeme koruması: Sipariş zaten ödendi mi kontrol et (race condition koruması)
  if (orderRefresh.payment?.paidAt || orderRefresh.status !== 'Ödeme Bekleniyor') {
   // Zaten ödendi, başarılı sayfasına yönlendir
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
   const redirectUrl = `${baseUrl}/odeme-callback?paymentId=${paymentId}&conversationId=${conversationId}&orderId=${orderId}&success=true`;
   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ödeme Başarılı</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Ödeme zaten tamamlanmış. Yönlendiriliyorsunuz...</p></body></html>`;
   return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];

  const mdStatus = result?.mdStatus !== undefined ? Number(result.mdStatus) : null;
  const fraudStatus = result?.fraudStatus !== undefined ? Number(result.fraudStatus) : null;
  const is3dsOk = mdStatus === null ? (result.status === 'success') : (result.status === 'success' && mdStatus === 1);

  if (is3dsOk) {
   // Ödeme başarılı - durumu güncelle
   const updateData = {
    $set: {
     'orders.$.status': 'Beklemede',
     'orders.$.payment': {
      type: '3dsecure',
      transactionId: result.paymentId,
      paymentId: result.paymentId,
      conversationId: result.conversationId,
      mdStatus: mdStatus,
      fraudStatus: fraudStatus,
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
    { _id: userRefresh._id, 'orders.orderId': orderId },
    updateData
   );

   // Stokları azalt
   const stockUpdateErrors = [];
   try {
    for (const item of orderRefresh.items) {
     const productId = item.productId;
     const quantity = Number(item.quantity || 1);

     if (productId) {
      try {
       const product = await Product.findById(productId);
       if (!product) {
        stockUpdateErrors.push(`Ürün bulunamadı: ${item.name || productId}`);
        continue;
       }

       // Stok kontrolü (double-check)
       if (product.stock < quantity) {
        stockUpdateErrors.push(`Yetersiz stok: ${item.name || product.name}`);
        continue;
       }

       await Product.findByIdAndUpdate(productId, { $inc: { soldCount: quantity, stock: -quantity } }, { new: true });

       if (item.color && product.colors && Array.isArray(product.colors)) {
        const colorName = String(item.color).trim();
        const colorOption = product.colors.find(c => String(c.name).trim() === colorName);
        if (colorOption && colorOption.stock < quantity) {
         stockUpdateErrors.push(`Yetersiz renk stoku: ${item.name || product.name} - ${colorName}`);
         continue;
        }
        await Product.updateOne({ _id: productId, 'colors.name': colorName }, { $inc: { 'colors.$.stock': -quantity } });
       }
      } catch (itemError) {
       stockUpdateErrors.push(`Stok güncelleme hatası: ${item.name || productId}`);
      }
     }
    }

    if (stockUpdateErrors.length > 0) {
     console.error('Stok güncelleme hataları:', stockUpdateErrors);
    }
   } catch (stockError) {
    console.error('Stok güncelleme genel hatası:', stockError);
   }

   // E-posta gönderilmiyor (mail gitmesin kimseye)

   // Başarılı sayfasına yönlendir
   const redirectUrl = `${baseUrl}/odeme-callback?paymentId=${paymentId}&conversationId=${conversationId}&orderId=${orderId}&success=true`;
   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ödeme Başarılı</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Ödeme başarılı! Yönlendiriliyorsunuz...</p></body></html>`;
   return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } else {
   // Ödeme başarısız
   const mdStatusText = mdStatus !== null ? ` (mdStatus: ${mdStatus})` : '';
   const fraudText = fraudStatus !== null ? ` (fraudStatus: ${fraudStatus})` : '';
   const failMessage = result.errorMessage || `3D Secure doğrulaması başarısız${mdStatusText}${fraudText}`;
   const updateData = {
    $set: {
     'orders.$.status': 'Ödeme Başarısız',
     'orders.$.payment': {
      type: '3dsecure',
      error: failMessage,
      mdStatus: mdStatus,
      fraudStatus: fraudStatus,
      errorCode: result.errorCode,
      failedAt: new Date(),
     },
     'orders.$.updatedAt': new Date(),
    },
   };

   await User.updateOne(
    { _id: userRefresh._id, 'orders.orderId': orderId },
    updateData
   );

   const redirectUrl = `${baseUrl}/odeme-callback?paymentId=${paymentId}&conversationId=${conversationId}&orderId=${orderId}&success=false&error=${encodeURIComponent(failMessage)}`;
   const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ödeme Başarısız</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Ödeme başarısız. Yönlendiriliyorsunuz...</p></body></html>`;
   return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
 } catch (error) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.url.split('/api')[0];
  const redirectUrl = `${baseUrl}/odeme-callback?error=${encodeURIComponent(error.message || 'Beklenmeyen bir hata oluştu')}`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hata</title><script>window.location.href="${redirectUrl}";</script></head><body><p>Hata oluştu. Yönlendiriliyorsunuz...</p></body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
 }
}