
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import AppointmentCard from '../components/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '../types';

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAppointments: Appointment[] = data.map(apt => ({
        id: apt.id,
        doctorId: apt.doctor_id,
        doctorName: apt.doctor_name,
        patientName: apt.patient_name,
        patientPhone: apt.patient_phone,
        date: apt.appointment_date,
        time: apt.time_slot,
        reason: apt.reason,
        status: apt.status as 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in-progress',
        queueNumber: apt.queue_number,
        notes: apt.notes || '',
        createdAt: apt.created_at
      }));

      setAppointments(formattedAppointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleReschedule = (id: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Appointment rescheduling will be available soon.",
    });
  };

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      });

      fetchAppointments(); // Refresh the list
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Detailed appointment view will be available soon.",
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav>
        <Button
          variant="outline"
          onClick={() => navigate('/book')}
          className="mr-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
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

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your scheduled appointments
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
              You haven't booked any appointments yet. Start by booking your first appointment.
            </p>
            <Button
              onClick={() => navigate('/book')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Your First Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
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

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Need help managing your appointments? Call our support line at{' '}
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

export default AppointmentsPage;
