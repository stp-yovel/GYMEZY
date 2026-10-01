import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ identifier, password }) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ identifier, password });
      setUser(response.user);
      setGym(response.gym);
      setToken(response.token);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
    } finally {
      setUser(null);
      setGym(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const updateGym = useCallback((updatedGym) => {
    setGym((prev) => ({ ...(prev || {}), ...(updatedGym || {}) }));
  }, []);

  const value = {
    user,
    gym,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateGym,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
