import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 

import Home from './home/pages/Home';
import Dashboard from './dashboard/pages/Dashboard';
import FlashcardStudy from './flashcard-study/pages/FlashcardStudy';
import Report from './report/pages/Report';

export const AuthContext = React.createContext(null); 

function App() {
  const [authToken, setAuthToken] = React.useState('simulated_jwt_token_for_testing');
  const [currentUser, setCurrentUser] = React.useState({ id: 1, username: 'TestUser', email: 'test@example.com' });

  const simulateLogin = () => {
    setAuthToken('simulated_jwt_token_for_testing');
    setCurrentUser({ id: 1, username: 'TestUser', email: 'test@example.com' });
  };

  const simulateLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <Router>
      <AuthContext.Provider value={{ authToken, currentUser, simulateLogin, simulateLogout }}>
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
      </AuthContext.Provider>
    </Router>
  );
}

export default App;