const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

const UserSchema = new mongoose.Schema(
 { orders: Array, tempOrders: Array },
 { strict: false }
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetOrders() {
 try {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
   console.error('MONGODB_URI bulunamadı (.env.local kontrol edin).');
   process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const result = await User.updateMany(
   {},
   { $set: { orders: [], tempOrders: [] } }
  );

  console.log('Siparişler sıfırlandı.');
  console.log('Güncellenen kullanıcı sayısı:', result.modifiedCount);

  await mongoose.disconnect();
 } catch (error) {
  console.error('Hata:', error.message);
  await mongoose.disconnect().catch(() => { });
  process.exit(1);
 }
}

resetOrders();
