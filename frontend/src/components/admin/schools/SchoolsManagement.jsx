import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import SchoolForm from './SchoolForm';
import SchoolsList from './SchoolsList';
import SchoolImages from './SchoolImages';
import Sidebar from '../Sidebar';
import { FaPlus } from 'react-icons/fa';
import '../../../styles/admin/schools/SchoolsManagement.css';

const SchoolsManagement = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkBackendHealth();
  }, []);
  
  const checkBackendHealth = async () => {
    try {
      console.log('🔍 Checking backend health before fetching schools...');
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        console.log('✅ Backend is healthy, fetching schools data...');
        fetchSchools();
      } else {
        console.error('❌ Backend health check failed:', response.status);
        setError('Backend server is not responding. Please check if the server is running.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      // Still try to fetch schools in case health endpoint is down
      fetchSchools();
    }
  };

  const fetchSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching schools data...');
      const response = await apiService.schools.getAll();
      console.log('API Response:', response); // Debugging line
      
      // Handle different response structures with proper fallbacks
      let schoolsArray = [];
      if (Array.isArray(response)) {
        schoolsArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        schoolsArray = response.data;
      } else if (response && response.schools && Array.isArray(response.schools)) {
        schoolsArray = response.schools;
      }
      
      console.log(`✅ Successfully fetched ${schoolsArray.length} schools`);
      setSchools(schoolsArray);
    } catch (error) {
      console.error('❌ Error fetching schools:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch schools';
      setError(`Error: ${errorMessage}`);
      setSchools([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchool = () => {
    setCurrentSchool(null);
    setShowForm(true);
    setShowImages(false);
    setError(null);
  };

  const handleEditSchool = (school) => {
    setCurrentSchool(school);
    setShowForm(true);
    setShowImages(false);
    setError(null);
  };

  const handleManageImages = (school) => {
    setCurrentSchool(school);
    setShowImages(true);
    setShowForm(false);
    setError(null);
  };

  const handleDeleteSchool = async (school_id) => {
    if (window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      setOperationLoading(true);
      try {
        console.log(`🗑️ Deleting school with ID: ${school_id}`);
        await apiService.schools.delete(school_id);
        setSchools(schools.filter(school => school.school_id !== school_id));
        console.log('✅ School deleted successfully');
        alert('School deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting school:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete school';
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
      if (currentSchool) {
        // Update existing school
        console.log(`🔄 Updating school with ID: ${currentSchool.school_id}`);
        result = await apiService.schools.update(currentSchool.school_id, formData);
        setSchools(schools.map(school => 
          school.school_id === currentSchool.school_id ? result : school
        ));
        console.log('✅ School updated successfully');
        alert('School updated successfully!');
      } else {
        // Add new school
        console.log('➕ Creating new school');
        result = await apiService.schools.create(formData);
        setSchools([...schools, result]);
        console.log('✅ School created successfully');
        alert('School created successfully!');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving school:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save school';
      setError(`Error: ${errorMessage}`);
      alert(`Error: ${errorMessage}`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowImages(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    checkBackendHealth();
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="schools-management">
          
          {showForm ? (
            <SchoolForm 
              school={currentSchool} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
              loading={operationLoading}
            />
          ) : showImages && currentSchool ? (
            <SchoolImages 
              school={currentSchool} 
              onBack={handleCancel} 
            />
          ) : (
            <>
              <div className="schools-header">
                <h1 className="schools-title">Schools Management</h1>
                <button 
                  className="add-school-btn" 
                  onClick={handleAddSchool}
                  disabled={operationLoading}
                >
                  <FaPlus /> Add New School
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

              <div className="schools-container">
                <SchoolsList 
                  schools={schools} 
                  loading={loading || operationLoading}
                  onEdit={handleEditSchool}
                  onManageImages={handleManageImages}
                  onDelete={handleDeleteSchool} 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolsManagement;