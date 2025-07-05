// src/report/pages/Report.jsx
import React, { useContext } from 'react'; // Importa useContext
import './Report.css';

// Importa o AuthContext do App.js
import { AuthContext } from '../../App'; 

function Report() {
  // Acessa o contexto de autenticação
  const { currentUser } = useContext(AuthContext);
  const username = currentUser ? currentUser.username : "Visitante";

  // Dados simulados para o relatório (mantidos por enquanto, pois não há endpoint de relatório direto)
  const reportData = {
    totalReviewed: 150,
    correctAnswers: 120,
    incorrectAnswers: 30,
    accuracy: (120 / 150 * 100).toFixed(1),
    mostChallengingDecks: [
      { name: "Gramática Alemã", errors: 15 },
      { name: "Terminologia Médica", errors: 8 },
    ],
    bestPerformingDecks: [
      { name: "Capitais do Mundo", correct: 25 },
      { name: "Estrutura de Dados", correct: 20 },
    ]
  };

  return (
    <div className="report-container">
      <header className="report-header">
        <div className="logo">DECOREBA</div>
        <div className="user-info">
          <span>{username}</span>
        </div>
      </header>

      <main className="report-main-content">
        <h1>Relatório de Desempenho</h1>

        <section className="report-summary">
          <h2>Resumo Geral</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Cartões Revisados</h3>
              <p>{reportData.totalReviewed}</p>
            </div>
            <div className="summary-card correct">
              <h3>Acertos</h3>
              <p>{reportData.correctAnswers}</p>
            </div>
            <div className="summary-card incorrect">
              <h3>Erros</h3>
              <p>{reportData.incorrectAnswers}</p>
            </div>
            <div className="summary-card accuracy">
              <h3>Taxa de Acerto</h3>
              <p>{reportData.accuracy}%</p>
            </div>
          </div>
        </section>

        <section className="report-details">
          <div className="details-section">
            <h2>Baralhos Mais Desafiadores</h2>
            {reportData.mostChallengingDecks.length > 0 ? (
              <ul>
                {reportData.mostChallengingDecks.map((deck, index) => (
                  <li key={index}>{deck.name} ({deck.errors} erros)</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum baralho desafiador registrado.</p>
            )}
          </div>

          <div className="details-section">
            <h2>Baralhos de Melhor Desempenho</h2>
            {reportData.bestPerformingDecks.length > 0 ? (
              <ul>
                {reportData.bestPerformingDecks.map((deck, index) => (
                  <li key={index}>{deck.name} ({deck.correct} acertos)</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum baralho de melhor desempenho registrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Report;