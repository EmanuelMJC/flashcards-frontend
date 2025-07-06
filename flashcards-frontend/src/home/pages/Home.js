import React from 'react';
import { Link } from 'react-router-dom'; 
import './Home.css';

function Home() { 
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">DECOREBA</div>
        <nav className="auth-buttons">
          <Link to="/dashboard" className="btn-sign-in" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link>
          <Link to="/dashboard" className="btn-login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-main-content">
          <div className="hero-content">
            <h1>Flashcards</h1>
            <p>
              Cansado de esquecer o que estudou? Com os nossos flash cards, você
              transforma o aprendizado em algo fácil e eficaz. Seja para a prova de amanhã,
              o próximo exame de certificação ou para aprender um novo idioma, nosso
              método de repetição espaçada otimiza sua memória e garante que o
              conhecimento fique na sua cabeça por muito mais tempo.
            </p>
            <Link to="/dashboard" className="btn-comece-agora" style={{ textDecoration: 'none', color: 'inherit' }}>Comece agora</Link>
          </div>

          <div className="flashcards-examples">
            <div className="flashcard-example primary-flashcard">
              <p>Como centralizar uma div?</p>
            </div>
            <div className="flashcard-example secondary-flashcard">
              <p>...e quem sabe...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;