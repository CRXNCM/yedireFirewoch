import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/lg.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Add scroll event listener to change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'transparent'}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link to="/">
              <img src={logo} alt="Yedire Firewoch Logo" className="logo" />
              <span className="brand-name">Yedire Firewoch</span>
            </Link>
          </div>
          
          <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
            <ul>
              <li><Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>HOME</Link></li>
              <li><Link to="/about" className={location.pathname === '/about' ? 'active-link' : ''}>ABOUT US</Link></li>
              <li><Link to="/achievements" className={location.pathname === '/achievements' ? 'active-link' : ''}>ACHIEVEMENTS</Link></li>
              <li><Link to="/gallery" className={location.pathname === '/gallery' ? 'active-link' : ''}>GALLERY</Link></li>
              <li><Link to="/contacts" className={location.pathname === '/contacts' ? 'active-link' : ''}>CONTACTS</Link></li>
            </ul>
          </div>
          
          <div className="navbar-actions">
            <Link to="/donate">
              <button className="donate-btn">DONATE</button>
            </Link>
          </div>
          
          <div className="menu-toggle" onClick={toggleMenu}>
            <div className={`hamburger ${isOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;