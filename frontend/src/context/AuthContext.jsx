import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../utils/apiClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔍 Checking session - Token:', !!token, 'User:', !!storedUser);
      
      if (token && storedUser) {
        try {
          // Verify token with backend
          console.log('🔐 Verifying token...');
          const response = await apiService.auth.verifyToken();
          console.log('✅ Token verification response:', response);
          
          if (response.valid) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            console.log('👤 Session restored for user:', userData);
          } else {
            console.log('❌ Token invalid, clearing storage');
            // Token invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Token verification failed:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('🔍 No stored session found');
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, []);

  const signIn = async (credentials) => {
    try {
      console.log('🔐 Attempting login with:', credentials.username);
      const response = await apiService.auth.login(credentials);
      
      console.log('✅ Login response:', response);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      console.log('👤 User state set:', response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signOut = async () => {
    try {
      await apiService.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await apiService.auth.changePassword(passwords);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Password change failed'
      };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    changePassword,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};