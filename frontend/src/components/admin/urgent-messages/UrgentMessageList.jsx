import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../../utils/apiClient.js';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';
import './UrgentMessageList.css';
import placeholderImg from '../../../assets/images/logo.png';
import Sidebar from '../Sidebar';

const UrgentMessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.urgentMessages.getAll();
      setMessages(response);
    } catch (error) {
      console.error('Error fetching urgent messages:', error);
      setError('Failed to load urgent messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMessageStatus = async (id, currentStatus) => {
    try {
      // If activating a message, first deactivate all other messages
      if (currentStatus === 'inactive') {
        // Deactivate all active messages except the current one
        const activeMessages = messages.filter(msg => msg.status === 'active' && msg.id !== id);
        for (const message of activeMessages) {
          await apiService.urgentMessages.updateStatus(message.id, 'inactive');
        }
      }

      // Update the status of the current message
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiService.urgentMessages.updateStatus(id, newStatus);
      
      // Refresh the messages list
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status. Please try again.');
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this urgent message?')) {
      try {
        await apiService.urgentMessages.delete(id);
        setMessages(messages.filter(message => message.id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  };

  const getUrgencyBadgeClass = (level) => {
    switch (level) {
      case 'Urgent':
        return 'urgency-badge urgent';
      case 'Important':
        return 'urgency-badge important';
      default:
        return 'urgency-badge normal';
    }
  };

  if (loading) {
    return <div className="loading-message">Loading urgent messages...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
        <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
    <div className="urgent-message-list-container">
      <div className="urgent-message-list-header">
        <h1>Manage Urgent Messages</h1>
        <Link to="/admin/urgent-messages/add" className="add-message-btn">
          <FaPlus /> Add New Message
        </Link>
      </div>

      <div className="important-note">
        <h3>Important Note</h3>
        <p>Only one urgent message can be active at a time. When you activate a message, any previously active message will be automatically deactivated.</p>
      </div>

      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No urgent messages found. Click "Add New Message" to create one.</p>
        </div>
      ) : (
        <div className="messages-table-container">
          <table className="messages-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Preview</th>
                <th>Image</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className={message.status === 'inactive' ? 'inactive' : ''}>
                  <td>{message.title}</td>
                  <td className="message-preview">
                    {message.message.length > 50 
                      ? `${message.message.substring(0, 50)}...` 
                      : message.message}
                  </td>
                  <td className="image-cell">
                    {message.image_path ? (
                      <img 
                        src={message.image_path} 
                        alt={message.title} 
                        className="message-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = placeholderImg;
                        }}
                      />
                    ) : (
                      <img 
                        src={placeholderImg}
                        alt="No image"
                        className="message-image"
                      />
                    )}
                  </td>
                  <td>
                    <span className={getUrgencyBadgeClass(message.urgency_level)}>
                      {message.urgency_level}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${message.status === 'active' ? 'active' : 'inactive'}`}>
                      {message.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {new Date(message.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/admin/urgent-messages/edit/${message.id}`} 
                        className="edit-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        className="visibility-btn" 
                        onClick={() => toggleMessageStatus(message.id, message.status)}
                        title={message.status === 'active' ? "Deactivate" : "Activate"}
                      >
                        {message.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => deleteMessage(message.id)}
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
        </div>

      )}
      </div>
    </div>
    </div>
  );
};

export default UrgentMessageList;
