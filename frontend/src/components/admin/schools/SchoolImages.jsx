import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import { FaEdit, FaTrash, FaStar, FaEye, FaArrowLeft, FaPlus, FaUpload } from 'react-icons/fa';
import '../../../styles/admin/schools/SchoolImages.css';

const SchoolImages = ({ school, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isFeatured: false,
    files: []
  });
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(school ? school.school_id : '');

  useEffect(() => {
    fetchImages();
    fetchSchools();
  }, [school]);

  const fetchSchools = async () => {
    try {
      const response = await apiService.schools.getAll();
      const list = response.schools || response || [];
      const simplified = list.map(s => ({ school_id: s.school_id, name: s.name }));
      setSchools(simplified);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  // Fetch images from backend API
  const fetchImages = async () => {
    setLoading(true);
    try {
      const schoolId = school?.school_id;
      if (!schoolId) {
        console.warn('Missing school_id when fetching images');
        setImages([]);
        return;
      }

      const response = await apiService.schoolImages.getAll({ school_id: schoolId });
      console.log('School images API response:', response);

      const list = Array.isArray(response)
        ? response
        : (response?.images || []);

      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const imagesWithUrls = list.map(img => {
        let url = img.image_url || (img.image_path ? `/uploads/${img.image_path}` : img.url) || '/vite.svg';
        if (typeof url === 'string' && url.startsWith('/uploads')) {
          url = `${apiBase}${url}`;
        }
        return { ...img, url };
      });
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({
      ...formData,
      files: selectedFiles
    });
  };

  // No longer need base64 conversion; backend stores files

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.files.length === 0) {
      alert('Please select at least one image to upload');
      return;
    }

    const schoolId = selectedSchoolId || school.school_id;
    if (!schoolId) {
      alert('Please select a school');
      return;
    }

    setUploading(true);
    
    try {
      await apiService.schoolImages.create({
        images: formData.files,
        school_id: schoolId,
        title: formData.title || undefined,
        description: formData.description || undefined,
        is_featured: formData.isFeatured
      });
      
      // Reset form and refresh images
      setFormData({
        title: '',
        description: '',
        isFeatured: false,
        files: []
      });
      
      setShowUploadForm(false);
      fetchImages();
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error uploading images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleFeature = async (imageId, currentFeatured) => {
    try {
      await apiService.schoolImages.update(imageId, { is_featured: !currentFeatured });
      setImages(images.map(img => 
        img.id === imageId ? { ...img, is_featured: !currentFeatured } : img
      ));
    } catch (error) {
      console.error('Error updating image:', error);
      alert(`Error updating image: ${error.message}`);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await apiService.schoolImages.delete(imageId);
        
        setImages(images.filter(img => img.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
        alert(`Error deleting image: ${error.message}`);
      }
    }
  };

  return (
    <div className="school-images-container">
      {showUploadForm ? (
        <div className="upload-form-container">
          <div className="upload-form-header">
            <h2>Add New Images</h2>
            <button className="back-btn" onClick={() => setShowUploadForm(false)}>
              <FaArrowLeft /> Back to Images
            </button>
          </div>
          
          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label>Select School</label>
              <select 
                value={selectedSchoolId || school.school_id} 
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="form-control"
                required
              >
                <option value="">-- Select a School --</option>
                {schools.map(s => (
                  <option key={s.school_id} value={s.school_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Image Title (Optional)</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Morning Meal Distribution"
                className="form-control"
              />
              <small className="form-text">This title will be used for all uploaded images. You can edit individual titles later.</small>
            </div>
            
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the images"
                className="form-control"
                rows={4}
              ></textarea>
              <small className="form-text">This description will be used for all uploaded images. You can edit individual descriptions later.</small>
            </div>
            
            <div className="form-check">
              <input 
                type="checkbox" 
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="form-check-input"
                id="featuredCheck"
              />
              <label className="form-check-label" htmlFor="featuredCheck">
                Set as Featured Image
              </label>
              <small className="form-text d-block">Featured images appear prominently in the gallery.</small>
            </div>
            
            <div className="form-group mt-4">
              <label>Upload Images</label>
              <div className="custom-file-upload">
                <input 
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                  id="imageUpload"
                />
                <div className="file-upload-ui">
                  <span className="file-name">
                    {formData.files.length > 0 
                      ? `${formData.files.length} file(s) selected` 
                      : 'Choose files'}
                  </span>
                  <button 
                    type="button" 
                    className="browse-btn"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    Browse
                  </button>
                </div>
              </div>
              <small className="form-text">You can select multiple images at once. Allowed formats: JPG, JPEG, PNG, GIF.</small>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="upload-submit-btn" 
                disabled={uploading || formData.files.length === 0}
              >
                <FaUpload /> {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="images-header">
            <h1>Images for: {school.name}</h1>
            <div className="header-actions">
              <button className="add-images-btn" onClick={() => setShowUploadForm(true)}>
                <FaPlus /> Add Images
              </button>
              <button className="back-btn" onClick={onBack}>
                <FaArrowLeft /> Back to Schools
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading images...</p>
            </div>
          ) : (
            <div className="images-grid">
              {images.length > 0 ? (
                images.map(image => (
                  <div key={image.id} className="image-card">
                    <div className="image-preview">
                      <img 
                        src={image.url} 
                        alt={image.title || 'Image'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/vite.svg';
                        }}
                      />
                    </div>
                    <div className="image-info">
                      <h3>{image.title}</h3>
                      <p>{image.description}</p>
                      <p className="upload-date">Uploaded: {new Date(image.upload_date).toLocaleDateString()}</p>
                    </div>
                    <div className="image-actions">
                      <button 
                        className={`feature-btn ${image.is_featured ? 'featured' : ''}`}
                        onClick={() => handleToggleFeature(image.id, image.is_featured)}
                      >
                        <FaStar /> {image.is_featured ? 'Featured' : 'Feature'}
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteImage(image.id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-images">
                  <p>No images found for this school. Add some images to get started!</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolImages;