import axios from 'axios';

// Tarayıcıda her zaman same-origin (relative URL). NEXT_PUBLIC_BASE_URL localhost
// ise production'da ERR_CONNECTION_REFUSED oluşmasını önler.
const baseURL =
  typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_BASE_URL || '');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;