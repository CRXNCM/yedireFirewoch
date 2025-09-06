import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient.js';
import VolunteerForm from './VolunteerForm';
import Sidebar from '../Sidebar';
import '../../../styles/admin/volunteers/VolunteersManagement.css';

const VolunteersManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);
  
  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health before fetching volunteers...');
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        console.log('✅ Backend is healthy, fetching volunteers data...');
        fetchVolunteers();
      } else {
        console.error('❌ Backend health check failed:', response.status);
        setError('Backend server is not responding. Please check if the server is running.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      // Still try to fetch volunteers in case health endpoint is down
      fetchVolunteers();
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching volunteers data...');
      const response = await apiService.volunteers.getAll();
      console.log('API Response:', response); // Debugging line
      
      // Handle different response structures with proper fallbacks
      let volunteersArray = [];
      if (Array.isArray(response)) {
        volunteersArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        volunteersArray = response.data;
      } else if (response && response.volunteers && Array.isArray(response.volunteers)) {
        volunteersArray = response.volunteers;
      } else if (response && Array.isArray(response)) {
        volunteersArray = response;
      }
      
      console.log(`✅ Successfully fetched ${volunteersArray.length} volunteers`);
      setVolunteers(volunteersArray);
    } catch (error) {
      console.error('❌ Error fetching volunteers:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch volunteers';
      setError(`Error: ${errorMessage}`);
      setVolunteers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddVolunteer = () => {
    setCurrentVolunteer(null);
    setShowForm(true);
    setError(null);
  };

  const handleEditVolunteer = (volunteer) => {
    setCurrentVolunteer(volunteer);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer? This action cannot be undone.')) {
      setOperationLoading(true);
      try {
        console.log(`🗑️ Deleting volunteer with ID: ${id}`);
        await apiService.volunteers.delete(id);
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
        console.log('✅ Volunteer deleted successfully');
        alert('Volunteer deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting volunteer:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete volunteer';
        alert(`Error: ${errorMessage}`);
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setOperationLoading(true);
    setError(null);
    try {
      let result;
      if (currentVolunteer) {
        // Update existing volunteer
        console.log(`🔄 Updating volunteer with ID: ${currentVolunteer.id}`);
        result = await apiService.volunteers.update(currentVolunteer.id, formData);
        setVolunteers(volunteers.map(volunteer => 
          volunteer.id === currentVolunteer.id ? result : volunteer
        ));
        console.log('✅ Volunteer updated successfully');
        alert('Volunteer updated successfully!');
      } else {
        // Add new volunteer
        console.log('➕ Creating new volunteer');
        result = await apiService.volunteers.create(formData);
        setVolunteers([...volunteers, result]);
        console.log('✅ Volunteer created successfully');
        alert('Volunteer created successfully!');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving volunteer:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save volunteer';
      setError(`Error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    checkBackendHealth();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (showForm) {
    return (
      <div className="volunteers-management">
        <VolunteerForm 
          volunteer={currentVolunteer} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      </div>
    );
  }

  return (
        <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
    <div className="volunteers-management">
      <div className="volunteers-header">
        <h1>Manage Volunteers</h1>
        <button 
          className="add-volunteer-btn" 
          onClick={handleAddVolunteer}
          disabled={operationLoading}
        >
          <FaPlus /> Add Volunteer
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

      <div className="volunteers-container">
        {loading || operationLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading volunteers...</p>
          </div>
        ) : (
          <div className="volunteers-table-container">
            <table className="volunteers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length > 0 ? (
                  volunteers.map(volunteer => (
                    <tr key={volunteer.id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.phone}</td>
                      <td>{formatDate(volunteer.join_date)}</td>
                      <td className="actions-cell">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEditVolunteer(volunteer)}
                          title="Edit"
                          disabled={operationLoading}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteVolunteer(volunteer.id)}
                          title="Delete"
                          disabled={operationLoading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No volunteers found. Click "Add Volunteer" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default VolunteersManagement;