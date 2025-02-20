import React, { useEffect, useState } from "react";
import "./MatrixLanding.css"; // Import the extracted CSS file
import ScrambledTitle from "./ScrambledTitle"; // Import the Scrambler component

const MatrixLanding = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    const charArray = Array.from(
      { length: 50 },
      () => chars[Math.floor(Math.random() * chars.length)]
    );
    setCharacters(charArray);
  }, []);

  return (
    <div className="content">
      {/* Matrix Rain Background */}
      <div className="rain-container">
        {characters.map((char, index) => (
          <div
            key={index}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <header className="header">
        <div className="logo">Al Fernandez</div>
        <nav className="nav">
          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Share
          </a>
          <a href="#" className="nav-link">
            My Contact
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          {/* Scrambled Title Animates Words One by One in a Loop */}
          <ScrambledTitle texts={["Welcome To", "My Portfolio"]} delay={2000} />
          
          <p className="hero-text">All Arround Services</p>
          <div className="button-group">
            <button className="button primary-button">My Skills</button>
            <button className="button secondary-button">Learn More</button>
          </div>
        </section>

       
      </main>

      
    </div>
  );
};

export default MatrixLanding;
