import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import { FaEdit, FaEye, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import '../../../styles/admin/gallery/GalleryManagement.css';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [featuredStatus, setFeaturedStatus] = useState('all');

  useEffect(() => {
    fetchSchools();
    fetchImages();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [selectedSchool, featuredStatus]);

  const fetchSchools = async () => {
    try {
      const response = await apiService.schools.getAll();
      const schoolsList = response.schools || response || [];
      setSchools(schoolsList.map(s => ({ school_id: s.school_id, name: s.name })));
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSchool !== 'all') params.school_id = selectedSchool;
      if (featuredStatus !== 'all') params.featured = String(featuredStatus === 'featured');
      const response = await apiService.schoolImages.getAll(params);
      console.log('Gallery images API response:', response);

      const list = Array.isArray(response)
        ? response
        : (response?.images || []);

      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const normalized = list.map(img => {
        let url = img.image_url || (img.image_path ? `/uploads/${img.image_path}` : img.url) || '/vite.svg';
        if (typeof url === 'string' && url.startsWith('/uploads')) {
          url = `${apiBase}${url}`;
        }
        return { ...img, url };
      });

      setImages(normalized);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await apiService.schoolImages.delete(id);
        setImages(images.filter(image => image.id !== id));
      } catch (error) {
        console.error('Error deleting image:', error);
        alert(`Error deleting image: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add these state variables
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    school_id: '',
    is_featured: false,
    images: []
  });

  // Add these functions
  const handleUploadModalOpen = () => {
    setUploadFormData({
      title: '',
      description: '',
      school_id: '',
      is_featured: false,
      images: []
    });
    setShowUploadModal(true);
  };

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
    setUploadFormData({
      title: '',
      description: '',
      school_id: '',
      is_featured: false,
      images: []
    });
  };

  const handleUploadInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? Array.from(files) : value
    }));
  };

  // Add convertFileToBase64 helper function
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Replace handleImageUpload with this version
  const handleImageUpload = async (e) => {
    e.preventDefault();
    
    if (uploadFormData.images.length === 0) {
      alert('Please select at least one image to upload');
      return;
    }
  
    if (!uploadFormData.school_id) {
      alert('Please select a school');
      return;
    }
  
    try {
      setLoading(true);
      
      await apiService.schoolImages.create({
        images: uploadFormData.images,
        school_id: uploadFormData.school_id,
        title: uploadFormData.title || undefined,
        description: uploadFormData.description || undefined,
        is_featured: uploadFormData.is_featured
      });
      
      // Refresh images list
      fetchImages();
      handleUploadModalClose();
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error uploading images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update the file input in the modal form
  <div className="form-group">
    <label>Images</label>
    <div className="custom-file-upload">
      <input
        type="file"
        name="images"
        accept="image/*"
        multiple
        onChange={handleUploadInputChange}
        className="file-input"
        id="imageUpload"
        required
      />
      <div className="file-upload-ui">
        <span className="file-name">
          {uploadFormData.images.length > 0 
            ? `${uploadFormData.images.length} file(s) selected` 
            : 'Choose files'}
        </span>
        <button type="button" className="browse-btn">Browse</button>
      </div>
    </div>
    <small className="form-text">You can select multiple images at once. Allowed formats: JPG, JPEG, PNG, GIF.</small>
  </div>

  // Update the return statement to include the upload modal
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="gallery-management">
        <div className="gallery-header">
          <h1>Image Gallery</h1>
          <div className="header-actions">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search images..."
                className="search-input"
              />
            </div>
            <button className="add-image-btn" onClick={handleUploadModalOpen}>
              <FaPlus /> Upload Images
            </button>

            {/* Add the upload modal */}
            {showUploadModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <div className="modal-logo">
                      <span className="logo-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 419.116">
                          <defs>
                            <clipPath id="clip-folder-new">
                              <rect width="512" height="419.116"></rect>
                            </clipPath>
                          </defs>
                          <g id="folder-new" clipPath="url(#clip-folder-new)">
                            <path
                              id="Union_1"
                              data-name="Union 1"
                              d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z"
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                    <button className="btn-close" onClick={handleUploadModalClose}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                      </svg>
                    </button>
                  </div>

                  <div className="modal-body">
                    <p className="modal-title">Upload Images</p>
                    <p className="modal-description">Add images to the gallery</p>

                    <form onSubmit={handleImageUpload}>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          value={uploadFormData.title}
                          onChange={handleUploadInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={uploadFormData.description}
                          onChange={handleUploadInputChange}
                          rows="3"
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>School</label>
                        <select
                          name="school_id"
                          value={uploadFormData.school_id}
                          onChange={handleUploadInputChange}
                          required
                        >
                          <option value="">Select School</option>
                          {schools.map(school => (
                            <option key={school.school_id} value={school.school_id}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="is_featured"
                            checked={uploadFormData.is_featured}
                            onChange={handleUploadInputChange}
                          />
                          Featured Image
                        </label>
                      </div>

                      <button type="button" className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                        <span className="upload-area-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 340.531 419.116">
                            <g id="files-new">
                              <path
                                id="Union_2"
                                data-name="Union 2"
                                d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Z"
                              />
                            </g>
                          </svg>
                        </span>
                        <span className="upload-area-title">
                          {uploadFormData.images.length > 0 
                            ? `${uploadFormData.images.length} file(s) selected` 
                            : 'Drag file(s) here to upload.'}
                        </span>
                        <span className="upload-area-description">
                          Alternatively, you can select files by <br />
                          <strong>clicking here</strong>
                        </span>
                      </button>
                      <input
                        id="fileInput"
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleUploadInputChange}
                        style={{ display: 'none' }}
                        required
                      />

                      <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={handleUploadModalClose}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Upload Images
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="gallery-filters">
          <div className="filter-pills">
            <button 
              onClick={() => setSelectedSchool('all')}
              className={selectedSchool === 'all' ? 'active' : ''}
            >
              All Photos
            </button>
            {schools.map(school => (
              <button 
                key={school.school_id}
                className={selectedSchool === school.school_id ? 'active' : ''}
                onClick={() => setSelectedSchool(school.school_id)}
              >
                {school.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="lookbook-grid">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`lookbook-item ${index % 3 === 0 ? 'large' : 'small'}`}
                >
                  <div className="image-container">
                    <img 
                      src={image.url}
                      alt={image.title || 'Gallery image'} 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/vite.svg';
                      }}
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <h3>{image.title || 'Untitled'}</h3>
                        <p>{image.schools?.name}</p>
                        <div className="action-buttons">
                          <button 
                            className="action-btn" 
                            title="Edit"
                            onClick={() => handleEditImage(image)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn" 
                            title="View"
                            onClick={() => handleViewImage(image)}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="action-btn delete" 
                            title="Delete"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-images">
                <p>No images found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;