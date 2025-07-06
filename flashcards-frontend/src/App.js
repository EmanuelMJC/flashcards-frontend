import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import api from './services/api';
import './App.css';

import Home from './home/pages/Home';
import Dashboard from './dashboard/pages/Dashboard';
import FlashcardStudy from './flashcard-study/pages/FlashcardStudy';
import CreateCard from './flashcard-study/pages/CreateCard';
import Report from './report/pages/Report';
import Login from './login/pages/login/login';
import Register from './login/pages/register/register';

export const AuthContext = React.createContext(null);

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (authToken && !currentUser) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setCurrentUser(savedUser);
    }
  }, [authToken]);

  const realLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        email: 'admin@teste.com',
        password: 'senha123',
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthToken(token);
      setCurrentUser(user);
      console.log('✅ Login real efetuado');
    } catch (err) {
      console.error('❌ Erro no login:', err.response?.data || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <Router>
      <AuthContext.Provider value={{ authToken, currentUser, login: realLogin, logout }}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/study/:deckId" element={<FlashcardStudy />} />
            <Route path="/deck/:deckId/add-card" element={<CreateCard />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
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
            
            <button onClick={authToken ? logout : realLogin} style={{
              padding: '10px 20px',
              backgroundColor: authToken ? 'salmon' : 'lightgreen',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '20px'
            }}>
              {authToken ? 'Logout' : 'Login admin@teste.com'}
            </button>
          </div>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;