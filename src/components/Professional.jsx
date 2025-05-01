import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Professional.css";
import Header from "./Header";
import ScrambledTitle from "./ScrambledTitle";

const Professional = () => {
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  // Matrix rain effect - reduced opacity for more subtle effect
  useEffect(() => {
    // Matrix rain effect for background
    const heroCharArray = Array.from(
      { length: 120 }, // Keeping good density
      () => ({
        char: getRandomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.15 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.2, // Reduced opacity range (0.15-0.35)
        size: 0.8 + Math.random() * 0.3, // Smaller characters
        green: Math.random() > 0.9, // 10% chance of being bright green (less bright characters)
        wiggle: Math.random() > 0.8, // 20% chance for wiggle effect
        wiggleAmount: Math.random() * 1.5 // Less wiggle
      })
    );
    setHeroCharacters(heroCharArray);

    // Animate the matrix rain
    const updateInterval = 200; // milliseconds between updates
    let lastUpdate = 0;
    
    const animateRain = (timestamp) => {
      if (timestamp - lastUpdate > updateInterval) {
        lastUpdate = timestamp;
        
        setHeroCharacters(prev => prev.map(char => {
          // Move character down
          let newY = char.y + char.speed * 0.15;
          
          // Reset if off-screen
          if (newY > 100) {
            newY = -10;
            return {
              ...char,
              y: newY,
              x: Math.random() * 100,
              char: getRandomChar(),
              speed: 0.15 + Math.random() * 0.7,
              opacity: 0.15 + Math.random() * 0.2, // Reduced opacity on reset
              size: 0.8 + Math.random() * 0.3,
              green: Math.random() > 0.9,
              wiggle: Math.random() > 0.8,
              wiggleAmount: Math.random() * 1.5
            };
          }
          
          // Occasionally change character
          if (Math.random() < 0.05) { // Less frequent character changes
            return { ...char, y: newY, char: getRandomChar() };
          }
          
          return { ...char, y: newY };
        }));
      }
      
      // Continue animation loop
      requestAnimationFrame(animateRain);
    };
    
    const animationId = requestAnimationFrame(animateRain);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Project data
  const projects = [
    {
      title: "Portfolio Website",
      description: "A matrix-themed personal portfolio website showcasing skills and projects.",
      technologies: ["React", "CSS", "JavaScript"],
      image: "matrix-portfolio.jpg" // Replace with actual image path
    },
    {
      title: "Tech Repair System",
      description: "A comprehensive system for tracking and managing computer repairs and maintenance.",
      technologies: ["Node.js", "Express", "MongoDB"],
      image: "tech-repair.jpg" // Replace with actual image path
    },
    {
      title: "Network Configuration Tool",
      description: "A utility for automating and optimizing network configuration across multiple devices.",
      technologies: ["Python", "Cisco API", "Network Protocols"],
      image: "network-tool.jpg" // Replace with actual image path
    },
    {
      title: "Smart Home Integration",
      description: "A custom solution for integrating various smart home devices into a unified control system.",
      technologies: ["IoT", "Raspberry Pi", "API Integration"],
      image: "smart-home.jpg" // Replace with actual image path
    }
  ];

  // Skills data
  const skills = [
    {
      category: "Programming",
      items: ["JavaScript", "Python", "HTML/CSS", "React", "Node.js"]
    },
    {
      category: "Computer Systems",
      items: ["Hardware Diagnostics", "System Maintenance", "OS Configuration", "Data Recovery"]
    },
    {
      category: "Networking",
      items: ["Network Setup", "Troubleshooting", "Security Implementation", "CISCO"]
    }
  ];

  // Education data
  const education = [
    {
      degree: "Bachelor of Science in Information Technology",
      institution: "Western Mindanao State University",
      period: "2021 - Present",
      status: "4th Year Student",
      description: "Focusing on software development, network administration, and database management."
    },
    {
      degree: "TESDA NC II Certification",
      institution: "Technical Education and Skills Development Authority",
      period: "2022",
      status: "Certified",
      description: "Computer Systems Servicing National Certificate II (CSS NC II) holder, trained in diagnosing, troubleshooting, and maintaining computer systems."
    }
  ];

  // Experience data
  const experiences = [
    {
      position: "Computer Technician",
      company: "Tech Solutions Inc.",
      period: "2020 - Present",
      description: "Providing comprehensive technical support and maintenance for hardware and software systems."
    },
    {
      position: "Freelance Web Developer",
      company: "Self-employed",
      period: "2018 - Present",
      description: "Developing custom websites and web applications for various clients with focus on responsive design."
    },
    {
      position: "IT Support Specialist",
      company: "Innovate Systems",
      period: "2018 - 2020",
      description: "Resolved technical issues and provided support for a diverse range of computer systems and networks."
    }
  ];

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('.footer');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="professional-page">
      {/* Global matrix rain effect with reduced opacity */}
      <div className="matrix-background">
        {heroCharacters.map((data, index) => (
          <div
            key={`matrix-${index}`}
            className={`matrix-drop ${data.green ? 'bright-green' : ''} ${data.wiggle ? 'wiggle' : ''}`}
            style={{
              left: `${data.x}%`,
              top: `${data.y}%`,
              opacity: data.opacity,
              fontSize: `${data.size}rem`,
              filter: data.green ? 'drop-shadow(0 0 2px rgba(0, 255, 0, 0.4))' : '', // Reduced glow
              ...(data.wiggle && {
                '--wiggle-amount': `${data.wiggleAmount}px`
              })
            }}
          >
            {data.char}
          </div>
        ))}
      </div>
      
      {/* Fixed Header */}
      <Header />

      <main className="professional-content">
        {/* Hero Section */}
        <section className="professional-hero">
          <div className="professional-hero-content">
            <div className="katakana-title-wrapper">
              {/* Split the title into two lines for better display */}
              <ScrambledTitle
                texts={["Hello again, I am", "Al Fernandez"]}
                delay={3000}
                firstPhraseDelay={2000}
                className="main-hero-title"
                loop={false}
              />
            </div>
            <div className="professional-intro">
              <p className="professional-tagline">
                Hi, I'm Al Fernandez, a passionate Computer Technician / Kind of Developer with a love for creating innovative digital experiences. A TESDA Certified NC 2 Holder for Computer System Servicing, sharpening my problem-solving skills and staying up-to-date with the latest tech trends and Repairs.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills-section" className="skills-section">
          <div className="section-container">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-container">
              {skills.map((skillGroup, index) => (
                <div key={index} className="skill-group">
                  <h3 className="skill-category">{skillGroup.category}</h3>
                  <ul className="skill-list">
                    {skillGroup.items.map((skill, idx) => (
                      <li key={idx} className="skill-item">
                        <span className="skill-icon">〉</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education-section" className="education-section">
          <div className="section-container">
            <h2 className="section-title">Education & Certifications</h2>
            <div className="education-timeline">
              {education.map((edu, index) => (
                <div key={index} className="education-card">
                  <div className="education-dot"></div>
                  <div className="education-content">
                    <h3 className="education-degree">{edu.degree}</h3>
                    <div className="education-meta">
                      <span className="education-institution">{edu.institution}</span>
                      <span className="education-period">{edu.period}</span>
                    </div>
                    <div className="education-status">{edu.status}</div>
                    <p className="education-description">{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects-section" className="projects-section">
          <div className="section-container">
            <h2 className="section-title">Professional Projects</h2>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-image-container">
                    <div className="project-image placeholder">
                      {/* Replace with actual images */}
                      <div className="matrix-placeholder">{project.title.charAt(0)}</div>
                    </div>
                  </div>
                  <div className="project-details">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="technologies">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience-section" className="experience-section">
          <div className="section-container">
            <h2 className="section-title">Work Experience</h2>
            <div className="experience-timeline">
              {experiences.map((exp, index) => (
                <div key={index} className="experience-card">
                  <div className="experience-dot"></div>
                  <div className="experience-content">
                    <h3 className="experience-position">{exp.position}</h3>
                    <div className="experience-meta">
                      <span className="experience-company">{exp.company}</span>
                      <span className="experience-period">{exp.period}</span>
                    </div>
                    <p className="experience-description">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="contact-cta-section">
          <div className="section-container">
            <h2 className="cta-title">Want to Collaborate?</h2>
            <p className="cta-text">If you're looking for a computer technician or developer for your next project, let's connect!</p>
            <a 
              href="#contact" 
              className="contact-button"
              onClick={scrollToContact}
            >
              <span>Get in Touch</span>
              <span className="envelope">✉️</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="thank-you-title">Thank you for viewing my work</h2>
          <div className="social-links">
            <a href="https://github.com/Alteryxx" className="social-link">GitHub</a>
            <a href="https://www.linkedin.com/in/al-fernandnez-2b0267125/" className="social-link">LinkedIn</a>
            <a href="https://www.facebook.com/Shomaaayyy" className="social-link">Facebook</a><a href="#" className="social-link">Email</a>
          </div>
          <p className="footer-text">Al Fernandez - Portfolio 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Professional; 