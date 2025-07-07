import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Requisição não autorizada, token possivelmente expirado. Redirecionando para o login.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      localStorage.removeItem('email');

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;