import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

// Memoize the NavLinks component to prevent unnecessary re-renders
const NavLinks = memo(({ isMobile, handleNavigation, isNavigating, location }) => (
  <>
    <NavLink
      to="/"
      className={({ isActive }) => `nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`}
      onClick={(e) => handleNavigation('/', e)}
      style={{ 
        pointerEvents: isNavigating ? 'none' : 'auto',
        transform: 'translateZ(0)'
      }}
    >
      Personal
    </NavLink>
    <NavLink
      to="/professional"
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={(e) => handleNavigation('/professional', e)}
      style={{ 
        pointerEvents: isNavigating ? 'none' : 'auto',
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    >
      Professional
    </NavLink>
    <NavLink
      to="/blog"
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={(e) => handleNavigation('/blog', e)}
      style={{ 
        pointerEvents: isNavigating ? 'none' : 'auto',
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    >
      Blog
    </NavLink>
    <NavLink
      to="/contact"
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={(e) => handleNavigation('/contact', e)}
      style={{ 
        pointerEvents: isNavigating ? 'none' : 'auto',
        transform: 'translateZ(0)'
      }}
    >
      Contact
    </NavLink>
  </>
));

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track clicks to prevent double-clicking
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Handle scroll effect with better throttling
  useEffect(() => {
    let isThrottled = false;
    let scrollPosition = 0;
    
    const handleScroll = () => {
      if (!isThrottled) {
        isThrottled = true;
        
        // Using RAF for better performance
        window.requestAnimationFrame(() => {
          scrollPosition = window.scrollY;
          setScrolled(scrollPosition > 50);
          
          // Reset throttle after frame renders
          setTimeout(() => {
            isThrottled = false;
          }, 100); // Throttle to max 10 updates per second
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Improved handling of link navigation with debouncing
  const handleNavigation = useCallback((to, e) => {
    // Close menu if open
    setMobileMenuOpen(false);
    
    // Prevent multiple rapid clicks
    if (isNavigating) {
      e.preventDefault();
      return;
    }
    
    // If this is a hash link on the same page (legacy support)
    if (to.startsWith('#') && location.pathname === '/') {
      e.preventDefault();
      
      // Add small delay to prevent jank
      requestAnimationFrame(() => {
        const element = document.getElementById(to.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      return;
    }
    
    // If it's a navigation to a different route
    if (location.pathname !== to && !to.startsWith('#')) {
      e.preventDefault();
      setIsNavigating(true);
      
      // Navigate programmatically with slight delay to allow state update
      requestAnimationFrame(() => {
        navigate(to);
      });
      
      // Reset the flag after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 600); // Slightly increased to ensure transitions complete
    }
  }, [location.pathname, navigate, isNavigating, mobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Handle mobile menu button click (add stopPropagation)
  const handleMobileMenuToggle = useCallback((e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    // Use throttled resize event handler
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`header ${scrolled ? 'scrolled' : ''}`} 
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="header-content">
        <Link 
          to="/" 
          className="logo" 
          onClick={(e) => handleNavigation('/', e)}
          style={{ transform: 'translateZ(0)' }}
        >
          Al Fernandez<span className="dot">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-tabs desktop-only">
          <NavLinks 
            isMobile={false} 
            handleNavigation={handleNavigation} 
            isNavigating={isNavigating} 
            location={location}
          />
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={handleMobileMenuToggle}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          style={{ transform: 'translateZ(0)' }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Navigation Menu */}
        <div 
          className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          style={{ transform: 'translateZ(0)' }}
        > 
          <nav 
            className="mobile-nav-links" 
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'translateZ(0)' }}
          >
            <NavLinks 
              isMobile={true} 
              handleNavigation={handleNavigation} 
              isNavigating={isNavigating} 
              location={location}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

// Memoize the Header component to prevent unnecessary re-renders
export default memo(Header); 