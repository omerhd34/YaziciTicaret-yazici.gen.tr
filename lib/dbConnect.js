import mongoose from 'mongoose';

function getMongoUri() {
 return process.env.MONGODB_URI || '';
}

let cached = global.mongoose;

if (!cached) {
 cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
 const MONGODB_URI = getMongoUri();
 if (!MONGODB_URI) {
  throw new Error(
   'MongoDB bağlantısı yok. .env.local içine MONGODB_URI="mongodb://..." ekleyin.'
  );
 }

 if (cached.conn) {
  return cached.conn;
 }

 if (!cached.promise) {
  const opts = {
   bufferCommands: false,
  };

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
   return mongoose;
  });
 }
 cached.conn = await cached.promise;
 return cached.conn;
}

export default dbConnect;