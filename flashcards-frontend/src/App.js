import React, { useState, useEffect } from 'react';
import './App.css';

import Home from './home/pages/Home';
import Dashboard from './dashboard/pages/Dashboard';
import FlashcardStudy from './flashcard-study/pages/FlashcardStudy';
import Report from './report/pages/Report';
import Login from './login/pages/login/login';
import Register from './login/pages/register/register';
import DeckDetails from './deck-details/pages/DeckDetails';
import { isAuthenticated } from './login/services/loginService';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  useEffect(() => {
    if (isAuthenticated()) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const navigateTo = (pageName, params = {}) => {
    setCurrentPage(pageName);
    setPageParams(params);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'deckDetails':
        return <DeckDetails navigateTo={navigateTo} deckId={pageParams.deckId} />;
      case 'study':
        return <FlashcardStudy navigateTo={navigateTo} deckId={pageParams.deckId} />;
      case 'report':
        return <Report navigateTo={navigateTo} />;
      case 'login':
        return <Login navigateTo={navigateTo} />;
      case 'register':
        return <Register navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;