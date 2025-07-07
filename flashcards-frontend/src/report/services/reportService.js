import api from '../../services/api'; 

export const registerSession = async (sessionData) => {
  try {
    const response = await api.post('/reports/sessions', sessionData); 
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar sessão:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Erro ao registrar sessão';
  }
};

export const getReportsHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.deckId) params.append('deckId', filters.deckId);
    if (filters.tagId) params.append('tagId', filters.tagId);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await api.get(`/reports/history?${params.toString()}`); 
    return response.data;
  } catch (error) {
    console.error('Erro ao obter histórico:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Erro ao obter histórico';
  }
};

export const getOverallStats = async () => {
  try {
    const response = await api.get('/reports/stats/overall');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Erro ao obter estatísticas gerais';
  }
};

export const getDeckStats = async () => {
  try {
    const response = await api.get('/reports/stats/decks');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas por deck:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Erro ao obter estatísticas por deck';
  }
};

export const getTagStats = async () => {
  try {
    const response = await api.get('/reports/stats/tags');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter estatísticas por tag:', error.response?.data?.message || error.message);
    throw error.response?.data?.message || 'Erro ao obter estatísticas por tag';
  }
};