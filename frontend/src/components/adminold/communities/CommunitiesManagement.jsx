import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient.js';
import Sidebar from '../Sidebar';
import CommunityForm from './CommunityForm';
import '../../../styles/admin/communities/CommunitiesManagement.css';

const CommunitiesManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);
  
  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health before fetching communities...');
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        console.log('✅ Backend is healthy, fetching communities data...');
        fetchCommunities();
      } else {
        console.error('❌ Backend health check failed:', response.status);
        setError('Backend server is not responding. Please check if the server is running.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      // Still try to fetch communities in case health endpoint is down
      fetchCommunities();
    }
  };

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching communities data...');
      const response = await apiService.communities.getAll();
      console.log('API Response:', response);
      
      // Handle API response structure { communities: [], count: number }
      const communitiesArray = response.communities || [];
      
      console.log(`✅ Successfully fetched ${communitiesArray.length} communities`);
      setCommunities(communitiesArray);
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch communities';
      setError(`Error: ${errorMessage}`);
      setCommunities([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunity = () => {
    setCurrentCommunity(null);
    setShowForm(true);
    setError(null);
  };

  const handleEditCommunity = (community) => {
    setCurrentCommunity(community);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteCommunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      setOperationLoading(true);
      try {
        console.log(`🗑️ Deleting community with ID: ${id}`);
        await apiService.communities.delete(id);
        setCommunities(communities.filter(community => community.id !== id));
        console.log('✅ Community deleted successfully');
        alert('Community deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting community:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete community';
        alert(`Error: ${errorMessage}`);
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setOperationLoading(true);
    setError(null);
    try {
      let result;
      if (currentCommunity) {
        // Update existing community
        console.log(`🔄 Updating community with ID: ${currentCommunity.id}`);
        result = await apiService.communities.update(currentCommunity.id, formData);
        setCommunities(communities.map(community => 
          community.id === currentCommunity.id ? result.community : community
        ));
        console.log('✅ Community updated successfully');
        alert('Community updated successfully!');
      } else {
        // Add new community
        console.log('➕ Creating new community');
        result = await apiService.communities.create(formData);
        setCommunities([...communities, result.community]);
        console.log('✅ Community created successfully');
        alert('Community created successfully!');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving community:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save community';
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
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <CommunityForm 
            community={currentCommunity} 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={operationLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="communities-management">
          
          <div className="communities-header">
            <h1 className="communities-title">Communities Management</h1>
            <button 
              className="add-community-btn" 
              onClick={handleAddCommunity}
              disabled={operationLoading}
            >
              <FaPlus /> Add New Community
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

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading communities...</p>
            </div>
          ) : (
            <div className="communities-grid">
              {communities.length > 0 ? (
                communities.map(community => (
                  <div key={community.id} className="community-card">
                    <div className="community-image">
                      {community.image_url ? (
                        <img src={community.image_url} alt={community.name} />
                      ) : (
                        <div className="placeholder-image">
                          {community.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="community-content">
                      <h3>{community.name}</h3>
                      <p className="region">{community.region}</p>
                      <p className="description">{community.description}</p>
                      <p className="date">Created: {formatDate(community.created_at)}</p>
                    </div>
                    <div className="community-actions">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditCommunity(community)}
                        title="Edit"
                        disabled={operationLoading}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteCommunity(community.id)}
                        title="Delete"
                        disabled={operationLoading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-communities">
                  <p>No communities found. Click "Add Community" to add one.</p>
                  <button className="add-community-btn" onClick={handleAddCommunity}>
                    + Add Community
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesManagement;
