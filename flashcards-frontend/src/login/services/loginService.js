export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const response = await fetch('https://sua-api.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha no login');
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};