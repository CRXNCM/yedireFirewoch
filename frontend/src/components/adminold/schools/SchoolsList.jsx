import React from 'react';
import { FaEdit, FaTrash, FaImages } from 'react-icons/fa';
import '../../../styles/admin/schools/SchoolsList.css';

const SchoolsList = ({ schools, loading, onEdit, onManageImages, onDelete }) => {
  if (loading) {
    return <div className="loading">Loading schools...</div>;
  }

  if (schools.length === 0) {
    return <div className="no-schools">No schools found. Add your first school!</div>;
  }

  return (
    <div className="schools-list">
      {schools.map((school, index) => (
        <div key={school?.school_id || `school-${index}`} className="school-card">
          <h3>{school?.name}</h3>
          <div className="school-details">
            <p><strong>ID:</strong> {school?.school_id}</p>
            <p><strong>Region:</strong> {school?.region || 'Not specified'}</p>
            <p><strong>Children Served:</strong> {school?.children_served}</p>
            {school?.description && (
              <p className="school-description">{school.description}</p>
            )}
          </div>
          <div className="school-actions">
            <button className="edit-btn" onClick={() => onEdit(school)}>
              <FaEdit /> Edit
            </button>
            <button className="images-btn" onClick={() => onManageImages(school)}>
              <FaImages /> Images
            </button>
            <button className="delete-btn" onClick={() => onDelete(school?.school_id)}>
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchoolsList;