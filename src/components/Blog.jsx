import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import "./Blog.css";
import Header from "./Header";
import ScrambledTitle from "./ScrambledTitle";
import blogPosts, { getFeaturedPosts, getTravelTourPosts, getIndustrialTourPosts, getPostById } from "../data/blogData";

const Blog = () => {
  const [heroCharacters, setHeroCharacters] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const charsRef = useRef("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check for URL parameters
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for id in URL path parameter
    if (id) {
      const post = getPostById(parseInt(id));
      if (post) {
        setSelectedPost(post);
      }
    } 
    // Check for id in query parameter (for compatibility)
    else {
      const urlParams = new URLSearchParams(location.search);
      const postId = urlParams.get('id');
      
      if (postId) {
        const post = getPostById(parseInt(postId));
        if (post) {
          setSelectedPost(post);
        }
      } else {
        // Reset selected post when navigating to the main blog page
        setSelectedPost(null);
      }
    }
  }, [id, location.search]);

  const handleBackClick = () => {
    setSelectedPost(null);
    navigate('/blog');
  };

  // Get a random katakana character
  const getRandomChar = () => {
    return charsRef.current[Math.floor(Math.random() * charsRef.current.length)];
  };

  // Matrix rain effect - reduced opacity for subtle effect
  useEffect(() => {
    // Matrix rain effect for background
    const heroCharArray = Array.from(
      { length: 120 },
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

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="blog-page">
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

      <main className="blog-content">
        {selectedPost ? (
          <div className="single-post-container">
            <button className="back-button" onClick={handleBackClick}>
              ← Back to All Articles
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
            <section className="blog-hero">
              <div className="blog-hero-content">
                <div className="katakana-title-wrapper">
                  <ScrambledTitle
                    texts={[" My Adventures and Learning Blog"]}
                    delay={3000}
                    firstPhraseDelay={2000}
                    className="main-hero-title"
                    loop={false}
                  />
                </div>
                <p className="blog-tagline">
                  Exploring technology, development, and <span className="highlight-text">digital innovations</span>
                </p>
              </div>
            </section>

            {/* Featured Posts Section */}
            <section className="featured-posts-section">
              <div className="section-container">
                <h2 className="section-title">Featured Articles</h2>
                <div className="featured-posts-grid">
                  {getFeaturedPosts().map(post => (
                    <div 
                      key={post.id} 
                      className="featured-post-card"
                      onClick={() => navigate(post.categories.includes("Travel Tours") 
                        ? `/travel-tours?id=${post.id}` 
                        : post.categories.includes("Industrial Tour") 
                          ? `/industrial-tours?id=${post.id}` 
                          : `/blog/${post.id}`)}
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(post.categories.includes("Travel Tours") 
                            ? `/travel-tours?id=${post.id}` 
                            : post.categories.includes("Industrial Tour") 
                              ? `/industrial-tours?id=${post.id}` 
                              : `/blog/${post.id}`);
                        }
                      }}
                    >
                      <div 
                        className="post-image" 
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      >
                        <div className="matrix-overlay"></div>
                      </div>
                      <div className="post-content">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          <span className="post-date">{post.date}</span>
                        </div>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-categories">
                          {post.categories.map(category => (
                            <span key={category} className="category-tag">{category}</span>
                          ))}
                        </div>
                        <span className="read-more-link">Read More →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Category Sections */}
            <section className="category-highlights-section">
              <div className="section-container">
                <h2 className="section-title">Explore by Category</h2>
                
                <div className="category-section">
                  <h3 className="category-title">Industrial Tours</h3>
                  <div className="category-posts">
                    {/* Show all five industrial tours as featured tours */}
                    {getIndustrialTourPosts()
                      .filter(post => 
                        post.title.includes("HYTEC") || 
                        post.title.includes("LRT") || 
                        post.title.includes("MMDA") || 
                        post.title.includes("Subic Automatic") || 
                        post.title.includes("Subic Convention")
                      )
                      .map(post => (
                        <div 
                          key={post.id} 
                          className="category-post-card featured-tour"
                          onClick={() => navigate(`/industrial-tours?id=${post.id}`)}
                          tabIndex="0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              navigate(`/industrial-tours?id=${post.id}`);
                            }
                          }}
                        >
                          <div 
                            className="category-post-image" 
                            style={{ backgroundImage: `url(${post.imageUrl})` }}
                          >
                            <div className="matrix-overlay"></div>
                            <div className="tour-badge">Featured Tour</div>
                          </div>
                          <h4 className="post-title">{post.title}</h4>
                          <p className="post-excerpt">{post.excerpt}</p>
                          <span className="read-more-link">Read More →</span>
                        </div>
                      ))}
                  </div>
                  <div className="view-more-container">
                    <Link to="/industrial-tours" className="view-more-link">View All Industrial Tours →</Link>
                  </div>
                </div>
                
                <div className="category-section">
                  <h3 className="category-title">Travel Tours</h3>
                  <div className="category-posts">
                    {/* Show all seven Baguio tours as featured tours */}
                    {getTravelTourPosts()
                      .filter(post => 
                        post.title.includes("Baguio Chinese Temple") || 
                        post.title.includes("The Mansion") || 
                        post.title.includes("Manuel L. Quezon") || 
                        post.title.includes("Mines View") || 
                        post.title.includes("Museum of Natural History") || 
                        post.title.includes("Philippine Military Academy") || 
                        post.title.includes("Presidential Car")
                      )
                      .map(post => (
                        <div 
                          key={post.id} 
                          className="category-post-card featured-tour"
                          onClick={() => navigate(`/travel-tours?id=${post.id}`)}
                          tabIndex="0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              navigate(`/travel-tours?id=${post.id}`);
                            }
                          }}
                        >
                          <div 
                            className="category-post-image" 
                            style={{ backgroundImage: `url(${post.imageUrl})` }}
                          >
                            <div className="matrix-overlay"></div>
                            <div className="tour-badge">Featured Tour</div>
                          </div>
                          <h4 className="post-title">{post.title}</h4>
                          <p className="post-excerpt">{post.excerpt}</p>
                          <span className="read-more-link">Read More →</span>
                        </div>
                      ))}
                  </div>
                  <div className="view-more-container">
                    <Link to="/travel-tours" className="view-more-link">View All Baguio Tours →</Link>
                  </div>
                </div>
              </div>
            </section>

            {/* All Posts Section */}
            <section className="all-posts-section">
              <div className="section-container">
                <h2 className="section-title">All Articles</h2>
                <div className="posts-grid">
                  {blogPosts.map(post => (
                    <div 
                      key={post.id} 
                      className="post-card"
                      onClick={() => navigate(post.categories.includes("Travel Tours") 
                        ? `/travel-tours?id=${post.id}` 
                        : post.categories.includes("Industrial Tour") 
                          ? `/industrial-tours?id=${post.id}` 
                          : `/blog/${post.id}`)}
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(post.categories.includes("Travel Tours") 
                            ? `/travel-tours?id=${post.id}` 
                            : post.categories.includes("Industrial Tour") 
                              ? `/industrial-tours?id=${post.id}` 
                              : `/blog/${post.id}`);
                        }
                      }}
                    >
                      <div 
                        className="post-card-image" 
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      >
                        <div className="matrix-overlay"></div>
                      </div>
                      <div className="post-card-content">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          <span className="post-date">{post.date}</span>
                        </div>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-categories">
                          {post.categories.map(category => (
                            <span key={category} className="category-tag">{category}</span>
                          ))}
                        </div>
                        <span className="read-more-link">Read More →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer is typically shared across components */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="thank-you-title">Thank you for reading</h2>
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

export default Blog; 