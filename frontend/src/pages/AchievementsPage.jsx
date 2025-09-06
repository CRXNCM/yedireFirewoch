// Update the imports to include the new image
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import '../styles/AchievementsPage.css';
import { FaTrophy, FaMedal, FaAward, FaHandshake, FaCertificate, FaRegStar, FaHeart } from 'react-icons/fa';
import heroBackground from '../assets/images/achievements-hero.png'; 
import direDawaAdmin from '../assets/images/diredewa-admin.jpg';
import ministryEdu from '../assets/images/ministry-edu.jpg';
import begoSaw from '../assets/images/bego-saw.jpg';
import urbanImg from '../assets/images/urban.jpg';
import begoImg from '../assets/images/bego.jpg';
import { FaYoutube } from 'react-icons/fa';

const AchievementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [awards, setAwards] = useState([
    {
      id: 1,
      title: "Excellence in Community Development",
      year: "2023",
      organization: "Dire Dawa Administration Bureau",
      description: "Awarded for outstanding contributions to community development and educational support in the Dire Dawa region. This recognition highlights our commitment to improving educational facilities and opportunities for children in underserved areas.",
      icon: <FaTrophy />,
      image: direDawaAdmin
    },
    {
      id: 2,
      title: "Outstanding Educational Initiative",
      year: "2022",
      organization: "Ministry of Education",
      description: "Recognized for our innovative approach to educational development and significant impact on improving access to quality education for children in rural communities across Ethiopia.",
      icon: <FaAward />,
      image: ministryEdu
    },
    {
      id: 3,
      title: "Kindest Person of the Year",
      year: "2021",
      organization: "Ministry of Education",
      description: "Honored for exceptional compassion and dedication to improving the lives of children through education. This award recognizes individuals who go above and beyond in their service to the community.",
      icon: <FaAward />,
      image: begoSaw
    },
    {
      id: 4,
      title: "Morning Meal Program Excellence",
      year: "2020",
      organization: "Ministry of Urban Development and Construction",
      description: "Recognized for our outstanding contribution to children's nutrition through the morning meal program, which has significantly improved school attendance and academic performance in urban areas.",
      icon: <FaMedal />,
      image: urbanImg
    },
    {
      id: 5,
      title: "Kindest Person Award",
      year: "2019",
      organization: "Ethiopian Humanitarian Foundation",
      description: "Awarded to individuals who demonstrate extraordinary kindness, empathy, and selfless service to children in need. This recognition celebrates the power of compassion in transforming lives.",
      icon: <FaHeart />,
      image: begoImg
    },
    // Keep only the remaining unique awards with corrected IDs
    
  ]);
  
  const [certifications, setCertifications] = useState([
    {
      id: 1,
      title: "ISO 9001:2015 Certification",
      year: "2021",
      issuer: "International Standards Organization",
      description: "Certified for meeting international standards for quality management systems in charitable operations."
    },
    {
      id: 2,
      title: "Ethical NGO Certification",
      year: "2020",
      issuer: "Ethiopian Charities and Societies Agency",
      description: "Recognized for maintaining the highest standards of ethical practice and financial transparency."
    },
    {
      id: 3,
      title: "Child Protection Standards Compliance",
      year: "2019",
      issuer: "International Child Welfare Alliance",
      description: "Certified for implementing comprehensive child protection policies across all programs and activities."
    }
  ]);

  useEffect(() => {
    // Simulate loading data from database
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="achievements-page">
      {/* Hero Section - Updated to match the About Us page style */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="container">
          <h1>Awards & Recognition</h1>
          <div className="breadcrumb">
            <Link to="/">HOME</Link>
            <span>-</span>
            <span>AWARDS & RECOGNITION</span>
          </div>
        </div>
      </section>

      {/* Major Awards Section - Updated to use cards with image on right */}
      <section className="major-awards-section">
        <div className="container">
          <h2>Our Honors</h2>
          <p>
            Throughout our journey, we've been honored to receive recognition for our commitment to 
            improving education and community development across Ethiopia.
          </p>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading awards...</p>
            </div>
          ) : (
            <>
              <div className="awards-cards">
                {awards.map((award, index) => (
                  <div key={award.id} className="award-card">
                    <div className="award-info">
                      <div className="award-year-badge">{award.year}</div>
                      <h3>{award.title}</h3>
                      <div className="award-organization">{award.organization}</div>
                      <div className="award-icon-container">
                        <div className="award-icon">{award.icon}</div>
                      </div>
                      <p>{award.description}</p>
                    </div>
                    <div className="award-image-container">
                      <img 
                        src={award.image} 
                        alt={award.title} 
                        className="award-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/vite.svg';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* New Summary Section */}
              <div className="awards-summary">
                <div className="awards-summary-header">
                  <div className="summary-icon"><FaTrophy /></div>
                  <h3>Our Journey of Recognition</h3>
                </div>
                
                <div className="awards-summary-content">
                  <div className="summary-column">
                    <p>
                      From our recent recognition by the Dire Dawa Administration Bureau in 2023 to our earliest 
                      Certificate of Excellence from the Ministry of Social Affairs in 2017, each award represents 
                      Wosen Biratu's dedication to transforming education in Ethiopia.
                    </p>
                  </div>
                  
                  <div className="summary-column">
                    <p>
                      Our work with the Ministry of Education has been particularly impactful, earning us both the 
                      Outstanding Educational Initiative award and the Kindest Person of the Year recognition. The 
                      Morning Meal Program has become one of our flagship initiatives, demonstrating how nutrition 
                      and education go hand in hand.
                    </p>
                  </div>
                  
                  <div className="summary-column">
                    <p>
                      The Kindest Person Award from the Ethiopian Humanitarian Foundation reminds us that at the heart 
                      of our work are the compassionate individuals who dedicate themselves to improving children's lives 
                      every day. These awards inspire us to reach even greater heights in our service.
                    </p>
                  </div>
                </div>
                
                <div className="awards-summary-footer">
                  <span className="highlight-text">7 Awards</span> received since 2017 across 
                  <span className="highlight-text"> 5 different organizations</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>


      {/* Media Recognition Videos Section */}
      <section className="media-recognition-section">
        <div className="container">
          <div className="media-recognition-intro">
            <h2>Media Interviews</h2>
            <p>Our work has been featured in various media outlets. Watch these interviews to learn more about our mission and impact.</p>
          </div>
          
          <div className="media-videos-container">
            <div className="media-video-card">
              <div className="video-container">
                <iframe 
                  src="https://www.youtube.com/embed/WIkGW5SaP3Q" 
                  title="VOA Interview on Educational Impact" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <div className="video-info">
                <h3>Our Educational Impact in Ethiopia</h3>
                <div className="video-source">
                  <FaYoutube /> Voice of America (VOA)
                </div>
                <p className="video-description">
                  Wosen Biratu's food donation initiative has been featured in this manner by the international media outlet Voice of America (VOA).
                </p>
              </div>
            </div>
            
            <div className="media-video-card">
              <div className="video-container">
                <iframe 
                  src="https://www.youtube.com/embed/6iWWGJfC3hg" 
                  title="EBC Feature on Educational Programs" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <div className="video-info">
                <h3>Spotlight on Our Educational Programs</h3>
                <div className="video-source">
                  <FaYoutube /> Ethiopian Broadcasting Corporation (EBC)
                </div>
                <p className="video-description">
                  The charitable activities being carried out by Wosen Biratu have been reported in this manner by Ethiopia Television, a national media outlet.
                </p>
              </div>
            </div>
            
            <div className="media-video-card">
              <div className="video-container">
                <iframe 
                  src="https://www.youtube.com/embed/tSpnxq5mtpo" 
                  title="DIRE TV Community Partnership Interview" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <div className="video-info">
                <h3>Supporting Vulnerable Communities</h3>
                <div className="video-source">
                  <FaYoutube /> DIRE TV
                </div>
                <p className="video-description">
                  DIRE TV reports on how, through the support of Wosen Biratu, assistance was provided to vulnerable community members in the Dire Dawa region, highlighting the impact of compassionate community service.
                </p>
              </div>
            </div>
            
            <div className="media-video-card">
              <div className="video-container">
                <iframe 
                  src="https://www.youtube.com/embed/ZI25WF7B0U4" 
                  title="DW Feature on Ethiopian Education Initiatives" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
              <div className="video-info">
                <h3>International Coverage of Our Work</h3>
                <div className="video-source">
                  <FaYoutube /> Deutsche Welle (DW)
                </div>
                <p className="video-description">
                  Wosen Biratu's food support program has been featured in this manner by the international media outlet, German Radio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="awards-cta">
        <div className="container">
          <h2>Support Our Award-Winning Work</h2>
          <p>Join us in continuing to make a difference in the lives of children across Ethiopia</p>
          <div className="cta-buttons">
            <a href="/donate" className="cta-button primary">Donate Now</a>
            <a href="/contacts" className="cta-button secondary">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AchievementsPage;