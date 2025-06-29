import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:8081', // substituir pela url certa
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores podem ser adicionados aqui
api.interceptors.request.use(
  (config) => {
    // Colocar o token aqui depois de configurar o back
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;