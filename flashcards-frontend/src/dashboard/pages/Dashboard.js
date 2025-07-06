import React from 'react';
import './Dashboard.css'; 

function Dashboard() {
  const username = "Username"; 

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
        
        <div className="no-decks-message">
          <p>Nada por enquanto. Vamos estudar?</p>
        </div>

        <button className="btn-criar-baralho">Criar Baralho</button>
      </main>
    </div>
  );
}

export default Dashboard;