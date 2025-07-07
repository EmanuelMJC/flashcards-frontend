import React, { useState, useEffect, useCallback, useRef } from 'react'; // Importe useRef
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

  // NOVOS ESTADOS E REFS para registrar a sessão
  const startTimeRef = useRef(null); // Para registrar o início da sessão
  const [allDifficultyRatings, setAllDifficultyRatings] = useState({}); // Objeto para armazenar ratings de todos os cards
                                                                        // Chave: cardId, Valor: rating
  
  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setAllDifficultyRatings({}); // Resetar ratings ao buscar novos cards
    startTimeRef.current = Date.now(); // Registrar início da sessão
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

    // Registre a avaliação do card
    setAllDifficultyRatings(prevRatings => ({
      ...prevRatings,
      [cardId]: numericRating
    }));

    try {
      await markCardDifficulty(cardId, numericRating);

      // Lógica para ir para o próximo cartão ou finalizar a sessão
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else { // Sessão concluída
        setStudyComplete(true);
        
        let sessionData = {}; // Inicializa o objeto de dados da sessão
        const endTime = Date.now();
        const durationMinutes = Math.round((endTime - startTimeRef.current) / 60000); // Milissegundos para minutos

        if (deckId !== undefined && deckId !== null) { // Verifique se é estudo por DECK
          sessionData = {
            deckId: deckId,
            durationMinutes: durationMinutes,
            cardsReviewed: cards.length, // Total de cards no baralho ou revisados
            correctCount: correctCount + (numericRating >= 3 ? 1 : 0), // Ajusta os contadores para incluir o último card
            incorrectCount: incorrectCount + (numericRating <= 2 ? 1 : 0),
            difficultyRatings: Object.entries(allDifficultyRatings).map(([cardId, rating]) => ({
              cardId: parseInt(cardId), // Garante que o cardId é um número
              rating: rating
            }))
          };
          console.log('Dados da sessão de estudo por deck sendo enviados:', sessionData); // LOG CRÍTICO!
          await registerSession(sessionData);
          console.log('Sessão de estudo por deck registrada com sucesso!');

        } else if (tagId !== undefined && tagId !== null) { // Verifique se é estudo por TAG
          sessionData = {
            tagId: tagId, // Usar tagId aqui
            durationMinutes: durationMinutes,
            cardsReviewed: cards.length, 
            correctCount: correctCount + (numericRating >= 3 ? 1 : 0),
            incorrectCount: incorrectCount + (numericRating <= 2 ? 1 : 0),
            difficultyRatings: Object.entries(allDifficultyRatings).map(([cardId, rating]) => ({
              cardId: parseInt(cardId),
              rating: rating
            }))
          };
          console.log('Dados da sessão de estudo por tag sendo enviados:', sessionData);
          await registerSession(sessionData); // Assumindo que registerSession lida com deckId/tagId nulos
          console.log('Sessão de estudo por tag registrada com sucesso!');
        } else {
            console.warn('Sessão de estudo concluída, mas sem deckId ou tagId válido para registro.');
        }
      }
    } catch (err) {
      setError(err.message || `Erro ao marcar dificuldade "${difficultyString}" do cartão.`);
      console.error('Erro ao marcar dificuldade:', err);
      
      // Lógica de fallback para o próximo cartão ou finalização, mesmo com erro
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        setStudyComplete(true);
        // Mesmo em caso de erro, tente registrar a sessão se for por deck/tag
        // para não perder os dados (se o erro não for na própria requisição de sessão)
        let sessionData = {}; 
        const endTime = Date.now();
        const durationMinutes = Math.round((endTime - startTimeRef.current) / 60000);

        if (deckId !== undefined && deckId !== null) {
            sessionData = {
              deckId: deckId,
              durationMinutes: durationMinutes,
              cardsReviewed: cards.length, 
              correctCount: correctCount + (numericRating >= 3 ? 1 : 0),
              incorrectCount: incorrectCount + (numericRating <= 2 ? 1 : 0),
              difficultyRatings: Object.entries(allDifficultyRatings).map(([cardId, rating]) => ({
                cardId: parseInt(cardId),
                rating: rating
              }))
            };
            console.log('Tentando registrar sessão após erro no markDifficulty:', sessionData);
            try {
                await registerSession(sessionData);
                console.log('Sessão de estudo registrada com sucesso (após erro de marcação)!');
            } catch (sessionError) {
                console.error('Erro secundário ao registrar sessão:', sessionError);
            }
        } else if (tagId !== undefined && tagId !== null) {
            sessionData = {
                tagId: tagId,
                durationMinutes: durationMinutes,
                cardsReviewed: cards.length, 
                correctCount: correctCount + (numericRating >= 3 ? 1 : 0),
                incorrectCount: incorrectCount + (numericRating <= 2 ? 1 : 0),
                difficultyRatings: Object.entries(allDifficultyRatings).map(([cardId, rating]) => ({
                    cardId: parseInt(cardId),
                    rating: rating
                }))
            };
            console.log('Tentando registrar sessão por tag após erro no markDifficulty:', sessionData);
            try {
                await registerSession(sessionData);
                console.log('Sessão de estudo por tag registrada com sucesso (após erro de marcação)!');
            } catch (sessionError) {
                console.error('Erro secundário ao registrar sessão por tag:', sessionError);
            }
        }
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