import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTravelTourPosts, getPostById } from "../data/blogData";
import Header from "./Header";
import "./TravelToursPage.css";

const TravelToursPage = () => {
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");
  const location = useLocation();
  const navigate = useNavigate();
  const slideIntervalRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  useEffect(() => {
    const travelPosts = getTravelTourPosts();
    setPosts(travelPosts);

    const heroCharArray = Array.from(
      { length: 120 },
      () => ({
        char: getRandomChar(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.15 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.2,
        size: 0.8 + Math.random() * 0.3,
        green: Math.random() > 0.9,
        wiggle: Math.random() > 0.8,
        wiggleAmount: Math.random() * 1.5
      })
    );
    setHeroCharacters(heroCharArray);

    const updateInterval = 200;
    let lastUpdate = 0;
    
    const animateRain = (timestamp) => {
      if (timestamp - lastUpdate > updateInterval) {
        lastUpdate = timestamp;
        
        setHeroCharacters(prev => prev.map(char => {
          let newY = char.y + char.speed * 0.15;
          
          if (newY > 100) {
            newY = -10;
            return {
              ...char,
              y: newY,
              x: Math.random() * 100,
              char: getRandomChar(),
              speed: 0.15 + Math.random() * 0.7,
              opacity: 0.15 + Math.random() * 0.2,
              size: 0.8 + Math.random() * 0.3,
              green: Math.random() > 0.9,
              wiggle: Math.random() > 0.8,
              wiggleAmount: Math.random() * 1.5
            };
          }
          
          if (Math.random() < 0.05) {
            return { ...char, y: newY, char: getRandomChar() };
          }
          
          return { ...char, y: newY };
        }));
      }
      
      requestAnimationFrame(animateRain);
    };
    
    const animationId = requestAnimationFrame(animateRain);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const postId = urlParams.get('id');
    
    window.scrollTo(0, 0);
    
    if (postId) {
      const post = getPostById(parseInt(postId));
      if (post) {
        setSelectedPost(post);
        setCurrentSlide(0);
      }
    } else {
      // Reset selected post when navigating to the main tours page
      setSelectedPost(null);
      setCurrentSlide(0);
    }
  }, [location.search]);

  useEffect(() => {
    // Auto slideshow effect for the current post's images
    if (selectedPost && slideshowPlaying) {
      // Clear any existing interval
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
      
      // Set up a new interval for auto-advancing slides
      slideIntervalRef.current = setInterval(() => {
        if (selectedPost.images && selectedPost.images.length > 0) {
          setCurrentSlide(prev => (prev + 1) % selectedPost.images.length);
        }
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      // Clean up interval on unmount or when slideshow is stopped
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [selectedPost, slideshowPlaying]);

  const handleBackClick = () => {
    setSelectedPost(null);
    navigate('/travel-tours');
  };

  const handlePrevSlide = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentSlide(prev => 
        prev === 0 ? selectedPost.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextSlide = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentSlide(prev => 
        (prev + 1) % selectedPost.images.length
      );
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const toggleSlideshow = () => {
    setSlideshowPlaying(prev => !prev);
  };

  return (
    <div className="travel-tours-page">
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
      
      <Header />

      <main className="travel-tours-content">
        {selectedPost ? (
          <div className="single-post-container">
            <button className="back-button" onClick={handleBackClick}>
              ← Back to All Travel Tours
            </button>
            
            <article className="single-post">
              <div className="post-header">
                {/* Image Slider for Post */}
                <div className="image-slider-container">
                  <div 
                    className="post-hero-image image-slider" 
                    style={{ 
                      backgroundImage: `url(${selectedPost.images ? selectedPost.images[currentSlide] : selectedPost.imageUrl})` 
                    }}
                  >
                    <div className="matrix-overlay"></div>
                    
                    {/* Slider Controls */}
                    <div className="slider-controls">
                      <button className="slider-btn prev-btn" onClick={handlePrevSlide}>
                        &#10094;
                      </button>
                      <button className="slider-btn next-btn" onClick={handleNextSlide}>
                        &#10095;
                      </button>
                    </div>
                    
                    {/* Slideshow Controls */}
                    <button 
                      className={`slideshow-toggle ${slideshowPlaying ? 'playing' : ''}`} 
                      onClick={toggleSlideshow}
                    >
                      {slideshowPlaying ? 'Pause' : 'Play'}
                    </button>
                    
                    {/* Slide Indicator Dots */}
                    {selectedPost.images && selectedPost.images.length > 1 && (
                      <div className="slider-dots">
                        {selectedPost.images.map((_, index) => (
                          <span 
                            key={index} 
                            className={`slider-dot ${currentSlide === index ? 'active' : ''}`} 
                            onClick={() => handleDotClick(index)}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <h1 className="post-title">{selectedPost.title}</h1>
                <div className="post-meta">
                  <span className="post-date">{selectedPost.date}</span>
                  <div className="post-categories">
                    {selectedPost.categories.map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <p className="post-excerpt">{selectedPost.excerpt}</p>
                <div className="post-full-content">
                  {selectedPost.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <>
            <section className="travel-tours-hero">
              <div className="hero-content">
                <h1 className="hero-title">Baguio Travel Tours</h1>
                <p className="hero-tagline">
                  Explore the <span className="highlight-text">wonders of Baguio</span> through our curated travel experiences
                </p>
              </div>
            </section>

            <section className="tours-section">
              <div className="section-container">
                <h2 className="section-title">Explore Baguio Tours</h2>
                <div className="tours-grid">
                  {posts.map(post => (
                    <div 
                      key={post.id} 
                      className="tour-card featured-tour"
                      onClick={() => navigate(`/travel-tours?id=${post.id}`)}
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/travel-tours?id=${post.id}`);
                        }
                      }}
                    >
                      <div 
                        className="tour-image" 
                        style={{ backgroundImage: `url(${post.images ? post.images[0] : post.imageUrl})` }}
                      >
                        <div className="matrix-overlay"></div>
                        <div className="tour-badge">Featured Tour</div>
                      </div>
                      <div className="tour-content">
                        <h3 className="tour-title">{post.title}</h3>
                        <p className="tour-excerpt">{post.excerpt}</p>
                        <div className="tour-meta">
                          <span className="tour-date">{post.date}</span>
                          <span className="view-tour-button">View Details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <h2 className="thank-you-title">Thank you for Reading</h2>
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

export default TravelToursPage; 