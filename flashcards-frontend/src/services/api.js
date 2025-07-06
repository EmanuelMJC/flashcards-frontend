import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function loginDevUser() {
  try {
    const response = await api.post('/auth/login', {
      email: 'admin@teste.com',
      password: 'senha123',
    });

    const token = response.data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ Login automático feito com sucesso');
  } catch (err) {
    console.error('❌ Erro no login automático:', err.response?.data || err.message);
  }
}

export default api;