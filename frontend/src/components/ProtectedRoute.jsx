import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verifying your access...</p>
      </div>
    );
  }

  // Only redirect to login if trying to access a protected route while not authenticated
  if (!isAuthenticated && location.pathname.startsWith('/admin')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is either authenticated or not trying to access a protected route
  return children;
};

export default ProtectedRoute;