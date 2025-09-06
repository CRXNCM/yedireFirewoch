import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/apiClient';
import { ImageWithFallback, convertToAbsoluteUrl } from '../utils/imageUtils.jsx';
import CreditCard from '../components/shared-assets/credit-card/credit-card';
import '../styles/DonatePage.css';

// Add this import at the top with other imports
import heroImage from '../assets/images/donate-hero.png';

import cbelogo from '../assets/images/cbe.png';
import awashlogo from '../assets/images/awash.png';
import dashenlogo from '../assets/images/dashen.png';
// Add other bank logos as needed

// Add this object after your imports
const bankLogos = {
  'Commercial Bank of Ethiopia': cbelogo,
  'Awash Bank': awashlogo,
  'Dashen Bank': dashenlogo,
  // Add more banks as needed
};

const DonatePage = () => {
  const [copiedBank, setCopiedBank] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await apiService.banks.getAll();
      console.log('Banks API response:', response); // Debug log
      
      const banksData = Array.isArray(response?.banks) ? response.banks : [];
      console.log('Banks data:', banksData); // Debug log
      
      // Filter active banks and process images
      const activeBanks = banksData
        .filter(bank => bank.is_active === true)
        .sort((a, b) => a.bank_name.localeCompare(b.bank_name));

      console.log('Active banks:', activeBanks); // Debug log

      // Process bank images with enhanced system (same as school images)
      const banksWithImages = activeBanks.map(bank => {
        // Use the new enhanced image system fields
        let imageUrl = bank.image_url || bank.bank_image;
        
        // If no image_url but we have image_path, construct the URL
        if (!imageUrl && bank.image_path) {
          const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
          imageUrl = `${apiBase}/uploads/${bank.image_path}`;
        }
        
        // Handle legacy Supabase URLs
        if (imageUrl && (imageUrl.includes('supabase.co') || imageUrl.includes('supabase'))) {
          const filename = imageUrl.split('/').pop();
          const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
          imageUrl = `${apiBase}/uploads/banks/${filename}`;
        }
        
        return { 
          ...bank, 
          bank_image: imageUrl 
        };
      });

      console.log('Final banks with images:', banksWithImages); // Debug log
      setBanks(banksWithImages);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyDetails = (bank) => {
    const details = `
Bank: ${bank.bank_name}
Account Name: ${bank.account_name}
Account Number: ${bank.account_number}
${bank.routing_number ? `Routing Number: ${bank.routing_number}` : ''}
${bank.swift_code ? `Swift Code: ${bank.swift_code}` : ''}
${bank.bank_address ? `Bank Address: ${bank.bank_address}` : ''}
    `;
    
    navigator.clipboard.writeText(details.trim()).then(() => {
      setCopiedBank(bank.id);
      setTimeout(() => setCopiedBank(null), 2000);
    });
  };

  return (
    <div className="donate-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Make a Difference Today</h1>
          <p>Your donation helps us provide education, healthcare, and hope to children in need around the world.</p>
          <div className="hero-buttons">
            <Link to="/about" className="btn btn-primary">Learn More</Link>
            <a href="#donation-section" className="btn btn-secondary">Donate Now</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Children in need" />
        </div>
      </section>

      {/* Donation Content */}
      <section className="donation-section" id="donation-section">
        <div className="container">
          <h2 className="section-title">Make a Donation</h2>
          <p className="section-description">
            Your contribution helps us continue our mission to help children in need around the world.
          </p>

          <div className="bank-section-header">
            <h3 className="bank-section-title">Our Bank Accounts</h3>
            <p className="bank-section-subtitle">
              Choose from our verified bank accounts to make your donation
            </p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading bank accounts...</p>
            </div>
          ) : (
            <div className="bank-cards-grid">
              {banks.length > 0 ? (
                banks.map((bank, index) => {
                  // Define card types for variety
                  const cardTypes = ['brand-dark', 'brand-blue', 'brand-green', 'brand-purple', 'brand-gold'];
                  const cardType = cardTypes[index % cardTypes.length];
                  
                  return (
                    <div className="bank-card-wrapper" key={bank.id}>
                      <CreditCard
                        type={cardType}
                        company={bank.account_name}
                        cardNumber={bank.account_number}
                        bankLogo={bank.bank_image}
                        className="bank-credit-card"
                      />
                      
                      {/* Card Actions */}
                      <div className="card-actions-overlay">
                        <button 
                          className={`action-btn copy-btn ${copiedBank === bank.id ? 'copied' : ''}`}
                          onClick={() => copyDetails(bank)}
                        >
                          <span className="btn-icon">
                            {copiedBank === bank.id ? '✓' : '📋'}
                          </span>
                          <span className="btn-text">
                            {copiedBank === bank.id ? 'Copied!' : 'Copy Details'}
                          </span>
                        </button>
                        {bank.payment_link && (
                          <a 
                            href={bank.payment_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="action-btn payment-btn"
                          >
                            <span className="btn-icon">💳</span>
                            <span className="btn-text">Pay Online</span>
                          </a>
                        )}
                      </div>
                      
                      {/* Additional Bank Details */}
                      <div className="bank-details">
                        <div className="detail-item">
                          <span className="detail-label">Bank Name</span>
                          <span className="detail-value">{bank.bank_name}</span>
                        </div>
                        {bank.routing_number && (
                          <div className="detail-item">
                            <span className="detail-label">Routing Number</span>
                            <span className="detail-value">{bank.routing_number}</span>
                          </div>
                        )}
                        {bank.swift_code && (
                          <div className="detail-item">
                            <span className="detail-label">Swift Code</span>
                            <span className="detail-value">{bank.swift_code}</span>
                          </div>
                        )}
                        {bank.bank_address && (
                          <div className="detail-item">
                            <span className="detail-label">Bank Address</span>
                            <span className="detail-value">{bank.bank_address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-banks-container">
                  <div className="no-banks-icon">🏦</div>
                  <h4>No Bank Accounts Available</h4>
                  <p>We're currently updating our banking information.</p>
                  <p>Please check back later or contact us for donation details.</p>
                  <Link to="/contact" className="contact-link">Contact Us</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      <section className="info-section">
        <div className="container">
          <h3>How Your Donation Helps</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Education</h4>
              <p>Provide school supplies, uniforms, and educational resources to children in need.</p>
            </div>
            <div className="info-item">
              <h4>Healthcare</h4>
              <p>Ensure children have access to basic healthcare and medical treatment.</p>
            </div>
            <div className="info-item">
              <h4>Nutrition</h4>
              <p>Provide nutritious meals and clean water to support healthy development.</p>
            </div>
            <div className="info-item">
              <h4>Shelter</h4>
              <p>Help build and maintain safe living environments for vulnerable children.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h3>Need Help?</h3>
          <p>If you have any questions about making a donation, please don't hesitate to contact us.</p>
          <div className="contact-buttons">
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;