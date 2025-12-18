import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../../../styles/admin/communities/CommunityForm.css';

const CommunityForm = ({ community, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (community) {
      setFormData({
        name: community.name || '',
        region: community.region || '',
        description: community.description || ''
      });
    }
  }, [community]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Call the parent component's submit handler
    onSubmit(formData);
  };

  return (
    <div className="community-form-container">
      <div className="community-form-header">
        <h1>{community ? 'Edit Community' : 'Add Community'}</h1>
        <button className="back-btn" onClick={onCancel}>
          <FaArrowLeft /> Back to Communities
        </button>
      </div>
      
      <form className="community-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Community Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            disabled={loading}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            disabled={loading}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : (community ? 'Update Community' : 'Save Community')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityForm;
