import { jwtDecode } from 'jwt-decode';
import api from '../../services/api'; 

export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const response = await api.post('/auth/login', { email, password });
    const data = response.data; 

    if (!data.token) { 
      throw new Error(data.message || 'Falha no login: Token não recebido');
    }

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    localStorage.setItem('id', data.user.id);
    localStorage.setItem('username', data.user.username);
    localStorage.setItem('email', data.user.email);

    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
    );
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000; 
  } catch {
    return false;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('id'); 
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};