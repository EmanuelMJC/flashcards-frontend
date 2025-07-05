import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import './FlashcardStudy.css';

import { AuthContext } from '../../App'; 

function FlashcardStudy() {
  const { authToken, currentUser } = useContext(AuthContext);
  const username = currentUser ? currentUser.username : "Visitante";

  const { deckId } = useParams();
  const navigate = useNavigate(); 

  const [showBack, setShowBack] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deckName, setDeckName] = useState("Carregando Baralho..."); 

  const API_BASE_URL = 'http://localhost:3000';

  const fetchStudyData = async () => {
    if (!authToken || !deckId) {
      navigate('/dashboard'); 
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const deckResponse = await fetch(`${API_BASE_URL}/decks/${deckId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!deckResponse.ok) {
        throw new new Error(`Erro ao buscar informações do baralho: ${deckResponse.statusText}`);
      }
      const deckData = await deckResponse.json();
      setDeckName(deckData.name);

      const cardsResponse = await fetch(`${API_BASE_URL}/decks/${deckId}/study`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (!cardsResponse.ok) {
        throw new Error(`Erro ao buscar cards para estudo: ${cardsResponse.statusText}`);
      }

      const cardsData = await cardsResponse.json();
      if (cardsData.length > 0) {
        setCurrentFlashcard(cardsData[0]); 
      } else {
        setCurrentFlashcard(null); 
        alert("Não há cards para estudar neste baralho no momento!");
        navigate('/dashboard'); 
      }

    } catch (err) {
      console.error("Erro ao buscar dados de estudo:", err);
      setError(err.message);
      alert(`Erro: ${err.message}. Voltando para o Dashboard.`);
      navigate('/dashboard'); 
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyClick = async (difficulty) => {
    if (!authToken || !currentFlashcard) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cards/${currentFlashcard.id}/difficulty`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ difficulty })
      });

      if (!response.ok) {
        throw new Error(`Erro ao marcar dificuldade: ${response.statusText}`);
      }

      console.log(`Cartão ${currentFlashcard.id} marcado como: ${difficulty}`);
      setShowBack(false); 
      await fetchStudyData(); 
    } catch (err) {
      console.error("Erro ao marcar dificuldade:", err);
      setError(err.message);
      alert(`Erro ao marcar dificuldade: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchStudyData();
  }, [deckId, authToken]);

  const handleShowBack = () => {
    setShowBack(true);
  };

  if (loading) {
    return (
      <div className="flashcard-study-container">
        <header className="flashcard-study-header">
          <div className="logo">DECOREBA</div>
          <div className="user-info">
            <span>{username}</span>
          </div>
        </header>
        <main className="flashcard-study-main-content">
          <p>Carregando cards para estudo...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcard-study-container">
        <header className="flashcard-study-header">
          <div className="logo">DECOREBA</div>
          <div className="user-info">
            <span>{username}</span>
          </div>
        </header>
        <main className="flashcard-study-main-content">
          <p className="error-message">Erro: {error}</p>
        </main>
      </div>
    );
  }

  if (!currentFlashcard) {
    return (
      <div className="flashcard-study-container">
        <header className="flashcard-study-header">
          <div className="logo">DECOREBA</div>
          <div className="user-info">
            <span>{username}</span>
          </div>
        </header>
        <main className="flashcard-study-main-content">
          <p>Nenhum card disponível para estudo neste baralho no momento.</p>
          <Link to="/dashboard" className="btn-show-back">Voltar para Baralhos</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flashcard-study-container">
      <header className="flashcard-study-header">
        <div className="logo">DECOREBA</div>
        <div className="user-info">
          <span>{username}</span>
        </div>
      </header>

      <main className="flashcard-study-main-content">
        <div className="study-header-info">
          <h1 className="deck-title">{deckName}</h1>
          <div className="flashcard-status-indicators">
            <span className="status-green">?</span> 
            <span className="status-orange">?</span>
            <span className="status-red">?</span>
          </div>
        </div>

        <div className={`flashcard ${showBack ? 'flashcard-back-active' : ''}`}>
          <p className="flashcard-text">
            {showBack ? currentFlashcard.back : currentFlashcard.front}
          </p>
        </div>

        {!showBack ? (
          <button className="btn-show-back" onClick={handleShowBack}>
            Mostrar verso
          </button>
        ) : (
          <div className="difficulty-buttons">
            <button className="btn-difficulty btn-wrong" onClick={() => handleDifficultyClick('hard')}>Errado</button>
            <button className="btn-difficulty btn-difficult" onClick={() => handleDifficultyClick('medium')}>Difícil</button>
            <button className="btn-difficulty btn-ok" onClick={() => handleDifficultyClick('medium')}>OK</button> 
            <button className="btn-difficulty btn-good" onClick={() => handleDifficultyClick('easy')}>Bom</button> 
            <button className="btn-difficulty btn-easy" onClick={() => handleDifficultyClick('easy')}>Fácil</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FlashcardStudy;