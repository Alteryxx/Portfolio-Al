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
          <section className="about-me">
  <h2>About Me</h2>
  <p>
    Hi, I'm Al Fernandez, a passionate Computer Technecian/ Kind of Developer with a love for creating innovative digital experiences.
    A TESDA Certified NC 2 Holder for Computer System Servicing, sharpening my problem-solving skills and staying up-to-date 
    with the latest tech trends and Repairs.
  </p>

  <h3>Skills & Expertise</h3>
  <ul>
    <li>Computer System Servicing</li>
    <li>Server Management Specialist</li>
    <li>UI/UX Design & Animation</li>
    <li>Networking Connection for CISCO Integration Products </li>
    
  </ul>

  <h3>Career Goals</h3>
  <p>
    My goal is to continue pushing the boundaries of web development, specializing in AI-powered applications 
    and encouraging the freedom of repairing devices. I aim to contribute to open-source projects and organizing Tech tips.
  </p>

  <h3>Fun Facts & Hobbies</h3>
  <p>
    When I’m not coding, I enjoy Gaming , Watching some Tech Repairs as well as experimenting with digital art. I believe 
    in continuous learning!
  </p>

  <div className="cta">
    <p>Want to collaborate or just say hi?</p>
    <button className="button primary-button">Get in Touch</button>
  </div>
</section>


        </section>

       
      </main>

      
    </div>
  );
};

export default MatrixLanding;
