import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

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

async function main() {
 loadEnv();
 const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
 if (!uri) {
  console.error('MONGODB_URI veya DATABASE_URL yok (.env.local).');
  process.exit(1);
 }

 await mongoose.connect(uri);
 const result = await Product.deleteMany({});
 console.log(`Silinen ürün: ${result.deletedCount}`);
 await mongoose.disconnect();
}

main().catch(async (e) => {
 console.error(e);
 await mongoose.disconnect().catch(() => { });
 process.exit(1);
});
