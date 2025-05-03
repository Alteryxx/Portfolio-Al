import { useState, useEffect, useRef } from 'react';

const CursorTrail = ({ 
  color = '#00ff00',  
  size = 16,          
  opacity = 0.5,      
  length = 15,        
  speed = 5,          
  useChars = true,    
  fallSpeed = 1,      
}) => {
  const [trail, setTrail] = useState([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const frameRef = useRef(null);
  const lastFrameTime = useRef(Date.now());
  
  const getRandomChar = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ/*-+<>?!@#$%^&*()~';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  useEffect(() => {
    if (useChars && fallSpeed > 0) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        @keyframes fall {
          0% {
            transform: translate(-50%, -50%);
          }
          100% {
            transform: translate(-50%, calc(-50% + ${fallSpeed * 50}px));
          }
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, [useChars, fallSpeed]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      isMoving.current = true;
      
      setTimeout(() => {
        isMoving.current = false;
      }, 100);
    };
    
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isMoving.current = true;
        
        setTimeout(() => {
          isMoving.current = false;
        }, 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    const updateTrail = () => {
      const now = Date.now();
      const delta = now - lastFrameTime.current;
      
      if (delta > 16) { 
        lastFrameTime.current = now;
        
        setTrail(prevTrail => {
          if (isMoving.current) {
            const newTrail = [{ 
              x: lastMousePos.current.x, 
              y: lastMousePos.current.y,
              opacity: opacity,
              id: now,
              char: useChars ? getRandomChar() : '',
              scale: 1.0,
            }, ...prevTrail];
            
            return newTrail
              .map((dot, index) => ({
                ...dot, 
                opacity: Math.max(0, dot.opacity - (opacity / (length * speed))),
                scale: Math.max(0.5, dot.scale - (0.5 / length)),
              }))
              .filter((dot, index) => index < length && dot.opacity > 0.05);
          }
          
          return prevTrail
            .map(dot => ({
              ...dot,
              opacity: Math.max(0, dot.opacity - (opacity / (length * speed * 0.5))),
              scale: Math.max(0.5, dot.scale - (0.5 / length)),
            }))
            .filter(dot => dot.opacity > 0.05);
        });
      }
      
      frameRef.current = requestAnimationFrame(updateTrail);
    };
    
    frameRef.current = requestAnimationFrame(updateTrail);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [length, opacity, speed, useChars]);
  
  const getAnimationStyles = (index) => {
    if (fallSpeed > 0 && index > 0) {
      return {
        animationName: 'fall',
        animationDuration: `${2/fallSpeed}s`,
        animationTimingFunction: 'ease-in',
        animationFillMode: 'forwards',
      };
    }
    return {};
  };
  
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', 
      zIndex: 9999, 
    }}>
      {trail.map((dot, index) => (
        useChars ? (
          <div
            key={dot.id}
            style={{
              position: 'absolute',
              fontSize: `${size * dot.scale}px`,
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: color,
              opacity: dot.opacity,
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              transform: 'translate(-50%, -50%)',
              textShadow: `0 0 ${size/3}px ${color}`,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
              ...getAnimationStyles(index),
            }}
          >
            {dot.char}
          </div>
        ) : (
          <div
            key={dot.id}
            style={{
              position: 'absolute',
              width: `${size * dot.scale}px`,
              height: `${size * dot.scale}px`,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: dot.opacity,
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${size/2}px ${color}`,
              transition: 'opacity 0.05s ease',
              pointerEvents: 'none',
              willChange: 'transform, opacity',
            }}
          />
        )
      ))}
    </div>
  );
};

export default CursorTrail; 