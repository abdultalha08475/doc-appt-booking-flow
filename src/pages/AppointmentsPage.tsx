
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import AppointmentCard from '../components/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Appointment } from '../types';
import { Calendar, Plus } from 'lucide-react';

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          doctorId: 'doc1',
          doctorName: 'Sarah Johnson',
          patientName: 'John Doe',
          patientPhone: '+91-9876543210',
          date: '2024-12-22',
          time: '10:00',
          reason: 'General Consultation',
          status: 'confirmed',
          queueNumber: 12,
          notes: 'Regular checkup',
          createdAt: '2024-12-21T10:00:00Z'
        },
        {
          id: '2',
          doctorId: 'doc2',
          doctorName: 'Michael Chen',
          patientName: 'John Doe',
          patientPhone: '+91-9876543210',
          date: '2024-12-18',
          time: '14:30',
          reason: 'Follow-up',
          status: 'completed',
          queueNumber: 5,
          createdAt: '2024-12-17T14:30:00Z'
        }
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    navigate('/login');
  };

  const handleReschedule = (appointmentId: string) => {
    console.log('Reschedule appointment:', appointmentId);
    // Implement reschedule logic
  };

  const handleCancel = (appointmentId: string) => {
    console.log('Cancel appointment:', appointmentId);
    // Implement cancel logic
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      )
    );
  };

  const handleViewDetails = (appointmentId: string) => {
    console.log('View details:', appointmentId);
    // Navigate to appointment details
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav>
        <Button
          variant="default"
          onClick={() => navigate('/book')}
          className="mr-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <span>Logout</span>
        </Button>
      </HeaderNav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your doctor appointments
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Book your first appointment to get started
            </p>
            <Button onClick={() => navigate('/book')}>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AppointmentsPage;
