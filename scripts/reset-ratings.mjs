import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
 const envFile = fs.readFileSync(envPath, 'utf8');
 envFile.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
   const key = match[1].trim();
   const value = match[2].trim().replace(/^["']|["']$/g, '');
   process.env[key] = value;
  }
 });
}

const ProductSchema = new mongoose.Schema(
 { rating: Number, reviewCount: Number, ratings: Array },
 { strict: false }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

try {
 const mongoUri = process.env.MONGODB_URI;
 if (!mongoUri) {
  console.error('MONGODB_URI bulunamadı (.env.local kontrol edin).');
  process.exit(1);
 }

 await mongoose.connect(mongoUri);

 const result = await Product.updateMany(
  {},
  { $set: { rating: 0, reviewCount: 0, ratings: [] } }
 );

 console.log('Ürün puanlamaları sıfırlandı.');
 console.log('Güncellenen ürün sayısı:', result.modifiedCount);

 await mongoose.disconnect();
} catch (error) {
 console.error('Hata:', error.message);
 await mongoose.disconnect().catch(() => { });
 process.exit(1);
}
