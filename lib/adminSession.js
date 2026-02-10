import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_PAYLOAD = "authenticated";
const COOKIE_NAME = "admin-session";

function getSecret() {
 const secret = process.env.ADMIN_SESSION_SECRET;
 if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("ADMIN_SESSION_SECRET env değişkeni production için zorunludur.");
 }
 return secret || "dev-only-default-secret-change-in-production";
}

export function createSignedToken() {
 const secret = getSecret();
 const hmac = createHmac("sha256", secret).update(TOKEN_PAYLOAD).digest("hex");
 return `${TOKEN_PAYLOAD}.${hmac}`;
}

export function verifySignedToken(value) {
 if (!value || typeof value !== "string") return false;
 const parts = value.split(".");
 if (parts.length !== 2 || parts[0] !== TOKEN_PAYLOAD) return false;
 const expectedHmac = createHmac("sha256", getSecret()).update(TOKEN_PAYLOAD).digest("hex");
 try {
  return timingSafeEqual(Buffer.from(parts[1], "hex"), Buffer.from(expectedHmac, "hex"));
 } catch {
  return false;
 }
}

export function isAdminAuthenticated(cookieStore) {
 const session = cookieStore.get(COOKIE_NAME);
 return !!(session?.value && verifySignedToken(session.value));
}

export { COOKIE_NAME };
