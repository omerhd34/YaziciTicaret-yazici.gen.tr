// Kart tipi tespiti
const DEFAULT_CARD_FORMAT = /(\d{1,4})/g;

export const CARD_TYPES = [
 {
  displayName: "Visa",
  type: "visa",
  icon: "/visa.png",
  startPattern: /^4/,
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: { name: "CVV", length: 3 },
 },
 {
  displayName: "Mastercard",
  type: "mastercard",
  icon: "/mastercard.webp",
  startPattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: { name: "CVC", length: 3 },
 },
 {
  displayName: "American Express",
  type: "amex",
  icon: "/amex.png",
  startPattern: /^3[47]/,
  gaps: [4, 10],
  lengths: [15],
  code: { name: "CID", length: 4 },
 },
 {
  displayName: "Troy",
  type: "troy",
  icon: "/troy.png",
  startPattern: /^(9792|65)/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: { name: "CVV", length: 3 },
 },
];

export function getCardTypeByValue(value) {
 const cleaned = (value || "").replace(/\D/g, "");
 if (!cleaned) return null;
 return CARD_TYPES.find((ct) => ct.startPattern.test(cleaned)) || null;
}

export function getCardTypeByType(type) {
 return CARD_TYPES.find((ct) => ct.type === type) || null;
}

export { DEFAULT_CARD_FORMAT };
