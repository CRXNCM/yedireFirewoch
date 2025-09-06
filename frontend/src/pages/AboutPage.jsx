import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/AboutPage.css';
import aboutHeroImage from '../assets/images/about-hero.png';
import feedingProgramImage from '../assets/images/feeding-program.jpg';

const AboutPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    if (location.pathname.includes('/history')) return 'history';
    return 'about';
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

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
                  
                  <div className="core-values-container">
                    <div className="row">
                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <FaHandHoldingHeart className="value-icon" />
                          <h3>Community And Local Resource Mobilization</h3>
                          <p>The community has huge potential to deal with its problems by using its knowledge and resources if it is adequately informed and mobilized. Cognizant to this, during project fund mobilization, implementation, monitoring and evaluation, grass-root community members including CBOs (Eddirs, youth clubs, Association ) leaders, religious elders, business owners, community volunteers, influential people, and interested/willing community elders ('YeseferMekariShimagile' ) will be actively involved.</p>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <FaStar className="value-icon" />
                          <h3>Compassionate Service</h3>
                          <p>"We see the child behind every hunger pang" Driven by deep empathy, we serve vulnerable children with dignity—whether providing school meals, educational support or healthcare. Our work in Dire Dawa's poorest kebeles stems from understanding poverty's vicious cycle (illiteracy → poor health → unemployment → poverty).</p>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <FaUsers className="value-icon" />
                          <h3>Community Ownership</h3>
                          <p>"Local problems demand local solutions" We empower communities through active participation—training volunteers, forming school committees, and collaborating with elders ('Yesefer Mekari Shimagle'). Our Home-Grown School Feeding model engages parents, teachers, and businesses to sustain impact.</p>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <FaCheckCircle className="value-icon" />
                          <h3>Transparency & Accountability</h3>
                          <p>"Every birr tells a story of trust" Multi-tiered oversight (school committees, government partners, audits) ensures resources reach beneficiaries. We publish impact metrics—like reducing dropout rates by 5-6%—to validate donor investments.</p>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <MdEquality className="value-icon" />
                          <h3>Gender Equity</h3>
                          <p>"Educating a girl transforms generations" With 800+ girls in our programs, we combat systemic barriers—early marriage, household burdens, and period poverty—through targeted scholarships, hygiene kits, and community sensitization to shift norms.</p>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4 mb-4">
                        <div className="value-card">
                          <GiPlantRoots className="value-icon" />
                          <h3>Sustainability</h3>
                          <p>We build programs that create lasting impact beyond our direct involvement.</p>
                        </div>
                      </div>
                    </div>
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