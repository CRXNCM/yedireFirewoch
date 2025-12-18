import React, { useState, useEffect } from 'react';
import { apiService } from '../../../utils/apiClient.js';
import { FaEdit, FaEye, FaTrash, FaPlus, FaBell, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import '../../../styles/admin/alerts/AlertsManagement.css';
import Sidebar from '../Sidebar';
import AlertForm from './AlertForm';

const AlertsManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
  }, [urgencyFilter, statusFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {};
      if (urgencyFilter !== 'all') {
        params.type = urgencyFilter;
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await apiService.alerts.getAll(params);
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = () => {
    setCurrentAlert(null);
    setShowForm(true);
  };

  const handleEditAlert = (alert) => {
    setCurrentAlert(alert);
    setShowForm(true);
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await apiService.alerts.delete(id);
        
        // Remove the deleted alert from the state
        setAlerts(alerts.filter(alert => alert._id !== id));
      } catch (error) {
        console.error('Error deleting alert:', error);
        window.alert(`Error deleting alert: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleToggleStatus = async (alert) => {
    try {
      const newStatus = alert.status === 'active' ? 'inactive' : 'active';
      
      await apiService.alerts.updateStatus(alert._id, newStatus);
      
      // Update the alert in state
      setAlerts(alerts.map(a => 
        a._id === alert._id ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error('Error toggling alert status:', error);
      window.alert(`Error updating alert status: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUrgencyBadgeClass = (level) => {
    switch (level) {
      case 'low': return 'urgency-low';
      case 'medium': return 'urgency-medium';
      case 'high': return 'urgency-high';
      case 'critical': return 'urgency-critical';
      default: return 'urgency-medium';
    }
  };

  if (showForm) {
    return (
      <AlertForm 
        alert={currentAlert}
        onSave={() => {
          setShowForm(false);
          fetchAlerts();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
        <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
    <div className="alerts-management">
      <div className="alerts-header">
        <h1>
          <FaBell className="header-icon" /> Manage Alert Messages
        </h1>
        <button className="add-alert-btn" onClick={handleAddAlert}>
          <FaPlus /> Add New Alert
        </button>
      </div>
      
      <div className="alerts-filters">
        <div className="filter-group">
          <label>Filter by Urgency:</label>
          <select 
            value={urgencyFilter} 
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      ) : (
        <div className="alerts-table-container">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Urgency</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <tr key={alert._id} className={alert.status === 'inactive' ? 'inactive-row' : ''}>
                    <td>{alert.title}</td>
                    <td className="message-cell">
                      {alert.message.length > 100 
                        ? `${alert.message.substring(0, 100)}...` 
                        : alert.message}
                    </td>
                    <td>
                      <span className={`urgency-badge ${getUrgencyBadgeClass(alert.type)}`}>
                        {alert.type}
                      </span>
                    </td>
                    <td>{formatDate(alert.createdAt)}</td>
                    <td>
                      <button 
                        className={`status-toggle ${alert.status === 'active' ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(alert)}
                        title={alert.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {alert.status === 'active' 
                          ? <><FaToggleOn /> Active</> 
                          : <><FaToggleOff /> Inactive</>}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="edit-btn" 
                        title="Edit"
                        onClick={() => handleEditAlert(alert)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="view-btn" 
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="delete-btn" 
                        title="Delete"
                        onClick={() => handleDeleteAlert(alert._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No alerts found. Click "Add New Alert" to create one.
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
  );
};

export default AlertsManagement;