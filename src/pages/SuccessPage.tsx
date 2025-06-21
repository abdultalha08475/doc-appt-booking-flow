
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import TipsBanner from '../components/TipsBanner';
import { Button } from '@/components/ui/button';

interface LocationState {
  queueNumber?: number;
  date?: string;
  phone?: string;
}

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const queueNumber = state?.queueNumber || Math.floor(Math.random() * 50) + 1;
  const appointmentDate = state?.date || new Date().toISOString().split('T')[0];
  const phoneNumber = state?.phone || localStorage.getItem('userPhone') || '+91-XXXX-XXXXX';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskedPhone = phoneNumber.replace(/(\+91)(\d{5})(\d{5})/, '$1-$2xxxxx');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <HeaderNav>
        <Link to="/">
          <Button variant="outline" className="hover:bg-blue-50">
            Home
          </Button>
        </Link>
      </HeaderNav>

      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
          <p className="text-gray-600">Your slot has been successfully reserved</p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center space-y-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Queue Number: #{queueNumber}
              </h2>
              <p className="text-lg text-green-700">
                {formatDate(appointmentDate)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
                <p className="text-gray-600">{formatDate(appointmentDate)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Queue Number</h3>
                <p className="text-gray-600">#{queueNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SMS Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">SMS Confirmation Sent</h3>
              <p className="text-blue-800">
                An SMS confirmation has been sent to {maskedPhone} with your appointment details.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Banner */}
        <div className="mb-8">
          <TipsBanner message="Please arrive 10 minutes early with a valid ID. Need to reschedule? Call the clinic at +91-123-456-7890." />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/book">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium">
              Book Another Appointment
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full py-3 px-4 rounded-md font-medium">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Bring a valid photo ID and any relevant medical documents</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Your queue number will be called in order of booking</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Late arrivals may result in slot reallocation</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>For emergencies, call +91-123-456-7890 immediately</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuccessPage;
