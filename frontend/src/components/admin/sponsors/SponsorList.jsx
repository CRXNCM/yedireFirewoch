import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../../utils/apiClient.js'; // Import MySQL connection pool
import Sidebar from '../Sidebar';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaSave, FaTimes } from 'react-icons/fa';
import './SponsorList.css';

const SponsorList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    website_url: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await apiService.sponsors.getAll();
      // Extract sponsors array from the response object
      setSponsors(response.sponsors || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to load sponsors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSponsorStatus = async (id, currentStatus) => {
    try {
      await apiService.sponsors.update(id, { is_active: !currentStatus });
      
      // Update the local state
      setSponsors(sponsors.map(sponsor => 
        sponsor.id === id ? { ...sponsor, is_active: !currentStatus } : sponsor
      ));
    } catch (error) {
      console.error('Error updating sponsor status:', error);
      alert('Failed to update sponsor status. Please try again.');
    }
  };

  const deleteSponsor = async (id) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        // Delete the sponsor record
        await apiService.sponsors.delete(id);
        
        // Update the local state
        setSponsors(sponsors.filter(sponsor => sponsor.id !== id));
      } catch (error) {
        console.error('Error deleting sponsor:', error);
        alert('Failed to delete sponsor. Please try again.');
      }
    }
  };

  const handleEditClick = (sponsor) => {
    setEditingSponsorId(sponsor.id);
    setEditFormData({
      name: sponsor.name || '',
      description: sponsor.description || '',
      website_url: sponsor.website_url || '',
      is_active: sponsor.is_active
    });
  };

  const handleCancelEdit = () => {
    setEditingSponsorId(null);
    setEditFormData({
      name: '',
      description: '',
      website_url: '',
      is_active: true
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveEdit = async (id) => {
    if (!editFormData.name) {
      alert('Sponsor name is required');
      return;
    }

    try {
      setSaving(true);
      
      // Update sponsor data using the API service
      const updateData = {
        name: editFormData.name,
        description: editFormData.description || null,
        website_url: editFormData.website_url || null,
        is_active: editFormData.is_active
      };

      await apiService.sponsors.update(id, updateData);
      
      // Update the local state
      setSponsors(sponsors.map(sponsor => 
        sponsor.id === id ? { ...sponsor, ...updateData } : sponsor
      ));
      
      setEditingSponsorId(null);
      setEditFormData({
        name: '',
        description: '',
        website_url: '',
        is_active: true
      });
      
    } catch (error) {
      console.error('Error updating sponsor:', error);
      alert('Failed to update sponsor. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="loading-message">Loading sponsors...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="sponsor-list-container">
          <div className="sponsor-list-header">
            <h1>Manage Sponsors</h1>
            <Link to="/admin/sponsors/add" className="add-sponsor-btn">
              + Add New Sponsor
            </Link>
          </div>

          {sponsors.length === 0 ? (
            <div className="no-sponsors">
              <p>No sponsors found. Click "Add New Sponsor" to create one.</p>
            </div>
          ) : (
            <div className="sponsors-table-container">
              <table className="sponsors-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Website</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <React.Fragment key={sponsor.id}>
                      {editingSponsorId === sponsor.id ? (
                        // Edit Form Row
                        <tr className="editing-row">
                          <td className="logo-cell">
                            {sponsor.logo_path ? (
                              <img 
                                src={sponsor.logo_path} 
                                alt={sponsor.name} 
                                className="sponsor-logo"
                              />
                            ) : (
                              <div className="placeholder-logo">
                                {sponsor.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditFormChange}
                              className="edit-input"
                              required
                            />
                          </td>
                          <td>
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              className="edit-textarea"
                              rows="2"
                            />
                          </td>
                          <td>
                            <input
                              type="url"
                              name="website_url"
                              value={editFormData.website_url}
                              onChange={handleEditFormChange}
                              className="edit-input"
                              placeholder="https://example.com"
                            />
                          </td>
                          <td>
                            <label className="status-checkbox">
                              <input
                                type="checkbox"
                                name="is_active"
                                checked={editFormData.is_active}
                                onChange={handleEditFormChange}
                              />
                              <span className={`status-badge ${editFormData.is_active ? 'active' : 'inactive'}`}>
                                {editFormData.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </label>
                          </td>
                          <td>
                            {new Date(sponsor.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="save-btn" 
                                onClick={() => handleSaveEdit(sponsor.id)}
                                title="Save"
                                disabled={saving}
                              >
                                <FaSave />
                              </button>
                              <button 
                                className="cancel-btn" 
                                onClick={handleCancelEdit}
                                title="Cancel"
                                disabled={saving}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        // Normal Row
                        <tr className={!sponsor.is_active ? 'inactive' : ''}>
                          <td className="logo-cell">
                            {sponsor.logo_path ? (
                              <img 
                                src={sponsor.logo_path} 
                                alt={sponsor.name} 
                                className="sponsor-logo"
                              />
                            ) : (
                              <div className="placeholder-logo">
                                {sponsor.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td>{sponsor.name}</td>
                          <td className="description-cell">
                            {sponsor.description 
                              ? (sponsor.description.length > 50 
                                  ? `${sponsor.description.substring(0, 50)}...` 
                                  : sponsor.description)
                              : 'No description'}
                          </td>
                          <td>
                            {sponsor.website_url ? (
                              <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                                Visit Site
                              </a>
                            ) : (
                              'None'
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${sponsor.is_active ? 'active' : 'inactive'}`}>
                              {sponsor.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {new Date(sponsor.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn" 
                                onClick={() => handleEditClick(sponsor)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="visibility-btn" 
                                onClick={() => toggleSponsorStatus(sponsor.id, sponsor.is_active)}
                                title={sponsor.is_active ? "Deactivate" : "Activate"}
                              >
                                {sponsor.is_active ? <FaEyeSlash /> : <FaEye />}
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={() => deleteSponsor(sponsor.id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorList;
