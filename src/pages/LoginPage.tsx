
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import NotificationBanner from '../components/NotificationBanner';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setNotification({
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await login(formData.email, formData.password);

      if (error) {
        throw error;
      }

      if (data.user) {
        setNotification({
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        setTimeout(() => navigate('/book'), 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setNotification({
        message: error.message || 'Login failed. Please check your credentials.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeaderNav />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">
              Welcome back! Please sign in to your account
            </p>
            <div className="mt-4">
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Don't have an account? Register here
              </Link>
            </div>
            <div className="mt-2">
              <Link 
                to="/admin/login" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Are you an admin? Login here
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            {notification && (
              <div className="mb-6">
                <NotificationBanner
                  message={notification.message}
                  type={notification.type}
                  onDismiss={dismissNotification}
                />
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                required
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                required
              />
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
