import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "./MatrixLanding.css"; // Import the extracted CSS file
import ScrambledTitle from "./ScrambledTitle"; // Import the Scrambler component
import GlitchText from "./GlitchText"; // Import our new GlitchText component
import Header from "./Header";

const MatrixLanding = () => {
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [trails, setTrails] = useState([]);
  const [titleTrigger, setTitleTrigger] = useState(false);
  const trailId = useRef(0);
  const timeoutIds = useRef([]);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  // Matrix rain effect - Consolidated using heroCharacters logic
  useEffect(() => {
    // Hero-specific rain effect adapted for general background
    const heroCharArray = Array.from(
      { length: 120 }, // Increased count like Professional.jsx
      () => ({
        char: getRandomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100, // Start at random Y positions
        speed: 0.15 + Math.random() * 0.7, // Parameters from Professional.jsx
        opacity: 0.15 + Math.random() * 0.2, // Reduced opacity range
        size: 0.8 + Math.random() * 0.3, // Smaller characters
        green: Math.random() > 0.9, // Less bright characters (10% chance)
        wiggle: Math.random() > 0.8, // Less wiggle (20% chance)
        wiggleAmount: Math.random() * 1.5, // Less wiggle amount
        changeFrequency: 0.05 // Match frequency from Professional.jsx
      })
    );
    setHeroCharacters(heroCharArray);

    // Create a more efficient update mechanism using requestAnimationFrame
    let rafId;
    let lastUpdate = 0;
    const updateInterval = 200; // Slower update rate like Professional.jsx

    const animateRain = (timestamp) => {
      // Throttle updates to reduce CPU usage
      if (timestamp - lastUpdate >= updateInterval) {
        lastUpdate = timestamp;

        setHeroCharacters(prev =>
          prev.map(char => {
            let newY = char.y + char.speed * 0.15; // Slower speed multiplier

            // Reset position if it goes off screen
            if (newY > 100) { // Check against 100vh
              return { // Reset with parameters matching initialization
                ...char,
                y: -10, // Start above screen
                x: Math.random() * 100,
                char: getRandomChar(), // Get new char on reset
                speed: 0.15 + Math.random() * 0.7,
                opacity: 0.15 + Math.random() * 0.2,
                size: 0.8 + Math.random() * 0.3,
                green: Math.random() > 0.9,
                wiggle: Math.random() > 0.8,
                wiggleAmount: Math.random() * 1.5
              };
            }

            // Occasionally change character for more dynamic effect
            const shouldChangeChar = Math.random() < char.changeFrequency; // Use changeFrequency

            return {
              ...char,
              y: newY,
              char: shouldChangeChar ? getRandomChar() : char.char
            };
          })
        );
      }

      rafId = requestAnimationFrame(animateRain);
    };

    // Start animation
    rafId = requestAnimationFrame(animateRain);
    
    // Periodically re-trigger the scramble effect for added visual impact
    const titleInterval = setInterval(() => {
      setTitleTrigger(prev => !prev);
    }, 20000); // Every 20 seconds
    
    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      clearInterval(titleInterval);
    };
  }, []);

  // Cursor trail effect - optimized with throttling
  const addTrail = useCallback((x, y) => {
    const id = trailId.current++;
    const newTrail = { id, x, y };
    
    setTrails(prevTrails => {
      // Limit the number of trails to reduce rendering overhead
      const limitedTrails = [...prevTrails, newTrail].slice(-15);
      return limitedTrails;
    });
    
    const timeoutId = setTimeout(() => {
      setTrails(prevTrails => prevTrails.filter(trail => trail.id !== id));
    }, 800); // Slightly shorter trail duration
    
    timeoutIds.current.push(timeoutId);
  }, []);

  const handleMouseMove = useCallback((e) => {
    // Throttle to create trails every 80ms (reduced frequency)
    if (!handleMouseMove.lastCall || Date.now() - handleMouseMove.lastCall > 80) {
      const { clientX, clientY } = e;
      addTrail(clientX, clientY);
      handleMouseMove.lastCall = Date.now();
    }
  }, [addTrail]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, [handleMouseMove]);

  useEffect(() => {
    // Add animation classes to sections for fade-in effects
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-section');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    // Account for fixed header in the header scroll logic
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Add some padding to account for fixed header (adjust as needed)
      const sections = document.querySelectorAll('section');
      if (sections.length > 0 && scrollPosition === 0) {
        // Adjust first section padding when at the top
        sections[0].style.paddingTop = '80px';
      }
    };
    
    // Initial call to set up sections
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="content">
      {/* Matrix Rain Background - Using the refactored heroCharacters */}
      {/* Removed the old .rain-container div */}

      {/* Cursor Trails */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`
          }}
        />
      ))}

      {/* Fixed Header */}
      <Header />

      <main className="main-content">
        {/* Hero Section  */}
        <section className="hero-section">
          <div className="hero-container">
            {/* Renamed container and drops, removed inline style */}
            <div
              className="matrix-background"
              // Removed inline background/shadow styles
            >
              {heroCharacters.map((data, index) => (
                <div
                  key={`matrix-${index}`} // Changed key prefix
                  className={`matrix-drop ${data.green ? 'bright-green' : ''} ${data.wiggle ? 'wiggle' : ''}`} // Renamed class
                  style={{
                    left: `${data.x}%`,
                    top: `${data.y}%`,
                    opacity: data.opacity,
                    fontSize: `${data.size}rem`,
                    // Updated filter style to match Professional.jsx
                    filter: data.green ? 'drop-shadow(0 0 2px rgba(0, 255, 0, 0.4))' : '',
                    ...(data.wiggle && {
                      '--wiggle-amount': `${data.wiggleAmount}px`
                    })
                  }}
                >
                  {data.char}
                </div>
              ))}
            </div>

            {/* Removed inline styles overriding background */}
            <div className="hero-content centered-layout" style={{
              backgroundColor: "transparent",
              boxShadow: "none",
              backdropFilter: "none"
            }}>
              <div className="katakana-title-wrapper" style={{
                backgroundColor: "transparent",
                boxShadow: "none"
              }}>
                <h1 className="main-hero-title" style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "100vw",
                  margin: "0 auto",
                  padding: "0"
                }}>
                  <div style={{ marginBottom: "1rem", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>Hello, I am</div>
                  <div style={{ 
                    position: "relative", 
                    width: "100%",
                    height: "80px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "visible"
                  }}>
                    <GlitchText 
                      primaryText="Al Fernandez" 
                      alternateTexts={[
                        "a Developer",
                        "a Tech Enthusiast", 
                        "a Gamer",
                        "a Problem Solver",
                        "a PC Technician",
                        "a Web Creator"
                      ]}
                      interval={4000}
                      glitchDuration={2000}
                      className="centered-glitch"
                    />
                  </div>
                </h1>
              </div>
              
              {/* Adding a separator div with fixed height to prevent layout shifts */}
              <div style={{ height: "5rem", width: "100%" }}></div>
              
              <div className="nickname-container" style={{ 
                position: "relative", 
                zIndex: 10,
                padding: "1rem",
                backgroundColor: "transparent",
                borderRadius: "5px",
                /* Added to prevent layout shifts */
                transform: "translateZ(0)",
                willChange: "transform",
                isolation: "isolate"
              }}>
                <h2 className="nickname-label">My nickname is</h2>
                <h2 className="nickname">Al</h2>
              </div>
              
              <div className="description-container">
                <p className="hero-description">
                  <span className="gray-text">Al is</span> <span className="highlight-text">Gamer / Developer / Tech Enthusiast</span>
                </p>
                <p className="hero-subtitle">Built this website with love</p>
              </div>
              
              <Link 
                to="/contact" 
                className="contact-button"
              >
                <span>Write a Letter</span>
                <span className="envelope">✉️</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="hobbies-section">
          <div className="section-container">
            <h2 className="section-title">Al's Hobbies</h2>
            <p className="section-subtitle">I like to stay active. New hobbies are added almost every year.</p>
            
            <div className="hobbies-grid">
              <div className="hobby-card">
                <h3>Computer Tech</h3>
                <p>There's something special about working with computers. I enjoy troubleshooting hardware issues and developing software solutions.</p>
              </div>
              
              <div className="hobby-card">
                <h3>Gaming & Tech</h3>
                <p>I enjoy gaming and keeping up with the latest technology trends. It's not just entertainment, but a way to understand user experience.</p>
              </div>
              
              <div className="hobby-card">
                <h3>Music Enthusiast</h3>
                <p>I also enjoy listening to various music genres and experimenting with digital music production in my spare time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section - Radnaabazar style */}
        <section className="components-section">
          <div className="section-container">
            <h2 className="section-title">Components of Al's Life</h2>
            
            <div className="components-grid">
              <div className="component-item">
                <h3>Computer, IT</h3>
                <p>Interest, Work</p>
              </div>
              
              <div className="component-item">
                <h3>Web Dev</h3>
                <p>Coding, Design</p>
              </div>
              
              <div className="component-item">
                <h3>Tech Repair</h3>
                <p>Hardware, Solutions</p>
              </div>
              
              <div className="component-item">
                <h3>Gaming</h3>
                <p>Entertainment, Strategy</p>
              </div>
              
              <div className="component-item">
                <h3>Networking</h3>
                <p>CISCO, Infrastructure</p>
              </div>
              
              <div className="component-item">
                <h3>AI & ML</h3>
                <p>Learning, Future</p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Routine Section - Radnaabazar style */}
        <section className="routine-section">
          <div className="section-container">
            <h2 className="section-title">Daily Routine</h2>
            
            <div className="routine-timeline">
              <div className="routine-item">
                <div className="time">6:00 AM</div>
                <div className="activity">Wake up</div>
              </div>
              
              <div className="routine-item">
                <div className="time">8:00 AM</div>
                <div className="activity">Work</div>
              </div>
              
              <div className="routine-item">
                <div className="time">12:00 PM</div>
                <div className="activity">Lunch</div>
              </div>
              
              <div className="routine-item">
                <div className="time">5:00 PM</div>
                <div className="activity">Tech Projects</div>
              </div>
              
              <div className="routine-item">
                <div className="time">7:00 PM</div>
                <div className="activity">Gaming/Relaxing</div>
              </div>
              
              <div className="routine-item">
                <div className="time">10:00 PM</div>
                <div className="activity">Sleep</div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Plans Section - Radnaabazar style */}
        <section className="future-plans-section">
          <div className="section-container">
            <h2 className="section-title">Future Plans</h2>
            
            <div className="plans-grid">
              <div className="plan-item">Master AI Development</div>
              <div className="plan-item">Learn Cloud Architecture</div>
              <div className="plan-item">Start a Tech Channel</div>
              <div className="plan-item">Build a Tech Community</div>
              <div className="plan-item">Travel to Tech Conferences</div>
              <div className="plan-item">Learn Japanese</div>
              <div className="plan-item">Build an AI Assistant</div>
              <div className="plan-item">Create Educational Content</div>
            </div>
          </div>
        </section>

        {/* Stats Section - Radnaabazar style */}
        <section className="stats-section">
          <div className="section-container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              
              
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Web Applications</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Tech Skills</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section - Radnaabazar style */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <h2 className="thank-you-title">For visiting my profile</h2>
          <h2 className="thank-you-title">Thank you.</h2>
          <div className="social-links">
            <a href="https://github.com/Alteryxx" className="social-link">GitHub</a>
            <a href="https://www.linkedin.com/in/al-fernandnez-2b0267125/" className="social-link">LinkedIn</a>
            <a href="https://www.facebook.com/Shomaaayyy" className="social-link">Facebook</a>
            <a href="#" className="social-link">Email</a>
          </div>
          <p className="footer-text">Al Fernandez - Portfolio 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default MatrixLanding;
