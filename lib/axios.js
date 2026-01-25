import axios from 'axios';

// Browser'da otomatik olarak mevcut domain'i kullan, server-side'da environment variable kullan
// ÖNEMLİ: baseURL'i runtime'da ayarlıyoruz, build zamanında değil
const axiosInstance = axios.create({
 // Başlangıçta boş bırakıyoruz, runtime'da ayarlanacak
 baseURL: '',
 withCredentials: true,
 headers: {
  'Content-Type': 'application/json',
 },
});

// Browser'da baseURL'i dinamik olarak ayarla
if (typeof window !== 'undefined') {
 // Browser'da: otomatik olarak mevcut domain'i kullan (https://yazici.gen.tr)
 axiosInstance.defaults.baseURL = window.location.origin;
} else {
 // Server-side rendering için: environment variable kullan
 axiosInstance.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
}

// Error interceptor: Hataları console'a yazdır (debug için)
axiosInstance.interceptors.response.use(
 (response) => response,
 (error) => {
  // Sadece browser'da console'a yazdır
  if (typeof window !== 'undefined') {
   console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    baseURL: error.config?.baseURL,
   });
  }
  return Promise.reject(error);
 }
);

export default axiosInstance;