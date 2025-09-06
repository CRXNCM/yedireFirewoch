import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import './UrgentMessageForm.css';

const AddUrgentMessage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    urgency_level: 'Normal',
    action_link: '',
    action_text: 'Help Now',
    activate_immediately: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // In your handleSubmit function, add error handling for RLS violations
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('Message title is required');
      return;
    }
  
    if (!formData.message) {
      setError('Message content is required');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      let imagePath = null;
      
      // Upload image to storage if provided
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `urgent_messages_${Date.now()}.${fileExt}`;
        imagePath = `urgent_messages/${fileName}`;
  
        // Use the 'images' bucket
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(imagePath, image);
  
        if (uploadError) throw uploadError;
      }
  
      // If activating immediately, first deactivate all other messages
      if (formData.activate_immediately) {
        const { error: deactivateError } = await supabase
          .from('urgent_messages')
          .update({ status: 'inactive' })
          .eq('status', 'active');
  
        if (deactivateError) {
          if (deactivateError.message.includes('row-level security')) {
            throw new Error('Permission denied: You do not have access to update urgent messages. Please contact your administrator.');
          }
          throw deactivateError;
        }
      }
  
      // Insert message data
      const messageData = {
        title: formData.title,
        message: formData.message,
        image_path: imagePath,
        urgency_level: formData.urgency_level,
        status: formData.activate_immediately ? 'active' : 'inactive',
        action_link: formData.action_link || null,
        action_text: formData.action_text || 'Help Now'
      };
  
      const { error: insertError } = await supabase
        .from('urgent_messages')
        .insert([messageData]);
        
      if (insertError) {
        if (insertError.message.includes('row-level security')) {
          throw new Error('Permission denied: You do not have access to add urgent messages. Please contact your administrator.');
        }
        throw new Error(`Failed to add urgent message: ${insertError.message}`);
      }
  
      navigate('/admin/urgent-messages');
    } catch (error) {
      console.error('Error adding urgent message:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="urgent-message-form-container">
      <div className="urgent-message-form-header">
        <h1>Add Urgent Message</h1>
        <button 
          className="btn-back" 
          onClick={() => navigate('/admin/urgent-messages')}
        >
          ← Back to Messages
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="urgent-message-form-content">
        <div className="form-section">
          <h2>Message Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the urgent situation or need. This will be displayed in the popup."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">
                Image
              </label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="file-input-label">
                  <span>Choose file</span>
                </div>
                <div className="file-name">
                  {image ? image.name : 'No file chosen'}
                </div>
                <button 
                  type="button" 
                  className="btn-browse"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
              </div>
              <small>Optional. Recommended size: 600x400px. Max size: 5MB.</small>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Image Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="urgency_level">Urgency Level</label>
              <select
                id="urgency_level"
                name="urgency_level"
                value={formData.urgency_level}
                onChange={handleChange}
              >
                <option value="Normal">Normal (Blue)</option>
                <option value="Important">Important (Yellow)</option>
                <option value="Urgent">Urgent (Red)</option>
              </select>
              <small>This determines the color of the popup header.</small>
            </div>

            <div className="form-group">
              <label htmlFor="action_link">Action Link</label>
              <input
                type="url"
                id="action_link"
                name="action_link"
                value={formData.action_link}
                onChange={handleChange}
                placeholder="https://example.com/donate"
              />
              <small>Optional. URL where users can take action (e.g., donation page).</small>
            </div>

            <div className="form-group">
              <label htmlFor="action_text">Action Button Text</label>
              <input
                type="text"
                id="action_text"
                name="action_text"
                value={formData.action_text}
                onChange={handleChange}
                placeholder="Help Now"
              />
              <small>Text to display on the action button. Default: "Help Now"</small>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="activate_immediately"
                  checked={formData.activate_immediately}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Activate immediately
              </label>
              <small>If checked, this message will be displayed on the website and any other active messages will be deactivated.</small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-add-message"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUrgentMessage;