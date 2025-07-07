import React, { useState, useEffect, useCallback } from 'react';
import './FlashcardStudy.css';
import { getStudyCardsByDeck, markCardDifficulty, getStudyCardsByTag } from '../../dashboard/services/dashboardService';
import { registerSession } from '../../report/services/reportService';

function FlashcardStudy({ navigateTo, deckId, tagId }) { 
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyComplete, setStudyComplete] = useState(false);
  const [isStudyByTag, setIsStudyByTag] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    try {
      let responseData;
      if (deckId) {
        responseData = await getStudyCardsByDeck(deckId);
        setIsStudyByTag(false);
      } else if (tagId) { 
        responseData = await getStudyCardsByTag(tagId); 
        setIsStudyByTag(true); 
      } else {
        setError("Nenhum baralho ou tag especificada para estudo. Voltando ao Dashboard.");
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
  }, [deckId, tagId, navigateTo]); 

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

    if (numericRating <= 2) {
      setIncorrectCount(prev => prev + 1);
    } else {
      setCorrectCount(prev => prev + 1);
    }

    try {
      await markCardDifficulty(cardId, numericRating);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else if (deckId !== null) {
        setStudyComplete(true);
        const sessionData = {
          deckId: deckId,
          correctCount: numericRating >= 3 ? correctCount + 1 : correctCount,
          incorrectCount: numericRating <= 2 ? incorrectCount + 1 : incorrectCount
        };
        await registerSession(sessionData);
        console.log('Sessão de estudo registrada com sucesso:', sessionData);
      } else {
        setStudyComplete(true);
      }
    } catch (err) {
      setError(err.message || `Erro ao marcar dificuldade "${difficultyString}" do cartão.`);
      console.error('Erro ao marcar dificuldade:', err);
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else if (deckId !== null) {
        setStudyComplete(true);
         const sessionData = {
          deckId: deckId,
          correctCount: numericRating >= 3 ? correctCount + 1 : correctCount,
          incorrectCount: numericRating <= 2 ? incorrectCount + 1 : incorrectCount
        };
        await registerSession(sessionData);
        console.log('Sessão de estudo registrada com sucesso:', sessionData);
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
          <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div> 
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
          <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div> 
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
          <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div>
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <div className="no-cards-for-study">
            <p>
              {isStudyByTag ?
                `Não há cartões para revisar com esta tag no momento.` :
                `Não há cartões para revisar neste baralho no momento.`
              }
            </p>
            <p>Parabéns! Você está em dia, ou precisa adicionar mais cartões.</p>
            <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
            {!isStudyByTag && (
              <button className="btn-secondary" onClick={() => navigateTo('deckDetails', { deckId })}>Gerenciar Cartões</button>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (studyComplete) {
    return (
      <div className="study-container">
        <header className="study-header">
          <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div> 
          <button className="btn-back" onClick={() => navigateTo('dashboard')}>Voltar para Baralhos</button>
        </header>
        <main className="study-main-content">
          <div className="study-complete">
            <h2>Sessão de Estudo Concluída!</h2>
            <p>Você revisou todos os cartões disponíveis para hoje neste baralho.</p>
            <div className="study-complete-actions">
              <button className="btn-primary" onClick={() => navigateTo('dashboard')}>Voltar ao Dashboard</button>
              <button className="btn-secondary" onClick={handleRestartStudy}>Revisar Novamente (Todos os Cards)</button>
              <button className="btn-secondary" onClick={() => navigateTo('report')}>Relatório do estudo</button>
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
        <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div>
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
    </div>
  );
}

export default FlashcardStudy;