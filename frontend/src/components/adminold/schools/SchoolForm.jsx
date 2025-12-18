import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../../../styles/admin/schools/SchoolForm.css';

const SchoolForm = ({ school, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    school_id: '',
    name: '',
    description: '',
    region: '',
    children_served: 0,
  });

  useEffect(() => {
    if (school) {
      setFormData({
        school_id: school.school_id || '',
        name: school.name || '',
        description: school.description || '',
        region: school.region || '',
        children_served: school.children_served || 0,
      });
    }
  }, [school]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'children_served' ? parseInt(value, 10) || 0 : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="school-form-container">
      <div className="form-header">
        <h1>{school ? 'Edit School' : 'Add New School'}</h1>
        <button type="button" className="back-button" onClick={onCancel}>
          <FaArrowLeft /> Back to Schools
        </button>
      </div>

      <form onSubmit={handleSubmit} className="school-form">
        <div className="form-group">
          <label htmlFor="name">School Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Addis Ababa School"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="school_id">School ID</label>
          <input
            type="text"
            id="school_id"
            name="school_id"
            placeholder="e.g., school1, addis_ababa_school (no spaces, use underscores)"
            value={formData.school_id}
            onChange={handleChange}
            required
            disabled={!!school} // Disable editing ID if updating existing school
          />
          <small className="form-hint">This will be used in URLs and file paths. Use only letters, numbers, and underscores.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Brief description of the school and its meal program"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="children_served">Children Served Daily</label>
          <input
            type="number"
            id="children_served"
            name="children_served"
            min="0"
            value={formData.children_served}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save School
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;
