import React, { useState, useEffect, useRef } from 'react';
import './GlitchText.css';

// GlitchText component that makes text glitch from one value to another
const GlitchText = ({ 
  primaryText = "Al Fernandez", 
  alternateText, // kept for backward compatibility
  alternateTexts = [],
  className = "",
  interval = 5000, // Time between transitions in ms
  glitchDuration = 1500 // How long the glitch effect should last in ms
}) => {
  // Convert old API to new API for backward compatibility
  const allAlternateTexts = alternateTexts.length > 0 ? alternateTexts : (alternateText ? [alternateText] : ["Developer"]);
  
  const [currentText, setCurrentText] = useState(primaryText);
  const [alternateIndex, setAlternateIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const textRef = useRef(null);
  const intervalRef = useRef(null);
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  
  // Helper function to get a random character
  const getRandomChar = () => {
    return chars[Math.floor(Math.random() * chars.length)];
  };
  
  useEffect(() => {
    // Function to start the glitch effect
    const startGlitchEffect = () => {
      if (isGlitching) return; // Prevent multiple glitches from starting
      
      setIsGlitching(true);
      
      // Determine if we're going from primary to alternate or alternate to primary
      const isShowingPrimary = currentText === primaryText;
      
      // If showing primary, get the next alternate text
      // If showing alternate, go back to primary
      const originalText = currentText;
      let targetText;
      
      if (isShowingPrimary) {
        // Going from primary to alternate
        targetText = allAlternateTexts[alternateIndex];
        // Prepare the index for next time
        setAlternateIndex((alternateIndex + 1) % allAlternateTexts.length);
      } else {
        // Going from alternate back to primary
        targetText = primaryText;
      }
      
      // The number of steps for the glitch effect
      const glitchSteps = 8;
      const stepDuration = glitchDuration / glitchSteps;
      
      // Create a series of timeouts for the glitch effect
      for (let i = 0; i < glitchSteps; i++) {
        setTimeout(() => {
          if (!textRef.current) return;
          
          // First half of steps - go to random characters
          if (i < glitchSteps / 2) {
            // Generate a glitched version of the text
            const length = originalText.length;
            let glitchedText = '';
            
            for (let j = 0; j < length; j++) {
              // Chance of replacing with random character increases as we progress
              const replaceChance = (i / (glitchSteps / 2)) * 1.0; // Up to 90% chance to replace
              if (Math.random() < replaceChance) {
                glitchedText += getRandomChar();
              } else {
                glitchedText += originalText[j] || '';
              }
            }
            
            setCurrentText(glitchedText);
          } 
          // Second half of steps - transition to target text
          else {
            const progress = (i - glitchSteps / 2) / (glitchSteps / 2);
            const length = Math.max(originalText.length, targetText.length);
            let transitionText = '';
            
            for (let j = 0; j < length; j++) {
              // As progress increases, higher chance to show target character
              const showTargetChar = Math.random() < progress;
              
              if (showTargetChar && j < targetText.length) {
                transitionText += targetText[j];
              } else if (j < originalText.length) {
                // Show glitch character or original depending on progress
                transitionText += Math.random() < 0.3 ? getRandomChar() : originalText[j];
              } else {
                transitionText += getRandomChar();
              }
            }
            
            setCurrentText(transitionText);
            
            // On the last step, make sure we set the exact target text
            if (i === glitchSteps - 1) {
              setTimeout(() => {
                setCurrentText(targetText);
                setIsGlitching(false);
              }, stepDuration / 2);
            }
          }
        }, i * stepDuration);
      }
    };
    
    // Set up an interval to trigger the glitch effect
    intervalRef.current = setInterval(startGlitchEffect, interval);
    
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentText, primaryText, alternateIndex, allAlternateTexts, interval, glitchDuration, isGlitching]);
  
  return (
    <span 
      ref={textRef}
      className={`glitch-text ${isGlitching ? 'glitching' : ''} ${className}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        minWidth: className.includes('centered-glitch') ? 'auto' : `${Math.max(
          primaryText.length, 
          ...allAlternateTexts.map(text => text.length)
        )}ch`,
        // Ensure consistent height
        minHeight: '1.2em',
        // Apply hardware acceleration and layout isolation
        transform: 'translateZ(0)',
        willChange: 'transform',
        // Center text
        textAlign: 'center',
        margin: '0 auto'
      }}
    >
      {currentText}
    </span>
  );
};

export default GlitchText; 