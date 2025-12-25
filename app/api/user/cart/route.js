import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// GET - Kullanıcının sepetindeki ürün ID'lerini getir
export async function GET() {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  let userData;
  try {
   userData = JSON.parse(session.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!userData || !userData.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  const user = await User.findById(userData.id).populate('cart');

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // Sepet populate edilmişse tam obje, değilse sadece ID
  // Frontend'de kullanmak için ID'leri döndür
  const cartIds = (user.cart || []).map(item => {
   if (item && item._id) {
    return item._id.toString();
   }
   return item ? item.toString() : null;
  }).filter(Boolean);

  return NextResponse.json({
   success: true,
   cart: cartIds,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Sepet getirilemedi', error: error.message },
   { status: 500 }
  );
 }
}

// POST - Sepete ürün ekle
export async function POST(request) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  let userData;
  try {
   userData = JSON.parse(session.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!userData || !userData.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  const body = await request.json();
  const { productId } = body;

  if (!productId) {
   return NextResponse.json(
    { success: false, message: 'Ürün ID gereklidir' },
    { status: 400 }
   );
  }

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // Ürün zaten sepetde mi kontrol et
  if (user.cart && user.cart.includes(productId)) {
   return NextResponse.json({
    success: true,
    message: 'Ürün zaten sepetinizde',
    cart: user.cart,
   });
  }

  // Sepete ekle
  if (!user.cart) {
   user.cart = [];
  }
  user.cart.push(productId);
  await user.save();

  return NextResponse.json({
   success: true,
   message: 'Ürün sepete eklendi',
   cart: user.cart,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Sepete eklenemedi', error: error.message },
   { status: 500 }
  );
 }
}

// DELETE - Sepetten ürün çıkar
export async function DELETE(request) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  let userData;
  try {
   userData = JSON.parse(session.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!userData || !userData.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
   return NextResponse.json(
    { success: false, message: 'Ürün ID gereklidir' },
    { status: 400 }
   );
  }

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // Sepetten çıkar
  if (user.cart) {
   user.cart = user.cart.filter(
    cartId => cartId.toString() !== productId.toString()
   );
   await user.save();
  }

  return NextResponse.json({
   success: true,
   message: 'Ürün sepetten çıkarıldı',
   cart: user.cart || [],
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Sepetten çıkarılamadı', error: error.message },
   { status: 500 }
  );
 }
}

// PUT - Sepeti tamamen güncelle (tüm ürün ID'lerini gönder)
export async function PUT(request) {
 try {
  await dbConnect();

  const cookieStore = await cookies();
  const session = cookieStore.get('user-session');

  if (!session || !session.value) {
   return NextResponse.json(
    { success: false, message: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  let userData;
  try {
   userData = JSON.parse(session.value);
  } catch (parseError) {
   return NextResponse.json(
    { success: false, message: 'Oturum hatası. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  if (!userData || !userData.id) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 401 }
   );
  }

  const body = await request.json();
  const { productIds } = body;

  if (!Array.isArray(productIds)) {
   return NextResponse.json(
    { success: false, message: 'Ürün ID listesi gereklidir' },
    { status: 400 }
   );
  }

  const user = await User.findById(userData.id);

  if (!user) {
   return NextResponse.json(
    { success: false, message: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.' },
    { status: 404 }
   );
  }

  // Sepeti güncelle
  user.cart = productIds;
  await user.save();

  return NextResponse.json({
   success: true,
   message: 'Sepet güncellendi',
   cart: user.cart || [],
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Sepet güncellenemedi', error: error.message },
   { status: 500 }
  );
 }
}

