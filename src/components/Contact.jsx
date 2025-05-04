import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import Header from "./Header";
import ScrambledTitle from "./ScrambledTitle";

const Contact = () => {
  const [matrixCharacters, setMatrixCharacters] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState(null);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For Netlify Forms when JavaScript is enabled
    const form = e.target;
    const formData = new FormData(form);
    
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
      setFormStatus("success");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }, 3000);
    })
    .catch((error) => {
      console.error("Form submission error:", error);
      setFormStatus("error");
    });
  };

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  // Matrix rain effect
  useEffect(() => {
    // Matrix rain effect for background
    const matrixCharArray = Array.from(
      { length: 150 },
      () => ({
        char: getRandomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100, 
        speed: 0.15 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.2,
        size: 0.8 + Math.random() * 0.4,
        green: Math.random() > 0.9, // 10% chance of being bright green
        wiggle: Math.random() > 0.8, // 20% chance for wiggle effect
        wiggleAmount: Math.random() * 2
      })
    );
    setMatrixCharacters(matrixCharArray);

    // Animate the matrix rain
    const updateInterval = 200; // milliseconds between updates
    let lastUpdate = 0;
    
    const animateRain = (timestamp) => {
      if (timestamp - lastUpdate > updateInterval) {
        lastUpdate = timestamp;
        
        setMatrixCharacters(prev => prev.map(char => {
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
              opacity: 0.15 + Math.random() * 0.2,
              size: 0.8 + Math.random() * 0.4,
              green: Math.random() > 0.9,
              wiggle: Math.random() > 0.8,
              wiggleAmount: Math.random() * 2
            };
          }
          
          // Occasionally change character
          if (Math.random() < 0.05) {
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

  return (
    <div className="contact-page">
      {/* Matrix background effect */}
      <div className="matrix-background">
        {matrixCharacters.map((data, index) => (
          <div
            key={`matrix-${index}`}
            className={`matrix-char ${data.green ? 'bright-green' : ''} ${data.wiggle ? 'wiggle' : ''}`}
            style={{
              left: `${data.x}%`,
              top: `${data.y}%`,
              opacity: data.opacity,
              fontSize: `${data.size}rem`,
              filter: data.green ? 'drop-shadow(0 0 3px #00ff00)' : '',
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

      <main className="contact-content">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <ScrambledTitle
              texts={["Contact Me"]}
              delay={3000}
              firstPhraseDelay={1000}
              className="contact-hero-title"
              loop={false}
            />
            <p className="contact-tagline">
              Connect with me for <span className="highlight-text">projects</span>, 
              <span className="highlight-text"> opportunities</span>, or just to 
              <span className="highlight-text"> say hello</span>.
            </p>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="form-container">
              <div className="terminal-header">
                <span className="terminal-title">message.sh</span>
                <div className="terminal-controls">
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                  <span className="control close"></span>
                </div>
              </div>

              <div className="terminal-content">
                {formStatus === "success" ? (
                  <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : formStatus === "error" ? (
                  <div className="error-message">
                    <div className="error-icon">⚠</div>
                    <h3>Message Not Sent</h3>
                    <p>There was a problem sending your message. Please try again or contact me directly via email.</p>
                    <button 
                      className="retry-button" 
                      onClick={() => setFormStatus(null)}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <form 
                    className="contact-form" 
                    onSubmit={handleSubmit}
                    data-netlify="true"
                    name="portfolio-contact"
                    method="POST"
                    netlify-honeypot="bot-field"
                  >
                    {/* Hidden input for Netlify Forms */}
                    <input type="hidden" name="form-name" value="portfolio-contact" />
                    <input type="hidden" name="bot-field" />
                    <input type="hidden" name="subject" value={`New contact from ${formState.name}: ${formState.subject}`} />
                    
                    <div className="form-prompt">
                      <span className="prompt-symbol">$</span>
                      <span className="prompt-command">send_message</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">NAME:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">EMAIL:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">SUBJECT:</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder="Enter subject"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">MESSAGE:</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        rows="5"
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="submit-button">
                      SEND MESSAGE
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="contact-info">
              <div className="terminal-header">
                <span className="terminal-title">contact_details.txt</span>
                <div className="terminal-controls">
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                  <span className="control close"></span>
                </div>
              </div>

              <div className="terminal-content">
                <div className="info-section">
                  <h3 className="info-heading">Direct Contact</h3>
                  <div className="info-group">
                    <div className="info-label">EMAIL:</div>
                    <div className="info-value">
                      <a href="mailto:dadaedalusdivine69@gmail.com">dadaedalusdivine69@gmail.com</a>
                    </div>
                  </div>
                  <div className="info-group">
                    <div className="info-label">LOCATION:</div>
                    <div className="info-value">Sa bahay ni kuya</div>
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="info-heading">Social Profiles</h3>
                  <div className="social-links">
                    <a href="https://github.com/Alteryxx" className="social-link github">
                      <i className="fa fa-github"></i>
                      <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/al-fernandnez-2b0267125/" className="social-link linkedin">
                      <i className="fa fa-linkedin"></i>
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://www.facebook.com/Shomaaayyy" className="social-link facebook">
                      <i className="fa fa-facebook"></i>
                      <span>Facebook</span>
                    </a>
                    
                  </div>
                </div>

                <div className="info-section availability">
                  <h3 className="info-heading">Availability</h3>
                  <div className="availability-status">
                    <span className="status-indicator available"></span>
                    <span className="status-text">Available for new projects</span>
                  </div>
                  <div className="response-time">
                    <span className="info-label">RESPONSE TIME:</span>
                    <span className="info-value">24-48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">What services do you offer?</h3>
              <p className="faq-answer">
                I specialize in full-stack web development, including frontend UI/UX design, 
                backend development, and database optimization. I also provide IT support and hardware repair services.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What is your typical project timeline?</h3>
              <p className="faq-answer">
                Project timelines vary depending on scope and complexity. A typical website might 
                take 2-4 weeks, while more complex applications could take 1-3 months. I'll provide 
                a detailed timeline during our initial consultation.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you offer maintenance services?</h3>
              <p className="faq-answer">
                Yes, I offer ongoing maintenance and support for all projects I develop. This includes 
                regular updates, security patches, and content updates as needed.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do we get started on a project?</h3>
              <p className="faq-answer">
                Getting started is easy! Just fill out the contact form with details about your project, 
                and I'll get back to you within 24-48 hours to schedule an initial consultation.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="copyright">© 2025 Al Fernandez - All Rights Reserved</p>
          <p className="footer-tagline">Building digital experiences one line of code at a time</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact; 