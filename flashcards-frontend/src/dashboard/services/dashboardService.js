const API_URL = 'http://localhost:3000';

export const getAllDecks = async () => {
  try {
    const idUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/decks/${idUser}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao obter dados do dashboard');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    throw error;
  }
}

export const createDeck = async (deckName) => {
  try {
    const idUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/decks/${idUser}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: deckName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar baralho');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar baralho:', error);
    throw error;
  }
}

export const getDeck = async (deckId) => {
    try {
        const idUser = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/decks/${idUser}/${deckId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao obter baralho');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter baralho:', error);
        throw error;
    }
}

export const deleteDeck = async (deckId) => {
    try {
        const idUser = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/decks/${idUser}/${deckId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir baralho');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Erro ao excluir baralho:', error);
        throw error;
    }
}

export const updateDeck = async (deckId, deckName) => {
    try {
        const idUser = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/decks/${idUser}/${deckId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deckName }),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar baralho');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar baralho:', error);
        throw error;
    }
}

export const getCardsByDeck = async (deckId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao obter cartas do baralho');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Erro ao obter cartas do baralho:', error);
        throw error;
    }
}

export const createCard = async (deckId, front, back) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ front, back }),
        });
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar carta');
        }
    
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar carta:', error);
        throw error;
    }
}
