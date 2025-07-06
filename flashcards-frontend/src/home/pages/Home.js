// src/home/pages/Home.jsx
import React from 'react';
import './Home.css';

function Home({ navigateTo }) {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">DECOREBA</div>
        <nav className="auth-buttons">
          <button className="btn-sign-in" onClick={() => navigateTo('register')}>Sign In</button>
          <button className="btn-login" onClick={() => navigateTo('login')}>Login</button>
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
            <button className="btn-comece-agora" onClick={() => navigateTo('dashboard')}>Comece agora</button>
          </div>

          <div className="flashcards-examples">
            <div className="flashcard-example primary-flashcard">
              <p>Como centralizar uma div?</p>
            </div>
            <div className="flashcard-example secondary-flashcard">
              <p>Niguém sabe...</p>
            </div>
          </div>
        </div>
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
        <button onClick={() => navigateTo('study')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Estudo</button>
        <button onClick={() => navigateTo('report')} style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer' }}>Ir para Relatório</button>
      </div>
    </div>
  );
}

export default Home;