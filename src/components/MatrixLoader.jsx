import React, { useState, useEffect, useMemo, useRef } from 'react';
import './MatrixLoader.css';

const MatrixLoader = ({ isLoading }) => {
  const [characters, setCharacters] = useState([]);
  const [highlightChars, setHighlightChars] = useState([]);
  const [codeStreams, setCodeStreams] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingText, setLoadingText] = useState("SYSTEM INITIALIZING");
  const [shouldRender, setShouldRender] = useState(isLoading);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const maxLoadingTime = 8000; // Maximum time the loader can be active (8 seconds)
  
  // Check if device is mobile
  const isMobile = useMemo(() => {
    return window.innerWidth <= 768;
  }, []);
  
  // Optimize grid size for different devices
  const gridSize = useMemo(() => {
    if (window.innerWidth <= 480) {
      return { rows: 12, cols: 18 }; // Smaller grid for mobile
    } else if (window.innerWidth <= 768) {
      return { rows: 15, cols: 25 }; // Medium grid for tablet
    } else {
      return { rows: 20, cols: 35 }; // Full grid for desktop
    }
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Safety mechanism - ensure loader can't be stuck forever
  useEffect(() => {
    // If loader is shown, set a maximum time it can be visible
    if (isLoading) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // Cycle through different loading messages
      const loadingMessages = [
        "SYSTEM INITIALIZING",
        "CONNECTING TO MATRIX",
        "SCANNING NETWORK",
        "ACCESSING DATA",
        "DECRYPTING CONTENT"
      ];
      
      let msgIndex = 0;
      const cycleMessages = () => {
        setLoadingText(loadingMessages[msgIndex % loadingMessages.length]);
        msgIndex++;
        
        if (isLoading && msgIndex < 12) { // Limit to reasonable number of cycles
          setTimeout(cycleMessages, 1500);
        }
      };
      
      cycleMessages();
      
      timeoutRef.current = setTimeout(() => {
        console.log('MatrixLoader safety timeout reached, forcing hide');
        setFadeOut(true);
        
        // Clear any existing fade timer
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        
        fadeTimerRef.current = setTimeout(() => {
          setShouldRender(false);
        }, 500);
      }, maxLoadingTime);
      
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      // Clear the safety timeout if loading has finished
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isLoading]);

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (isLoading) {
      // Clear any existing fade timer
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      
      setShouldRender(true);
      setFadeOut(false);
    } else if (shouldRender) {
      // Only start fade-out if we're currently visible
      setFadeOut(true);
      
      // Clear any existing fade timer
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
      
      // Show "SYSTEM OFFLINE" when exiting
      setLoadingText("SYSTEM OFFLINE");
      
      // Wait for fade out animation to complete before unmounting
      fadeTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        fadeTimerRef.current = null;
      }, 800); // Longer fade-out time for smoother transition
    }
  }, [isLoading, shouldRender]);
  
  // Generate matrix characters for the background grid
  useEffect(() => {
    if (shouldRender) {
      const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
      const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const symbols = "♯≠∞♬♪†‡√∑";
      const digits = "0123456789";
      const chars = katakana + latin + symbols + digits;
      
      // Create character grid - reduce density
      const { rows, cols } = gridSize;
      const charGrid = [];
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Only add a character with 70% probability to create a less dense effect
          if (Math.random() < 0.7) {
            charGrid.push({
              char: chars[Math.floor(Math.random() * chars.length)],
              row: i,
              col: j,
              delay: (i * 0.05) + (j * 0.02),
              duration: Math.random() * 0.6 + 0.4,
              glitch: Math.random() > 0.97 // Occasional glitch effect
            });
          }
        }
      }
      
      setCharacters(charGrid);
      
      // Create highlighted characters that will be more prominent
      const highlights = [];
      for (let i = 0; i < 20; i++) {
        highlights.push({
          char: chars[Math.floor(Math.random() * chars.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: 1 + Math.random() * 0.5,
          glow: Math.random() > 0.5
        });
      }
      setHighlightChars(highlights);
      
      // Create falling code streams
      const streams = [];
      for (let i = 0; i < (isMobile ? 8 : 15); i++) {
        const streamLength = Math.floor(Math.random() * 10) + 5;
        const streamChars = [];
        
        for (let j = 0; j < streamLength; j++) {
          streamChars.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            opacity: 1 - (j / streamLength) * 0.8 // Fade out toward the end of the stream
          });
        }
        
        streams.push({
          x: Math.random() * 100,
          y: -10 - Math.random() * 20, // Start above the screen
          speed: 0.2 + Math.random() * 0.3,
          chars: streamChars
        });
      }
      setCodeStreams(streams);
      
      // Animate the code streams
      let lastTime = 0;
      const animateStreams = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        
        if (deltaTime > 30) { // Limit updates to approximately 30fps for performance
          lastTime = timestamp;
          
          setCodeStreams(prevStreams => 
            prevStreams.map(stream => ({
              ...stream,
              y: stream.y + stream.speed,
              // Reset stream if it moves off-screen
              ...(stream.y > 120 ? {
                y: -10 - Math.random() * 20,
                x: Math.random() * 100,
                chars: stream.chars.map(ch => ({
                  ...ch,
                  char: chars[Math.floor(Math.random() * chars.length)]
                }))
              } : {}),
              // Randomly change characters in stream (Matrix effect)
              chars: stream.chars.map(ch => ({
                ...ch,
                char: Math.random() > 0.95 ? chars[Math.floor(Math.random() * chars.length)] : ch.char
              }))
            }))
          );
          
          // Also update some of the highlight characters
          setHighlightChars(prev => 
            prev.map(item => ({
              ...item,
              char: Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : item.char
            }))
          );
        }
        
        if (shouldRender && !fadeOut) {
          rafRef.current = requestAnimationFrame(animateStreams);
        }
      };
      
      rafRef.current = requestAnimationFrame(animateStreams);
      
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [shouldRender, fadeOut, gridSize, isMobile]);
  
  // Don't render anything if not needed
  if (!shouldRender) return null;
  
  return (
    <div className={`matrix-loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="matrix-rain-effect"></div>
      
      <div className="loader-overlay">
        {/* Static background grid */}
        {characters.map((item, index) => (
          <div
            key={`grid-${index}`}
            className={`loader-char ${item.glitch ? 'glitch' : ''}`}
            style={{
              top: `${(item.row * (isMobile ? 9 : 5)) + 5}%`,
              left: `${(item.col * (isMobile ? 6 : 3)) + 2}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {item.char}
          </div>
        ))}
        
        {/* Highlighted characters */}
        {highlightChars.map((item, index) => (
          <div
            key={`highlight-${index}`}
            className={`highlight-char ${item.glow ? 'glow' : ''}`}
            style={{
              top: `${item.y}%`,
              left: `${item.x}%`,
              transform: `scale(${item.scale})`,
            }}
          >
            {item.char}
          </div>
        ))}
        
        {/* Falling code streams */}
        {codeStreams.map((stream, streamIndex) => (
          <div 
            key={`stream-${streamIndex}`}
            className="code-stream"
            style={{
              top: `${stream.y}%`,
              left: `${stream.x}%`,
            }}
          >
            {stream.chars.map((char, charIndex) => (
              <div 
                key={`stream-${streamIndex}-char-${charIndex}`}
                className="stream-char"
                style={{
                  opacity: char.opacity,
                  top: `${charIndex * 20}px`
                }}
              >
                {char.char}
              </div>
            ))}
          </div>
        ))}
        
        {/* Central loading message */}
        <div className="loader-message">
          <div className="message-bracket">[</div>
          <div className="message-text">{loadingText}</div>
          <div className="message-bracket">]</div>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="access-message">Accessing Mainframe</div>
        </div>
      </div>
    </div>
  );
};

export default MatrixLoader; 