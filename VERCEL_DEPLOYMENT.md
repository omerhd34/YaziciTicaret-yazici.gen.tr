# Vercel Deployment Rehberi - yazici.gen.tr

## ✅ Vercel'in Avantajları

1. **Next.js için optimize edilmiş** - En iyi performans
2. **Otomatik deployment** - Git push ile otomatik deploy
3. **Ücretsiz SSL** - Otomatik HTTPS
4. **Global CDN** - Hızlı yükleme süreleri
5. **Kolay kurulum** - 5 dakikada deploy
6. **Environment variables** - Kolay yönetim
7. **Preview deployments** - Her PR için test ortamı
8. **Otomatik scaling** - Trafiğe göre otomatik ölçeklendirme

## 🚀 Hızlı Başlangıç

### ADIM 1: Vercel Hesabı Oluştur

1. [vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. GitHub, GitLab veya Bitbucket ile giriş yapın (önerilir)

### ADIM 2: Projeyi Vercel'e Bağla

**Yöntem 1: Vercel CLI (Önerilen)**

```bash
# Vercel CLI'yi global olarak yükleyin
npm install -g vercel

# Proje klasörüne gidin
cd "D:\Projects\e-ticaret - yaziciTicaret"

# Vercel'e login olun
vercel login

# Projeyi deploy edin
vercel

# Production'a deploy etmek için
vercel --prod
```

**Yöntem 2: Vercel Dashboard (Daha Kolay)**

1. [vercel.com/dashboard](https://vercel.com/dashboard) adresine gidin
2. "Add New..." → "Project" butonuna tıklayın
3. GitHub/GitLab/Bitbucket repo'nuzu seçin
4. Veya "Import Git Repository" ile repo URL'i girin
5. "Import" butonuna tıklayın

### ADIM 3: Build Ayarları

Vercel otomatik olarak Next.js projelerini algılar, ancak kontrol edin:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### ADIM 4: Environment Variables Ekle

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. Şu değişkenleri ekleyin:

```
MONGODB_URI=mongodb+srv://wildandmr1:dNHhBgREkI3TjmNw@yaziciticaret.p1lmz2v.mongodb.net/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=daaoxujog
CLOUDINARY_API_KEY=829819935713443
CLOUDINARY_API_SECRET=UW3iCLAJbQGeYM4yGc
EMAIL_USER=yaziciticaret1997@gmail.com
EMAIL_PASSWORD=escq ffym gndh enop
NEXT_PUBLIC_BASE_URL=https://yazici.gen.tr
IYZICO_API_KEY=your_production_api_key
IYZICO_SECRET_KEY=your_production_secret_key
IYZICO_URI=https://api.iyzipay.com
NODE_ENV=production
```

**ÖNEMLİ:** 
- `NEXT_PUBLIC_*` ile başlayan değişkenler client-side'da kullanılabilir
- Diğerleri sadece server-side'da kullanılabilir

### ADIM 5: Domain Bağlama

1. Vercel Dashboard → Projeniz → **Settings** → **Domains**
2. "Add Domain" butonuna tıklayın
3. `yazici.gen.tr` yazın
4. Vercel size DNS kayıtlarını verecek
5. Domain sağlayıcınızda (domain satın aldığınız yer) DNS ayarlarını yapın:

**DNS Kayıtları:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Veya Vercel'in verdiği özel DNS kayıtlarını kullanın.

### ADIM 6: Deploy!

1. "Deploy" butonuna tıklayın
2. Birkaç dakika bekleyin
3. Site canlıya çıkacak! 🎉

## 📝 next.config.mjs Güncellemesi

Vercel için özel bir ayar gerekmez, ancak standalone build'i kaldırabilirsiniz:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
 reactCompiler: true,
 // output: 'standalone', // Vercel için gerekli değil
 images: {
  remotePatterns: [
   {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
   },
  ],
 },
 webpack: (config, { isServer }) => {
  if (isServer) {
   config.externals = config.externals || [];
   if (Array.isArray(config.externals)) {
    config.externals.push({
     'iyzipay': 'commonjs iyzipay',
    });
   } else {
    config.externals = [
     config.externals,
     {
      'iyzipay': 'commonjs iyzipay',
     },
    ];
   }
  }
  return config;
 },
 turbopack: {},
};

export default nextConfig;
```

## 🔄 Otomatik Deployment

GitHub'a push yaptığınızda otomatik deploy olur:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Vercel otomatik olarak:
- Build alır
- Test eder
- Production'a deploy eder

## 💰 Fiyatlandırma

**Hobby (Ücretsiz):**
- ✅ Sınırsız deployment
- ✅ 100GB bandwidth/ay
- ✅ SSL sertifikası
- ✅ Global CDN
- ⚠️ Serverless functions: 10 saniye timeout
- ⚠️ 100GB bandwidth limiti

**Pro ($20/ay):**
- ✅ Tüm Hobby özellikleri
- ✅ Sınırsız bandwidth
- ✅ 60 saniye function timeout
- ✅ Password protection
- ✅ Team collaboration

## ⚠️ Önemli Notlar

### 1. MongoDB Bağlantısı
- MongoDB Atlas'ta Vercel'in IP'lerini whitelist'e ekleyin
- Veya `0.0.0.0/0` (tüm IP'ler) izni verin

### 2. iyzico Entegrasyonu
- Vercel serverless functions'da çalışır
- Timeout limitlerine dikkat edin (Hobby: 10 saniye)
- Production API key'lerini kullanın

### 3. Dosya Yükleme
- Vercel'de dosya sistemi read-only
- Cloudinary gibi external storage kullanın (zaten kullanıyorsunuz ✅)

### 4. Environment Variables
- Production, Preview ve Development için ayrı ayrı ayarlayabilirsiniz
- `NEXT_PUBLIC_*` değişkenleri client-side'da expose olur, dikkatli olun

## 🔍 Sorun Giderme

### Build Hatası
- Vercel Dashboard → Deployments → Build Logs'u kontrol edin
- Local'de `npm run build` çalıştırıp hataları kontrol edin

### Environment Variables Çalışmıyor
- Deploy sonrası değişken eklediyseniz, yeniden deploy edin
- `NEXT_PUBLIC_*` prefix'ini kontrol edin

### Domain Bağlanmıyor
- DNS propagation 24-48 saat sürebilir
- DNS checker tool'ları kullanın
- Vercel'in verdiği DNS kayıtlarını doğru eklediğinizden emin olun

## 📊 cPanel vs Vercel Karşılaştırması

| Özellik | cPanel | Vercel |
|---------|--------|--------|
| Next.js Optimizasyonu | ❌ Manuel | ✅ Otomatik |
| Deployment | ❌ Manuel | ✅ Otomatik (Git) |
| SSL | ⚠️ Manuel | ✅ Otomatik |
| CDN | ❌ Yok | ✅ Global CDN |
| Scaling | ❌ Manuel | ✅ Otomatik |
| Fiyat | 💰 Hosting ücreti | 💰 Ücretsiz (Hobby) |
| Kurulum | ⚠️ Karmaşık | ✅ Çok Kolay |
| Serverless | ❌ Yok | ✅ Var |
| Preview Deployments | ❌ Yok | ✅ Var |

## 🎯 Sonuç

**Vercel kullanmanızı şiddetle öneririm çünkü:**
1. Next.js için optimize edilmiş
2. Deployment çok daha kolay
3. Otomatik SSL ve CDN
4. Ücretsiz tier yeterli olabilir
5. Git ile otomatik deployment
6. Daha iyi performans

**cPanel kullanmanız gereken durumlar:**
- Zaten cPanel hosting'iniz varsa ve değiştirmek istemiyorsanız
- Özel server gereksinimleriniz varsa
- Vercel'in limitlerini aşacaksanız

## 🚀 Hemen Başlayın

```bash
npm install -g vercel
vercel login
vercel --prod
```

5 dakikada deploy edin! 🎉
