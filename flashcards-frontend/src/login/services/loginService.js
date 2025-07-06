import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Falha no login');
    }

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setAuthToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error(
      error.message || 
      'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
    );
  }
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
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
  setAuthToken(null);
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const token = localStorage.getItem('authToken');
if (token) {
  setAuthToken(token);
}