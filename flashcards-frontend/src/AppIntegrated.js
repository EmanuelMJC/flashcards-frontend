import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './home/pages/Home';
import Dashboard from './dashboard/pages/Dashboard';
import FlashcardStudy from './flashcard-study/pages/FlashcardStudy';
import Report from './report/pages/Report';
import { AuthProvider, AuthContext } from './AuthContextIntegrated';

function AppIntegrated() {
  const { authToken, simulateLogin, simulateLogout } = React.useContext(AuthContext);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study/:deckId" element={<FlashcardStudy />} />
            <Route path="/report" element={<Report />} />
          </Routes>

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
            <Link to="/" style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'black' }}>Home</Link>
            <Link to="/dashboard" style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'black' }}>Dashboard</Link>
            <Link to="/study/1" style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'black' }}>Estudo (Deck 1)</Link>
            <Link to="/report" style={{ padding: '10px 20px', backgroundColor: 'lightgray', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'black' }}>Relatório</Link>

            <button onClick={authToken ? simulateLogout : simulateLogin} style={{
              padding: '10px 20px',
              backgroundColor: authToken ? 'salmon' : 'lightgreen',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '20px'
            }}>
              {authToken ? 'Simular Logout' : 'Simular Login'}
            </button>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default AppIntegrated;
