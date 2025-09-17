import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { storageUtils } from '../utils/helpers';

/**
 * Custom hook for authentication management
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check current authentication status
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = storageUtils.get('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await api.auth.getProfile();
      
      if (response && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Invalid token, clear storage
        storageUtils.remove('authToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      storageUtils.remove('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   * @param {Object} credentials - Username/email and password
   * @returns {Promise<Object>} Login result
   */
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Store auth data
        storageUtils.set('authToken', response.token);
        storageUtils.set('user', response.user);
        
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.register(userData);
      
      if (response.success) {
        // Auto-login after successful registration
        const loginResult = await login({
          username: userData.email,
          password: userData.password
        });
        
        return { success: true, autoLoggedIn: loginResult.success };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await api.auth.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Clear storage
      storageUtils.remove('authToken');
      storageUtils.remove('user');
      
      setIsLoading(false);
      
      // Redirect to home
      navigate('/', { replace: true });
    }
  }, [navigate]);

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Update result
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.updateProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        storageUtils.set('user', response.user);
        
        return { success: true, user: response.user };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change user password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise<Object>} Change result
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.changePassword(passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Request result
   */
  const requestPasswordReset = useCallback(async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.requestPasswordReset({ email });
      
      return { 
        success: response.success, 
        message: response.message || 'Password reset email sent' 
      };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset password with token
   * @param {Object} resetData - Token and new password
   * @returns {Promise<Object>} Reset result
   */
  const resetPassword = useCallback(async (resetData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.auth.resetPassword(resetData);
      
      return { 
        success: response.success, 
        message: response.message || 'Password reset successful' 
      };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Has role
   */
  const hasRole = useCallback((role) => {
    return user && user.role === role;
  }, [user]);

  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Roles to check
   * @returns {boolean} Has any role
   */
  const hasAnyRole = useCallback((roles) => {
    return user && roles.includes(user.role);
  }, [user]);

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} Has permission
   */
  const hasPermission = useCallback((permission) => {
    return user && user.permissions && user.permissions.includes(permission);
  }, [user]);

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh result
   */
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await api.auth.refresh();
      
      if (response.success && response.token) {
        storageUtils.set('authToken', response.token);
        return { success: true };
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      setError(error.message);
      // If refresh fails, logout user
      logout();
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  /**
   * Clear authentication error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = storageUtils.get('authToken');
    if (!token) return;

    // Check token expiration (assuming JWT with exp field)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Refresh token 5 minutes before expiration
      const refreshTime = timeUntilExpiration - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        const timeoutId = setTimeout(() => {
          refreshToken();
        }, refreshTime);
        
        return () => clearTimeout(timeoutId);
      } else {
        // Token already expired, logout
        logout();
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }, [isAuthenticated, refreshToken, logout]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshToken,
    checkAuthStatus,
    clearError,
    
    // Utility methods
    hasRole,
    hasAnyRole,
    hasPermission,
    
    // Computed properties
    isAdmin: hasRole('admin'),
    isUser: hasRole('user'),
    userName: user?.name || user?.email || 'Usuario',
    userInitials: user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
  };
};

export default useAuth;