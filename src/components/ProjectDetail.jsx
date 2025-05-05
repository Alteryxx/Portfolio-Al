import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Header from "./Header";
import "./ProjectDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  // Matrix rain effect characters
  const charsRef = React.useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");

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
        green: Math.random() > 0.9, // 10% chance of being bright green
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

  // Project data (you would fetch this from an API or centralized data store in a real app)
  useEffect(() => {
    // Simulating data fetch
    const projects = [
      {
        id: "lifestream-platform",
        title: "LifeStream: Blood Donation Platform",
        description: "A comprehensive online application platform for blood donation and blood bank management with emergency services. The project aims to create a user-friendly and efficient system that improves the entire blood donation process, from donor registration and screening to blood inventory management and timely distribution to hospitals.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "RESTful API"],
        demoUrl: false,
        githubUrl: false,
        images: [
          "/projects/1.jpg",
          "/projects/2.jpg",
          "/projects/3.jpg",
          "/projects/4.jpg",
          "/projects/5.jpg"
        ],
        features: [
          "Donor Management: Tools for managing donor information, health history, eligibility status, and donation records",
          "Appointment Scheduling: Enables donors to schedule appointments and receive notifications about blood donation events",
          "Blood Bank Management: Real-time tracking of blood inventory and processing of donations",
          "Hospital Requests: System for fulfilling blood requests from hospitals with robust data security",
          "Emergency Services: Rapid response system for urgent blood requests with donor notifications",
          "Analytics Dashboard: Comprehensive reporting and metrics visualization"
        ]
      },
      {
        id: "verdevista-garden-shop",
        title: "VerdeVista: Grow Green, Live Beautifully",
        description: "Your online destination for decorative plants, garden ornaments, and fresh produce starters. At VerdeVista, we make it easy to bring nature home. Browse our curated selection of indoor and outdoor plants, garden ornaments, and fruit and vegetable starters—all available online for fast, reliable delivery. Whether you're decorating your space or growing your own produce, VerdeVista has the greenery and garden accessories to match your vision.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        demoUrl: false,
        githubUrl: false,
        images: [
          "/projects/6.jpg",
          "/projects/7.jpg",
          "/projects/8.jpg"
          
        ],
        features: [
          "Curated plant selection with detailed care guides",
          "Garden ornament online catalog",
          "Fruit and vegetable starter plants for home gardening",
          "User-friendly shopping and checkout experience",
          "Expert gardening tips and seasonal plant recommendations"
        ]
      },
      {
        id: "dtr-management-system",
        title: "DTR Management Information System",
        description: "Streamlining Attendance: A comprehensive system for managing daily time records (DTR) in academic and corporate environments. This platform efficiently handles employee attendance tracking, leave management, and reporting, making administrative tasks simpler and more accurate.",
        technologies: ["React", "Node.js", "Express", "MongoDB", "RESTful API"],
        demoUrl: "https://theclique.pythonanywhere.com/",
        githubUrl: false,
        images: [
          "/projects/9.jpg",
          "/projects/10.jpg"
        ],
        features: [
          "Employee Management: Effortlessly manage faculty and staff profiles, including personal information, department assignments, and employment details",
          "Time-In/Time-Out Logging: A user-friendly interface for employees to record their daily arrival and departure times accurately",
          "Leave Management: Simplify the process of submitting, reviewing, and tracking leave requests",
          "DTR Monitoring: Provides real-time and historical views of individual and departmental Daily Time Records",
          "Report Generation: Generate comprehensive reports on attendance, tardiness, absences, and leave summaries",
          "System Administration: Securely manage user accounts, roles, system settings, and audit trails" 
        ]
      },
      {
        id: "react-calculator",
        title: "React Calculator: Modern Calculation App",
        description: "A sleek, responsive calculator application built with React and Vite, featuring both standard and scientific calculation modes. This project demonstrates modern front-end development practices, state management techniques, and clean user interface design. The calculator provides an intuitive user experience with keyboard support and theme customization options.",
        technologies: ["React", "Vite", "JavaScript", "CSS3", "React Hooks"],
        demoUrl: "https://scicalculatetorss.netlify.app/",
        githubUrl: "https://github.com/Alteryxx/Calculatorsci",
        images: [
          "/projects/11.jpg",
          "/projects/12.jpg"
          
        ],
        features: [
          "Standard calculation mode with arithmetic operations and memory functions",
          "Scientific mode with trigonometric functions, logarithms, and advanced math operations",
          "Responsive design that works seamlessly across desktop and mobile devices",
          "Theme customization with light/dark mode and high contrast options",
          "Keyboard support for enhanced usability and accessibility",
          "History feature to track previous calculations and results",
          "Built with Vite for lightning-fast development and optimized production builds"
        ]
      },
      
    ];

    // Find the project by ID
    const foundProject = projects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
    } else {
      // If project not found, redirect to projects section
      navigate("/professional#projects-section");
    }
    
    setLoading(false);
  }, [id, navigate]);

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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 5,
    accessibility: true,
    draggable: true,
    useCSS: true,
    useTransform: true,
    waitForAnimate: false,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          swipe: true,
          touchThreshold: 10,
          swipeToSlide: true,
        }
      }
    ],
    afterChange: () => {
      // Reset drag state after slide change
      setIsDragging(false);
    }
  };

  // Touch and drag handlers
  const handleTouchStart = () => {
    setIsDragging(false);
  };

  const handleTouchMove = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = (e) => {
    if (isDragging) {
      e.stopPropagation();
    }
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <Header />
        <div className="loading-container">
          <div className="matrix-loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <Header />
        <div className="error-container">
          <div className="matrix-error">Project not found</div>
          <button onClick={() => navigate("/professional#projects-section")}>
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
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

      <main className="project-detail-content">
        <div className="back-navigation">
          <button 
            className="back-button" 
            onClick={() => navigate("/professional#projects-section")}
          >
            ← Back to Projects
          </button>
        </div>

        <section className="project-hero">
          <div className="project-header">
            <h1 className="project-title">{project.title}</h1>
            <div className="project-technologies">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
          
          <div 
            className="project-slider-container touch-friendly-slider"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
          >
            <Slider {...sliderSettings} className="touch-enabled-slider" ref={sliderRef}>
              {project.images && project.images.length > 0 ? (
                project.images.map((image, index) => (
                  <div key={index} className="project-slide">
                    <div className="project-image-container" 
                         role="button" 
                         tabIndex={0} 
                         aria-label={`${project.title} screenshot ${index + 1}`}>
                      <img 
                        src={image} 
                        alt={`${project.title} screenshot ${index + 1}`}
                        onLoad={(e) => {
                          // Check if image is portrait and add appropriate class
                          if (e.target.naturalHeight > e.target.naturalWidth) {
                            e.target.classList.add('portrait-image');
                          }
                        }}
                        draggable="false" // Prevent image dragging which can interfere with swipe
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="project-slide">
                  <div className="matrix-placeholder-project">
                    {project.title.charAt(0)}
                  </div>
                </div>
              )}
            </Slider>
          </div>
        </section>

        <section className="project-details-section">
          <div className="project-description">
            <h2>Project Overview</h2>
            <p>{project.description}</p>
          </div>

          <div className="project-features">
            <h2>Key Features</h2>
            <ul className="features-list">
              {project.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">〉</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="project-links">
            {project.demoUrl && project.demoUrl !== "#" && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-link demo-link"
              >
                <span>Visit Live Demo</span>
                <span className="link-icon">🔗</span>
              </a>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-link github-link"
              >
                <span>View Code</span>
                <span className="link-icon">💻</span>
              </a>
            )}
            {(!project.demoUrl || project.demoUrl === "#") && (!project.githubUrl || project.githubUrl === "#") && (
              <div className="no-links-message">
                <span>Project links not available</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetail; 