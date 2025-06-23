
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createAdminUser } from '../utils/createAdminUser';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await login(credentials.email, credentials.password);

      if (error) {
        throw error;
      }

      if (data.user) {
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setCreatingAdmin(true);
    setError('');

    try {
      const result = await createAdminUser();
      
      if (result.success) {
        setAdminCreated(true);
        setCredentials({
          email: 'admin@docbook.com',
          password: 'admin123'
        });
        console.log('Admin user created! You can now log in with admin@docbook.com / admin123');
      } else {
        setError(result.error || 'Failed to create admin user');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create admin user');
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Admin Login
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Access the clinic management dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {adminCreated && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">
                Admin user created successfully! You can now log in.
              </p>
            </div>
          )}

          {!adminCreated && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-600 text-sm mb-3">
                No admin user exists yet. Create one to get started.
              </p>
              <Button
                onClick={handleCreateAdmin}
                disabled={creatingAdmin}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {creatingAdmin ? 'Creating Admin User...' : 'Create Admin User'}
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@docbook.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Default admin credentials: admin@docbook.com / admin123
            </p>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
