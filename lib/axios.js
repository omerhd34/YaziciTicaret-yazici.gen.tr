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
 (config) => config,
 (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
 (response) => response,
 (error) => Promise.reject(error)
);

export default axiosInstance;