import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/apiClient';
import '../styles/GalleryPage.css';
import galleryHeroImage from '../assets/images/gallery-hero.jpg';

const GalleryPage = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolImages, setSchoolImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await apiService.schools.getAll();
        const schoolsData = Array.isArray(response?.schools) ? response.schools : [];
        
        setSchools(schoolsData);
        
        // Set the first school as selected by default if we have schools
        if (schoolsData.length > 0) {
          setSelectedSchool(schoolsData[0]);
          fetchSchoolImages(schoolsData[0].school_id);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []);

  const fetchSchoolImages = async (schoolId) => {
    setImagesLoading(true);
    try {
      const response = await apiService.schoolImages.getAll({ school_id: schoolId });
      const imagesData = Array.isArray(response?.images) ? response.images : [];
      
      // Build absolute URLs like in SchoolImages.jsx
      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const imagesWithUrls = imagesData.map(img => {
        let url = img.image_url || (img.image_path ? `/uploads/${img.image_path}` : img.url) || '/vite.svg';
        if (typeof url === 'string' && url.startsWith('/uploads')) {
          url = `${apiBase}${url}`;
        }
        return { ...img, image_data: url };
      });
      
      setSchoolImages(imagesWithUrls);
    } catch (error) {
      console.error('Error fetching school images:', error);
      setSchoolImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    fetchSchoolImages(school.school_id);
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      {/* Hero Banner */}
      <div className="gallery-hero" style={{ backgroundImage: `url(${galleryHeroImage})` }}>
        <div className="overlay"></div>
        <div className="container">
          <h1>Gallery</h1>
          <div className="breadcrumb-nav">
            <Link to="/">HOME</Link> • <span className="active">GALLERY</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="gallery-content-wrapper">
        <div className="container">
          <div className="gallery-header">
            <h2>Morning Meal Program</h2>
            <p>Our gallery showcases the impact of our morning voluntary feeding program across different schools, providing nutritious meals to children in need.</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading schools...</p>
            </div>
          ) : (
            <div className="gallery-layout">
              {/* Sidebar with Schools List */}
              <div className="gallery-sidebar">
                <div className="sidebar">
                  <h3 style={{ color: `white`}}>Our Schools</h3>
                  {schools.length > 0 ? (
                    <ul className="schools-nav">
                      {schools.map((school) => (
                        <li 
                          key={school.school_id} 
                          className={selectedSchool && selectedSchool.school_id === school.school_id ? 'active' : ''}
                          onClick={() => handleSchoolSelect(school)}
                        >
                          {school.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-schools">No schools found.</p>
                  )}
                </div>
              </div>

              {/* School Images */}
              {selectedSchool && (
                <div className="gallery-content">
                  <div className="school-gallery">
                    <div className="school-header">
                      <h3>{selectedSchool.name}</h3>
                      <p className="school-description">{selectedSchool.description || `Small village school`}</p>
                    </div>

                    {imagesLoading ? (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading images...</p>
                      </div>
                    ) : schoolImages.length > 0 ? (
                      <div className="lookbook-grid">
                        {schoolImages.map((image, index) => (
                          <div 
                            key={image.id} 
                            className={`lookbook-item ${index % 3 === 0 ? 'large' : 'small'}`}
                            onClick={() => openLightbox(image)}
                          >
                            <div className="image-container">
                              <img 
                                src={image.image_data} 
                                alt={image.title || `${selectedSchool.name} - Image`} 
                                loading="lazy"
                              />
                              <div className="image-overlay">
                                <div className="overlay-content">
                                  <h3>{image.title || 'Untitled'}</h3>
                                  <p>{selectedSchool.name}</p>
                                  <button className="view-larger-btn">VIEW LARGER</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-images">
                        <p>No images available for this school.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for viewing larger images */}
      {showLightbox && selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeLightbox}>&times;</span>
            <img 
              src={selectedImage.image_data} 
              alt={selectedImage.title || 'School image'} 
            />
            {selectedImage.title && <div className="lightbox-caption">{selectedImage.title}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;