import React, { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import '../../../styles/admin/volunteers/VolunteerForm.css';

const VolunteerForm = ({ volunteer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (volunteer) {
      setFormData({
        name: volunteer.name || '',
        email: volunteer.email || '',
        phone: volunteer.phone || ''
      });
    }
  }, [volunteer]);

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
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="volunteer-form-container">
      <div className="volunteer-form-header">
        <h1>{volunteer ? 'Edit Volunteer' : 'Add Volunteer'}</h1>
        <button className="back-btn" onClick={onCancel}>
          <FaArrowLeft /> Back to Volunteers
        </button>
      </div>
      
      <form className="volunteer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">
            <FaSave /> Save Volunteer
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerForm;