import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/apiClient';
import CountUp from 'react-countup';
import '../styles/HomePage.css';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaGraduationCap, FaSchool, FaHandsHelping, FaUsers } from 'react-icons/fa';
import heroImage from '../assets/images/home-hero.png';
import mmLogo from '../assets/images/mm.png';
import wapLogo from '../assets/images/wap.jpg'; // Import Watch and Pray logo

const HomePage = () => {
  const [stats, setStats] = useState({
    students: 0,
    schools: 0,
    volunteers: 0,
    communities: 0
  });
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Add new state for sponsors
  const [sponsors, setSponsors] = useState([
    { 
      id: 1, 
      name: 'MM Hotel Dire Dawa', 
      logo: mmLogo, // Use the imported logo instead of placeholder
      url: 'https://www.mmhoteldire.com/' 
    },
    { 
      id: 2, 
      name: 'Watch and Pray', 
      logo: wapLogo, // Use the imported Watch and Pray logo
      url: 'https://example.com/watchandpray' 
    }
   
  ]);
  const [sponsorPosition, setSponsorPosition] = useState(0);
  const sponsorSliderRef = useRef(null);
  const sponsorIntervalRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchGalleryImages();
    fetchTestimonials();
    fetchSponsors();
    
    // Start the sponsor carousel
    startSponsorCarousel();
    
    // Clean up the interval when component unmounts
    return () => {
      if (sponsorIntervalRef.current) {
        clearInterval(sponsorIntervalRef.current);
      }
    };
  }, []);

  // Add these new functions for sponsor carousel
  const startSponsorCarousel = () => {
    sponsorIntervalRef.current = setInterval(() => {
      nextSponsor();
    }, 3000);
  };
  
  const pauseSponsorCarousel = () => {
    if (sponsorIntervalRef.current) {
      clearInterval(sponsorIntervalRef.current);
    }
  };
  
  const resumeSponsorCarousel = () => {
    pauseSponsorCarousel();
    startSponsorCarousel();
  };
  
  const nextSponsor = () => {
    setSponsorPosition(prev => 
      prev === sponsors.length - 4 ? 0 : prev + 1
    );
  };
  
  const prevSponsor = () => {
    setSponsorPosition(prev => 
      prev === 0 ? sponsors.length - 4 : prev - 1
    );
  };

  // Fetch sponsors from backend API
  const fetchSponsors = async () => {
    try {
      const resp = await apiService.sponsors.getAll();
      const list = Array.isArray(resp?.sponsors) ? resp.sponsors : [];
      if (list.length === 0) return; // keep defaults

      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const transformed = list.map((s) => {
        let logo = s.logo_path || '/vite.svg';
        if (typeof logo === 'string' && logo.startsWith('/uploads')) {
          logo = `${apiBase}${logo}`;
        }
        return {
          id: s.id,
          name: s.name,
          logo,
          url: s.website_url || '#'
        };
      });
      setSponsors(transformed);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    }
  };

  // Fetch testimonials from the database
  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const resp = await apiService.testimonials.getAll();
      const items = Array.isArray(resp?.testimonials) ? resp.testimonials : [];
      setTestimonials(items.slice(0, 3));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Set default testimonials if there's an error
      setTestimonials([]);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Render star ratings based on the rating value
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < rating ? 'star filled' : 'star empty'} 
        />
      );
    }
    return stars;
  };

  const fetchStats = async () => {
    try {
      // Schools and students
      const schoolsResp = await apiService.schools.getAll();
      const schoolsArr = Array.isArray(schoolsResp?.schools) ? schoolsResp.schools : [];
      const totalStudents = schoolsArr.reduce((sum, school) => sum + (school.children_served || 0), 0);

      // Communities
      const communitiesResp = await apiService.communities.getAll();
      const communitiesCount = Number(communitiesResp?.count || 0);

      // Volunteers: endpoint is admin-protected; avoid calling from public homepage
      const volunteersCount = 0;

      setStats((prev) => ({
        ...prev,
        schools: Number(schoolsResp?.count || schoolsArr.length || 0),
        students: totalStudents || 0,
        volunteers: volunteersCount,
        communities: communitiesCount
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    setGalleryLoading(true);
    try {
      const imagesResp = await apiService.schoolImages.getAll();
      const imagesData = Array.isArray(imagesResp?.images) ? imagesResp.images : [];

      // Build absolute URLs like in SchoolImages.jsx
      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const transformedImages = imagesData
        .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
        .slice(0, 16)
        .map((img) => {
          let url = img.image_url || (img.image_path ? `/uploads/${img.image_path}` : img.url) || '/vite.svg';
          if (typeof url === 'string' && url.startsWith('/uploads')) {
            url = `${apiBase}${url}`;
          }
          return {
            id: img.id,
            image_url: url,
            title: img.title || 'School Image',
            description: img.description || ''
          };
        });
      
      // If we have less than 16 images, fill the rest with placeholders
      const images = transformedImages || [];
      const totalImages = images.length;
      
      if (totalImages < 16) {
        const placeholders = Array(16 - totalImages).fill().map((_, i) => ({
          id: `placeholder-${i}`,
          image_url: '/vite.svg',
          title: 'Coming Soon',
          description: 'More images will be added soon'
        }));
        setGalleryImages([...images, ...placeholders]);
      } else {
        setGalleryImages(images);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Set placeholder images if there's an error
      setGalleryImages(Array(16).fill().map((_, i) => ({ 
        id: `error-${i}`, 
        image_url: '/vite.svg',
        title: 'Image Unavailable'
      })));
    } finally {
      setGalleryLoading(false);
    }
  };

  // Create a 4x4 grid structure from the flat array of images
  const createGridStructure = (images) => {
    const grid = [];
    for (let row = 0; row < 4; row++) {
      const rowImages = [];
      for (let col = 0; col < 4; col++) {
        const index = row * 4 + col;
        if (index < images.length) {
          rowImages.push(images[index]);
        }
      }
      grid.push(rowImages);
    }
    return grid;
  };

  const galleryGrid = createGridStructure(galleryImages);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>One for another!</h1>
          <h2 className="amharic-text">አንዳችን ለአንዳችን!</h2>
          <p>Yedire Firewoch Charitable Development Organization</p>
          <p className="amharic-subtitle">የድሬ ፍሬዎች የበጎ አድራጎት ልማት ማህበር</p>
        </div>
      </section>

      {/* Be Part of Change Section */}

      {/* Our Gallery Preview Section */}
      <section className="gallery-preview-section">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Take a look at some of our recent activities and the communities we serve</p>
           
          {galleryLoading ? (
            <div className="gallery-loading">
              <div className="loader"></div>
              <p>Loading gallery...</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryGrid.map((row, rowIndex) => (
                <div className="gallery-row" key={`row-${rowIndex}`}>
                  {row.map((image, colIndex) => (
                    <div 
                      key={image.id || `${rowIndex}-${colIndex}`} 
                      className={`gallery-item diagonal-curved-${(rowIndex + colIndex) % 4}`}
                    >
                      <img 
                        src={image.image_url || '/vite.svg'} 
                        alt={image.title || `Gallery Image ${rowIndex * 4 + colIndex + 1}`} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/vite.svg';
                          e.target.alt = 'Image failed to load';
                        }}
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <h3>{image.title || 'School Image'}</h3>
                          <p>{image.description || 'View our gallery for more images'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link to="/gallery" className="cta-button">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section - Updated with dynamic data and animations */}
      <section className="impact-section">
        <div className="container">
          <h2>Our Impact</h2>
          <p>
            Since our foundation, we've been committed to making a difference in the lives of children
            across Ethiopia. Here's how we've helped so far:
          </p>
          <div className="impact-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaGraduationCap />
              </div>
              <div className="stat-number">
                {loading ? (
                  <span className="loading-placeholder">...</span>
                ) : (
                  <CountUp 
                    end={stats.students} 
                    duration={2.5} 
                    separator="," 
                    suffix="+"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
              </div>
              <div className="stat-label">Students Helped</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaSchool />
              </div>
              <div className="stat-number">
                {loading ? (
                  <span className="loading-placeholder">...</span>
                ) : (
                  <CountUp 
                    end={stats.schools} 
                    duration={2} 
                    suffix="+"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
              </div>
              <div className="stat-label">Schools Supported</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaHandsHelping />
              </div>
              <div className="stat-number">
                {loading ? (
                  <span className="loading-placeholder">...</span>
                ) : (
                  <CountUp 
                    end={stats.volunteers} 
                    duration={1.5} 
                    suffix="+"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
              </div>
              <div className="stat-label">Volunteers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-number">
                {loading ? (
                  <span className="loading-placeholder">...</span>
                ) : (
                  <CountUp 
                    end={stats.communities} 
                    duration={1} 
                    suffix="+"
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
              </div>
              <div className="stat-label">Communities Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What People Say</h2>
          <p>Hear from our volunteers, donors, and the communities we serve about the impact of our work</p>
          
          {testimonialsLoading ? (
            <div className="testimonials-loading">
              <div className="loader"></div>
              <p>Loading testimonials...</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="testimonials-container horizontal">
              {testimonials.map((testimonial) => (
                <div className="testimonial-card green-theme" key={testimonial.id}>
                  <div className="testimonial-content">
                    <div className="rating">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="quote">"{testimonial.message}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-img">
                        {testimonial.image_path ? (
                          <img 
                            src={testimonial.image_path} 
                            alt={testimonial.name} 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/vite.svg';
                            }}
                          />
                        ) : (
                          <div className="testimonial-placeholder">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="author-info">
                        <h4>{testimonial.name}</h4>
                        <p className="position">{testimonial.role || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-testimonials-message">
              <p>No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Updated Sponsors Section */}
      <section className="sponsors-section">
        <div className="container">
          <h2>Our Sponsors</h2>
          <p>We are grateful to these organizations for their generous support of our mission.</p>
          
          <div className="sponsors-carousel-container">
            <div className="sponsors-slider">
              {/* Double the sponsors to create infinite loop effect */}
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <a 
                  key={`${sponsor.id}-${index}`}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-logo"
                  title={`Visit ${sponsor.name}`}
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="sponsor-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/vite.svg';
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Join Our Mission</h2>
          <p>Together, we can make a difference in the lives of children across Ethiopia.</p>
          <div className="cta-buttons">
            <Link to="/donate" className="cta-button primary">
              Donate Now
            </Link>
            <Link to="/contacts" className="cta-button secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;