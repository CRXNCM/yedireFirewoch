import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/images/lg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
  faPinterest,
  faTiktok,
  faSnapchat,
  faReddit,
  faWhatsapp,
  faTelegram,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { apiService } from '../utils/apiClient';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await apiService.socialLinks.getAll();
      const linksData = Array.isArray(response?.socialLinks) ? response.socialLinks : [];
      
      // Filter active links and sort by display_order
      const activeLinks = linksData
        .filter(link => link.is_active)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      
      setSocialLinks(activeLinks);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconClass) => {
    if (iconClass.includes('facebook')) return faFacebook;
    if (iconClass.includes('instagram')) return faInstagram;
    if (iconClass.includes('twitter')) return faTwitter;
    if (iconClass.includes('linkedin')) return faLinkedin;
    if (iconClass.includes('youtube')) return faYoutube;
    if (iconClass.includes('pinterest')) return faPinterest;
    if (iconClass.includes('tiktok')) return faTiktok;
    if (iconClass.includes('snapchat')) return faSnapchat;
    if (iconClass.includes('reddit')) return faReddit;
    if (iconClass.includes('whatsapp')) return faWhatsapp;
    if (iconClass.includes('telegram')) return faTelegram;
    if (iconClass.includes('discord')) return faDiscord;
    return faFacebook;
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Logo Section */}
        <div className="footer-logo">
          <Link to="/">
            <img src={logo} alt="Yedire Firewoch Logo" />
          </Link>
        </div>

        {/* Top nav links */}
        <div className="footer-top-nav">
          <ul className="footer-top-links">
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/about">ABOUT US</Link></li>
            <li><Link to="/gallery">GALLERY</Link></li>
            <li><Link to="/contacts">CONTACTS</Link></li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Description */}
        <div className="footer-description">
          <p>
          An organization dedicated to nourishing young minds through morning meals.
It ensures students start their day with the energy they need to learn and grow.
By tackling classroom hunger, it improves focus, attendance, and performance.
Its mission is to build a healthier, brighter future—one breakfast at a time.


          </p>
        </div>

        {/* Social icons */}
        <div className="social-icons">
          {loading ? (
            <div className="loading-social">Loading...</div>
          ) : (
            socialLinks.length > 0 ? (
              socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.platform}
                >
                  <FontAwesomeIcon icon={getIconComponent(link.icon_class)} />
                </a>
              ))
            ) : (
              <div className="no-social-links">No social media links available</div>
            )
          )}
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; 2025 Yedire Firewoch Charitable Development Organization. All rights reserved.</p>
          <p className="developed-by">
            Developed by <span title="Dire Dawa American Corner">DDAC</span> <span title="Dire Dawa University">DDU</span> Software Engineering interns 2025
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
