import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import '../styles/ContactPage.css';
import contactHeroImage from '../assets/images/contact-hero.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" style={{ backgroundImage: `url(${contactHeroImage})` }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Contacts</h1>
            <div className="breadcrumb-nav">
              <Link to="/">HOME</Link> • <span className="active">CONTACTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="contact-card">
                <div className="icon-wrapper">
                  <FaPhoneAlt />
                </div>
                <h3>+251 921-310-681</h3>
                <p>You can call us anytime</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="contact-card">
                <div className="icon-wrapper">
                  <FaMapMarkerAlt />
                </div>
                <h3>Dire Dawa, Ethiopia Dechatu</h3>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="contact-card">
                <div className="icon-wrapper">
                  <FaEnvelope />
                </div>
                <h3>yedirefrewoch@gmail.com</h3>
                <p>Feel free to email us your questions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <h2>Get in Touch</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                ></textarea>
              </div>
              
              <div className="form-group text-center">
                <button type="submit" className="submit-btn">SEND</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;