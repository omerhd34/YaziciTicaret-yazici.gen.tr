import axios from 'axios';

// Browser'da otomatik olarak mevcut domain'i kullan, server-side'da environment variable kullan
const axiosInstance = axios.create({
 withCredentials: true,
 headers: {
  'Content-Type': 'application/json',
 },
});

// Request interceptor: Her istekte baseURL'i dinamik olarak ayarla
axiosInstance.interceptors.request.use(
 (config) => {
  // Browser'da: otomatik olarak mevcut domain'i kullan
  if (typeof window !== 'undefined') {
   config.baseURL = window.location.origin;
  } else {
   // Server-side rendering için: environment variable kullan
   // Eğer yoksa relative path kullan (Next.js API route'ları için)
   const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
   if (baseURL) {
    config.baseURL = baseURL;
   } else {
    // Relative path kullan - Next.js API route'ları için
    config.baseURL = '';
   }
  }
  return config;
 },
 (error) => {
  return Promise.reject(error);
 }
);

// Response interceptor: Hataları sessizce handle et
axiosInstance.interceptors.response.use(
 (response) => response,
 (error) => {
  return Promise.reject(error);
 }
);

export default axiosInstance;