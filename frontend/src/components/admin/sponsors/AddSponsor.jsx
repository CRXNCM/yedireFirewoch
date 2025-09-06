import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient.js';
import './SponsorForm.css';

const AddSponsor = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    is_active: true
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Sponsor name is required');
      return;
    }

    if (!logo) {
      setError('Logo image is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, upload the image to get the URL
      const uploadData = await apiService.upload.image(logo);
      const logoUrl = uploadData.file.url;

      // Then create the sponsor with the uploaded image URL
      const newSponsor = {
        name: formData.name,
        description: formData.description || '',
        logo_path: logoUrl,
        website_url: formData.website_url || '',
        is_active: formData.is_active
      };

      await apiService.sponsors.create(newSponsor);

      navigate('/admin/sponsors');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="sponsor-form-container">
      <div className="sponsor-form-header">
        <h1>Add New Sponsor</h1>
        <button 
          className="btn-back" 
          onClick={() => navigate('/admin/sponsors')}
        >
          <FaArrowLeft /> Back to Sponsors
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="sponsor-form-content">
        <div className="form-section">
          <h2>Sponsor Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                Sponsor Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the sponsor (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo">
                Logo Image <span className="required">*</span>
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="logo"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="file-name">
                  {logo ? logo.name : 'No file chosen'}
                </div>
                <button 
                  type="button" 
                  className="btn-browse"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
              </div>
              <small>Upload a logo image (JPG, PNG, or GIF, max 5MB)</small>
              
              {logoPreview && (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="website_url">Website URL</label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              <small>Sponsor's website URL (optional)</small>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Active
              </label>
              <small>Display this sponsor on the website</small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-add-sponsor"
                disabled={loading}
              >
                {loading ? 'Adding...' : '+ Add Sponsor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSponsor;
