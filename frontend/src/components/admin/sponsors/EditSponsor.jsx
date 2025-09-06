import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../utils/apiClient.js';
import { FaArrowLeft } from 'react-icons/fa';
import './SponsorForm.css';

const EditSponsor = () => {
  const { id } = useParams();
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
  const [currentLogoPath, setCurrentLogoPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const response = await apiService.sponsors.getById(id);
        const sponsorData = response.sponsor;
        
        if (sponsorData) {
          setFormData({
            name: sponsorData.name || '',
            description: sponsorData.description || '',
            website_url: sponsorData.website_url || '',
            is_active: sponsorData.is_active
          });
          
          if (sponsorData.logo_path) {
            setCurrentLogoPath(sponsorData.logo_path);
            // For API-based logo preview, we need to construct the URL
            // This assumes the backend serves uploaded files from a specific route
            const logoUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${sponsorData.logo_path}`;
            setLogoPreview(logoUrl);
          }
        } else {
          setError('Sponsor not found');
        }
      } catch (error) {
        console.error('Error fetching sponsor:', error);
        setError('Failed to load sponsor. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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

    try {
      setSaving(true);
      setError(null);

      // Handle logo upload if a new logo is provided
      let logoPath = currentLogoPath;
      
      if (logo) {
        // Upload new logo using the API service
        const formData = new FormData();
        formData.append('image', logo);
        
        const uploadResponse = await apiService.upload.image(logo);
        logoPath = uploadResponse.filePath;
        
        // Note: The backend should handle deletion of old logo if needed
      }

      // Update sponsor data using the API service
      const updateData = {
        name: formData.name,
        description: formData.description || null,
        website_url: formData.website_url || null,
        is_active: formData.is_active
      };
      
      // Only include logo_path if we have a new logo path
      if (logoPath) {
        updateData.logo_path = logoPath;
      }

      await apiService.sponsors.update(id, updateData);
      navigate('/admin/sponsors');
    } catch (error) {
      console.error('Error updating sponsor:', error);
      setError(error.response?.data?.message || 'Failed to update sponsor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading sponsor...</div>;
  }

  if (error && !formData.name) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="sponsor-form-container">
      <div className="sponsor-form-header">
        <h1>Edit Sponsor</h1>
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
                Logo Image {!currentLogoPath && <span className="required">*</span>}
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="logo"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleLogoChange}
                  className="file-input"
                />
                <div className="file-name">
                  {logo ? logo.name : 'No new file chosen'}
                </div>
                <button 
                  type="button" 
                  className="btn-browse"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
              </div>
              <small>
                {currentLogoPath 
                  ? 'Upload a new logo to replace the current one (optional)' 
                  : 'Upload a logo image (JPG, PNG, or GIF, max 5MB)'}
              </small>
              
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
                className="btn-save-sponsor"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSponsor;