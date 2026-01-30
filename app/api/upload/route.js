import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
 try {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
   return NextResponse.json(
    { success: false, message: 'Dosya bulunamadı' },
    { status: 400 }
   );
  }

  // File'ı buffer'a çevir
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Base64'e çevir
  const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

  const folder = formData.get('folder') === 'returns' ? 'e-ticaret/returns' : 'e-ticaret/products';

  // Cloudinary'ye yükle
  const result = await cloudinary.uploader.upload(base64File, {
   folder,
   resource_type: 'auto',
  });

  return NextResponse.json({
   success: true,
   url: result.secure_url,
   publicId: result.public_id,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Yükleme başarısız', error: error.message },
   { status: 500 }
  );
 }
}

// Resim silme
export async function DELETE(request) {
 try {
  const { publicId } = await request.json();

  if (!publicId) {
   return NextResponse.json(
    { success: false, message: 'Public ID gerekli' },
    { status: 400 }
   );
  }

  await cloudinary.uploader.destroy(publicId);

  return NextResponse.json({
   success: true,
   message: 'Resim silindi',
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Silme başarısız' },
   { status: 500 }
  );
 }
}

