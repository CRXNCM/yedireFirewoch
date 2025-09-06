import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube, 
  FaPinterest, 
  FaTiktok, 
  FaSnapchatGhost, 
  FaReddit, 
  FaWhatsapp, 
  FaTelegram,
  FaDiscord,
  FaTimes
} from 'react-icons/fa';
import Sidebar from '../Sidebar';
import './SocialMediaManagement.css';

const SocialMediaManagement = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showIconBrowser, setShowIconBrowser] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon_class: '',
    display_order: 1,
    is_active: true
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [error, setError] = useState(null);

  // Social media icons collection
  const socialIcons = [
    { name: 'Facebook', class: 'facebook', icon: <FaFacebook /> },
    { name: 'Instagram', class: 'instagram', icon: <FaInstagram /> },
    { name: 'Twitter', class: 'twitter', icon: <FaTwitter /> },
    { name: 'LinkedIn', class: 'linkedin', icon: <FaLinkedin /> },
    { name: 'YouTube', class: 'youtube', icon: <FaYoutube /> },
    { name: 'Pinterest', class: 'pinterest', icon: <FaPinterest /> },
    { name: 'TikTok', class: 'tiktok', icon: <FaTiktok /> },
    { name: 'Snapchat', class: 'snapchat', icon: <FaSnapchatGhost /> },
    { name: 'Reddit', class: 'reddit', icon: <FaReddit /> },
    { name: 'WhatsApp', class: 'whatsapp', icon: <FaWhatsapp /> },
    { name: 'Telegram', class: 'telegram', icon: <FaTelegram /> },
    { name: 'Discord', class: 'discord', icon: <FaDiscord /> }
  ];

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health before fetching social links...');
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        console.log('✅ Backend is healthy, fetching social links data...');
        fetchSocialLinks();
      } else {
        console.error('❌ Backend health check failed:', response.status);
        setError('Backend server is not responding. Please check if the server is running.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      // Still try to fetch social links in case health endpoint is down
      fetchSocialLinks();
    }
  };

  const fetchSocialLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching social links data...');
      const response = await apiService.socialLinks.getAll();
      console.log('API Response:', response); // Debugging line
      
      // Handle different response structures with proper fallbacks
      let socialLinksArray = [];
      if (Array.isArray(response)) {
        socialLinksArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        socialLinksArray = response.data;
      } else if (response && response.socialLinks && Array.isArray(response.socialLinks)) {
        socialLinksArray = response.socialLinks;
      } else if (response && Array.isArray(response)) {
        socialLinksArray = response;
      }
      
      console.log(`✅ Successfully fetched ${socialLinksArray.length} social links`);
      setSocialLinks(socialLinksArray);
    } catch (error) {
      console.error('❌ Error fetching social links:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch social links';
      setError(`Error: ${errorMessage}`);
      setSocialLinks([]); // Set empty array on error
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

    // Update icon preview when icon class changes
    if (name === 'icon_class') {
      setIconPreview(value);
    }
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      icon_class: '',
      display_order: 1,
      is_active: true
    });
    setCurrentLink(null);
    setIconPreview(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setFormData({
      platform: link.platform || '',
      url: link.url || '',
      icon_class: link.icon_class || '',
      display_order: link.display_order || 1,
      is_active: link.is_active
    });
    setIconPreview(link.icon_class);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    setError(null);
    
    try {
      const linkData = {
        platform: formData.platform,
        url: formData.url,
        icon_class: formData.icon_class,
        display_order: parseInt(formData.display_order),
        is_active: formData.is_active
      };
      
      console.log('Attempting to save social link:', linkData);
      
      if (currentLink) {
        // Update existing link
        console.log(`🔄 Updating social link with ID: ${currentLink.id}`);
        const result = await apiService.socialLinks.update(currentLink.id, linkData);
        setSocialLinks(socialLinks.map(link => 
          link.id === currentLink.id ? result.socialLink : link
        ));
        console.log('✅ Social link updated successfully');
        alert('Social link updated successfully!');
      } else {
        // Add new link
        console.log('➕ Creating new social link');
        const result = await apiService.socialLinks.create(linkData);
        setSocialLinks([...socialLinks, result.socialLink]);
        console.log('✅ Social link created successfully');
        alert('Social link created successfully!');
      }
      
      closeModal();
    } catch (error) {
      console.error('❌ Error saving social link:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save social link';
      setError(`Error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      setOperationLoading(true);
      try {
        console.log(`🗑️ Deleting social link with ID: ${id}`);
        await apiService.socialLinks.delete(id);
        setSocialLinks(socialLinks.filter(link => link.id !== id));
        console.log('✅ Social link deleted successfully');
        alert('Social link deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting social link:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete social link';
        alert(`Error: ${errorMessage}`);
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    checkBackendHealth();
  };

  const getIconComponent = (iconClass) => {
    if (iconClass.includes('facebook')) return <FaFacebook />;
    if (iconClass.includes('instagram')) return <FaInstagram />;
    if (iconClass.includes('twitter')) return <FaTwitter />;
    if (iconClass.includes('linkedin')) return <FaLinkedin />;
    if (iconClass.includes('youtube')) return <FaYoutube />;
    if (iconClass.includes('pinterest')) return <FaPinterest />;
    if (iconClass.includes('tiktok')) return <FaTiktok />;
    if (iconClass.includes('snapchat')) return <FaSnapchatGhost />;
    if (iconClass.includes('reddit')) return <FaReddit />;
    if (iconClass.includes('whatsapp')) return <FaWhatsapp />;
    if (iconClass.includes('telegram')) return <FaTelegram />;
    if (iconClass.includes('discord')) return <FaDiscord />;
    // Default case
    return null;
  };

  const browseIcons = () => {
    setShowIconBrowser(true);
  };

  const selectIcon = (iconInfo) => {
    setFormData({
      ...formData,
      platform: formData.platform || iconInfo.name,
      icon_class: `fa-${iconInfo.class}`
    });
    setIconPreview(`fa-${iconInfo.class}`);
    setShowIconBrowser(false);
  };

  return (
        <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
    <div className="social-media-management">
      <div className="social-media-header">
        <h2>
          <span className="icon">🔗</span> 
          Manage Social Media Links
        </h2>
        <button 
          className="add-link-btn" 
          onClick={openAddModal}
          disabled={operationLoading}
        >
          <FaPlus /> Add New Social Link
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={handleRetry} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      )}

      <div className="social-links-container">
        {loading || operationLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading social links...</p>
          </div>
        ) : (
          <div className="social-links-table">
            {socialLinks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Platform</th>
                    <th>Icon</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {socialLinks.map((link) => (
                    <tr key={link.id} className={!link.is_active ? 'inactive' : ''}>
                      <td>{link.display_order}</td>
                      <td>{link.platform}</td>
                      <td className="icon-cell">
                        {getIconComponent(link.icon_class) || <span className="icon-class">{link.icon_class}</span>}
                      </td>
                      <td>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
                          {link.url}
                        </a>
                      </td>
                      <td>
                        <span className={`status-badge ${link.is_active ? 'active' : 'inactive'}`}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn" 
                            onClick={() => openEditModal(link)}
                            disabled={operationLoading}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(link.id)}
                            disabled={operationLoading}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-links">
                <p>No social media links found. Click "Add New Social Link" to create one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{currentLink ? 'Edit Social Media Link' : 'Add New Social Media Link'}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="platform">Platform Name</label>
                <input
                  type="text"
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  placeholder="E.g., Facebook, Twitter, Instagram, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="Full URL including https://"
                  required
                />
              </div>
              
              <div className="form-group icon-input-group">
                <label htmlFor="icon_class">Icon Class</label>
                <div className="icon-input-container">
                  <input
                    type="text"
                    id="icon_class"
                    name="icon_class"
                    value={formData.icon_class}
                    onChange={handleInputChange}
                    placeholder="Font Awesome icon class (e.g., fa-facebook)"
                    required
                  />
                  <button 
                    type="button" 
                    className="browse-icons-btn"
                    onClick={browseIcons}
                  >
                    Browse Icons
                  </button>
                </div>
                {iconPreview && (
                  <div className="icon-preview">
                    {getIconComponent(iconPreview) || <span className="icon-class">{iconPreview}</span>}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="display_order">Display Order</label>
                <input
                  type="number"
                  id="display_order"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Lower numbers will be displayed first"
                  required
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {currentLink ? 'Update Social Link' : 'Add Social Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Icon Browser Modal */}
      {showIconBrowser && (
        <div className="modal-overlay">
          <div className="modal icon-browser-modal">
            <div className="modal-header">
              <h3>Select Social Media Icon</h3>
              <button className="close-btn" onClick={() => setShowIconBrowser(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="icon-browser-content">
              <div className="icon-grid">
                {socialIcons.map((icon, index) => (
                  <div 
                    key={index} 
                    className="icon-item" 
                    onClick={() => selectIcon(icon)}
                  >
                    <div className="icon-display">
                      {icon.icon}
                    </div>
                    <div className="icon-name">{icon.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default SocialMediaManagement;