import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import '../styles/AboutPage.css';
import aboutHeroImage from '../assets/images/about-hero.png';
import feedingProgramImage from '../assets/images/feeding-program.jpg';
// icons removed for a cleaner Values section

const AboutPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('about');

  // Sync activeSection with URL so navigation (NavLink) controls which content shows
  useEffect(() => {
    if (location.pathname.includes('/history')) setActiveSection('history');
    else if (location.pathname.includes('/values')) setActiveSection('values');
    else setActiveSection('about');
  }, [location.pathname]);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" style={{ backgroundImage: `url(${aboutHeroImage})` }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>About Us</h1>
            <div className="breadcrumb-nav">
              <Link to="/">HOME</Link> • <span className="active">ABOUT US</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Content Layout */}
      <section className="modern-content-section">
        <div className="container">
          <div className="modern-content-wrapper">
            {/* Modern Sidebar */}
            <div className="modern-sidebar">
              <h3>About YDFCA</h3>
              <ul className="modern-nav">
                <li className={activeSection === 'about' ? 'active' : ''}>
                  <Link to="/about" onClick={() => handleSectionChange('about')}>
                    About Yedire Firewoch
                  </Link>
                </li>
                <li className={activeSection === 'history' ? 'active' : ''}>
                  <Link to="/about/history" onClick={() => handleSectionChange('history')}>
                    Our History
                  </Link>
                </li>
                <li className={activeSection === 'values' ? 'active' : ''}>
                  <Link to="/about/values" onClick={() => handleSectionChange('values')}>
                    Core Values
                  </Link>
                </li>
                
              </ul>
            </div>

            {/* Modern Content Area */}
            <div className="modern-content">
              {activeSection === 'about' && (
                <div className="content-card">
                  <div className="content-header">
                    <div className="image-title-container">
                      <div className="content-image-container">
                        <img src={feedingProgramImage} alt="Feeding program at Yedire Firewoch" />
                      </div>
                      <div className="content-title">
                        <h2>About Yedire Firewoch</h2>
                        <div className="accent-line"></div>
                        <h4>Fighting child hunger and school dropouts in Dire Dawa</h4>
                        <div className="content-body">
                    <p>
                      We are Ye Dire Firewoch Charity Association (YDFCA) - a local Ethiopian team committed to improving education through school feeding programs. Since our founding in 2010, we've grown to serve daily meals to over 1,500 children in 15 primary schools across Dire Dawa.
                    </p>
                    <p>
                      Our work focuses on keeping children in school, especially girls, by addressing the root cause of classroom hunger. We believe every child deserves the opportunity to learn without the distraction of an empty stomach.
                    </p>
                  </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}

              {/* Other sections remain the same */}
              {activeSection === 'history' && (
                <div className="content-card">
                  <h2>Our History</h2>
                  <div className="accent-line"></div>
                  
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-marker">
                        <span className="year">2010</span>
                      </div>
                      <div className="timeline-content">
                        <h3>YDFCA Foundation</h3>
                        <p>
                          Ye Dire Firewoch Charity Association [YDFCA]is a non-government, is located 515 km East of Addis Ababa and only at about 311kms west of Djibouti port in Dire Dawa, a non-profit making and non political affiliate was founded in the year 2010 by interested individuals living in Dire Dawa Town Kebele 06.
                        </p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-marker">
                        <span className="year">2022</span>
                      </div>
                      <div className="timeline-content">
                        <h3>Official Registration</h3>
                        <p>
                          Officially registered as "Ye Dire Firewoch Charity Association (YDFCA)" under Ethiopian law to expand our impact. Last year the organization has been legally established and registered as inline with government proclamation no.1113/2019
                        </p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-marker">
                        <span className="year">2023</span>
                      </div>
                      <div className="timeline-content">
                        <h3>School Feeding Program Launch</h3>
                        <p>
                          Started our flagship school feeding program in 18 primary schools to fight hunger and improve school attendance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="timeline-item">
                      <div className="timeline-marker">
                        <span className="year">2025</span>
                      </div>
                      <div className="timeline-content">
                        <h3>Growing Impact</h3>
                        <p>
                          Now serving 2,000 children daily with nutritious meals and educational support, helping them stay in school and learn better.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'values' && (
                <div className="content-card">
                  <h2>Our Core Values</h2>
                  <div className="accent-line"></div>

                  <div className="content-body">
                    <section>
                      <h3>Community & Local Resource Mobilization</h3>
                      <p>
                        We actively mobilize local resources and community members—including CBOs, volunteers, elders, and local businesses—to plan and sustain solutions that address the root causes of child hunger and school dropout.
                      </p>
                    </section>

                    <section>
                      <h3>Compassionate Service</h3>
                      <p>
                        Our programs are driven by empathy and dignity; we prioritize children's wellbeing through nutritious meals, educational support, and health-focused interventions.
                      </p>
                    </section>

                    <section>
                      <h3>Community Ownership</h3>
                      <p>
                        We empower local stakeholders—parents, teachers, and community leaders—to co-design and manage programs so benefits endure beyond our direct involvement.
                      </p>
                    </section>

                    <section>
                      <h3>Transparency & Accountability</h3>
                      <p>
                        Financial and programmatic transparency are core: oversight, reporting, and community feedback ensure resources reach children and create measurable impact.
                      </p>
                    </section>

                    <section>
                      <h3>Gender Equity</h3>
                      <p>
                        We prioritize girls' education through targeted support, scholarships, and hygiene initiatives that remove barriers to attendance and learning.
                      </p>
                    </section>

                    <section>
                      <h3>Sustainability</h3>
                      <p>
                        We design interventions that build local capacity and foster long-term community-led solutions for food security and education.
                      </p>
                    </section>
                  </div>
                </div>
              )}

              
              {/* Remaining sections... */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;