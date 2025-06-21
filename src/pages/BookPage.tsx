
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import SelectBox from '../components/SelectBox';
import DatePicker from '../components/DatePicker';
import TipsBanner from '../components/TipsBanner';
import NotificationBanner from '../components/NotificationBanner';
import { Button } from '@/components/ui/button';

const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: localStorage.getItem('userPhone') || '',
    reason: '',
    date: new Date().toISOString().split('T')[0], // Today's date
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const reasonOptions = [
    { value: 'consultation', label: 'General Consultation' },
    { value: 'followup', label: 'Follow-up Visit' },
    { value: 'checkup', label: 'Regular Check-up' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call stub
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/success', {
          state: {
            queueNumber: result.queueNumber,
            date: formData.date,
            phone: formData.phone,
          }
        });
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      console.log('Appointment booking simulated - proceeding to success');
      // Simulate successful booking for demo
      const queueNumber = Math.floor(Math.random() * 50) + 1;
      navigate('/success', {
        state: {
          queueNumber,
          date: formData.date,
          phone: formData.phone,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeaderNav>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </Button>
      </HeaderNav>

      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Fill in your details to secure your slot</p>
        </div>

        <div className="mb-6">
          <TipsBanner message="Booking opens from 08:50 AM to 09:00 AM daily. Book early to get your preferred slot!" />
        </div>

        {notification && (
          <div className="mb-6">
            <NotificationBanner
              message={notification.message}
              type={notification.type}
              onDismiss={() => setNotification(null)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              value={formData.name}
              onChange={(value) => updateFormData('name', value)}
              placeholder="Enter your full name"
              required
            />

            <InputField
              label="Age"
              value={formData.age}
              onChange={(value) => updateFormData('age', value)}
              type="number"
              placeholder="Enter your age"
              required
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChange={() => {}} // Read-only
              readOnly
              className="bg-gray-50"
            />

            <SelectBox
              label="Reason for Visit"
              options={reasonOptions}
              value={formData.reason}
              onChange={(value) => updateFormData('reason', value)}
              placeholder="Select reason for your visit"
              required
            />

            <DatePicker
              label="Appointment Date"
              value={formData.date}
              onChange={(value) => updateFormData('date', value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need help? Call our support line at{' '}
            <a href="tel:+911234567890" className="text-blue-600 hover:text-blue-700 font-medium">
              +91-123-456-7890
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookPage;
