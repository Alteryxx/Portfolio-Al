import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import MatrixLanding from "./components/MatrixLanding";
import Professional from "./components/Professional";
import MatrixLoader from "./components/MatrixLoader";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import CursorTrail from "./components/CursorTrail";
import TravelToursPage from "./components/TravelToursPage";
import IndustrialToursPage from "./components/IndustrialToursPage";
import './App.css'

function MainLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const locationRef = useRef('');
  const location = useLocation();
  const timerRef = useRef(null);
  const navigationInProgressRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialLoad) {
      if (timerRef.current) clearTimeout(timerRef.current);
      const isPageAlreadyLoaded = document.readyState === 'complete';
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
        setInitialLoad(false);
        locationRef.current = location.pathname;
        navigationInProgressRef.current = false;
      }, isPageAlreadyLoaded ? 1500 : 2000);
    }
  }, [initialLoad, location.pathname]);

  useEffect(() => {
    if (initialLoad) return;
    if (navigationInProgressRef.current) return;
    if (locationRef.current !== location.pathname) {
      navigationInProgressRef.current = true;
      setIsLoading(true);
      locationRef.current = location.pathname;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
        navigationInProgressRef.current = false;
      }, 1500);
    }
  }, [location.pathname, initialLoad]);

  return (
    <>
      <CursorTrail 
        color="#00ff00" 
        size={13} 
        length={12} 
        opacity={0.9}
        speed={2}
        useChars={true}
        fallSpeed={0.8}
      />
      <MatrixLoader isLoading={isLoading} />
      
      <div 
        className="main-container"
        style={{ 
          visibility: isLoading ? 'hidden' : 'visible', 
          opacity: isLoading ? 0 : 1, 
          transition: 'opacity 0.5s ease-in',
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        <Routes>
          <Route path="/" element={<MatrixLanding />} />
          <Route path="/professional" element={<Professional />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/travel-tours" element={<TravelToursPage />} />
          <Route path="/industrial-tours" element={<IndustrialToursPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App
