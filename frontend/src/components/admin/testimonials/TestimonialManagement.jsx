import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import Sidebar from '../Sidebar';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaStar, FaArrowLeft } from 'react-icons/fa';
import './TestimonialManagement.css';
import placeholderPerson from '../../../assets/images/logo.png';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    type: 'donor',
    message: '',
    rating: 5,
    location: '',
    isVisible: true,
    isFeatured: false,
    displayOrder: 0,
    image: '',
    image_file: null,
    image_preview: null
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiService.testimonials.getAll();
      // API returns an object with testimonials array
      setTestimonials(response.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };



  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        image_file: file,
        image_preview: URL.createObjectURL(file),
        image: '' // Clear URL when file is selected
      });
    } else if (name === 'image') {
      // Clear file when URL is entered
      setFormData({
        ...formData,
        [name]: value,
        image_file: null,
        image_preview: value || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };


  const uploadImage = async (file) => {
    try {
      const response = await apiService.upload.image(file);
      return response.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let imageUrl = formData.image;
      
      // If a new file was selected, upload it first
      if (formData.image_file) {
        imageUrl = await uploadImage(formData.image_file);
      }
      
      const testimonialData = {
        name: formData.name,
        title: formData.title || '',
        organization: formData.organization || '',
        type: formData.type || 'donor',
        message: formData.message,
        rating: formData.rating,
        location: formData.location || '',
        isVisible: formData.isVisible,
        isFeatured: formData.isFeatured || false,
        displayOrder: formData.displayOrder || 0,
        ...(imageUrl && { image: imageUrl })
      };
      
      let result;
      if (currentTestimonial) {
        // Update existing testimonial
        result = await apiService.testimonials.update(currentTestimonial._id, testimonialData);
        alert('Testimonial updated successfully!');
      } else {
        // Add new testimonial
        result = await apiService.testimonials.create(testimonialData);
        alert('Testimonial created successfully!');
      }
      
      // Refresh the testimonials list
      fetchTestimonials();
      closeModal();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert(`Error saving testimonial: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      organization: '',
      type: 'donor',
      message: '',
      rating: 5,
      location: '',
      isVisible: true,
      isFeatured: false,
      displayOrder: 0,
      image: '',
      image_file: null,
      image_preview: null
    });
    setCurrentTestimonial(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      title: testimonial.title || '',
      organization: testimonial.organization || '',
      type: testimonial.type || 'donor',
      message: testimonial.message || '',
      rating: testimonial.rating || 5,
      location: testimonial.location || '',
      isVisible: testimonial.isVisible || true,
      isFeatured: testimonial.isFeatured || false,
      displayOrder: testimonial.displayOrder || 0,
      image: testimonial.image || '',
      image_file: null,
      image_preview: testimonial.image || null
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await apiService.testimonials.delete(id);
        
        // Refresh the testimonials list
        fetchTestimonials();
        alert('Testimonial deleted successfully!');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Error deleting testimonial. Please try again.');
      }
    }
  };

  const toggleStatus = async (testimonials) => {
    try {
      const updatedData = { isVisible: !testimonials.isVisible };
      await apiService.testimonials.update(testimonials._id, updatedData);
      
      // Refresh the testimonials list
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      alert('Error updating testimonial status. Please try again.');
    }
  };

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

  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="testimonial-management">
          <div className="testimonial-header">
            <h2>Manage Testimonials</h2>
            <button className="add-testimonial-btn" onClick={openAddModal}>
              <FaPlus /> Add New Testimonial
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading testimonials...</div>
          ) : (
            <div className="testimonials-table-container">
              {testimonials.length > 0 ? (
                <table className="testimonials-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>type</th>
                      <th>Message</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Date Added</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((testimonials) => (
                      <tr key={testimonials._id} className={!testimonials.isVisible ? 'inactive' : ''}>
                        <td className="image-cell">
                          {testimonials.image ? (
                            <img 
                              src={testimonials.image} 
                              alt={testimonials.name} 
                              className="testimonial-image"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = placeholderPerson;
                              }}
                            />
                          ) : (
                            <div className="placeholder-image">
                              {testimonials.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td>{testimonials.name}</td>
                        <td>{testimonials.type || '-'}</td>
                        <td className="message-cell">
                          {testimonials.message.length > 50 
                            ? `${testimonials.message.substring(0, 50)}...` 
                            : testimonials.message}
                        </td>
                        <td className="rating-cell">
                          <div className="stars-display">
                            {renderStars(testimonials.rating)}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${testimonials.isVisible ? 'active' : 'inactive'}`}>
                            {testimonials.isVisible ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {new Date(testimonials.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn" 
                              onClick={() => openEditModal(testimonials)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="visibility-btn" 
                              onClick={() => toggleStatus(testimonials)}
                              title={testimonials.isVisible ? "Deactivate" : "Activate"}
                            >
                              {testimonials.isVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDelete(testimonials._id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-testimonials">
                  <p>No testimonials found. Click "Add New Testimonial" to create one.</p>
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal testimonial-modal">
                <div className="modal-header">
                  <h3>{currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                  <button className="back-btn" onClick={closeModal}>
                    <FaArrowLeft /> Back to Testimonials
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="testimonial-form">
                  <div className="form-group">
                    <label htmlFor="name">Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="title">Title/Position</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title or position (e.g., CEO, Teacher, Volunteer)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="organization">Organization</label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="type">Testimonial Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="donor">Donor</option>
                      <option value="beneficiary">Beneficiary</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="partner">Partner</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location (e.g., City, Country)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Testimonial Message <span className="required">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="Enter the testimonial message"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= formData.rating ? 'star filled' : 'star empty'}
                          onClick={() => handleRatingChange(star)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image_file">Person Image</label>
                    <div className="file-input-container">
                      <input
                        type="file"
                        id="image_file"
                        name="image_file"
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                      <p className="file-hint">Recommended size: 200x200 pixels. Square images work best.</p>
                    </div>
                    {formData.image_preview && (
                      <div className="image-preview">
                        <img src={formData.image_preview} alt="Preview" />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image || ''}
                      onChange={handleInputChange}
                      placeholder="Enter URL to person's image"
                    />
                    {formData.image && (
                      <div className="image-preview">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = placeholderPerson;
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="displayOrder">Display Order</label>
                    <input
                      type="number"
                      id="displayOrder"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      placeholder="Enter display order (0 = first)"
                      min="0"
                    />
                    <p className="file-hint">Lower numbers appear first. Use 0 for highest priority.</p>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      Featured testimonial (highlight on homepage)
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isVisible"
                        checked={formData.isVisible}
                        onChange={handleInputChange}
                      />
                      Active (display on website)
                    </label>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {currentTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialManagement;