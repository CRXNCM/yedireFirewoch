import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verifying your access...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;