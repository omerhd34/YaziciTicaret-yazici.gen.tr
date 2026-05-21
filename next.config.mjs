/** @type {import('next').NextConfig} */
const nextConfig = {
 reactCompiler: true,
 async headers() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr';

  return [
   {
    source: '/api/:path*',
    headers: [
     { key: 'Access-Control-Allow-Origin', value: origin },
     { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH' },
     { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
     { key: 'Access-Control-Allow-Credentials', value: 'true' },
    ],
   },
  ];
 },
 images: {
  remotePatterns: [
   {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
   },
  ],
  qualities: [70, 75], // Görüntü kalite seviyeleri
 },
 // iyzipay paketi için webpack config
 webpack: (config, { isServer }) => {
  if (isServer) {
   // iyzipay paketinin dinamik require'larını handle et
   // iyzipay için node modüllerini external olarak işaretle
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
 // Turbopack config (boş bırakarak webpack kullanılmasını sağlıyoruz)
 turbopack: {},
};

export default nextConfig;
