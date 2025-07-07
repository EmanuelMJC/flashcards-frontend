import React from 'react';
import './Home.css';
import { logoutUser } from '../../login/services/loginService';

function Home({ navigateTo }) {

  const isLoggedIn = localStorage.getItem('authToken') !== null;
  const username = JSON.stringify(localStorage.getItem('username')).replace(/^"|"$/g, ''); 

  const handleLogout = () => {
    logoutUser();
    navigateTo('home');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>DECOREBA</div>
        <nav >
          {isLoggedIn ? (
            <div className="user-info">
              <span>{username}</span>
              <button className="btn-logout" onClick={logoutUser}>Sair</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-sign-in" onClick={() => navigateTo('register')}>
                Sign In
              </button>
              <button className="btn-login" onClick={() => navigateTo('login')}>
                Login
              </button>
            </div>
          )}
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
            <button className="btn-comece-agora" onClick={() => navigateTo('login')}>Comece agora</button>
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
    </div>
  );
}

export default Home;