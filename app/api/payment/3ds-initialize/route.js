import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createIyzicoClient } from '@/lib/iyzico';
import { getIyzicoUserMessage } from '@/lib/iyzicoErrorMessages';
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

  // Kullanıcıyı veritabanından al
  const user = await User.findById(session.id);
  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  const body = await request.json();
  const { amount, referenceNo, cardData, address, items } = body || {};

  if (!amount || !referenceNo || !cardData || !address) {
   return NextResponse.json(
    { success: false, message: 'Eksik bilgi' },
    { status: 400 }
   );
  }

  // Siparişi kontrol et ve tutarı doğrula
  const order = user.orders?.find(o => o.orderId === referenceNo);
  if (!order) {
   return NextResponse.json(
    { success: false, message: 'Sipariş bulunamadı' },
    { status: 404 }
   );
  }

  // Çift ödeme koruması: Sipariş zaten ödendi mi kontrol et
  if (order.payment?.paidAt || order.status !== 'Ödeme Bekleniyor') {
   return NextResponse.json(
    { success: false, message: 'Bu sipariş için ödeme zaten yapılmış' },
    { status: 400 }
   );
  }

  // Amount validasyonu: Client'tan gelen amount ile sipariş tutarı eşleşmeli
  const orderTotal = Number(order.total || 0);
  const clientAmount = Number(amount || 0);
  const amountDifference = Math.abs(orderTotal - clientAmount);

  // 0.01 TL tolerans (yuvarlama hataları için)
  if (amountDifference > 0.01) {
   return NextResponse.json(
    { success: false, message: `Ödeme tutarı sipariş tutarı ile eşleşmiyor. Beklenen: ${orderTotal.toFixed(2)} TL, Gönderilen: ${clientAmount.toFixed(2)} TL` },
    { status: 400 }
   );
  }

  // Stok kontrolü: Ödeme öncesi stok yeterliliği kontrol et
  const Product = (await import('@/models/Product')).default;
  try {
   for (const item of order.items || []) {
    const productId = item.productId;
    const quantity = Number(item.quantity || 1);

    if (productId) {
     const product = await Product.findById(productId);
     if (!product) {
      return NextResponse.json(
       { success: false, message: `Ürün bulunamadı: ${item.name || productId}` },
       { status: 404 }
      );
     }

     // Ana stok kontrolü
     if (product.stock < quantity) {
      return NextResponse.json(
       { success: false, message: `Yetersiz stok: ${item.name || product.name}. Mevcut stok: ${product.stock}, İstenen: ${quantity}` },
       { status: 400 }
      );
     }

     // Renk bazlı stok kontrolü
     if (item.color && product.colors && Array.isArray(product.colors)) {
      const colorName = String(item.color).trim();
      const colorOption = product.colors.find(c => String(c.name).trim() === colorName);
      if (colorOption && colorOption.stock < quantity) {
       return NextResponse.json(
        { success: false, message: `Yetersiz stok: ${item.name || product.name} - ${colorName}. Mevcut stok: ${colorOption.stock}, İstenen: ${quantity}` },
        { status: 400 }
       );
      }
     }
    }
   }
  } catch (stockError) {
   return NextResponse.json(
    { success: false, message: 'Stok kontrolü sırasında hata oluştu', error: stockError.message },
    { status: 500 }
   );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr';

  // iyzico client'ı oluştur
  let iyzico;
  try {
   iyzico = createIyzicoClient();
  } catch (error) {
   return NextResponse.json(
    { success: false, message: error.message || 'İyzico yapılandırma hatası' },
    { status: 500 }
   );
  }

  // Kart bilgilerini hazırla
  const cardNumber = cardData.cardNumber?.replace(/\s/g, '') || '';
  const cardHolderName = cardData.cardHolder || '';
  const expireMonth = String(cardData.month || '').padStart(2, '0');
  const expireYear = String(cardData.year || '').slice(-2);
  const cvc = cardData.cvc || '';

  // Sepet öğelerini hazırla
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const basketItems = orderItems.map((item, index) => {
   const qty = Number(item?.quantity || 1) || 1;
   const unit = Number(item?.price || 0) || 0;
   const lineTotal = Math.round(unit * qty * 100) / 100;
   return {
    id: String(item.productId || index),
    name: item.name || 'Ürün',
    category1: 'Genel',
    itemType: 'PHYSICAL',
    price: lineTotal.toFixed(2),
   };
  });

  // Kargo/fark satırı ekle (order.total ile basket toplamını eşitle)
  const basketSum = basketItems.reduce((sum, bi) => sum + (Number(bi.price) || 0), 0);
  const orderTotalRounded = Math.round(Number(orderTotal || 0) * 100) / 100;
  const diff = Math.round((orderTotalRounded - basketSum) * 100) / 100;
  if (Math.abs(diff) > 0.01) {
   if (diff > 0) {
    // Toplam daha büyükse kargo satırı ekle
    basketItems.push({
     id: 'shipping',
     name: 'Kargo',
     category1: 'Kargo',
     itemType: 'VIRTUAL',
     price: diff.toFixed(2),
    });
   } else {
    // basketSum orderTotal'den büyükse (negatif diff) son satırı azalt
    if (basketItems.length > 0) {
     const last = basketItems.at(-1);
     const patched = Math.round(((Number(last.price) || 0) + diff) * 100) / 100; // diff negatif
     last.price = Math.max(patched, 0.01).toFixed(2);
    }
   }
  } else if (Math.abs(diff) > 0) {
   // küçük yuvarlama farkını son satıra yansıt
   if (basketItems.length > 0) {
    const last = basketItems.at(-1);
    const patched = Math.round(((Number(last.price) || 0) + diff) * 100) / 100;
    last.price = Math.max(patched, 0.01).toFixed(2);
   }
  }

  // Alıcı bilgilerini hazırla
  const splitNameSurname = (fullName) => {
   const tokens = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
   if (tokens.length === 0) return { name: "", surname: "" };
   if (tokens.length === 1) return { name: tokens[0], surname: "" };
   return {
    name: tokens.slice(0, -1).join(" "),
    surname: tokens.at(-1),
   };
  };

  const { name: buyerNameFromAddress, surname: buyerSurnameFromAddress } = splitNameSurname(address?.fullName);
  const { name: buyerNameFromUser, surname: buyerSurnameFromUser } = splitNameSurname(user?.name);

  const buyerName = buyerNameFromAddress || buyerNameFromUser || "Müşteri";
  const buyerSurname = buyerSurnameFromAddress || buyerSurnameFromUser || "";

  // Client IP adresini al (localhost'u filtrele)
  const getClientIp = () => {
   // Önce proxy header'larını kontrol et
   const forwardedFor = request.headers.get('x-forwarded-for');
   if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    // localhost IP'lerini filtrele
    const realIp = ips.find(ip => ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('::ffff:127.0.0.1'));
    if (realIp) return realIp;
   }

   const realIp = request.headers.get('x-real-ip');
   if (realIp && realIp !== '127.0.0.1' && realIp !== '::1' && !realIp.startsWith('::ffff:127.0.0.1')) {
    return realIp;
   }
   // Son çare: gerçek IP alınamıyorsa localhost gönder
   return '127.0.0.1';
  };

  const clientIp = getClientIp();

  // Identity Number (TC Kimlik) - Profilden al, sandbox'ta yoksa test değeri kullan
  const iyzicoUri = String(process.env.IYZICO_URI || '');
  const isSandbox = iyzicoUri.includes('sandbox');
  const userTc = String(user.identityNumber || '').replace(/\D/g, '').trim();
  let identityNumber;
  if (userTc.length === 11) {
   identityNumber = userTc;
  } else if (isSandbox) {
   identityNumber = '74300864791';
  } else {
   return NextResponse.json(
    { success: false, message: 'Ödeme için Profil Bilgileri\'nden TC Kimlik No girmeniz gerekmektedir.' },
    { status: 400 }
   );
  }

  const formatIyzicoDate = (date) => {
   const d = new Date(date);
   const year = d.getFullYear();
   const month = String(d.getMonth() + 1).padStart(2, '0');
   const day = String(d.getDate()).padStart(2, '0');
   const hours = String(d.getHours()).padStart(2, '0');
   const minutes = String(d.getMinutes()).padStart(2, '0');
   const seconds = String(d.getSeconds()).padStart(2, '0');
   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const now = new Date();
  const registrationDate = user.createdAt ? formatIyzicoDate(user.createdAt) : formatIyzicoDate(now);
  const lastLoginDate = formatIyzicoDate(now);

  const registrationAddress = address.address ||
   (address.fullName ? `${address.fullName}, ${address.city || ''}`.trim() : '') ||
   `${address.city || 'Bursa'}, Türkiye`;

  const billingAddressData = address.billingAddress || address;

  const { name: billingNameFromAddress, surname: billingSurnameFromAddress } = splitNameSurname(billingAddressData?.fullName);
  const billingContactName = billingAddressData?.fullName
   ? `${billingNameFromAddress || ''} ${billingSurnameFromAddress || ''}`.trim()
   : (address.fullName || `${buyerName} ${buyerSurname}` || 'Müşteri').trim();

  const buyerCity = address.city || 'Bursa';
  const shippingCity = address.city || 'Bursa';
  const billingCity = billingAddressData.city || address.city || 'Bursa';

  const shippingContactName = (address.fullName || `${buyerName} ${buyerSurname}` || 'Müşteri').trim();
  const shippingAddressLine = (address.address || `${shippingCity}, Türkiye`).trim();

  const finalShippingAddress = shippingAddressLine || `${shippingCity}, Türkiye`;

  const billingAddressLine = (billingAddressData.address || address.address || `${billingCity}, Türkiye`).trim();
  const finalBillingAddress = billingAddressLine || `${billingCity}, Türkiye`;

  // iyzico Init 3DS request
  const iyzicoRequest = {
   locale: 'tr',
   conversationId: referenceNo,
   price: amount.toFixed(2),
   paidPrice: amount.toFixed(2),
   currency: 'TRY',
   installment: '1',
   paymentCard: {
    cardHolderName: cardHolderName,
    cardNumber: cardNumber,
    expireMonth: expireMonth,
    expireYear: expireYear,
    cvc: cvc,
    registerCard: '0'
   },
   buyer: {
    id: String(user._id || user.id || ''),
    name: buyerName,
    surname: buyerSurname,
    gsmNumber: address.phone || '',
    email: user.email || address.email || '',
    identityNumber: identityNumber,
    lastLoginDate: lastLoginDate,
    registrationDate: registrationDate,
    registrationAddress: registrationAddress,
    ip: clientIp,
    city: buyerCity,
    country: 'Türkiye',
    zipCode: ''
   },
   shippingAddress: {
    contactName: shippingContactName,
    city: shippingCity,
    country: 'Türkiye',
    address: finalShippingAddress,
    zipCode: ''
   },
   billingAddress: {
    contactName: billingContactName,
    city: billingCity,
    country: 'Türkiye',
    address: finalBillingAddress,
    zipCode: ''
   },
   basketItems: basketItems.length > 0 ? basketItems : [{
    id: '1',
    name: 'Sipariş',
    category1: 'Genel',
    itemType: 'PHYSICAL',
    price: amount.toFixed(2)
   }],
   callbackUrl: `${baseUrl}/api/payment/odeme-callback?orderId=${referenceNo}`
  };

  const result = await iyzico.threedsInitialize(iyzicoRequest);

  if (result.status === 'success' && (result.threeDSHtmlContent || result.htmlContent)) {
   let htmlContent = result.threeDSHtmlContent || result.htmlContent;

   // Iyzico HTML içeriğini base64 decode et (eğer base64 ise)
   try {
    // Base64 kontrolü: base64 string'ler genellikle sadece alfanumerik karakterler ve +, /, = içerir
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (base64Pattern.test(htmlContent.trim()) && htmlContent.length > 100) {
     // Base64 decode dene
     const decoded = Buffer.from(htmlContent, 'base64').toString('utf-8');
     if (decoded.includes('<html') || decoded.includes('<form')) {
      htmlContent = decoded;
     }
    }
   } catch (_) { }

   return NextResponse.json({
    success: true,
    htmlContent: htmlContent,
    conversationId: result.conversationId,
    paymentId: result.paymentId
   });
  } else {
   const userMessage = getIyzicoUserMessage(result, cardNumber);
   return NextResponse.json(
    {
     success: false,
     message: userMessage,
     errorCode: result.errorCode,
     errorGroup: result.errorGroup
    },
    { status: 400 }
   );
  }
 } catch (error) {
  return NextResponse.json(
   {
    success: false,
    message: error.response?.data?.message || 'Ödeme işlemi başlatılamadı',
    error: error.message
   },
   { status: 500 }
  );
 }
}
