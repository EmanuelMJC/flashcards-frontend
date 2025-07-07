import React, { useState, useEffect } from 'react';

import { getCardsByDeck, createCard, deleteCard, updateCard, resetDeckProgress, resetCardProgress } from './services/dashboardService'; 
import './DeckDetailsPage.css'; 
import CreateCardModal from '../components/CreateCardModal'; 
import EditCardModal from '../components/EditCardModal';

function DeckDetailsPage({ navigateTo, deckId }) {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  const fetchDeckAndCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCards = await getCardsByDeck(deckId);

      setCards(fetchedCards);

    } catch (err) {
      setError(err.message || 'Erro ao carregar os detalhes do baralho e cartões.');
      console.error('Erro ao carregar detalhes do deck:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deckId) {
      fetchDeckAndCards();
    }
  }, [deckId]); 

  const handleCreateCard = async (front, back, tags) => {
    try {
      await createCard(deckId, front, back, tags);
      fetchDeckAndCards();
      setIsCreateCardModalOpen(false);
    } catch (err) {
      setError(err.message || 'Erro ao criar cartão.');
      alert(`Erro ao criar cartão: ${err.message}`);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await deleteCard(cardId);
        fetchDeckAndCards(); 
      } catch (err) {
        setError(err.message || 'Erro ao excluir cartão.');
        alert(`Erro ao excluir cartão: ${err.message}`);
      }
    }
  };

  const handleEditCard = async (cardId, front, back, tags) => {
    try {
      await updateCard(cardId, front, back, tags);
      fetchDeckAndCards(); 
      setIsEditCardModalOpen(false);
      setCurrentCard(null);
    } catch (err) {
      setError(err.message || 'Erro ao editar cartão.');
      alert(`Erro ao editar cartão: ${err.message}`);
    }
  };

  const handleResetDeckProgress = async () => {
    if (window.confirm('Tem certeza que deseja resetar o progresso de TODOS os cartões neste baralho? Isso não pode ser desfeito.')) {
      try {
        await resetDeckProgress(deckId);
        alert('Progresso do baralho resetado com sucesso!');
        fetchDeckAndCards(); 
      } catch (err) {
        setError(err.message || 'Erro ao resetar progresso do baralho.');
        alert(`Erro ao resetar progresso do baralho: ${err.message}`);
      }
    }
  };

  const handleResetCardProgress = async (cardId) => {
    if (window.confirm('Tem certeza que deseja resetar o progresso deste cartão?')) {
      try {
        await resetCardProgress(cardId);
        alert('Progresso do cartão resetado com sucesso!');
        fetchDeckAndCards(); 
      } catch (err) {
        setError(err.message || 'Erro ao resetar progresso do cartão.');
        alert(`Erro ao resetar progresso do cartão: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="deck-details-container">
        <header className="deck-details-header">
            <div className="logo">DECOREBA</div>
            <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="deck-details-main-content">
          <h1>Carregando Cartões...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="deck-details-container">
      <header className="deck-details-header">
        <div className="logo">DECOREBA</div>
        <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
      </header>
      <main className="deck-details-main-content">
        <h1>{deck ? deck.name : `Baralho ID: ${deckId}`} - Cartões</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="deck-details-actions">
            <button className="btn-primary" onClick={() => setIsCreateCardModalOpen(true)}>
                Adicionar Novo Cartão
            </button>
            <button 
              className="btn-danger-outline" 
              onClick={handleResetDeckProgress}
            >
              Resetar Progresso do Baralho
            </button>
            <button 
                className="btn-primary" 
                onClick={() => navigateTo('study', { deckId: deckId })}
            >
                Começar Estudo
            </button>
        </div>

        {cards.length === 0 ? (
          <div className="no-cards-message">
            <p>Nenhum cartão neste baralho ainda. Adicione um!</p>
          </div>
        ) : (
          <div className="cards-list">
            {cards.map(card => (
              <div key={card.id} className="card-item">
                <div className="card-content">
                  <p><strong>Frente:</strong> {card.front}</p>
                  <p><strong>Verso:</strong> {card.back}</p>
                  <p><strong>Dificuldade:</strong> {card.difficulty}</p>
                  {card.next_review && <p><strong>Próxima Revisão:</strong> {new Date(card.next_review).toLocaleDateString()}</p>}
                  {card.tags && card.tags.length > 0 && (
                    <p>
                      <strong>Tags:</strong> 
                      {card.tags.map(tag => (
                        <span key={tag.id} className="card-tag">{tag.name}</span>
                      ))}
                    </p>
                  )}
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-action btn-edit" 
                    onClick={() => {setCurrentCard(card); setIsEditCardModalOpen(true);}}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-action btn-delete" 
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Excluir
                  </button>
                  <button 
                    className="btn-action btn-reset" 
                    onClick={() => handleResetCardProgress(card.id)}
                  >
                    Resetar Progresso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onCreate={handleCreateCard}
      />

      {currentCard && (
        <EditCardModal
          isOpen={isEditCardModalOpen}
          onClose={() => setIsEditCardModalOpen(false)}
          card={currentCard}
          onEdit={handleEditCard}
        />
      )}

       <div style={{
        position: 'fixed',
        bottom: '0', 
        left: '0',        
        width: '100%',    
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        padding: '15px 0',
        display: 'flex',
        justifyContent: 'center', 
        gap: '20px',     
        zIndex: 9999,         
        boxSizing: 'border-box'
      }}>
        <button onClick={() => navigateTo('home')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Home</button>
        <button onClick={() => navigateTo('dashboard')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Dashboard</button>
        <button onClick={() => navigateTo('study')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Estudo (Geral)</button> 
        <button onClick={() => navigateTo('report')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Relatório</button>
      </div>
    </div>
  );
}

export default DeckDetailsPage;