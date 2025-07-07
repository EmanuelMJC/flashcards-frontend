import api from '../../services/api'; 

export const registerUser = async (username, email, password) => {
  try {
    if (!username || !email || !password) {
      throw new Error('Preencha todos os campos');
    }

    const response = await api.post('/auth/register', { username, email, password });
    
    return response.data; 
  } catch (error) {
    console.error('Erro no registro:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Falha no registro');
  }
};