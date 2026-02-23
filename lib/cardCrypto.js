import crypto from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 16;
const TAG_LEN = 16;
const KEY_LEN = 32;

function getKey() {
 const raw = process.env.CARD_ENCRYPTION_KEY || process.env.ENCRYPTION_SECRET || 'yazici-ticaret-card-key-32byte!!';
 const buf = Buffer.from(raw, 'utf8');
 if (buf.length >= KEY_LEN) return buf.subarray(0, KEY_LEN);
 return crypto.createHash('sha256').update(raw).digest();
}

export function encryptCardNumber(cardNumber) {
 if (!cardNumber || typeof cardNumber !== 'string') return '';
 const key = getKey();
 const iv = crypto.randomBytes(IV_LEN);
 const cipher = crypto.createCipheriv(ALGO, key, iv);
 const enc = Buffer.concat([
  cipher.update(cardNumber.replace(/\D/g, ''), 'utf8'),
  cipher.final(),
 ]);
 const tag = cipher.getAuthTag();
 return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptCardNumber(encrypted) {
 if (!encrypted || typeof encrypted !== 'string') return '';
 try {
  const key = getKey();
  const buf = Buffer.from(encrypted, 'base64');
  if (buf.length < IV_LEN + TAG_LEN + 1) return '';
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data) + decipher.final('utf8');
 } catch {
  return '';
 }
}
