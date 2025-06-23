
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

const EmailConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'Email confirmation failed. The link may be invalid or expired.');
    } else {
      setStatus('success');
      setMessage('Your email has been confirmed successfully! You can now log in to your account.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            )}
            
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            )}
            
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {status === 'success' ? 'Email Confirmed!' : 
               status === 'error' ? 'Confirmation Failed' : 'Confirming Email...'}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {message}
            </p>

            <div className="space-y-4">
              {status === 'success' && (
                <Link to="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue to Login
                  </Button>
                </Link>
              )}
              
              {status === 'error' && (
                <Link to="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Try Registering Again
                  </Button>
                </Link>
              )}
              
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>

            {status === 'success' && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-medium">What's next?</p>
                    <p>You can now log in and start booking appointments with your confirmed account.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmailConfirmationPage;
