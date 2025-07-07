const API_URL = 'http://localhost:3000';

export const registerSession = async (sessionData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao registrar sessão');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar sessão:', error);
    throw error;
  }
};

export const getReportsHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.deckId) params.append('deckId', filters.deckId);
    if (filters.tagId) params.append('tagId', filters.tagId);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/history?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao obter histórico');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    throw error;
  }
};

export const getOverallStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/stats/overall`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao obter estatísticas gerais');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error);
    throw error;
  }
};

export const getDeckStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/stats/decks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao obter estatísticas por deck');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter estatísticas por deck:', error);
    throw error;
  }
};

export const getTagStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/stats/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao obter estatísticas por tag');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter estatísticas por tag:', error);
    throw error;
  }
};