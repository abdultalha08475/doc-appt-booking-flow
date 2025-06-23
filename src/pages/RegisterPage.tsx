
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import NotificationBanner from '../components/NotificationBanner';
import { Button } from '@/components/ui/button';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setNotification({
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    if (formData.password.length < 6) {
      setNotification({
        message: 'Password must be at least 6 characters long',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.session) {
        setNotification({
          message: 'Please check your email for verification link to complete registration',
          type: 'success'
        });
      } else {
        setNotification({
          message: 'Registration successful! Redirecting...',
          type: 'success'
        });
        setTimeout(() => navigate('/book'), 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setNotification({
        message: error.message || 'Registration failed. Please try again.',
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
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us to book appointments easily
            </p>
            <div className="mt-4">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Already have an account? Sign in here
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

            <form onSubmit={handleRegister} className="space-y-6">
              <InputField
                label="Full Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                required
              />

              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                required
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                placeholder="Create a password (min 6 characters)"
                required
              />

              <InputField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                required
              />
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
