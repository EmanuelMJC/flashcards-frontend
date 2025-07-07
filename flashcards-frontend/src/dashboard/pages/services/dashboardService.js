import api from '../../../services/api'; 

export const getAllDecks = async () => {
  try {
    const response = await api.get('/decks'); 
    return response.data; 
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter decks';
  }
}

export const createDeck = async (deckName, description = '') => { 
  try {

    const response = await api.post('/decks', { name: deckName, description }); 
    return response.data;
  } catch (error) {
    console.error('Erro ao criar baralho:', error);
    throw error.response?.data?.message || error.message || 'Erro desconhecido ao criar baralho';
  }
}

export const getDeck = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}`); 
        return response.data;
    } catch (error) {
        console.error('Erro ao obter baralho:', error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter baralho';
    }
}

export const deleteDeck = async (deckId) => {
    try {
        const response = await api.delete(`/decks/${deckId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir baralho:', error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao excluir baralho';
    }
}

export const updateDeck = async (deckId, deckName, description) => { 
    try {
        const response = await api.put(`/decks/${deckId}`, { name: deckName, description: description }); 
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar baralho:', error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao atualizar baralho';
    }
}

export const getCardsByDeck = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}/cards`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter cartas do baralho:', error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter cartas do baralho';
    }
}

export const createCard = async (deckId, front, back, tags = []) => { 
    try {
        const response = await api.post(`/decks/${deckId}/cards`, { front, back, tags });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar carta:', error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao criar carta';
    }
}

export const getCardById = async (cardId) => {
  try {
      const response = await api.get(`/cards/${cardId}`);
      return response.data;
  } catch (error) {
      console.error(`Erro ao obter card ${cardId}:`, error);
      throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter card';
  }
}

export const updateCard = async (cardId, front, back, tags = []) => {
    try {
        const response = await api.put(`/cards/${cardId}`, { front, back, tags });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar card ${cardId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao atualizar card';
    }
}

export const deleteCard = async (cardId) => {
    try {
        const response = await api.delete(`/cards/${cardId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar card ${cardId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao deletar card';
    }
}

export const markCardDifficulty = async (cardId, rating) => {
    try {
        const response = await api.post(`/cards/${cardId}/difficulty`, { rating });
        return response.data;
    } catch (error) {
        console.error(`Erro ao marcar dificuldade do card ${cardId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao marcar dificuldade do card';
    }
}

export const getStudyCardsByDeck = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}/study`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao obter cards para estudo do deck ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter cards para estudo';
    }
}

export const getStudyCardsByTag = async (tagId) => {
    try {
        const response = await api.get(`/tags/${tagId}/study`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao obter cards para estudo da tag ${tagId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter cards para estudo por tag';
    }
}

export const resetCardProgress = async (cardId) => {
    try {
        const response = await api.post(`/cards/${cardId}/reset-progress`); 
        return response.data;
    } catch (error) {
        console.error(`Erro ao resetar progresso do card ${cardId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao resetar progresso do card';
    }
}

export const resetDeckProgress = async (deckId) => {
    try {
        const response = await api.post(`/decks/${deckId}/reset-progress`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao resetar progresso do deck ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao resetar progresso do deck';
    }
}

export const getAllTags = async () => {
  try {
    const response = await api.get('/tags'); 
    return response.data;
  } catch (error) {
    console.error('Erro ao obter tags:', error);
    throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter tags';
  }
}