import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient.js';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/admin/alerts/AlertForm.css';

const AlertForm = ({ alert, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info', // Changed from urgency_level to match our API
    status: 'inactive',
    activate_immediately: false,
    priority: 1 // Added priority field
  });

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (alert) {
      setFormData({
        title: alert.title || '',
        message: alert.message || '',
        type: alert.type || 'info',
        status: alert.status || 'inactive',
        activate_immediately: false,
        priority: alert.priority || 1
      });
      
      if (alert.image) {
        setImagePreview(alert.image);
      }
    }
  }, [alert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('Alert title is required');
      return;
    }

    if (!formData.message) {
      setError('Alert message is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = alert?.image;
      
      // Upload new image if provided
      if (image) {
        const uploadResult = await apiService.upload.image(image);
        imageUrl = uploadResult.file.url;
      }

      // Prepare alert data
      const alertData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        status: formData.activate_immediately ? 'active' : formData.status,
        priority: parseInt(formData.priority),
        image: imageUrl
      };
      
      if (alert) {
        // Update existing alert
        await apiService.alerts.update(alert._id, alertData);
      } else {
        // Create new alert
        await apiService.alerts.create(alertData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving alert:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alert-form-container">
      <div className="form-header">
        <h1>{alert ? 'Edit Alert Message' : 'Create New Alert Message'}</h1>
        <button 
          className="back-button" 
          onClick={onCancel}
          disabled={loading}
        >
          <FaArrowLeft /> Back to Alerts
        </button>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="alert-form">
        <div className="form-group">
          <label htmlFor="title">Alert Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a clear, concise title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Alert Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Enter the full alert message"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image (Optional)</label>
          <div className="file-input-container">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="image" className="file-input-label">
              <FaImage /> {image ? 'Change Image' : 'Choose Image'}
            </label>
          </div>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Alert Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority (1-10)</label>
            <input
              type="number"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={formData.activate_immediately}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="activate_immediately"
              checked={formData.activate_immediately}
              onChange={handleChange}
            />
            Activate Immediately (will deactivate all other alerts)
          </label>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="action_link">Action Button Link (Optional)</label>
            <input
              type="url"
              id="action_link"
              name="action_link"
              value={formData.action_link}
              onChange={handleChange}
              placeholder="https://example.com/page"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="action_text">Action Button Text</label>
            <input
              type="text"
              id="action_text"
              name="action_text"
              value={formData.action_text}
              onChange={handleChange}
              placeholder="Learn More"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Saving...' : <><FaSave /> Save Alert</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlertForm;