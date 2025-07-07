import api from '../../services/api';

export const getDecks = async () => {
  try {
    const response = await api.get('/decks');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados do dashboard (decks):', error);
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

export const getDeckById = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao obter baralho ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter baralho';
    }
}

export const deleteDeck = async (deckId) => {
    try {
        const response = await api.delete(`/decks/${deckId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao excluir baralho ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao excluir baralho';
    }
}

export const updateDeck = async (deckId, deckName, description) => {
    try {
        const response = await api.put(`/decks/${deckId}`, { name: deckName, description: description });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar baralho ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao atualizar baralho';
    }
}

export const getCardsByDeckId = async (deckId) => {
    try {
        const response = await api.get(`/decks/${deckId}/cards`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao obter cartões para o baralho ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao obter cartões';
    }
}

export const createCard = async (deckId, cardData) => {
    try {
        const response = await api.post(`/decks/${deckId}/cards`, cardData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao criar cartão no baralho ${deckId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao criar cartão';
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

export const updateCard = async (cardId, cardData) => {
    try {
        const response = await api.put(`/cards/${cardId}`, cardData);
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
        console.error(`Erro ao excluir cartão ${cardId}:`, error);
        throw error.response?.data?.message || error.message || 'Erro desconhecido ao excluir cartão';
    }
}

export const markCardDifficulty = async (cardId, rating) => {
    try {
        const response = await api.post(`/cards/${cardId}/difficulty`, { rating });
        return response.data;
    } catch (error) {
        console.error(`Erro ao marcar dificuldade do card ${cardId}:`, error);
        if (error.response) {
            console.error("Detalhes do erro do backend:", error.response.data);
            console.error("Status do erro:", error.response.status);
            console.error("Headers do erro:", error.response.headers);
        } else if (error.request) {
            console.error("Nenhuma resposta recebida para a requisição:", error.request);
        } else {
            console.error("Erro na configuração da requisição:", error.message);
        }
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