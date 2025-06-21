
import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and user data
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPhone');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isPatient = () => user?.role === 'patient';
  const isDoctor = () => user?.role === 'doctor';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isPatient,
    isDoctor,
    isAuthenticated: !!user
  };
};
