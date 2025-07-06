import React, { useState, useEffect, useContext } from 'react'; 
import { Link } from 'react-router-dom';
import './Dashboard.css';

import { AuthContext } from '../../App'; 

function Dashboard() {
  const { authToken, currentUser } = useContext(AuthContext);
  const username = currentUser ? currentUser.username : "Visitante"; 

  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const fetchDecks = async () => {
    if (!authToken) {
      setError("Não autenticado. Por favor, faça login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/decks`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar baralhos: ${response.statusText}`);
      }

      const data = await response.json();
      setDecks(data);
    } catch (err) {
      console.error("Erro ao buscar decks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [authToken]); 

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!authToken) {
      alert("Você precisa estar logado para criar um baralho.");
      return;
    }
    if (!newDeckName.trim()) {
      alert("O nome do baralho não pode ser vazio.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/decks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newDeckName, description: newDeckDescription })
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar baralho: ${response.statusText}`);
      }

      await fetchDecks();
      setNewDeckName(''); 
      setNewDeckDescription(''); 
      alert("Baralho criado com sucesso!");
    } catch (err) {
      console.error("Erro ao criar deck:", err);
      setError(err.message);
      alert(`Erro ao criar baralho: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">DECOREBA</div>
        <div className="user-info">
          <span>{username}</span>
        </div>
      </header>

      <main className="dashboard-main-content">
        <h1>Baralhos:</h1>

        {loading && <p>Carregando baralhos...</p>}
        {error && <p className="error-message">Erro: {error}</p>}
        
        {!loading && !error && decks.length === 0 ? (
          <div className="no-decks-message">
            <p>Nada por enquanto. Vamos estudar?</p>
          </div>
        ) : (
          <div className="deck-list">
            {decks.map(deck => (
              <div key={deck.id} className="deck-item">
                <h3>{deck.name}</h3>
                <p>{deck.description}</p>
                <div className="deck-actions">
                  <Link to={`/study/${deck.id}`} className="btn-study-deck">Estudar</Link>
                  <Link to={`/deck/${deck.id}/add-card`} className="btn-study-deck">Adicionar Card</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCreateDeck} className="create-deck-form">
          <h2>Criar Novo Baralho</h2>
          <input
            type="text"
            placeholder="Nome do Baralho"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={newDeckDescription}
            onChange={(e) => setNewDeckDescription(e.target.value)}
          ></textarea>
          <button type="submit" className="btn-criar-baralho">Criar Baralho</button>
        </form>
      </main>
    </div>
  );
}

export default Dashboard;