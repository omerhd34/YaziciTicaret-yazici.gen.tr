import crypto from 'node:crypto';

/**
 * İyzico REST API Helper
 * Native Node.js ile iyzico API çağrıları yapar
 */
export class IyzicoClient {
 constructor(config) {
  this.apiKey = config.apiKey;
  this.secretKey = config.secretKey;
  this.uri = config.uri || 'https://sandbox-api.iyzipay.com';
 }

 /**
  * Random string oluştur (Iyzico dokümantasyon formatı)
  */
 generateRandomString() {
  // Iyzico dokümantasyon formatı: timestamp + random
  return Date.now().toString() + Math.random().toString().slice(2, 11);
 }

 /**
  * Authorization header oluştur (IYZWSv2 formatı - Iyzico dokümantasyon)
  * https://docs.iyzico.com/en/getting-started/preliminaries/authentication/hmacsha256-auth
  */
 generateAuthorizationHeaderV2(endpoint, requestBody, randomString) {
  // 1. Signature: HMACSHA256(randomKey + uri.path + request.body, secretKey)
  const bodyString = JSON.stringify(requestBody);
  const payload = randomString + endpoint + bodyString;

  const signature = crypto
   .createHmac('sha256', this.secretKey)
   .update(payload)
   .digest('hex');

  // 2. Authorization String: apiKey:xxx&randomKey:xxx&signature:xxx
  const authorizationString = `apiKey:${this.apiKey}&randomKey:${randomString}&signature:${signature}`;

  // 3. Base64 Encode
  const base64EncodedAuthorization = Buffer.from(authorizationString).toString('base64');

  // 4. Final Header: IYZWSv2 base64EncodedAuthorization
  return `IYZWSv2 ${base64EncodedAuthorization}`;
 }

 /**
  * HTTP request gönder
  */
 async request(endpoint, body) {
  const url = `${this.uri}${endpoint}`;

  // Random string oluştur
  const randomString = this.generateRandomString();

  // Authorization header'ı oluştur (IYZWSv2 formatı)
  const authorization = this.generateAuthorizationHeaderV2(endpoint, body, randomString);

  try {
   const response = await fetch(url, {
    method: 'POST',
    headers: {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     'Authorization': authorization,
     'x-iyzi-rnd': randomString, // Iyzico dokümantasyonuna göre gerekli
     'x-iyzi-client-version': 'node.js-1.0.0'
    },
    body: JSON.stringify(body)
   });

   const data = await response.json();

   return data;
  } catch (error) {
   throw error;
  }
 }

 /**
  * 3D Secure Initialize
  */
 async threedsInitialize(requestData) {
  return await this.request('/payment/3dsecure/initialize', requestData);
 }

 /**
  * 3D Secure Auth (Charge)
  */
 async threedsAuth(requestData) {
  return await this.request('/payment/3dsecure/auth', requestData);
 }

 /**
  * Ödeme sorgulama
  */
 async retrievePayment(requestData) {
  return await this.request('/payment/detail', requestData);
 }
}

/**
 * İyzico client instance oluştur
 */
export function createIyzicoClient() {
 const apiKey = process.env.IYZICO_API_KEY;
 const secretKey = process.env.IYZICO_SECRET_KEY;
 const uri = process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com';

 if (!apiKey || !secretKey || apiKey === 'your_api_key_here' || secretKey === 'your_secret_key_here') {
  throw new Error('İyzico API anahtarları yapılandırılmamış');
 }

 return new IyzicoClient({
  apiKey,
  secretKey,
  uri
 });
}
