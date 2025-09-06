import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/apiClient.js';
import '../../styles/AdminTestPage.css';
import Sidebar from './Sidebar.js';

const AdminTestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testEndpoints = [
    { name: 'Schools', service: 'schools', method: 'getAll' },
    { name: 'Testimonials', service: 'testimonials', method: 'getAll' },
    { name: 'Sponsors', service: 'sponsors', method: 'getAll' },
    { name: 'Banks', service: 'banks', method: 'getAll' },
    { name: 'Communities', service: 'communities', method: 'getAll' },
    { name: 'Alerts', service: 'alerts', method: 'getAll' },
    { name: 'Urgent Messages', service: 'urgentMessages', method: 'getAll' },
  ];

  const testEndpoint = async (service, method) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiMethod = apiService[service][method];
      if (!apiMethod) {
        throw new Error(`Method ${method} not found for service ${service}`);
      }
      
      const data = await apiMethod();
      
      return {
        success: true,
        status: 200,
        data: data,
        count: data?.count || data?.length || 'N/A'
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status || 'No response',
        error: error.response?.data?.message || error.message,
        data: null
      };
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setError(null);
    const results = {};

    for (const test of testEndpoints) {
      console.log(`Testing ${test.name}...`);
      results[test.name] = await testEndpoint(test.service, test.method);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTestResults(results);
    setLoading(false);
  };

  const testSingleEndpoint = async (service, method, name) => {
    const result = await testEndpoint(service, method);
    setTestResults(prev => ({
      ...prev,
      [name]: result
    }));
  };

  useEffect(() => {
    // Run initial test when component mounts
    runAllTests();
  }, []);

  const getStatusColor = (success) => {
    if (success === true) return 'success';
    if (success === false) return 'error';
    return 'pending';
  };

  const getStatusIcon = (success) => {
    if (success === true) return '✅';
    if (success === false) return '❌';
    return '⏳';
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
    <div className="admin-test-page">
      <div className="test-header">
        <h1>🔧 Admin Database Test Page</h1>
        <p>Test database connections and API endpoints</p>
        
        <div className="test-controls">
          <button 
            onClick={runAllTests} 
            disabled={loading}
            className="test-btn primary"
          >
            {loading ? '🔄 Running Tests...' : '🧪 Run All Tests'}
          </button>
          
          <button 
            onClick={() => setTestResults({})}
            className="test-btn secondary"
          >
            🗑️ Clear Results
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="test-results">
        <h2>Test Results</h2>
        
        {testEndpoints.map((test) => (
          <div key={test.name} className="test-item">
            <div className="test-header-row">
              <h3>{test.name}</h3>
              <div className="test-actions">
                <button
                  onClick={() => testSingleEndpoint(test.service, test.method, test.name)}
                  disabled={loading}
                  className="test-btn small"
                >
                  🔄 Retest
                </button>
              </div>
            </div>
            
            <div className="test-details">
              <div className="endpoint-info">
                <strong>Service:</strong> {test.service}.{test.method}()
              </div>
              
              {testResults[test.name] && (
                <div className={`test-result ${getStatusColor(testResults[test.name].success)}`}>
                  <div className="result-header">
                    <span className="status-icon">
                      {getStatusIcon(testResults[test.name].success)}
                    </span>
                    <span className="status-text">
                      {testResults[test.name].success ? 'Success' : 'Failed'}
                    </span>
                    <span className="status-code">
                      Status: {testResults[test.name].status}
                    </span>
                  </div>
                  
                  {testResults[test.name].success ? (
                    <div className="success-details">
                      <div className="data-count">
                        <strong>Data Count:</strong> {testResults[test.name].count}
                      </div>
                      <div className="data-preview">
                        <strong>Data Preview:</strong>
                        <pre>
                          {JSON.stringify(testResults[test.name].data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="error-details">
                      <div className="error-message">
                        <strong>Error:</strong> {testResults[test.name].error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="test-summary">
        <h2>Test Summary</h2>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Tests:</span>
            <span className="stat-value">{testEndpoints.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Successful:</span>
            <span className="stat-value success">
              {Object.values(testResults).filter(r => r.success === true).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Failed:</span>
            <span className="stat-value error">
              {Object.values(testResults).filter(r => r.success === false).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending:</span>
            <span className="stat-value pending">
              {Object.values(testResults).filter(r => r.success === undefined).length}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>  
    </div>
  );
};

export default AdminTestPage;
