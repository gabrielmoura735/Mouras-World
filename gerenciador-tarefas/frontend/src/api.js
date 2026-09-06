import axios from 'axios';
import useStore from './store';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().token || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
