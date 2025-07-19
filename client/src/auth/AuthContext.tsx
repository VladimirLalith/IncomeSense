// client/src/context/AuthContext.tsx
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the shape of a user object
interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

// Define the shape of the AuthContext value
export interface AuthContextType { // Export this interface so useAuth.ts can use it
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
import { AuthContext } from './authContextDefinition'; // Import AuthContext from the new provider file

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Login failed');
      } else if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('An unexpected error occurred during login.');
      }
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiRegister(username, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } else if (err instanceof Error) {
            setError(err.message || 'Registration failed');
        } else {
            setError('An unexpected error occurred during registration.');
        }
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Note: useAuth hook has been moved to src/hooks/useAuth.ts