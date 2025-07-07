export const registerUser = async (username, email, password) => {
  try {
    if (!username || !email || !password) {
      throw new Error('Preencha todos os campos');
    }

    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
      
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha no registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};