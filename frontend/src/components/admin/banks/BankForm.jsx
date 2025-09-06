import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { apiService } from '../../../utils/apiClient';
import { 
  validateImageFile, 
  compressImage, 
  formatFileSize,
  ImageWithFallback 
} from '../../../utils/imageUtils.jsx';
import '../../../styles/admin/banks/BankManagement.css';

const BankForm = ({ bank, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankLogo: null,
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (bank) {
      setFormData({
        bankName: bank.bank_name || bank.name || '',
        accountNumber: bank.account_number || '',
        accountName: bank.account_name || '',
        bankLogo: bank.bank_image || bank.logo_url || '',
        isActive: bank.is_active !== undefined ? bank.is_active : true
      });
      setPreviewUrl(bank.bank_image || bank.logo_url || '');
    }
  }, [bank]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      
      if (!file) return;
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return;
      }
      
      setSelectedFile(file);
      setUploading(true);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Store the original file for form submission (skip compression for now)
      console.log('BankForm - Original file:', file);
      
      setFormData(prev => ({
        ...prev,
        bankLogo: file
      }));
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Error processing image: ${error.message}`);
      setPreviewUrl(formData.bankLogo || '');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('bankName', formData.bankName);
      submitData.append('accountNumber', formData.accountNumber);
      submitData.append('accountName', formData.accountName);
      submitData.append('isActive', formData.isActive);
      
      console.log('BankForm - formData.bankLogo:', formData.bankLogo);
      console.log('BankForm - is File:', formData.bankLogo instanceof File);
      
      if (formData.bankLogo && formData.bankLogo instanceof File) {
        submitData.append('bankLogo', formData.bankLogo);
        console.log('BankForm - Added bankLogo to FormData');
      }
      
      // Debug FormData contents
      console.log('BankForm - FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }
      
      if (bank) {
        // Update existing bank
        await apiService.banks.update(bank.id, submitData);
      } else {
        // Create new bank
        await apiService.banks.create(submitData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving bank:', error);
      alert(`Error saving bank: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      bankLogo: null
    }));
  };

  return (
    <div className="bank-form-container">
      <div className="form-header">
        <button 
          type="button" 
          className="back-button" 
          onClick={onCancel}
        >
          <FaArrowLeft /> Back to Banks
        </button>
        <div className="form-title">
          <h2>{bank ? 'Edit Bank Account' : 'Add New Bank Account'}</h2>
          <p>{bank ? 'Update bank account information' : 'Create a new bank account for donations'}</p>
        </div>
      </div>
      
      <div className="form-content">
        <form onSubmit={handleSubmit} className="bank-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bankName">
                  <span className="label-text">Bank Name</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={`form-input ${errors.bankName ? 'error' : ''}`}
                    placeholder="e.g., Commercial Bank of Ethiopia"
                  />
                  {errors.bankName && <div className="error-message">{errors.bankName}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="accountName">
                  <span className="label-text">Account Holder Name</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className={`form-input ${errors.accountName ? 'error' : ''}`}
                    placeholder="e.g., Yedire Firewoch Organization"
                  />
                  {errors.accountName && <div className="error-message">{errors.accountName}</div>}
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="accountNumber">
                <span className="label-text">Account Number</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`form-input ${errors.accountNumber ? 'error' : ''}`}
                  placeholder="Enter the bank account number"
                />
                {errors.accountNumber && <div className="error-message">{errors.accountNumber}</div>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Bank Logo</h3>
            <div className="upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="bankLogo"
                  name="bankLogo"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor="bankLogo" className="upload-label">
                  <div className="upload-icon">
                    <FaUpload />
                  </div>
                  <div className="upload-text">
                    <span className="upload-title">
                      {uploading ? 'Uploading...' : 'Upload Bank Logo'}
                    </span>
                    <span className="upload-subtitle">
                      PNG, JPG up to 5MB • Recommended: 300x300px
                    </span>
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <div className="file-info">
                  <div className="file-details">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
              )}
              
              {previewUrl && (
                <div className="logo-preview">
                  <div className="preview-container">
                    <ImageWithFallback
                      src={previewUrl}
                      alt="Bank logo preview"
                      className="preview-image"
                      fallbackType="bank"
                      fallbackName={formData.bankName}
                    />
                    <div className="preview-overlay">
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={handleRemoveImage}
                        title="Remove logo"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="preview-info">
                    <span className="preview-label">Current logo</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Settings</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                <div className="toggle-content">
                  <span className="toggle-title">Active</span>
                  <span className="toggle-description">Show this bank account on the donation page</span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {bank ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                bank ? 'Update Bank Account' : 'Create Bank Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankForm;
