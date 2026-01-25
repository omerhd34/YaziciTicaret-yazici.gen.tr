import axios from 'axios';

// Browser'da otomatik olarak mevcut domain'i kullan, server-side'da environment variable kullan
const getBaseURL = () => {
 if (typeof window !== 'undefined') {
  // Browser'da: otomatik olarak mevcut domain'i kullan (https://yazici.gen.tr)
  return window.location.origin;
 }
 // Server-side rendering için: environment variable kullan
 return process.env.NEXT_PUBLIC_BASE_URL || '';
};

const axiosInstance = axios.create({
 baseURL: getBaseURL(),
 withCredentials: true,
 headers: {
  'Content-Type': 'application/json',
 },
});

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