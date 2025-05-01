import React, { useState, useEffect, useRef } from 'react';
import './ScrambledTitle.css'; // Import the CSS file

// TextScramble class for text scrambling animation
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789♯≠∞♬♪†‡√∑';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 10);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.65) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ScrambledTitle component
const ScrambledTitle = ({ 
  texts, 
  delay = 2000, 
  firstPhraseDelay = null,
  className = '', 
  loop = true, 
  triggerRescramble = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstPhrase, setIsFirstPhrase] = useState(true);
  const textRef = useRef(null);
  const fx = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // We need to handle multi-line texts differently than rotating phrases
  const isMultiLine = !loop && texts.length > 1;
  
  // Set up the text scramble effect
  useEffect(() => {
    if (textRef.current && !fx.current) {
      fx.current = new TextScramble(textRef.current);
      // Start with the first text
      fx.current.setText(texts[0]).then(() => {
        setIsInitialized(true);
      });
    }
  }, [texts]);
  
  // Handle text rotation
  useEffect(() => {
    if (!isInitialized) return;
    
    // If there's only one phrase, don't cycle after the initial scramble
    if (texts.length === 1 && !isFirstPhrase) {
      return;
    }
    
    const currentDelay = (isFirstPhrase && firstPhraseDelay !== null) 
      ? firstPhraseDelay 
      : delay;
    
    const timer = setTimeout(() => {
      // Only change index if we're looping through phrases
      if (texts.length > 1 && loop) {
        const nextIndex = (currentIndex + 1) % texts.length;
        setCurrentIndex(nextIndex);
        
        if (fx.current) {
          fx.current.setText(texts[nextIndex]);
        }
      }
      
      if (isFirstPhrase) {
        setIsFirstPhrase(false);
      }
      
    }, currentDelay);
    
    return () => clearTimeout(timer);
  }, [currentIndex, delay, firstPhraseDelay, isFirstPhrase, isInitialized, loop, texts]);
  
  // Handle rescramble trigger
  useEffect(() => {
    if (triggerRescramble && fx.current && isInitialized) {
      fx.current.setText(texts[currentIndex]);
    }
  }, [triggerRescramble, currentIndex, texts]);

  // Render either a single scrambled container for rotating phrases,
  // or multiple lines for multi-line static text
  return (
    <div 
      className={`scrambled-title ${className}`} 
      style={{ 
        position: 'relative', 
        zIndex: 50,
        padding: '0.5rem 0',
        width: '100%'
      }}
    >
      {isMultiLine ? (
        // For multi-line texts like "Hello again, I am" followed by "Al Fernandez"
        texts.map((text, idx) => (
          <div key={idx} className="scrambled-line">
            <span className="scrambled-text static-text">{text}</span>
          </div>
        ))
      ) : (
        // For single rotating phrase
        <div className="scrambled-line">
          <span 
            ref={textRef}
            className="scrambled-text"
          ></span>
        </div>
      )}
    </div>
  );
};

export default ScrambledTitle;
