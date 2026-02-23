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
   process.exit(1);
  }

  await mongoose.connect(mongoUri);

  await User.updateMany({}, { $set: { orders: [], tempOrders: [] } });

  await mongoose.disconnect();
  console.log('Siparişler sıfırlandı.');
 } catch (error) {
  console.error(error);
  await mongoose.disconnect().catch(() => { });
  process.exit(1);
 }
}

resetOrders()
 .then(() => process.exit(0))
 .catch(() => process.exit(1));
