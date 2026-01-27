import axios from 'axios';
const baseURL =
 typeof window !== 'undefined'
  ? ''
  : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

const axiosInstance = axios.create({
 baseURL,
 withCredentials: true,
 timeout: 30000,
 headers: {
  'Content-Type': 'application/json',
 },
});

axiosInstance.interceptors.request.use(
 (config) => {
  if (process.env.NODE_ENV === 'development') {
   console.log('API Request:', config.method?.toUpperCase(), config.url);
  }
  return config;
 },
 (error) => {
  return Promise.reject(error);
 }
);

axiosInstance.interceptors.response.use(
 (response) => {
  return response;
 },
 (error) => {
  if (process.env.NODE_ENV === 'development' && error.response?.status !== 401) {
   console.error('API Error:', error.message, error.config?.url);
  }
  return Promise.reject(error);
 }
);

export default axiosInstance;