import React, { useState } from 'react';
import './FlashcardStudy.css';

function FlashcardStudy() {
  const username = "Username";
  const deckName = "Nome baralho";
  
  const [showBack, setShowBack] = useState(false);

  const currentFlashcard = {
    front: "Como centralizar uma div?",
    back: "Ninguém sabe..."
  };

  const handleShowBack = () => {
    setShowBack(true);
  };

  const handleDifficultyClick = (difficulty) => {
    console.log(`Cartão marcado como: ${difficulty}`);
    setShowBack(false); 
  };

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
            <span className="status-green">10</span>
            <span className="status-orange">0</span>
            <span className="status-red">1</span>
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
            <button className="btn-difficulty btn-wrong" onClick={() => handleDifficultyClick('Errado')}>Errado</button>
            <button className="btn-difficulty btn-difficult" onClick={() => handleDifficultyClick('Difícil')}>Difícil</button>
            <button className="btn-difficulty btn-ok" onClick={() => handleDifficultyClick('OK')}>OK</button>
            <button className="btn-difficulty btn-good" onClick={() => handleDifficultyClick('Bom')}>Bom</button>
            <button className="btn-difficulty btn-easy" onClick={() => handleDifficultyClick('Fácil')}>Fácil</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FlashcardStudy;