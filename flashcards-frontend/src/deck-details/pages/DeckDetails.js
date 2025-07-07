import React, { useState, useEffect, useCallback } from 'react';
import './DeckDetails.css';
import { getDeckById, getCardsByDeckId, createCard, updateCard, deleteCard, deleteDeck } from '../../dashboard/services/dashboardService';
import CreateCardModal from '../../dashboard/components/CreateCardModal'; 
import EditCardModal from '../../dashboard/components/EditCardModal';   

function DeckDetails({ navigateTo, deckId }) {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [currentCardToEdit, setCurrentCardToEdit] = useState(null); 

  const [showDeleteDeckConfirmModal, setShowDeleteDeckConfirmModal] = useState(false);

  const fetchDeckAndCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedDeck = await getDeckById(deckId);
      setDeck(fetchedDeck);

      const fetchedCards = await getCardsByDeckId(deckId);
      setCards(fetchedCards.cards || []); 

    } catch (err) {
      setError(err.message || 'Erro desconhecido ao carregar detalhes do baralho e cartões.');
      console.error('Erro ao carregar deck e cards:', err);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) {
      fetchDeckAndCards();
    } else {
      setError('ID do baralho não fornecido.');
      setLoading(false);
    }
  }, [deckId, fetchDeckAndCards]);

  const handleAddCardClick = () => {
    setIsCreateCardModalOpen(true);
  };

  const handleEditCardClick = (card) => {
    setCurrentCardToEdit(card);
    setIsEditCardModalOpen(true);
  };

  const handleDeleteCardClick = async (cardId) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await deleteCard(cardId);
        fetchDeckAndCards(); 
      } catch (err) {
        setError(err.message || 'Erro desconhecido ao excluir cartão.');
        console.error('Erro ao excluir card:', err);
      }
    }
  };

  const handleCreateCard = async (front, back, tags) => {
    try {
      await createCard(deckId, { front, back, tags });
      fetchDeckAndCards(); 
      setIsCreateCardModalOpen(false); 
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao criar cartão.');
      console.error('Erro ao criar card:', err);
      alert(`Erro ao criar cartão: ${err.message || err}`); 
    }
  };

  const handleUpdateCard = async (cardId, front, back, tags) => {
    try {
      await updateCard(cardId, { front, back, tags });
      fetchDeckAndCards();
      setIsEditCardModalOpen(false); 
      setCurrentCardToEdit(null); 
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao salvar cartão.');
      console.error('Erro ao salvar card:', err);
      alert(`Erro ao salvar cartão: ${err.message || err}`); 
    }
  };


  const handleDeleteDeckConfirm = () => {
    setShowDeleteDeckConfirmModal(true);
  };

  const handleDeleteDeck = async () => {
    try {
      await deleteDeck(deckId);
      setShowDeleteDeckConfirmModal(false);
      navigateTo('dashboard'); 
    } catch (err) {
      setError(err.message || 'Erro desconhecido ao excluir baralho.');
      console.error('Erro ao excluir deck:', err);
      alert(`Erro ao excluir baralho: ${err.message || err}`);
    }
  };

  if (loading) {
    return (
      <div className="deck-details-container">
        <header className="deck-details-header">
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>
            Voltar
          </button>
          <div className="logo">DECOREBA</div>
        </header>
        <main className="deck-details-main-content">
          <h1>Carregando detalhes do baralho...</h1>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deck-details-container">
        <header className="deck-details-header">
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>
            Voltar
          </button>
          <div className="logo">DECOREBA</div>
        </header>
        <main className="deck-details-main-content">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
        </main>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="deck-details-container">
        <header className="deck-details-header">
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>
            Voltar
          </button>
          <div className="logo">DECOREBA</div>
        </header>
        <main className="deck-details-main-content">
          <div className="no-deck-found">
            <p>Baralho não encontrado.</p>
            <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="deck-details-container">
      <header className="deck-details-header">
        <button className="btn-back" onClick={() => navigateTo('dashboard')}>
          Voltar
        </button>
        <div className="logo">DECOREBA</div>
      </header>

      <main className="deck-details-main-content">
        <div className="deck-header-actions">
          <h1>{deck.name}</h1>
          <div className="deck-actions">
            <button className="btn-primary" onClick={() => navigateTo('study', { deckId: deck.id })}>
              Estudar Baralho
            </button>
            <button className="btn-danger" onClick={handleDeleteDeckConfirm}>
              Excluir Baralho
            </button>
          </div>
        </div>

        <div className="cards-section">
          <h2>Cartões ({cards.length})</h2>
          <button className="btn-add-card" onClick={handleAddCardClick}>
            Adicionar Novo Cartão
          </button>

          {cards.length === 0 ? (
            <p className="no-cards-message">Nenhum cartão neste baralho ainda. Adicione um!</p>
          ) : (
            <div className="cards-list">
              {cards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-content">
                    <div className="card-front-preview">
                      <strong>Frente:</strong> {card.front}
                    </div>
                    <div className="card-back-preview">
                      <strong>Verso:</strong> {card.back}
                    </div>
                    {card.tags && card.tags.length > 0 && (
                      <div className="card-tags-preview">
                        <strong>Tags:</strong> {card.tags.map(tag => tag.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="card-actions">
                    <button className="btn-action edit" onClick={() => handleEditCardClick(card)}>
                      Editar
                    </button>
                    <button className="btn-action delete" onClick={() => handleDeleteCardClick(card.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onCreate={handleCreateCard}
      />

      {currentCardToEdit && (
        <EditCardModal
          isOpen={isEditCardModalOpen}
          onClose={() => {
            setIsEditCardModalOpen(false);
            setCurrentCardToEdit(null); 
          }}
          card={currentCardToEdit}
          onEdit={handleUpdateCard}
        />
      )}

      {showDeleteDeckConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o baralho "<strong>{deck?.name}</strong>"?</p>
            <p>Todos os cartões associados a ele também serão excluídos.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDeleteDeck}>
                Excluir Permanentemente
              </button>
              <button className="btn-secondary" onClick={() => setShowDeleteDeckConfirmModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
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

export default DeckDetails;