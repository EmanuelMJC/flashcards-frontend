// src/flashcard-study/pages/FlashcardStudy.js
import React, { useState, useEffect, useCallback } from 'react';
import './FlashcardStudy.css';
import { getStudyCardsByDeck, markCardDifficulty } from '../../dashboard/services/dashboardService';

function FlashcardStudy({ navigateTo, deckId }) {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyComplete, setStudyComplete] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let responseData;
      if (deckId) {
        responseData = await getStudyCardsByDeck(deckId);
      } else {
        setError("Nenhum baralho especificado para estudo. Voltando ao Dashboard.");
        navigateTo('dashboard');
        return;
      }

      const fetchedCards = responseData.cards;

      if (!Array.isArray(fetchedCards)) {
        console.error("Erro: A propriedade 'cards' na resposta não é um array. Tipo:", typeof fetchedCards, "Valor:", fetchedCards);
        setError("Os dados de cartões para estudo estão em um formato inválido. Por favor, tente novamente.");
        setLoading(false);
        return;
      }

      const shuffledCards = fetchedCards.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setStudyComplete(false);
    } catch (err) {
      setError(err.message || 'Erro ao carregar cartões para estudo.');
      console.error('Erro ao carregar cartões para estudo:', err);
    } finally {
      setLoading(false);
    }
  }, [deckId, navigateTo]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = async (difficultyString) => {
    if (!cards[currentCardIndex]) return;

    const cardId = cards[currentCardIndex].id;

    let numericRating;
    switch (difficultyString) {
      case 'again':
        numericRating = 1;
        break;
      case 'hard':
        numericRating = 2;
        break;
      case 'good':
        numericRating = 3;
        break;
      case 'easy':
        numericRating = 4;
        break;
      case 'very_easy':
        numericRating = 5;
        break;
      default:
        console.warn(`Dificuldade desconhecida: "${difficultyString}". Usando rating padrão 3.`);
        numericRating = 3;
    }

    try {
      await markCardDifficulty(cardId, numericRating);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        setStudyComplete(true);
      }
    } catch (err) {
      setError(err.message || `Erro ao marcar dificuldade "${difficultyString}" do cartão.`);
      console.error('Erro ao marcar dificuldade:', err);
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        setStudyComplete(true);
      }
    }
  };

  const handleRestartStudy = () => {
    fetchCards();
  };

  if (loading) {
    return (
      <div className="study-container">
        <header className="study-header">
          <div className="logo">DECOREBA</div>
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <h1>Preparando sua sessão de estudo...</h1>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-container">
        <header className="study-header">
          <div className="logo">DECOREBA</div>
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
        </main>
      </div>
    );
  }

  if (cards.length === 0 && !studyComplete) {
    return (
      <div className="study-container">
        <header className="study-header">
          <div className="logo">DECOREBA</div>
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <div className="no-cards-for-study">
            <p>Não há cartões para revisar neste baralho no momento.</p>
            <p>Parabéns! Você está em dia, ou precisa adicionar mais cartões.</p>
            <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
            <button className="btn-secondary" onClick={() => navigateTo('deckDetails', { deckId })}>Gerenciar Cartões</button>
          </div>
        </main>
      </div>
    );
  }

  if (studyComplete) {
    return (
      <div className="study-container">
        <header className="study-header">
          <div className="logo">DECOREBA</div>
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <div className="study-complete">
            <h2>Sessão de Estudo Concluída!</h2>
            <p>Você revisou todos os cartões disponíveis para hoje neste baralho.</p>
            <div className="study-complete-actions">
              <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
              <button className="btn-secondary" onClick={handleRestartStudy}>Revisar Novamente (Todos os Cards)</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="study-container">
      <header className="study-header">
        <div className="logo">DECOREBA</div>
        <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
      </header>

      <main className="study-main-content">
        <div className="study-progress">
          Cartão {currentCardIndex + 1} de {cards.length}
        </div>

        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <p>{currentCard.front}</p>
            </div>
            <div className="flashcard-back">
              <p>{currentCard.back}</p>
              {currentCard.tags && currentCard.tags.length > 0 && (
                <div className="flashcard-tags">
                  {currentCard.tags.map(tag => (
                    <span key={tag.id} className="flashcard-tag">{tag.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isFlipped && (
          <div className="difficulty-buttons">
            <button className="btn-difficulty again" onClick={() => handleDifficulty('again')}>Novamente</button>
            <button className="btn-difficulty hard" onClick={() => handleDifficulty('hard')}>Difícil</button>
            <button className="btn-difficulty good" onClick={() => handleDifficulty('good')}>Bom</button>
            <button className="btn-difficulty easy" onClick={() => handleDifficulty('easy')}>Fácil</button>
            <button className="btn-difficulty very-easy" onClick={() => handleDifficulty('very_easy')}>Muito Fácil</button>
          </div>
        )}
      </main>

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

export default FlashcardStudy;