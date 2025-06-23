import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import SelectBox from '../components/SelectBox';
import DatePicker from '../components/DatePicker';
import TipsBanner from '../components/TipsBanner';
import NotificationBanner from '../components/NotificationBanner';
import DoctorCard from '../components/DoctorCard';
import TimeSlotPicker from '../components/TimeSlotPicker';
import EmergencyBooking from '../components/EmergencyBooking';
import { Button } from '@/components/ui/button';
import { Doctor } from '../types';
import { useAvailability } from '../hooks/useAvailability';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [showEmergency, setShowEmergency] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: '',
    phone: userProfile?.phone || '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Check if user is authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // Mock doctors data
  const mockDoctors: Doctor[] = [
    {
      id: 'doc1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      experience: 8,
      rating: 4.8,
      avatar: '/placeholder.svg',
      availability: [],
      fee: 500,
      isActive: true
    },
    {
      id: 'doc2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      experience: 12,
      rating: 4.9,
      avatar: '/placeholder.svg',
      availability: [],
      fee: 800,
      isActive: true
    },
    {
      id: 'doc3',
      name: 'Dr. Priya Sharma',
      specialty: 'Dermatology',
      experience: 6,
      rating: 4.7,
      avatar: '/placeholder.svg',
      availability: [],
      fee: 600,
      isActive: true
    }
  ];

  const { slots, loading: slotsLoading } = useAvailability(
    selectedDoctor?.id || '', 
    formData.date
  );

  const reasonOptions = [
    { value: 'consultation', label: 'General Consultation' },
    { value: 'followup', label: 'Follow-up Visit' },
    { value: 'checkup', label: 'Regular Check-up' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'other', label: 'Other' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleEmergencyBook = async (emergencyData: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use explicit insert with queue_number set to 0 - trigger will assign actual value
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: 'emergency',
          doctor_name: 'Emergency Doctor',
          patient_name: emergencyData.name,
          patient_phone: emergencyData.phone,
          appointment_date: formData.date,
          time_slot: 'Emergency',
          reason: 'Emergency',
          status: 'confirmed',
          queue_number: 0 // Trigger will override this
        } as any)
        .select()
        .single();

      if (error) throw error;

      navigate('/success', {
        state: {
          queueNumber: data.queue_number,
          date: formData.date,
          phone: emergencyData.phone,
          doctorName: 'Emergency Doctor',
          timeSlot: 'Emergency',
          isEmergency: true,
        }
      });
    } catch (error: any) {
      console.error('Emergency booking error:', error);
      toast({
        title: "Error",
        description: "Failed to book emergency appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      setNotification({
        message: 'Please select a doctor',
        type: 'error'
      });
      return;
    }

    if (!selectedSlot) {
      setNotification({
        message: 'Please select a time slot',
        type: 'error'
      });
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Use explicit insert with queue_number set to 0 - trigger will assign actual value
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          doctor_id: selectedDoctor.id,
          doctor_name: selectedDoctor.name,
          patient_name: formData.name,
          patient_phone: formData.phone,
          appointment_date: formData.date,
          time_slot: selectedSlot,
          reason: formData.reason,
          status: 'confirmed',
          queue_number: 0 // Trigger will override this
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your appointment has been booked successfully.",
      });

      navigate('/success', {
        state: {
          queueNumber: data.queue_number,
          date: formData.date,
          phone: formData.phone,
          doctorName: selectedDoctor.name,
          timeSlot: selectedSlot,
        }
      });
    } catch (error: any) {
      console.error('Appointment booking error:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav>
        <Button
          variant="outline"
          onClick={() => navigate('/appointments')}
          className="mr-2"
        >
          <Calendar className="h-4 w-4 mr-2" />
          My Appointments
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
            Book Your Appointment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Fill in your details to secure your slot
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <TipsBanner message="Booking opens from 08:50 AM to 09:00 AM daily. Book early to get your preferred slot!" />
          <Button
            variant="outline"
            onClick={() => setShowEmergency(!showEmergency)}
            className="ml-4 border-red-200 text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency
          </Button>
        </div>

        {showEmergency && (
          <div className="mb-8">
            <EmergencyBooking onEmergencyBook={handleEmergencyBook} />
          </div>
        )}

        {notification && (
          <div className="mb-6">
            <NotificationBanner
              message={notification.message}
              type={notification.type}
              onDismiss={() => setNotification(null)}
            />
          </div>
        )}

        <div className="space-y-8">
          {/* Doctor Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Select Doctor
            </h2>
            <div className="space-y-4">
              {mockDoctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selected={selectedDoctor?.id === doctor.id}
                  onSelect={setSelectedDoctor}
                />
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          {selectedDoctor && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. Select Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DatePicker
                  label="Appointment Date"
                  value={formData.date}
                  onChange={(value) => updateFormData('date', value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Time Slots
                  </label>
                  <TimeSlotPicker
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    loading={slotsLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Patient Information */}
          {selectedDoctor && selectedSlot && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. Patient Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(value) => updateFormData('phone', value)}
                  placeholder="Enter your phone number"
                  required
                />

                <SelectBox
                  label="Reason for Visit"
                  options={reasonOptions}
                  value={formData.reason}
                  onChange={(value) => updateFormData('reason', value)}
                  placeholder="Select reason for your visit"
                  required
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Booking...' : `Book Appointment - ₹${selectedDoctor.fee}`}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
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
