import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 
import { getAllDecks, createDeck, deleteDeck, updateDeck } from '../pages/services/dashboardService'; 
import { logoutUser } from '../../login/services/loginService'; 
import CreateDeckModal from '../components/CreateDeckModal'; 
import EditDeckModal from '../components/EditDeckModal'; 

function Dashboard({ navigateTo }) { 
  const username = localStorage.getItem('username').replace(/^"|"$/g, ''); 
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null); 

  const fetchDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDecks();
      setDecks(data);
    } catch (err) {
      setError(err);
      console.error('Erro ao buscar baralhos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreateDeck = async (deckName, deckDescription) => {
    try {
      await createDeck(deckName, deckDescription);
      fetchDecks(); 
      setIsCreateModalOpen(false); 
    } catch (err) {
      setError(err);
      console.error('Erro ao criar baralho:', err);
      alert(`Erro ao criar baralho: ${err}`); 
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (window.confirm('Tem certeza que deseja excluir este baralho e todos os seus cartões?')) {
      try {
        await deleteDeck(deckId);
        fetchDecks();
      } catch (err) {
        setError(err);
        console.error('Erro ao excluir baralho:', err);
        alert(`Erro ao excluir baralho: ${err}`);
      }
    }
  };

  const handleEditDeck = async (deckId, newName, newDescription) => {
    try {
      await updateDeck(deckId, newName, newDescription);
      fetchDecks();
      setIsEditModalOpen(false); 
      setCurrentDeck(null); 
    } catch (err) {
      setError(err);
      console.error('Erro ao editar baralho:', err);
      alert(`Erro ao editar baralho: ${err}`);
    }
  };

  const openEditModal = (deck) => {
    setCurrentDeck(deck);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="logo">DECOREBA</div>
          <div className="user-info">
            <span>{username}</span>
            <button className="btn-logout" onClick={logoutUser}>Sair</button>
          </div>
        </header>
        <main className="dashboard-main-content">
          <h1>Carregando Baralhos...</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">DECOREBA</div>
        <div className="user-info">
          <span>{username}</span>
          <button className="btn-logout" onClick={logoutUser}>Sair</button>
        </div>
      </header>

      <main className="dashboard-main-content">
        <h1>Baralhos:</h1>
        
        {error && <div className="error-message">{error}</div>} 

        <button className="btn-criar-baralho" onClick={() => setIsCreateModalOpen(true)}>
          Criar Novo Baralho
        </button>

        {decks.length === 0 ? (
          <div className="no-decks-message">
            <p>Nada por enquanto. Vamos estudar?</p>
          </div>
        ) : (
          <div className="decks-grid"> 
            {decks.map(deck => (
              <div key={deck.id} className="deck-card">
                <h3>{deck.name}</h3>
                <p className="deck-description">{deck.description || 'Sem descrição'}</p>
                <div className="deck-stats">
                  <span>Total de Cards: <strong>{deck.total_cards || 0}</strong></span>
                  <span className="cards-for-review">
                    Cards para Revisão: <strong>{deck.cards_for_review || 0}</strong>
                  </span>
                </div>
                <div className="deck-actions">
                  <button 
                    className="btn-action btn-view-cards" 
                    onClick={() => navigateTo('deckDetails', { deckId: deck.id })} 
                  >
                    Ver Cards
                  </button>
                  {deck.cards_for_review > 0 && ( 
                    <button 
                      className="btn-action btn-study" 
                      onClick={() => navigateTo('study', { deckId: deck.id })}
                    >
                      Estudar ({deck.cards_for_review})
                    </button>
                  )}
                  <button 
                    className="btn-action btn-edit" 
                    onClick={() => openEditModal(deck)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-action btn-delete" 
                    onClick={() => handleDeleteDeck(deck.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateDeckModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateDeck} 
      />

      {currentDeck && (
        <EditDeckModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          deck={currentDeck}
          onEdit={handleEditDeck}
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

export default Dashboard;