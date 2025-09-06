import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn({ username, password });
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
    setSuccess('');
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>Success:</strong> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="login-help">
          <h3>Need Help?</h3>
          <div className="help-options">
            <button 
              onClick={handleTestLogin}
              className="test-login-btn"
              disabled={loading}
            >
              Test with Default Credentials
            </button>
            
            <div className="credentials-info">
              <p><strong>Default Test Credentials:</strong></p>
              <p>Username: <code>admin</code></p>
              <p>Password: <code>admin123</code></p>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>YeDire Firewoch Charity Organization - Admin Panel</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
