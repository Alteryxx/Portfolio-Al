import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatrixLanding from './components/MatrixLanding';
import './App.css';

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        
        setHideNav(true);
      } else {
        
        setHideNav(false);
      }
      
      
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <Router>
      <div className="App">
        <header className={`header ${hideNav ? 'nav-hide' : ''}`}>
          <div className="nav-container">
            <div className="logo">
              <span className="logo-symbol">{'>'}</span>Matrix_Portfolio
            </div>
            <div className="nav-links">
              <a href="#about" className="nav-link">About</a>
              <a href="#hobbies" className="nav-link">Hobbies</a>
              <a href="#life-components" className="nav-link">Life</a>
              <a href="#routine" className="nav-link">Routine</a>
              <a href="#future-plans" className="nav-link">Future</a>
              <a href="#stats" className="nav-link">Stats</a>
            </div>
            <button className="menu-toggle" aria-label="Toggle menu">
              ☰
            </button>
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<MatrixLanding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 