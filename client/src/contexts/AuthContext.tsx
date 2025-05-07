import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_addresses?: any;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { first_name: string; last_name: string; phone?: string }) => Promise<string>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<string>;
  updateAddresses: (addresses: any[]) => Promise<{ message: string; user: User }>;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user profile using token
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update profile function (only updating user, keep global loading state intact)
  const updateProfile = async (data: { first_name: string; last_name: string; phone?: string }) => {
    try {
      const response = await api.put('/auth/profile', data);
      // Sync user with updated data
      setUser(response.data.user);
      // Return server confirmation message
      return response.data.message as string;
    } catch (err: any) {
      console.error('Update profile error:', err);
      throw err;
    }
  };

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data.message;
  };

  // Update saved addresses
  const updateAddresses = async (addresses: any[]) => {
    const response = await api.post('/auth/addresses', { addresses });
    const { user: updatedUser, message } = response.data;
    setUser(updatedUser);
    return { message, user: updatedUser };
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    updateAddresses,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};