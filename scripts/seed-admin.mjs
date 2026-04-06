import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
 const envPath = path.join(__dirname, '..', '.env.local');
 if (!fs.existsSync(envPath)) return;
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

function hashPassword(plain) {
 return Buffer.from(plain).toString('base64');
}

async function main() {
 loadEnv();
 const uri = process.env.MONGODB_URI || '';
 if (!uri) {
  console.error('MONGODB_URI yok (.env.local).');
  process.exit(1);
 }

 const username = (process.argv[2] || '').trim();
 const password = process.argv[3] || '';
 if (!username || !password) {
  console.error('Kullanım: node scripts/seed-admin.mjs <kullanici-adi> <sifre>');
  console.error('Örnek:  npm run seed-admin -- yazici "GucluSifre123"');
  process.exit(1);
 }

 await mongoose.connect(uri);
 const hashed = hashPassword(password);

 const doc = await Admin.findOneAndUpdate(
  { username },
  {
   $set: {
    password: hashed,
    role: 'admin',
   },
   $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true, new: true, runValidators: true }
 );

 console.log(`Tamam: "${doc.username}" kaydı eklendi veya güncellendi (Atlas’ta koleksiyon: admins).`);
 await mongoose.disconnect();
}

main().catch(async (e) => {
 console.error(e);
 await mongoose.disconnect().catch(() => { });
 process.exit(1);
});
