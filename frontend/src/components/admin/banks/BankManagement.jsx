import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBuilding, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient';
import Sidebar from '../Sidebar';
import BankForm from './BankForm';
import '../../../styles/admin/banks/BankManagement.css';

const BankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentBank, setCurrentBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await apiService.banks.getAll();
      // The API returns { banks: [], count: number } structure
      const banksData = response.banks || response || [];
      setBanks(banksData);
    } catch (error) {
      console.error('Error fetching banks:', error);
      alert(`Error fetching banks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBank = () => {
    setCurrentBank(null);
    setShowForm(true);
  };

  const handleEditBank = (bank) => {
    setCurrentBank(bank);
    setShowForm(true);
  };

  const handleDeleteBank = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank? This action cannot be undone.')) {
      try {
        await apiService.banks.delete(id);
        setBanks(banks.filter(bank => bank.id !== id));
        alert('Bank deleted successfully!');
      } catch (error) {
        console.error('Error deleting bank:', error);
        alert(`Error deleting bank: ${error.message}`);
      }
    }
  };

  const handleToggleStatus = async (bank) => {
    try {
      const newStatus = !bank.is_active;
      await apiService.banks.updateStatus(bank.id, newStatus);
      
      setBanks(banks.map(b => 
        b.id === bank.id ? { ...b, is_active: newStatus } : b
      ));
    } catch (error) {
      console.error('Error toggling bank status:', error);
      alert(`Error updating bank status: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.account_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && bank.is_active) ||
                         (statusFilter === 'inactive' && !bank.is_active);
    
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <BankForm 
        bank={currentBank}
        onSave={() => {
          setShowForm(false);
          fetchBanks();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="bank-management">
          <div className="bank-management-header">
            <h2>
              <FaBuilding className="header-icon" /> Bank Management
            </h2>
            <div className="header-actions">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search banks..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="add-bank-btn" onClick={handleAddBank}>
                <FaPlus /> Add Bank
              </button>
            </div>
          </div>

          <div className="banks-filters">
            <div className="filter-group">
              <label>Filter by Status:</label>
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
              <p>Loading banks...</p>
            </div>
          ) : (
            <div className="banks-table-container">
              <table className="banks-table">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Account Number</th>
                    <th>Account Name</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map(bank => (
                      <tr key={bank.id} className={!bank.is_active ? 'inactive-row' : ''}>
                        <td className="bank-name-cell">
                          {bank.bank_name}
                        </td>
                        <td>{bank.account_number || 'N/A'}</td>
                        <td>{bank.account_name || 'N/A'}</td>
                        <td>{bank.last_updated ? formatDate(bank.last_updated) : 'N/A'}</td>
                        <td>
                          <button 
                            className={`status-toggle ${bank.is_active ? 'active' : 'inactive'}`}
                            onClick={() => handleToggleStatus(bank)}
                            title={bank.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {bank.is_active 
                              ? <><FaToggleOn /> Active</> 
                              : <><FaToggleOff /> Inactive</>}
                          </button>
                        </td>
                        <td className="actions-cell">
                          <button 
                            className="action-btn edit-btn" 
                            onClick={() => handleEditBank(bank)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            onClick={() => handleDeleteBank(bank.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        {banks.length === 0 
                          ? 'No banks found. Click "Add Bank" to create one.'
                          : 'No banks match your search criteria.'}
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

export default BankManagement;
