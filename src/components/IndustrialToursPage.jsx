import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getIndustrialTourPosts, getPostById } from "../data/blogData";
import Header from "./Header";
import "./IndustrialToursPage.css";

const IndustrialToursPage = () => {
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  useEffect(() => {
    // Load all industrial tour posts
    const industrialPosts = getIndustrialTourPosts();
    setPosts(industrialPosts);

    // Matrix rain effect for background
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

    // Animate the matrix rain
    const updateInterval = 200;
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
              opacity: 0.15 + Math.random() * 0.2,
              size: 0.8 + Math.random() * 0.3,
              green: Math.random() > 0.9,
              wiggle: Math.random() > 0.8,
              wiggleAmount: Math.random() * 1.5
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const postId = urlParams.get('id');
    
    window.scrollTo(0, 0);
    
    if (postId) {
      const post = getPostById(parseInt(postId));
      if (post) {
        setSelectedPost(post);
      }
    } else {
      // Reset selected post when navigating to the main tours page
      setSelectedPost(null);
    }
  }, [location.search]);

  const handleBackClick = () => {
    setSelectedPost(null);
    navigate('/industrial-tours');
  };

  return (
    <div className="industrial-tours-page">
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
      
      {/* Fixed Header */}
      <Header />

      <main className="industrial-tours-content">
        {selectedPost ? (
          <div className="single-post-container">
            <button className="back-button" onClick={handleBackClick}>
              ← Back to All Industrial Tours
            </button>
            
            <article className="single-post">
              <div className="post-header">
                <div 
                  className="post-hero-image" 
                  style={{ backgroundImage: `url(${selectedPost.imageUrl})` }}
                >
                  <div className="matrix-overlay"></div>
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
            {/* Hero Section */}
            <section className="industrial-tours-hero">
              <div className="hero-content">
                <h1 className="hero-title">Industrial Technology Tours</h1>
                <p className="hero-tagline">
                  Discover <span className="highlight-text">cutting-edge facilities</span> and infrastructure systems
                </p>
              </div>
            </section>

            {/* Tours Grid */}
            <section className="tours-section">
              <div className="section-container">
                <h2 className="section-title">Explore Industrial Tours</h2>
                <div className="tours-grid">
                  {posts.map(post => (
                    <div 
                      key={post.id} 
                      className="tour-card featured-tour"
                    >
                      <div 
                        className="tour-image" 
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      >
                        <div className="matrix-overlay"></div>
                        <div className="tour-badge">Featured Tour</div>
                      </div>
                      <div className="tour-content">
                        <h3 className="tour-title">{post.title}</h3>
                        <p className="tour-excerpt">{post.excerpt}</p>
                        <div className="tour-meta">
                          <span className="tour-date">{post.date}</span>
                          <Link to={`/industrial-tours?id=${post.id}`} className="view-tour-button">View Details</Link>
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="thank-you-title">Thank you for exploring Industrial Tours</h2>
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

export default IndustrialToursPage; 