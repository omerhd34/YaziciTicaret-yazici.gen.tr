import axios from 'axios';

const axiosInstance = axios.create({
 withCredentials: true,
 headers: {
  'Content-Type': 'application/json',
 },
});

axiosInstance.interceptors.request.use(
 (config) => {
  if (typeof window !== 'undefined') {
   config.baseURL = window.location.origin;
  } else {
   config.baseURL = '';
  }
  return config;
 },
 (error) => {
  return Promise.reject(error);
 }
);

axiosInstance.interceptors.response.use(
 (response) => response,
 (error) => {
  return Promise.reject(error);
 }
);

export default axiosInstance;