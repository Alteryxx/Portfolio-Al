import { useEffect, useState, useRef } from "react";
import "./Professional.css";
import Header from "./Header";
import GlitchText from "./GlitchText";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Professional = () => {
  const navigate = useNavigate();
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [scrollY, setScrollY] = useState(0); // eslint-disable-line no-unused-vars
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  // Matrix rain effect 
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
      id: "lifestream-platform",
      title: "LifeStream: Blood Donation Platform",
      description: "A comprehensive online application platform for blood donation and blood bank management with emergency services. This system improves the entire blood donation process from donor registration to timely distribution to hospitals, featuring donor management, blood bank operations, and emergency response modules.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      image: "/projects/1.jpg"
    },
    {
      id: "verdevista-garden-shop",
      title: "VerdeVista: Grow Green, Live Beautifully",
      description: "Your online destination for decorative plants, garden ornaments, and fresh produce starters. Browse our curated selection of indoor and outdoor plants, garden ornaments, and fruit and vegetable starters—all available online for fast, reliable delivery.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      image: "/projects/6.jpg"
    },
    {
      id: "dtr-management-system",
      title: "DTR Management Information System",
      description: "Streamlining Attendance: A comprehensive system for managing daily time records (DTR) in academic and corporate environments. This platform efficiently handles employee attendance tracking, leave management, and reporting, making administrative tasks simpler and more accurate.",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      image: "/projects/9.jpg"
    },
    
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

  // Certifications and Participation data
  const certifications = [
    {
      title: "Cisco Certified Technician Routing & Switching",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/1.jpg",
      certificateUrl: "/certs/1.jpg",
      duration: "6hrs 34mins"
    },
    {
      title: "Cisco Certified Support Technician CCST Networking",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/2.jpg",
      certificateUrl: "/certs/2.jpg",
      duration: "10hrs 10mins"
    },
    {
      title: "Windows 10 Networking",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/3.jpg",
      certificateUrl: "/certs/3.jpg",
      duration: "1hr 15mins"
    },
    {
      title: "Windows 10 Security",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/4.jpg",
      certificateUrl: "/certs/4.jpg",
      duration: "2hrs 10mins"
    },
    {
      title: "Windows 11 Essential Training",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/5.jpg",
      certificateUrl: "/certs/5.jpg",
      duration: "4hrs 1min"
    },
    {
      title: "Cybersecurity Foundations",
      issuer: "LinkedIn Learning",
      date: "2023",
      image: "/certs/6.jpg",
      certificateUrl: "/certs/CertificateOfCompletion_Cybersecurity Foundations_page-0001.jpg",
      duration: "3hrs 33min"
    }
    
  ];

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('.footer');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Custom arrows for slider
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} slider-next-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <span className="arrow-icon">→</span>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} slider-prev-arrow`}
        style={{ ...style }}
        onClick={onClick}
      >
        <span className="arrow-icon">←</span>
      </div>
    );
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 8,
    accessibility: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  // Mobile slider settings with optimized touch behavior
  const mobileSliderSettings = {
    ...sliderSettings,
    arrows: false,
    dots: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 5,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '15px',
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    useCSS: true, // Enables hardware acceleration
    useTransform: true, // Enables hardware acceleration
    waitForAnimate: false // Makes swipe more responsive
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Navigate to project detail
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
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
              {/* Replace the ScrambledTitle with static text and GlitchText */}
              <h1 className="main-hero-title">
                Hello again, I am <GlitchText 
                  primaryText="Al Fernandez" 
                  alternateTexts={[
                    "a Developer",
                    "a Tech Specialist", 
                    "a Computer Technician",
                    "a Web Developer",
                    "an IT Professional",
                    "a Network Specialist"
                  ]}
                  interval={5000}
                  glitchDuration={2000}
                  className="centered-glitch"
                />
              </h1>
            </div>
            <div className="professional-intro">
              <p className="professional-tagline">
                Hi, I&apos;m Al Fernandez, a passionate Computer Technician / Kind of Developer with a love for creating innovative digital experiences. A TESDA Certified NC 2 Holder for Computer System Servicing, sharpening my problem-solving skills and staying up-to-date with the latest tech trends and Repairs.
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

        {/* Certifications Section */}
        <section id="certifications-section" className="certifications-section">
          <div className="section-container">
            <h2 className="section-title">Professional Certifications</h2>
            
            {/* Certifications */}
            <div className="subsection-title">
              <h3>Technology & Skills Certifications</h3>
              <span className="subtitle-caption">Swipe to explore my qualifications</span>
            </div>
            <div className="slider-container">
              {windowWidth <= 768 ? (
                // Mobile view: Use optimized slider settings for touch
                <Slider {...mobileSliderSettings}>
                  {certifications.map((cert, index) => (
                    <div key={index} className="slider-item">
                      <div className="certificate-card">
                        <div className="certificate-ribbon"></div>
                        <div className="certificate-image-container">
                          <div className="certificate-image">
                            {/* Image container with fallback */}
                            {cert.image ? (
                              <img src={cert.image} alt={cert.title} />
                            ) : (
                              <div className="matrix-placeholder-cert">
                                {cert.title.charAt(0)}{cert.title.split(' ')[1]?.charAt(0) || ''}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="certificate-details">
                          <h4 className="certificate-title">{cert.title}</h4>
                          <div className="certificate-meta">
                            <span className="certificate-issuer">{cert.issuer}</span>
                            <span className="certificate-date">{cert.date}</span>
                          </div>
                          {cert.duration && (
                            <div className="certificate-duration">
                              <span className="duration-icon">⏱️</span>
                              <span>{cert.duration}</span>
                            </div>
                          )}
                          <a 
                            href={cert.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="view-certificate-button"
                          >
                            <span>View Certificate</span>
                            <span className="certificate-icon">📄</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                // Desktop view: Use slider with custom arrows
                <Slider {...sliderSettings}>
                  {certifications.map((cert, index) => (
                    <div key={index} className="slider-item">
                      <div className="certificate-card">
                        <div className="certificate-ribbon"></div>
                        <div className="certificate-image-container">
                          <div className="certificate-image">
                            {/* Image container with fallback */}
                            {cert.image ? (
                              <img src={cert.image} alt={cert.title} />
                            ) : (
                              <div className="matrix-placeholder-cert">
                                {cert.title.charAt(0)}{cert.title.split(' ')[1]?.charAt(0) || ''}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="certificate-details">
                          <h4 className="certificate-title">{cert.title}</h4>
                          <div className="certificate-meta">
                            <span className="certificate-issuer">{cert.issuer}</span>
                            <span className="certificate-date">{cert.date}</span>
                          </div>
                          {cert.duration && (
                            <div className="certificate-duration">
                              <span className="duration-icon">⏱️</span>
                              <span>{cert.duration}</span>
                            </div>
                          )}
                          <a 
                            href={cert.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="view-certificate-button"
                          >
                            <span>View Certificate</span>
                            <span className="certificate-icon">📄</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects-section" className="projects-section">
          <div className="section-container">
            <h2 className="section-title">Professional Projects</h2>
            <div className="projects-list">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="project-row"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="technologies">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      <a 
                        href={`https://github.com/yourusername/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-code-link"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent double navigation
                        }}
                      >
                        <span className="link-icon">💻</span> Source Code
                      </a>
                      <button 
                        className="view-details-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent double navigation
                          handleProjectClick(project.id);
                        }}
                      >
                        View Project Details <span className="arrow-icon">→</span>
                      </button>
                    </div>
                  </div>
                  <div className="project-image-container">
                    <div className="project-image">
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="project-img"
                        />
                      ) : (
                        <div className="matrix-placeholder">{project.title.charAt(0)}</div>
                      )}
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
            <p className="cta-text">If you&apos;re looking for a computer technician or developer for your next project, let&apos;s connect!</p>
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
            <a href="https://www.facebook.com/Shomaaayyy" className="social-link">Facebook</a>
            <a href="#" className="social-link">Email</a>
          </div>
          <p className="footer-text">Al Fernandez - Portfolio 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Professional; 