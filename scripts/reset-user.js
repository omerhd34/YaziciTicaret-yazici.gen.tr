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

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetUsers() {
 try {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
   process.exit(1);
  }

  await mongoose.connect(mongoUri);
  await User.deleteMany({});
  await mongoose.disconnect();
 } catch (error) {
  await mongoose.disconnect().catch(() => { });
  process.exit(1);
 }
}

await resetUsers();
