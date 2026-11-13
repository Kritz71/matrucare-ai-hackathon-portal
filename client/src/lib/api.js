import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('matrucare_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && localStorage.getItem('matrucare_token')) {
    localStorage.removeItem('matrucare_token');
    localStorage.removeItem('matrucare_user');
    window.dispatchEvent(new Event('matrucare:unauthorized'));
  }
  return Promise.reject(error);
});
