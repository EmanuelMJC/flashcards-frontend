import React, { useState } from 'react';
import './App.css'; 

import Home from './home/pages/Home';
import Dashboard from './dashboard/pages/Dashboard';
import FlashcardStudy from './flashcard-study/pages/FlashcardStudy';
import Report from './report/pages/Report';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'dashboard':
        return <Dashboard />;
      case 'study':
        return <FlashcardStudy />;
      case 'report':
        return <Report />;
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